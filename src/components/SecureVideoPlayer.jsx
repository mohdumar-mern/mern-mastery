import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { useGetSignedUrlQuery } from '../app/api/apiSlice/course/courseApiSlice';

function SecureVideoPlayer({ publicId, fileType, version }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [bufferedPercent, setBufferedPercent] = useState(0);

  const { data, isLoading, error, refetch } = useGetSignedUrlQuery(
    { publicId, fileType, version },
    { skip: !publicId || !fileType || !version }
  );


  useEffect(() => {
    const video = videoRef.current;
    if (!data?.url || !video || fileType !== 'video') return;

    const isHls = data.url.endsWith('.m3u8');

    const setupHls = () => {
      const hls = new Hls({
        enableWorker: true,
        capLevelToPlayerSize: true,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
      });

      hlsRef.current = hls;
      hls.attachMedia(video);
      hls.loadSource(data.url);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setRetryCount(0);
        setIsBuffering(false);
      });

      hls.on(Hls.Events.ERROR, (event, hlsData) => {
        console.error('HLS Error:', hlsData);
        if (hlsData.fatal && hlsData.type === Hls.ErrorTypes.NETWORK_ERROR && retryCount < 3) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            refetch();
          }, 1000 * (retryCount + 1));
        } else if (hlsData.fatal) {
          hls.destroy();
        }
      });
    };

    if (isHls && Hls.isSupported()) {
      setupHls();
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = data.url;
      video.addEventListener('loadedmetadata', () => setIsBuffering(false));
    }

    const trackProgress = () => {
    //   if (video && onProgress) {
    //     onProgress({
    //       currentTime: video.currentTime,
    //       duration: video.duration,
    //     });
    //   }

      if (video.buffered.length > 0) {
        const buffered = video.buffered.end(video.buffered.length - 1);
        const percent = (buffered / video.duration) * 100;
        setBufferedPercent(percent);
      }
    };

    video.addEventListener('timeupdate', trackProgress);
    video.addEventListener('waiting', () => setIsBuffering(true));
    video.addEventListener('playing', () => setIsBuffering(false));

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.removeEventListener('timeupdate', trackProgress);
      video.removeEventListener('waiting', () => setIsBuffering(true));
      video.removeEventListener('playing', () => setIsBuffering(false));
    };
  }, [data?.url, fileType, publicId, version, retryCount, refetch]);

  if (isLoading) return <div className="text-center text-gray-500">Loading video...</div>;
  if (error) return <div className="text-red-500">Error: {error?.data?.message || error.message}</div>;
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
      />
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <span className="text-white animate-pulse">Buffering...</span>
        </div>
      )}
      {bufferedPercent > 0 && bufferedPercent < 100 && (
        <div className="absolute bottom-1 left-0 w-full h-1 bg-gray-700">
          <div
            className="h-1 bg-green-500 transition-all duration-300"
            style={{ width: `${bufferedPercent}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default SecureVideoPlayer;
