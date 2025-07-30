// src/components/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { toast } from 'react-toastify';
import { useAddLectureMutation, useAddUnitMutation, useCreateCourseMutation, useGetCoursesQuery } from '../app/api/apiSlice/course/courseApiSlice';

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', category: '' });
  const [unitForm, setUnitForm] = useState({ courseId: '', title: '', file: null });
  const [lectureForm, setLectureForm] = useState({
    courseId: '',
    unitId: '',
    title: '',
    order: '',
    file: null,
  });
  const { data: coursesData, isLoading: coursesLoading } = useGetCoursesQuery({ limit: 100 });
  const [createCourse] = useCreateCourseMutation();
  const [addUnit] = useAddUnitMutation();
  const [addLecture] = useAddLectureMutation();

  const courses = coursesData?.courses || [];

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse(courseForm).unwrap();
      toast.success('Course created');
      setCourseForm({ title: '', description: '', category: '' });
    } catch (err) {
      toast.error(err.data?.message || 'Failed to create course');
    }
  };

  const handleUnitSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUnit({ courseId: unitForm.courseId, data: { title: unitForm.title }, file: unitForm.file }).unwrap();
      toast.success('Unit added');
      setUnitForm({ courseId: '', title: '', file: null });
    } catch (err) {
      toast.error(err.data?.message || 'Failed to add unit');
    }
  };

  const handleLectureSubmit = async (e) => {
    e.preventDefault();
    try {
      await addLecture({
        courseId: lectureForm.courseId,
        unitId: lectureForm.unitId,
        data: { title: lectureForm.title, order: lectureForm.order },
        file: lectureForm.file,
      }).unwrap();
      toast.success('Lecture added');
      setLectureForm({ courseId: '', unitId: '', title: '', order: '', file: null });
    } catch (err) {
      toast.error(err.data?.message || 'Failed to add lecture');
    }
  };

  if (!user || user.role !== 'admin') return <div className="text-center p-4">Unauthorized</div>;
  if (coursesLoading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl mb-4">Admin Dashboard</h2>
      <form onSubmit={handleCourseSubmit} className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="text-xl mb-2">Create Course</h3>
        <input
          type="text"
          value={courseForm.title}
          onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
          placeholder="Course Title"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={courseForm.description}
          onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
          placeholder="Description"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          value={courseForm.category}
          onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
          placeholder="Category"
          className="w-full p-2 mb-2 border rounded"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Create Course
        </button>
      </form>
      <form onSubmit={handleUnitSubmit} className="mb-6 p-4 bg-white rounded shadow">
        <h3 className="text-xl mb-2">Add Unit</h3>
        <select
          value={unitForm.courseId}
          onChange={(e) => setUnitForm({ ...unitForm, courseId: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={unitForm.title}
          onChange={(e) => setUnitForm({ ...unitForm, title: e.target.value })}
          placeholder="Unit Title"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => setUnitForm({ ...unitForm, file: e.target.files[0] })}
          accept=".mp4,.pdf"
          className="w-full p-2 mb-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Add Unit
        </button>
      </form>
      <form onSubmit={handleLectureSubmit} className="p-4 bg-white rounded shadow">
        <h3 className="text-xl mb-2">Add Lecture</h3>
        <select
          value={lectureForm.courseId}
          onChange={(e) => setLectureForm({ ...lectureForm, courseId: e.target.value, unitId: '' })}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Select Course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
        <select
          value={lectureForm.unitId}
          onChange={(e) => setLectureForm({ ...lectureForm, unitId: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="">Select Unit</option>
          {lectureForm.courseId &&
            courses
              .find((c) => c._id === lectureForm.courseId)
              ?.units.map((unit) => (
                <option key={unit._id} value={unit._id}>
                  {unit.title}
                </option>
              ))}
        </select>
        <input
          type="text"
          value={lectureForm.title}
          onChange={(e) => setLectureForm({ ...lectureForm, title: e.target.value })}
          placeholder="Lecture Title"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="number"
          value={lectureForm.order}
          onChange={(e) => setLectureForm({ ...lectureForm, order: e.target.value })}
          placeholder="Order"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => setLectureForm({ ...lectureForm, file: e.target.files[0] })}
          accept=".mp4,.pdf"
          className="w-full p-2 mb-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Add Lecture
        </button>
      </form>
    </div>
  );
}

export default AdminDashboard;