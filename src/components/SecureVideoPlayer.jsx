import React, { useEffect, useRef, useState, useMemo } from 'react';
import Hls from 'hls.js';
import { useSelector } from 'react-redux';
import { useGetSignedUrlQuery } from '../app/api/apiSlice/course/courseApiSlice';
import LoadingSpinner from './LoadingSpinner';
import CryptoJS from 'crypto-js';

function SecureVideoPlayer({ publicId, fileType, version, onEnd }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [decryptionError, setDecryptionError] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetSignedUrlQuery(
    { publicId, fileType, version },
    { skip: !publicId || !fileType || !version }
  );

  // Decrypt the encrypted URL
  const decryptUrl = (encryptedUrl) => {
    try {
      const secretKey = import.meta.env.VITE_AES_SECRET_KEY;
      if (!secretKey) {
        throw new Error('AES secret key is not configured in environment variables.');
      }
      const [ivHex, encryptedHex] = encryptedUrl.split(':');
      if (!ivHex || !encryptedHex) {
        throw new Error('Invalid encrypted URL format.');
      }
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encrypted },
        CryptoJS.enc.Hex.parse(secretKey),
        { iv: iv }
      );
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      console.error('Decryption error:', err.message);
      setDecryptionError(err.message);
      return null;
    }
  };

  // Get decrypted URL
  const decryptedUrl = useMemo(() => {
    if (data?.encryptedUrl) {
      return decryptUrl(data.encryptedUrl);
    }
    return null;
  }, [data?.encryptedUrl]);

  // Memoized HLS setup configuration
  const hlsConfig = useMemo(
    () => ({
      enableWorker: true,
      capLevelToPlayerSize: true,
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
      maxBufferSize: 60 * 1000 * 1000,
    }),
    []
  );

  // Memoized effect dependencies
  const effectDeps = useMemo(() => [decryptedUrl, fileType, retryCount, refetch], [decryptedUrl, fileType, retryCount, refetch]);

  useEffect(() => {
    const video = videoRef.current;
    if (!decryptedUrl || !video || fileType !== 'video') return;

    const isHls = decryptedUrl.endsWith('.m3u8');
    let hlsInstance = hlsRef.current;

    const setupHls = () => {
      if (hlsInstance) hlsInstance.destroy();
      hlsInstance = new Hls(hlsConfig);
      hlsRef.current = hlsInstance;

      hlsInstance.attachMedia(video);
      hlsInstance.loadSource(decryptedUrl);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        setRetryCount(0);
        setIsBuffering(false);
      });

      hlsInstance.on(Hls.Events.ERROR, (event, hlsData) => {
        if (hlsData.fatal) {
          if (hlsData.type === Hls.ErrorTypes.NETWORK_ERROR && retryCount < 3) {
            setTimeout(() => {
              setRetryCount((prev) => prev + 1);
              refetch();
            }, 1000 * (retryCount + 1));
          } else {
            hlsInstance.destroy();
            setIsBuffering(false);
          }
        }
      });
    };

    const setupNativeHls = () => {
      video.src = decryptedUrl;
      video.addEventListener('loadedmetadata', () => setIsBuffering(false));
      video.addEventListener('ended', onEnd);
    };

    if (isHls && Hls.isSupported()) {
      setupHls();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      setupNativeHls();
    }

    const trackProgress = () => {
      if (video.buffered.length > 0) {
        const buffered = video.buffered.end(video.buffered.length - 1);
        const percent = (buffered / video.duration) * 100 || 0;
        setBufferedPercent(percent);
      }
    };

    video.addEventListener('timeupdate', trackProgress);
    video.addEventListener('waiting', () => setIsBuffering(true));
    video.addEventListener('playing', () => setIsBuffering(false));
    video.addEventListener('ended', onEnd);

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
        video.removeEventListener('timeupdate', trackProgress);
        video.removeEventListener('waiting', () => setIsBuffering(true));
        video.removeEventListener('playing', () => setIsBuffering(false));
        video.removeEventListener('ended', onEnd);
      }
    };
  }, effectDeps);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500 p-4">Error: {error?.data?.message || 'Failed to load video'}</div>;
  if (decryptionError) return <div className="text-center text-red-500 p-4">Decryption Error: {decryptionError}</div>;
  if (fileType !== 'video') return null;

  return (
    <div className="relative w-full h-auto">
      <video
        ref={videoRef}
        controls
        playsInline
        controlsList="nodownload"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-96 rounded-lg shadow-lg bg-black"
        onKeyDown={(e) => e.key === 'F12' && e.preventDefault()}
      />
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner />
        </div>
      )}
      {bufferedPercent > 0 && bufferedPercent < 100 && (
        <div className="absolute bottom-2 left-0 w-full h-1 bg-gray-700">
          <div
            className="h-1 bg-green-500 transition-all duration-300"
            style={{ width: `${bufferedPercent}%` }}
          ></div>
        </div>
      )}
      {!isBuffering && (
        <div
          className="absolute inset-0 flex top-2 right-1.5 justify-end pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <span className="text-white text-lg font-semibold opacity-20">
            {user?.email}
          </span>
        </div>
      )}
    </div>
  );
}

export default SecureVideoPlayer;
