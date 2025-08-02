import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useGetSignedUrlQuery } from '../app/api/apiSlice/course/courseApiSlice';
import { useGetAesKeyQuery } from '../app/api/apiSlice/auth/authApiSlice';
import LoadingSpinner from './LoadingSpinner';
import CryptoJS from 'crypto-js';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

function SecureVideoPlayer({ publicId, fileType, version, onEnd }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [decryptionError, setDecryptionError] = useState(null);
  const [watermarkPosition, setWatermarkPosition] = useState({ top: '8px', right: '1rem' });

  const { user } = useSelector((state) => state.auth);
  const { data: keyData, isLoading: keyLoading, error: keyError } = useGetAesKeyQuery();
  const { data, isLoading, error, refetch } = useGetSignedUrlQuery(
    { publicId, fileType, version },
    { skip: !publicId || !fileType || !version || !keyData?.key }
  );

  // Handle AES key errors
  useEffect(() => {
    if (keyError) {
      // console.error('AES key fetch error:', keyError);
      setDecryptionError('Failed to fetch encryption key. Please try again later.');
    }
  }, [keyError]);

  // Dynamic watermark positioning
  useEffect(() => {
    const positions = [
      { top: '8px', right: '1rem' },
      { top: '8px', left: '1rem' },
      { bottom: '8px', right: '1rem' },
      { bottom: '8px', left: '1rem' },
    ];
    const updatePosition = () => {
      setWatermarkPosition(positions[Math.floor(Math.random() * positions.length)]);
    };
    updatePosition();
    const interval = setInterval(updatePosition, 15000);
    return () => clearInterval(interval);
  }, []);

  // Decrypt the encrypted URL
  const decryptUrl = (encryptedUrl) => {
    try {
      const aesKey = keyData?.key;
      if (!aesKey) throw new Error('AES secret key is missing');
      if (!/^[0-9a-fA-F]{64}$/.test(aesKey)) throw new Error('Invalid AES key format');
      const [ivHex, encryptedHex] = encryptedUrl.split(':');
      if (!ivHex || !encryptedHex) throw new Error('Invalid encrypted URL format');
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encrypted },
        CryptoJS.enc.Hex.parse(aesKey),
        { iv }
      );
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedString.endsWith('.m3u8')) throw new Error('Invalid decrypted URL');
      // console.log('Decrypted URL:', decryptedString); // Debug log
      return decryptedString;
    } catch (err) {
      console.error('Decryption error:', err.message);
      setDecryptionError('Failed to decrypt video URL. Please try again later.');
      return null;
    }
  };

  // Get decrypted URL
  const decryptedUrl = useMemo(() => {
    if (data?.encryptedUrl && keyData?.key) {
      // console.log('Decrypting URL:', data.encryptedUrl); // Debug log
      return decryptUrl(data.encryptedUrl);
    }
    return null;
  }, [data?.encryptedUrl, keyData?.key]);

  // Track buffering progress
  const trackProgress = () => {
    const video = videoRef.current;
    if (video && video.buffered.length > 0 && video.duration) {
      const buffered = video.buffered.end(video.buffered.length - 1);
      const percent = (buffered / video.duration) * 100 || 0;
      setBufferedPercent(percent);
    }
  };

  // Video.js setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !decryptedUrl || fileType !== 'video' || !document.contains(video)) {
      // console.log('Video setup skipped:', {
      //   video: !!video,
      //   decryptedUrl: !!decryptedUrl,
      //   fileType,
      //   isInDOM: video ? document.contains(video) : false,
      // });
      return;
    }

    // console.log('Setting up Video.js with URL:', decryptedUrl);

    if (!playerRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        playsInline: true,
        fluid: false,
        responsive: true,
        preload: 'auto',
        sources: [
          {
            src: decryptedUrl,
            type: 'application/x-mpegURL',
          },
        ],
      }, () => {
        // console.log('Video.js player initialized');
        setIsBuffering(false);
      });

      playerRef.current = player;

      player.on('error', () => {
        const error = player.error();
        console.error('Video.js error:', error);
        if (error?.code === 403 && retryCount < 3) {
          console.log(`Retrying (${retryCount + 1}/3)...`);
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            refetch();
          }, 1000 * (retryCount + 1));
        } else {
          setDecryptionError('Failed to load video stream. Please try again.');
          setIsBuffering(false);
        }
      });

      player.on('loadedmetadata', () => setIsBuffering(false));
      player.on('waiting', () => setIsBuffering(true));
      player.on('playing', () => setIsBuffering(false));
      player.on('ended', () => {
        console.log('Video ended');
        onEnd();
      });

      video.addEventListener('timeupdate', trackProgress);

      // return () => {
      //   video.removeEventListener('timeupdate', trackProgress);
      //   if (playerRef.current) {
      //     playerRef.current.dispose();
      //     playerRef.current = null;
      //   }
      // };
    } else {
      // console.log('Updating Video.js source to:', decryptedUrl);
      playerRef.current.src({ src: decryptedUrl, type: 'application/x-mpegURL' });
      playerRef.current.play().catch((err) => console.error('Play error:', err));
    }
  }, [decryptedUrl, fileType, retryCount, refetch, onEnd]);

  if (isLoading || keyLoading) return (
    <div className="p-4 bg-white/90 rounded-lg shadow-md w-full max-w-4xl mx-auto text-center">
      <LoadingSpinner />
    </div>
  );
  if (error) return (
    <div className="p-4 bg-white/90 rounded-lg shadow-md w-full max-w-4xl mx-auto text-center text-red-500">
      Error: Failed to load video.{' '}
      <button onClick={() => refetch()} className="underline text-blue-500 hover:text-blue-600">
        Retry
      </button>
    </div>
  );
  if (keyError) return (
    <div className="p-4 bg-white/90 rounded-lg shadow-md w-full max-w-4xl mx-auto text-center text-red-500">
      Error: Failed to fetch encryption key.{' '}
      <button onClick={() => refetch()} className="underline text-blue-500 hover:text-blue-600">
        Retry
      </button>
    </div>
  );
  if (decryptionError) return (
    <div className="p-4 bg-white/90 rounded-lg shadow-md w-full max-w-4xl mx-auto text-center text-red-500">
      Error: {decryptionError}{' '}
      <button onClick={() => refetch()} className="underline text-blue-500 hover:text-blue-600">
        Retry
      </button>
    </div>
  );
  if (fileType !== 'video') return null;

  return (
    <div className="relative w-full max-w-4xl border-4 mx-auto p-4 bg-white/90 rounded-lg shadow-md">
      <div data-vjs-player className="w-full border-4 aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="video-js vjs-default-skin "
          controls
          width={'100%'}
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          preload="auto"
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
              e.preventDefault();
            }
          }}
        />
      </div>
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 rounded-lg pointer-events-none">
          <LoadingSpinner />
        </div>
      )}
      {bufferedPercent > 0 && bufferedPercent < 100 && (
        <div className="absolute bottom-4 left-4 right-4 h-1.5 bg-gray-800/80 rounded-full z-10">
          <div
            className="h-full bg-green-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${bufferedPercent}%` }}
          />
        </div>
      )}
      {!isBuffering && user?.email && (
        <div
          className="absolute inset-0 flex justify-end items-start pointer-events-none p-4 sm:p-3 z-20"
          style={watermarkPosition}
        >
          <span className="text-white text-xs sm:text-sm font-medium opacity-30 select-none bg-black/30 rounded-md px-2 py-1 shadow-sm">
            {user.email} | {new Date().toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}

export default SecureVideoPlayer;