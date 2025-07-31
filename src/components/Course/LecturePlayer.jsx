import React, { useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SecureVideoPlayer from '../SecureVideoPlayer';

function LecturePlayer() {
  const { selectedLecture } = useOutletContext();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!selectedLecture) {
  //     navigate(`/course/${selectedLecture?._id || 'default'}`); // Redirect to course page if no lecture
  //   }
  // }, [selectedLecture, navigate]);

  if (!selectedLecture) return <div className="text-center p-4 text-gray-500">Loading lecture...</div>;

  // Destructure props based on whether it's an introduction or lecture
  const { publicId, fileType, version } = selectedLecture.introduction
    ? selectedLecture.introduction
    : selectedLecture;

  return (
    <div className="mb-6 p-4 bg-white/90 rounded-lg shadow-md">
    
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">{selectedLecture.title}</h3>
      <SecureVideoPlayer
        publicId={publicId}
        fileType={fileType}
        version={version}
      />
    
    </div>
  );
}

export default LecturePlayer;