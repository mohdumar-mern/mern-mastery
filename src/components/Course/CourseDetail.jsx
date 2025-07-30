// src/components/CourseDetail.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import SecureVideoPlayer from './SecureVideoPlayer';
import { toast } from 'react-toastify';
import {
    useCommentCourseMutation,
    useGetCourseByIdQuery,
    useGetProgressQuery,
    useMarkLectureCompletedMutation,
    useRateCourseMutation
} from '../../app/api/apiSlice/course/courseApiSlice';
import SecureVideoPlayer from '../SecureVideoPlayer';

function CourseDetail() {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(id);
    const { data: progress, isLoading: progressLoading } = useGetProgressQuery();
    const [markLectureCompleted] = useMarkLectureCompletedMutation();
    const [rateCourse] = useRateCourseMutation();
    const [commentCourse] = useCommentCourseMutation();
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');

    const handleMarkCompleted = async (unitId, lectureId) => {
        try {
            await markLectureCompleted({ courseId: id, unitId, lectureId }).unwrap();
            toast.success('Lecture marked as completed');
        } catch (err) {
            toast.error(err.data?.message || 'Failed to mark lecture');
        }
    };

    const handleRate = async (e) => {
        e.preventDefault();
        try {
            await rateCourse({ courseId: id, data: { rating: Number(rating) } }).unwrap();
            toast.success('Rating submitted');
            setRating('');
        } catch (err) {
            toast.error(err.data?.message || 'Failed to submit rating');
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        try {
            await commentCourse({ courseId: id, data: { comment } }).unwrap();
            toast.success('Comment submitted');
            setComment('');
        } catch (err) {
            toast.error(err.data?.message || 'Failed to submit comment');
        }
    };

    if (courseLoading || progressLoading) return <div className="text-center p-4">Loading...</div>;
    if (!course) return <div className="text-center p-4">Course not found</div>;

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-3xl mb-4">{course.title}</h2>
            <p className="mb-4">{course.description}</p>
            {course.units.map((unit) => (
                <div key={unit._id} className="mb-6">
                    <h3 className="text-2xl mb-2">{unit.title}</h3>
                    <div className="mb-4">
                        <h4 className="text-lg">Introduction</h4>
                        {unit.introduction.fileType === 'video' ? (
                            <SecureVideoPlayer publicId={unit.introduction.publicId} fileType={unit.introduction.fileType} version={unit.introduction.version} />
                        ) : (
                            <iframe src={unit.introduction.fileUrl} className="w-full h-96" title="Introduction PDF" />
                        )}
                    </div>
                    {unit.lectures.map((lecture) => {
                        const isCompleted = progress?.some(
                            (p) => p.courseId === id && p.unitId === unit._id && p.lectureId === lecture._id && p.completed
                        );
                        return (
                            <div key={lecture._id} className="mb-4">
                                <h4 className="text-lg">{lecture.title}</h4>
                                {lecture.fileType === 'video' ? (
                                    <SecureVideoPlayer publicId={lecture.publicId} fileType={lecture.fileType} version={lecture.version} />
                                ) : (
                                    <iframe src={lecture.fileUrl} className="w-full h-96" title="Lecture PDF" />
                                )}
                                {user && (
                                    <button
                                        onClick={() => handleMarkCompleted(unit._id, lecture._id)}
                                        className={`p-2 mt-2 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'} text-white rounded`}
                                    >
                                        {isCompleted ? 'Completed' : 'Mark as Completed'}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
            {user && (
                <div className="mt-6">
                    <h3 className="text-2xl mb-2">Rate this Course</h3>
                    <form onSubmit={handleRate} className="mb-4">
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="p-2 border rounded mr-2"
                            placeholder="Rating (1-5)"
                        />
                        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                            Submit Rating
                        </button>
                    </form>
                    <h3 className="text-2xl mb-2">Comments</h3>
                    <form onSubmit={handleComment} className="mb-4">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Add a comment"
                        />
                        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                            Submit Comment
                        </button>
                    </form>
                    {course.comments.map((c) => (
                        <div key={c._id} className="p-2 bg-gray-100 rounded mb-2">
                            <p>{c.comment}</p>
                            <p className="text-sm text-gray-500">
                                By {c.userId.username} on {new Date(c.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CourseDetail;