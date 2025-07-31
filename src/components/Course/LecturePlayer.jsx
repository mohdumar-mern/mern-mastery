import React, {  useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import SecureVideoPlayer from '../SecureVideoPlayer';

function LecturePlayer() {
  const { selectedLecture } = useOutletContext();

  useEffect(() => {
    if (!selectedLecture) {
      // Redirect or handle no lecture selected
      console.log('No lecture selected');
    }
  }, [selectedLecture]);

  if (!selectedLecture) return <div className="text-center p-4">Select a lecture to play</div>;

  return (
    <div className="mb-6">
      <h3 className="text-2xl mb-2">{selectedLecture.title}</h3>
      <SecureVideoPlayer
        publicId={selectedLecture.publicId}
        fileType={selectedLecture.fileType}
        version={selectedLecture.version}
      />
    </div>
  );
}

export default LecturePlayer;