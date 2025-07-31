import React from 'react';
import UnitDropdown from './UnitDropdown';

const Sidebar = ({ course, openUnits, toggleUnit, setSelectedLecture, navigate, progress, id, selectedLecture }) => (
  <aside className="md:w-1/4 bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-xl overflow-y-auto border-r border-gray-200">
    <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
      {course.title}
    </h2>
    <p className="text-gray-600 mb-6 text-sm">{course.description}</p>
    {course.units.map((unit) => (
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
    ))}
  </aside>
);

export default Sidebar;