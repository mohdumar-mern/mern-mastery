import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { useGetSignedUrlQuery } from '../app/api/apiSlice/course/courseApiSlice';

function SecureVideoPlayer({ publicId, fileType, version }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [retryCount, setRetryCount] = useState(0);
  const { data, isLoading, error, refetch } = useGetSignedUrlQuery(
    { publicId, fileType, version },
    { skip: !publicId || !fileType || !version } // Prevent queries with missing props
  );

  useEffect(() => {
    if (!fileType || fileType !== 'video' || !data?.url || !videoRef.current) {
      return;
    }

    const videoEl = videoRef.current;
    const isHls = data.url.includes('.m3u8');

    if (!isHls) {
      console.warn('URL is not an HLS stream, expected .m3u8 extension:', data.url);
      return;
    }

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000 ,// 60MB
        enableWorker: true,
        autoStartLoad: true,
        capLevelToPlayerSize: true, // Optimize quality
      });
      hlsRef.current = hls;

      hls.loadSource(data.url);
      hls.attachMedia(videoEl);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoEl.muted = true; // Mute to bypass auto-play restrictions
        videoEl
          .pause()
          .then(() => console.log('Auto-play started successfully'))
          .catch((err) => console.error('Auto-play failed:', err.message));
        setRetryCount(0);
      });

      hls.on(Hls.Events.ERROR, (event, hlsData) => {
        console.error('HLS Error:', {
          type: hlsData.type,
          details: hlsData.details,
          fatal: hlsData.fatal,
          url: hlsData.url,
          response: hlsData.response,
          status: hlsData.response?.code || 'N/A',
        });

        if (hlsData.fatal && hlsData.type === Hls.ErrorTypes.NETWORK_ERROR && retryCount < 3) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            refetch();
          }, 1000 * (retryCount + 1)); // Exponential backoff
        } else if (hlsData.fatal) {
          console.error('Fatal HLS error, no further retries:', {
            ...hlsData,
            retryCount,
            timestamp: new Date().toISOString(),
          });
        }
      });
    } else if (isHls && videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.muted = true;
      videoEl.src = data.url;
      videoEl
        .play()
        .then(() => console.log('Native HLS auto-play started'))
        .catch((err) => console.error('Native HLS auto-play failed:', err.message));
      videoEl.addEventListener('loadedmetadata', () => {
        videoEl.play().catch((err) => console.error('Metadata load auto-play failed:', err.message));
      });
      videoEl.addEventListener('error', (e) => {
        console.error('Native HLS Video Error:', {
          error: e,
          url: data.url,
          status: e.target?.error?.code,
          message: e.target?.error?.message,
        });
      });
    } else {
      console.error('HLS not supported or invalid URL:', data.url);
      return;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (videoEl) {
        videoEl.pause();
        videoEl.src = '';
        videoEl.removeAttribute('src');
        videoEl.load(); // Reset video element
      }
    };
  }, [data, fileType, publicId, version, retryCount, refetch]);

  if (isLoading) {
    return <div className="text-center p-4">Loading video...</div>;
  }

  if (error) {
    console.error('RTK Query Error:', {
      message: error.data?.message,
      status: error.status,
      error: error.message,
    });
    return (
      <div className="text-center p-4 text-red-500">
        Error loading video: {error.data?.message || error.message || 'Unknown error'}
      </div>
    );
  }

  if (fileType !== 'video') {
    return null;
  }

  return (
    <video
      ref={videoRef}
      controls
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      disablePictureInPicture
      className="w-full max-w-4xl h-96 mx-auto"
      // muted // Default muted to support auto-play
    />
  );
}

export default SecureVideoPlayer;