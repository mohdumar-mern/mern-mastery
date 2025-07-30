// src/components/SecureVideoPlayer.jsx
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { useGetSignedUrlQuery } from '../app/api/apiSlice/course/courseApiSlice';

function SecureVideoPlayer({ publicId, fileType }) {
  const videoRef = useRef(null);
  const { data, isLoading } = useGetSignedUrlQuery({ publicId, fileType });

  useEffect(() => {
    if (fileType !== 'video' || !data?.url || !videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(data.url);
      hls.attachMedia(videoRef.current);
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = data.url;
    }
  }, [data, fileType]);

  if (isLoading) return <div className="text-center p-4">Loading video...</div>;
  if (fileType !== 'video') return null;

  return (
    <video
      ref={videoRef}
      controls
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      disablePictureInPicture
      className="w-full max-w-4xl mx-auto"
    />
  );
}

export default SecureVideoPlayer;