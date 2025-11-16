
import React from 'react';
import type { Course } from '../../types';

interface CourseCardProps {
  course: Course;
  onRegisterClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onRegisterClick }) => {
  const today = new Date();
  const regStart = new Date(course.registrationStart);
  const regEnd = new Date(course.registrationEnd);
  
  let statusClass = '';
  let statusText = '';
  let canRegister = false;

  if (today >= regStart && today <= regEnd) {
      statusClass = 'bg-green-500 text-white';
      statusText = 'เปิดรับสมัคร';
      canRegister = true;
  } else if (today < regStart) {
      statusClass = 'bg-yellow-500 text-white';
      statusText = 'เร็วๆ นี้';
  } else {
      statusClass = 'bg-red-500 text-white';
      statusText = 'ปิดรับสมัคร';
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2 duration-300 flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-tight">{course.courseName}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass} whitespace-nowrap`}>
            {statusText}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 min-h-[5rem]">{course.description}</p>

        <div className="my-4 p-3 bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-lg">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                ช่วงเวลารับสมัคร:
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
                {formatDate(course.registrationStart)} - {formatDate(course.registrationEnd)}
            </p>
        </div>
        
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
           <p><strong>รุ่นที่:</strong> {course.courseGen}</p>
           <p><strong>อบรม:</strong> {formatDate(course.startDate)} - {formatDate(course.endDate)}</p>
           <p><strong>สถานที่:</strong> {course.location}</p>
           <p><strong>วิทยากร:</strong> {course.instructor}</p>
        </div>
      </div>
      
      <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-700">
        <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                รับสมัคร: {course.currentParticipants}/{course.maxParticipants}
            </span>
            <button 
                onClick={() => onRegisterClick(course)}
                disabled={!canRegister}
                className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-300 ${
                    canRegister 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
                ลงทะเบียน
            </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;