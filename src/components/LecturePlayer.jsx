import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import SecureVideoPlayer from './SecureVideoPlayer';
import LoadingSpinner from './LoadingSpinner';
import PDFViewer from './PDFViwer';

function LecturePlayer() {
  const { selectedLecture, isLoading } = useOutletContext(); // Added isLoading
  const navigate = useNavigate();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-md w-full max-w-4xl mx-auto text-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle missing or invalid lecture
  if (!selectedLecture || !selectedLecture.title || !selectedLecture._id) {
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-md w-full max-w-4xl mx-auto text-center text-gray-600">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Our Course</h1>
        <p className="text-base">Please select a lecture to begin.</p>
        <button
          onClick={() => navigate('/courses')}
          className="mt-4 inline-block text-blue-500 underline hover:text-blue-600"
        >
          Browse Courses
        </button>
      </div>
    );
  }

  // Destructure props safely
  const { publicId, fileType, version } = selectedLecture.introduction
    ? selectedLecture.introduction
    : selectedLecture;

  // Validate required props
  if (!publicId || !fileType || !version) {
    return (
      <div className="p-4 bg-white/90 rounded-lg shadow-md w-full max-w-4xl mx-auto text-center text-red-500">
        Error: Invalid lecture data.{' '}
        <button
          onClick={() => navigate(-1)}
          className="underline text-blue-500 hover:text-blue-600"
        >
          Go back
        </button>
      </div>
    );
  }

  // Handle lecture completion
  const handleVideoEnd = async () => {
    console.log(`Lecture ${selectedLecture.title} completed`);
    try {
      const response = await fetch('/api/courses/mark-lecture-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lectureId: selectedLecture._id }),
      });
      if (response.ok) {
        navigate('/courses'); // Navigate to course list or next lecture
      }
    } catch (err) {
      console.error('Failed to mark lecture complete:', err);
    }
  };

  return (
    <div className="p-4 bg-white/90 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        {selectedLecture.title}
      </h3>
      {fileType === 'video' ? (
        <SecureVideoPlayer
          publicId={publicId}
          fileType={fileType}
          version={version}
          onEnd={handleVideoEnd}
        />
      ) : fileType === 'pdf' ? (
        <PDFViewer publicId={publicId} version={version} />
      ) : (
        <div className="text-center p-4 text-red-500 rounded-md bg-red-50">
          Unsupported file type: {fileType}
        </div>
      )}
    </div>
  );
}

export default LecturePlayer;