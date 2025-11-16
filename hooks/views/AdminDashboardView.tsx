
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/mockApi';
import type { Course, Registration, AdminView, Faq, ContactInfo, Announcement } from '../../types';
import CourseModal from '../../contexts/components/CourseModal';
import FaqModal from '../../contexts/components/FaqModal';
import AnnouncementModal from '../../contexts/components/AnnouncementModal';
import ConfirmationModal from '../../contexts/components/ConfirmationModal';
import { EditIcon, DeleteIcon, ExportIcon, ChevronDownIcon, ChevronRightIcon } from '../../contexts/components/icons/Icons';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import LoadingSpinner from '../../contexts/components/LoadingSpinner';
import { useToast } from '../../hooks/useToast';

interface AdminDashboardViewProps {
    activeView: AdminView;
}

const StatCard: React.FC<{ title: string; value: number | string; color: string }> = ({ title, value, color }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border-l-4 ${color}`}>
        <div className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
        <div className="text-gray-600 dark:text-gray-400">{title}</div>
    </div>
);

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ activeView }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [contactInfo, setContactInfo] = useState<ContactInfo>({ phone: '', email: '', address: '' });
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Course Modals State
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

    // FAQ Modals State
    const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
    const [isFaqConfirmModalOpen, setIsFaqConfirmModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
    const [deletingFaq, setDeletingFaq] = useState<Faq | null>(null);

    // CMS Modals State
    const [isCmsModalOpen, setIsCmsModalOpen] = useState(false);
    const [isCmsConfirmModalOpen, setIsCmsConfirmModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [deletingAnnouncement, setDeletingAnnouncement] = useState<Announcement | null>(null);

    // Registrations UI State
    const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
    
    const addToast = useToast();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [coursesData, registrationsData, contactData, faqsData, announcementsData] = await Promise.all([
                api.getCourses(),
                api.getRegistrations(),
                api.getContactInfo(),
                api.getFaqs(),
                api.getAnnouncements()
            ]);
            setCourses(coursesData);
            setRegistrations(registrationsData);
            setContactInfo(contactData);
            setFaqs(faqsData);
            setAnnouncements(announcementsData);
        } catch (error) {
            console.error("Failed to fetch admin data:", error);
            addToast('Failed to load dashboard data.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Course Handlers
    const handleOpenAddModal = () => {
        setEditingCourse(null);
        setIsCourseModalOpen(true);
    };
    const handleOpenEditModal = (course: Course) => {
        setEditingCourse(course);
        setIsCourseModalOpen(true);
    };
    const handleOpenDeleteConfirm = (course: Course) => {
        setDeletingCourse(course);
        setIsConfirmModalOpen(true);
    };
    const handleCloseCourseModals = () => {
        setIsCourseModalOpen(false);
        setIsConfirmModalOpen(false);
        setEditingCourse(null);
        setDeletingCourse(null);
    };
    const handleSaveCourse = async (courseData: Omit<Course, 'courseId' | 'currentParticipants'> | Course) => {
        const isUpdating = 'courseId' in courseData;
        try {
            if (isUpdating) {
                await api.updateCourse(courseData as Course);
            } else {
                await api.addCourse(courseData);
            }
            addToast(isUpdating ? 'แก้ไขข้อมูลหลักสูตรสำเร็จ!' : 'เพิ่มหลักสูตรใหม่สำเร็จ!', 'success');
            await fetchData();
            handleCloseCourseModals();
        } catch (error) {
            console.error("Failed to save course:", error);
            addToast('ไม่สามารถบันทึกข้อมูลได้', 'error');
        }
    };
    const handleDeleteCourse = async () => {
        if (deletingCourse) {
            try {
                await api.deleteCourse(deletingCourse.courseId);
                addToast('ลบหลักสูตรสำเร็จ!', 'success');
                await fetchData();
            } catch(e) {
                addToast('ไม่สามารถลบหลักสูตรได้', 'error');
            }
        }
        handleCloseCourseModals();
    };
    
    // Registration Handlers
    const handleExportCourseCsv = (course: Course) => {
        const courseRegistrations = registrations.filter(reg => reg.courseId === course.courseId);

        if (courseRegistrations.length === 0) {
            addToast(`ไม่มีข้อมูลการลงทะเบียนสำหรับหลักสูตร "${course.courseName}"`, 'error');
            return;
        }

        const headers: (keyof Registration)[] = ['registrationId', 'courseName', 'firstName', 'lastName', 'idCard', 'birthDate', 'phone', 'email', 'organization', 'position', 'address', 'registrationDate', 'status'];
        const csvContent = [
            headers.join(','),
            ...courseRegistrations.map(reg => 
                headers.map(header => `"${reg[header]}"`).join(',')
            )
        ].join('\n');

        const bom = '\uFEFF';
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            const filename = `registrations_${course.courseName.replace(/[\s/]/g, '_')}.csv`;
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            addToast(`ส่งออกข้อมูล CSV สำหรับหลักสูตร "${course.courseName}" สำเร็จ!`, 'success');
        }
    };
    
    // Settings Handlers
    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setContactInfo(prev => ({ ...prev!, [id]: value }));
    };
    const handleSaveContact = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.updateContactInfo(contactInfo);
            addToast('บันทึกข้อมูลการติดต่อสำเร็จ!', 'success');
        } catch (error) {
            addToast('ไม่สามารถบันทึกข้อมูลการติดต่อได้', 'error');
        }
    };
    const handleOpenAddFaqModal = () => {
        setEditingFaq(null);
        setIsFaqModalOpen(true);
    };
    const handleOpenEditFaqModal = (faq: Faq) => {
        setEditingFaq(faq);
        setIsFaqModalOpen(true);
    };
    const handleOpenDeleteFaqConfirm = (faq: Faq) => {
        setDeletingFaq(faq);
        setIsFaqConfirmModalOpen(true);
    };
    const handleCloseFaqModals = () => {
        setIsFaqModalOpen(false);
        setIsFaqConfirmModalOpen(false);
        setEditingFaq(null);
        setDeletingFaq(null);
    };
    const handleSaveFaq = async (faqData: Omit<Faq, 'id'> | Faq) => {
        const isUpdating = 'id' in faqData;
        try {
            if (isUpdating) {
                await api.updateFaq(faqData as Faq);
            } else {
                await api.addFaq(faqData);
            }
            addToast(isUpdating ? 'แก้ไข FAQ สำเร็จ!' : 'เพิ่ม FAQ ใหม่สำเร็จ!', 'success');
            await fetchData();
            handleCloseFaqModals();
        } catch (error) {
            addToast('ไม่สามารถบันทึก FAQ ได้', 'error');
        }
    };
    const handleDeleteFaq = async () => {
        if (deletingFaq) {
            try {
                await api.deleteFaq(deletingFaq.id);
                addToast('ลบ FAQ สำเร็จ!', 'success');
                await fetchData();
            } catch(e) {
                addToast('ไม่สามารถลบ FAQ ได้', 'error');
            }
        }
        handleCloseFaqModals();
    };

    // CMS Handlers
    const handleOpenAddCmsModal = () => {
        setEditingAnnouncement(null);
        setIsCmsModalOpen(true);
    };
    const handleOpenEditCmsModal = (announcement: Announcement) => {
        setEditingAnnouncement(announcement);
        setIsCmsModalOpen(true);
    };
    const handleOpenDeleteCmsConfirm = (announcement: Announcement) => {
        setDeletingAnnouncement(announcement);
        setIsCmsConfirmModalOpen(true);
    };
    const handleCloseCmsModals = () => {
        setIsCmsModalOpen(false);
        setIsCmsConfirmModalOpen(false);
        setEditingAnnouncement(null);
        setDeletingAnnouncement(null);
    };
    const handleSaveAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'postedDate'> | Announcement) => {
        const isUpdating = 'id' in announcementData;
        try {
            if (isUpdating) {
                await api.updateAnnouncement(announcementData as Announcement);
            } else {
                await api.addAnnouncement(announcementData as Omit<Announcement, 'id' | 'postedDate'>);
            }
            addToast(isUpdating ? 'แก้ไขประกาศสำเร็จ!' : 'เพิ่มประกาศใหม่สำเร็จ!', 'success');
            await fetchData();
            handleCloseCmsModals();
        } catch (error) {
            addToast('ไม่สามารถบันทึกประกาศได้', 'error');
        }
    };
    const handleDeleteAnnouncement = async () => {
        if (deletingAnnouncement) {
            try {
                await api.deleteAnnouncement(deletingAnnouncement.id);
                addToast('ลบประกาศสำเร็จ!', 'success');
                await fetchData();
            } catch(e) {
                addToast('ไม่สามารถลบประกาศได้', 'error');
            }
        }
        handleCloseCmsModals();
    };


    // Data for charts
    const lineChartData = [
        { name: 'ม.ค.', registrations: 12 }, { name: 'ก.พ.', registrations: 19 }, { name: 'มี.ค.', registrations: 3 },
        { name: 'เม.ย.', registrations: 5 }, { name: 'พ.ค.', registrations: 2 }, { name: 'มิ.ย.', registrations: 3 },
    ];
    const barChartData = courses.map(c => ({
        name: c.courseName.length > 20 ? c.courseName.substring(0, 20) + '...' : c.courseName,
        ผู้ลงทะเบียน: c.currentParticipants
    }));

    const statusStyles: Record<Course['status'], string> = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        upcoming: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        closed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };
    const viewTitles: Record<AdminView, string> = {
        dashboard: "Admin Dashboard",
        courses: "จัดการหลักสูตร",
        registrations: "จัดการการลงทะเบียน",
        cms: "จัดการประกาศ/ประชาสัมพันธ์",
        settings_contact: "ตั้งค่า: ข้อมูลการติดต่อ",
        settings_faq: "ตั้งค่า: ข้อมูล FAQs"
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{viewTitles[activeView]}</h2>
            
            {activeView === 'dashboard' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="จำนวนผู้ลงทะเบียนทั้งหมด" value={registrations.length} color="border-blue-500" />
                        <StatCard title="หลักสูตรที่เปิดรับสมัคร" value={courses.filter(c => c.status === 'active').length} color="border-green-500" />
                        <StatCard title="หลักสูตรที่กำลังจะเปิด" value={courses.filter(c => c.status === 'upcoming').length} color="border-yellow-500" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">สถิติการลงทะเบียน</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={lineChartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="registrations" stroke="#3b82f6" activeDot={{ r: 8 }} /></LineChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">จำนวนผู้ลงทะเบียนตามหลักสูตร</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="name" width={150} tick={{fontSize: 12}} /><Tooltip /><Legend /><Bar dataKey="ผู้ลงทะเบียน" fill="#3b82f6" /></BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {activeView === 'courses' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex justify-end mb-4">
                        <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">เพิ่มหลักสูตรใหม่</button>
                    </div>
                    <div className="overflow-x-auto text-gray-800 dark:text-gray-300">
                        <table className="min-w-full bg-white dark:bg-gray-800 text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr className="text-gray-700 dark:text-gray-300">
                                    <th className="py-3 px-4 text-left font-semibold">ชื่อหลักสูตร</th>
                                    <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">วันที่รับสมัคร</th>
                                    <th className="py-3 px-4 text-left font-semibold">ผู้ลงทะเบียน</th>
                                    <th className="py-3 px-4 text-left font-semibold">สถานะ</th>
                                    <th className="py-3 px-4 text-left font-semibold">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course.courseId} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{course.courseName}</td>
                                        <td className="py-3 px-4 whitespace-nowrap hidden md:table-cell">{formatDate(course.registrationStart)} - {formatDate(course.registrationEnd)}</td>
                                        <td className="py-3 px-4">{course.currentParticipants}/{course.maxParticipants}</td>
                                        <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[course.status]}`}>{course.status}</span></td>
                                        <td className="py-3 px-4 flex items-center space-x-3">
                                            <button onClick={() => handleOpenEditModal(course)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                                            <button onClick={() => handleOpenDeleteConfirm(course)} className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {activeView === 'registrations' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-300">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr className="text-gray-700 dark:text-gray-300">
                                    <th className="py-3 px-4 text-left font-semibold">ชื่อหลักสูตร</th>
                                    <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">วันที่รับสมัคร</th>
                                    <th className="py-3 px-4 text-left font-semibold">ผู้ลงทะเบียน</th>
                                    <th className="py-3 px-4 text-left font-semibold">สถานะ</th>
                                    <th className="py-3 px-4 text-center font-semibold">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => {
                                    const courseRegistrations = registrations.filter(r => r.courseId === course.courseId);
                                    const isExpanded = expandedCourseId === course.courseId;
                                    return (
                                        <React.Fragment key={course.courseId}>
                                            <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{course.courseName}</td>
                                                <td className="py-3 px-4 whitespace-nowrap hidden md:table-cell">{formatDate(course.registrationStart)} - {formatDate(course.registrationEnd)}</td>
                                                <td className="py-3 px-4">{courseRegistrations.length}/{course.maxParticipants}</td>
                                                <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[course.status]}`}>{course.status}</span></td>
                                                <td className="py-3 px-4 flex items-center justify-center space-x-3">
                                                    <button onClick={() => setExpandedCourseId(isExpanded ? null : course.courseId)} className="text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed" aria-label={isExpanded ? "ซ่อนรายชื่อ" : "แสดงรายชื่อ"} disabled={courseRegistrations.length === 0}>{isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}</button>
                                                    <button onClick={() => handleExportCourseCsv(course)} className="text-green-600 hover:text-green-800 disabled:text-gray-300 disabled:cursor-not-allowed" aria-label="ส่งออกเป็น CSV" disabled={courseRegistrations.length === 0}><ExportIcon /></button>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr className="bg-gray-50 dark:bg-gray-900/50"><td colSpan={5} className="p-4">
                                                    <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">รายชื่อผู้ลงทะเบียน: {course.courseName}</h4>
                                                    <div className="overflow-x-auto border dark:border-gray-600 rounded-lg"><table className="min-w-full bg-white dark:bg-gray-800">
                                                        <thead className="bg-gray-200 dark:bg-gray-700 text-xs"><tr>
                                                            <th className="py-2 px-3 text-left font-semibold">ชื่อ-นามสกุล</th>
                                                            <th className="py-2 px-3 text-left font-semibold hidden sm:table-cell">องค์กร</th>
                                                            <th className="py-2 px-3 text-left font-semibold hidden md:table-cell">อีเมล</th>
                                                            <th className="py-2 px-3 text-left font-semibold">สถานะ</th>
                                                        </tr></thead>
                                                        <tbody>{courseRegistrations.map(reg => (<tr key={reg.registrationId} className="border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                            <td className="py-2 px-3">{reg.firstName} {reg.lastName}</td>
                                                            <td className="py-2 px-3 hidden sm:table-cell">{reg.organization}</td>
                                                            <td className="py-2 px-3 hidden md:table-cell">{reg.email}</td>
                                                            <td className="py-2 px-3"><span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{reg.status}</span></td>
                                                        </tr>))}</tbody>
                                                    </table></div>
                                                </td></tr>
                                            )}
                                        </React.Fragment>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {activeView === 'cms' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex justify-end mb-4">
                        <button onClick={handleOpenAddCmsModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">เพิ่มประกาศใหม่</button>
                    </div>
                    <div className="overflow-x-auto text-gray-800 dark:text-gray-300">
                        <table className="min-w-full bg-white dark:bg-gray-800 text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr className="text-gray-700 dark:text-gray-300">
                                    <th className="py-3 px-4 text-left font-semibold">หัวข้อ</th>
                                    <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">วันที่โพสต์</th>
                                    <th className="py-3 px-4 text-left font-semibold">ประเภท</th>
                                    <th className="py-3 px-4 text-left font-semibold">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.map(ann => (
                                    <tr key={ann.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">{ann.title}</td>
                                        <td className="py-3 px-4 whitespace-nowrap hidden md:table-cell">{formatDate(ann.postedDate)}</td>
                                        <td className="py-3 px-4 capitalize">{ann.type}</td>
                                        <td className="py-3 px-4 flex items-center space-x-3">
                                            <button onClick={() => handleOpenEditCmsModal(ann)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                                            <button onClick={() => handleOpenDeleteCmsConfirm(ann)} className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeView === 'settings_contact' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <form onSubmit={handleSaveContact}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">โทรศัพท์</label>
                                <input type="text" id="phone" value={contactInfo.phone} onChange={handleContactChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">อีเมล</label>
                                <input type="email" id="email" value={contactInfo.email} onChange={handleContactChange} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ที่อยู่ (สามารถใช้ &lt;br/&gt; สำหรับขึ้นบรรทัดใหม่)</label>
                                <textarea id="address" value={contactInfo.address} onChange={handleContactChange} rows={3} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6 pt-4 border-t dark:border-gray-700">
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                บันทึกการเปลี่ยนแปลง
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeView === 'settings_faq' && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="flex justify-end mb-4">
                        <button onClick={handleOpenAddFaqModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">เพิ่ม FAQ ใหม่</button>
                    </div>
                    <div className="space-y-3">
                        {faqs.map(faq => (
                            <div key={faq.id} className="border dark:border-gray-700 p-4 rounded-lg flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{faq.question}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{faq.answer}</p>
                                </div>
                                <div className="flex items-center space-x-3 flex-shrink-0">
                                    <button onClick={() => handleOpenEditFaqModal(faq)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                                    <button onClick={() => handleOpenDeleteFaqConfirm(faq)} className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <CourseModal isOpen={isCourseModalOpen} onClose={handleCloseCourseModals} onSave={handleSaveCourse} course={editingCourse} />
            <ConfirmationModal isOpen={isConfirmModalOpen} onClose={handleCloseCourseModals} onConfirm={handleDeleteCourse} title="ยืนยันการลบ" message={`คุณแน่ใจหรือไม่ว่าต้องการลบหลักสูตร "${deletingCourse?.courseName}"? การกระทำนี้ไม่สามารถยกเลิกได้`} />
            <FaqModal isOpen={isFaqModalOpen} onClose={handleCloseFaqModals} onSave={handleSaveFaq} faq={editingFaq} />
            <ConfirmationModal isOpen={isFaqConfirmModalOpen} onClose={handleCloseFaqModals} onConfirm={handleDeleteFaq} title="ยืนยันการลบ FAQ" message={`คุณแน่ใจหรือไม่ว่าต้องการลบคำถาม "${deletingFaq?.question}"?`} />
            <AnnouncementModal isOpen={isCmsModalOpen} onClose={handleCloseCmsModals} onSave={handleSaveAnnouncement} announcement={editingAnnouncement} />
            <ConfirmationModal isOpen={isCmsConfirmModalOpen} onClose={handleCloseCmsModals} onConfirm={handleDeleteAnnouncement} title="ยืนยันการลบประกาศ" message={`คุณแน่ใจหรือไม่ว่าต้องการลบประกาศ "${deletingAnnouncement?.title}"?`} />
        </div>
    );
};

export default AdminDashboardView;