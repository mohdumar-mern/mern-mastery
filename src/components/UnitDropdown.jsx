import React, { memo, useCallback, useMemo } from 'react';
import LectureItem from './LectureItem';

const UnitDropdown = memo(({ unit, openUnits, toggleUnit, setSelectedLecture, navigate, progress, courseId, selectedLecture }) => {
  // Memoized isOpen to prevent re-computation
  const isOpen = useMemo(() => openUnits[unit._id] || false, [openUnits, unit._id]);

  // Memoized handler for toggle and navigation
  const handleToggle = useCallback(() => {
    toggleUnit(unit._id);
    if (unit.introduction) {
      setSelectedLecture(unit);
      navigate(`/course/${courseId}`);
    }
  }, [toggleUnit, unit._id, unit.introduction, setSelectedLecture, navigate, courseId]);

  // Memoized lecture list to prevent re-renders
  const lectureList = useMemo(() => {
    return unit.lectures?.map((lecture) => (
      <LectureItem
        key={lecture._id}
        lecture={lecture}
        setSelectedLecture={setSelectedLecture}
        navigate={navigate}
        progress={progress}
        courseId={courseId}
        unitId={unit._id}
        selectedLecture={selectedLecture}
      />
    )) || [];
  }, [unit.lectures, setSelectedLecture, navigate, progress, courseId, unit._id, selectedLecture]);

  if (!unit) {
    return <div className="text-center p-2 text-gray-500">Unit data unavailable</div>;
  }

  return (
    <div className="mb-4" role="region" aria-label={`Unit ${unit.title} dropdown`}>
      <button
        onClick={handleToggle}
        className="w-full text-left p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg font-semibold text-gray-800 hover:bg-blue-200 transition-all duration-300 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-controls={`lectures-${unit._id}`}
      >
        <span className="truncate">{unit.title}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div id={`lectures-${unit._id}`} className="mt-2 space-y-2">
          {lectureList.length > 0 ? (
            lectureList
          ) : (
            <p className="text-center text-gray-500 p-2">No lectures available.</p>
          )}
        </div>
      )}
    </div>
  );
});

UnitDropdown.displayName = 'UnitDropdown'; // For debugging in React DevTools

export default UnitDropdown;