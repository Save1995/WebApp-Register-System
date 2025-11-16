
import React, { useState } from 'react';
import type { Course, Registration } from '../../types';
import { useToast } from '../../hooks/useToast';
import api from '../../services/mockApi';

interface RegistrationModalProps {
  course: Course;
  onClose: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ course, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idCard: '',
    birthDate: '',
    phone: '',
    email: '',
    organization: '',
    position: '',
    address: '',
  });
  const [documents, setDocuments] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successfulRegistration, setSuccessfulRegistration] = useState<Registration | null>(null);
  const addToast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocuments(e.target.files);
  };

  const handleFillWithTestData = () => {
    setFormData({
        firstName: 'สมหญิง',
        lastName: 'ใจดี',
        idCard: '1234567890123',
        birthDate: '1995-08-15',
        phone: '0819998888',
        email: 'somying.test@example.com',
        organization: 'โรงพยาบาลตัวอย่าง',
        position: 'พยาบาลวิชาชีพ',
        address: '99/9 หมู่ 9 ตำบลทดสอบ อำเภอเมือง จังหวัดกรุงเทพ 10210',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documents || documents.length === 0) {
      setError('กรุณาแนบเอกสารที่จำเป็น');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      const registrationData = {
        ...formData,
        courseId: course.courseId,
      };
      const newRegistration = await api.addRegistration(registrationData);
      setSuccessfulRegistration(newRegistration);
      addToast(`ลงทะเบียนหลักสูตร "${course.courseName}" สำเร็จ!`, 'success');
    } catch (err) {
      const errorMessage = 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderSuccessView = () => (
    <div className="p-6 sm:p-8 text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">ลงทะเบียนสำเร็จ!</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        ท่านได้ลงทะเบียนหลักสูตร <span className="font-semibold">{successfulRegistration?.courseName}</span> เรียบร้อยแล้ว
      </p>
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg w-full text-left sm:text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">รหัสการลงทะเบียนของคุณคือ:</p>
        <p className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-wider">{successfulRegistration?.registrationId}</p>
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        ระบบได้ส่งอีเมลยืนยันพร้อมรายละเอียดการลงทะเบียนไปยังอีเมลของท่านแล้ว
      </p>
      <div className="mt-6">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ปิด
        </button>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="p-6">
        <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-4">
        <div className="flex items-center space-x-4">
            <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">ลงทะเบียนเข้าร่วมอบรม</h3>
                <p className="text-gray-600 dark:text-gray-300">{course.courseName}</p>
            </div>
              <button 
                type="button" 
                onClick={handleFillWithTestData} 
                className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors"
            >
                Test Fill
            </button>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="firstName">ชื่อจริง *</label>
                <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="lastName">นามสกุล *</label>
                <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="idCard">เลขบัตรประชาชน *</label>
            <input type="text" id="idCard" value={formData.idCard} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="birthDate">วัน/เดือน/ปี เกิด *</label>
                <input type="date" id="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="phone">โทรศัพท์ *</label>
                <input type="tel" id="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">อีเมล *</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="organization">องค์กร *</label>
                <input type="text" id="organization" value={formData.organization} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="position">ตำแหน่ง *</label>
                <input type="text" id="position" value={formData.position} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            </div>
            <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="address">ที่อยู่ *</label>
            <textarea id="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} required></textarea>
            </div>
            <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="documents">เอกสารแนบ (สำเนาบัตรประชาชน, ใบทะเบียนวุฒิ) *</label>
            <input type="file" id="documents" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" multiple required />
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 gap-2 sm:gap-0">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                ยกเลิก
            </button>
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-wait"
            >
                {isSubmitting ? 'กำลังส่ง...' : 'ลงทะเบียน'}
            </button>
            </div>
        </form>
    </div>
  );


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {successfulRegistration ? renderSuccessView() : renderForm()}
      </div>
    </div>
  );
};

export default RegistrationModal;