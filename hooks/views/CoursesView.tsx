
import React, { useState, useEffect } from 'react';
import api from '../../services/mockApi';
import type { Course } from '../../types';
import CourseCard from '../../contexts/components/CourseCard';
import RegistrationModal from '../../contexts/components/RegistrationModal';
import LoadingSpinner from '../../contexts/components/LoadingSpinner';

const CoursesView: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleRegisterClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">หลักสูตรที่เปิดรับสมัคร</h2>
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard 
                key={course.courseId} 
                course={course} 
                onRegisterClick={handleRegisterClick} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">ไม่มีหลักสูตรที่เปิดรับสมัครในขณะนี้</p>
        </div>
      )}

      {selectedCourse && (
        <RegistrationModal 
            course={selectedCourse} 
            onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default CoursesView;