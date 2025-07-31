import React, { memo } from 'react';
import UnitDropdown from './UnitDropdown';

const Sidebar = memo(({ course, openUnits, toggleUnit, setSelectedLecture, navigate, progress, id, selectedLecture }) => {
  // Memoized unit list to prevent re-renders
  const unitList = React.useMemo(() => {
    return course?.units?.map((unit) => (
      <UnitDropdown
        key={unit._id}
        unit={unit}
        openUnits={openUnits}
        toggleUnit={toggleUnit}
        setSelectedLecture={setSelectedLecture}
        navigate={navigate}
        progress={progress}
        courseId={id}
        selectedLecture={selectedLecture}
      />
    )) || [];
  }, [course?.units, openUnits, toggleUnit, setSelectedLecture, navigate, progress, id, selectedLecture]);

  if (!course) {
    return <div className="text-center p-4 text-gray-500">Course data unavailable</div>;
  }

  return (
    <aside
      className="md:w-1/4 bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-xl overflow-y-auto border-r border-gray-200 transition-all duration-300 hover:shadow-2xl"
      role="complementary"
      aria-label="Course Sidebar"
    >
      <h2
        className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text hover:text-opacity-90 transition-opacity"
      >
        {course.title}
      </h2>
      <p className="text-gray-600 mb-6 text-sm line-clamp-3">{course.description}</p>
      {unitList.length > 0 ? (
        unitList
      ) : (
        <p className="text-center text-gray-500">No units available for this course.</p>
      )}
    </aside>
  );
});

Sidebar.displayName = 'Sidebar'; // For debugging in React DevTools

export default Sidebar;