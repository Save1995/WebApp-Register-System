
import React, { useState, useEffect } from 'react';
import type { Course } from '../../types';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'courseId' | 'currentParticipants'> | Course) => void;
  course: Course | null;
}

const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, onSave, course }) => {
  const initialFormState = {
    courseName: '',
    courseGen: '',
    description: '',
    startDate: '',
    endDate: '',
    registrationStart: '',
    registrationEnd: '',
    maxParticipants: 0,
    location: '',
    instructor: '',
    status: 'upcoming' as 'active' | 'upcoming' | 'closed',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.courseName,
        courseGen: course.courseGen,
        description: course.description,
        startDate: course.startDate,
        endDate: course.endDate,
        registrationStart: course.registrationStart,
        registrationEnd: course.registrationEnd,
        maxParticipants: course.maxParticipants,
        location: course.location,
        instructor: course.instructor,
        status: course.status,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [course, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: id === 'maxParticipants' ? parseInt(value, 10) || 0 : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = course ? { ...formData, courseId: course.courseId, currentParticipants: course.currentParticipants } : formData;
      await onSave(dataToSave);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{course ? 'แก้ไขหลักสูตร' : 'เพิ่มหลักสูตรใหม่'}</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl">&times;</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ชื่อหลักสูตร</label>
              <input type="text" id="courseName" value={formData.courseName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="courseGen" className="block text-sm font-medium text-gray-700 dark:text-gray-300">รุ่นที่</label>
                    <input type="text" id="courseGen" value={formData.courseGen} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                 <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">สถานที่</label>
                    <input type="text" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">คำอธิบาย</label>
                <textarea id="description" value={formData.description} onChange={handleChange} rows={3} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">วันที่เริ่มหลักสูตร</label>
                    <input type="date" id="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">วันที่สิ้นสุดหลักสูตร</label>
                    <input type="date" id="endDate" value={formData.endDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="registrationStart" className="block text-sm font-medium text-gray-700 dark:text-gray-300">วันที่เปิดรับสมัคร</label>
                    <input type="date" id="registrationStart" value={formData.registrationStart} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="registrationEnd" className="block text-sm font-medium text-gray-700 dark:text-gray-300">วันที่ปิดรับสมัคร</label>
                    <input type="date" id="registrationEnd" value={formData.registrationEnd} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 dark:text-gray-300">จำนวนผู้เข้าร่วมสูงสุด</label>
                    <input type="number" id="maxParticipants" value={formData.maxParticipants} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div>
                    <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">วิทยากร</label>
                    <input type="text" id="instructor" value={formData.instructor} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                </div>
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">สถานะ</label>
                <select id="status" value={formData.status} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                </select>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 gap-2 sm:gap-0 mt-6 pt-4 border-t dark:border-gray-700">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              ยกเลิก
            </button>
            <button 
                type="submit" 
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-wait"
            >
              {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;