
import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/mockApi';
import type { Course, Registration, AdminView } from '../../types';
import CourseModal from '../../contexts/components/CourseModal';
import ConfirmationModal from '../../contexts/components/ConfirmationModal';
import { EditIcon, DeleteIcon, PDFIcon, ExportIcon } from '../../contexts/components/icons/Icons';
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
    <div className={`bg-white rounded-lg p-6 shadow-md border-l-4 ${color}`}>
        <div className="text-2xl sm:text-3xl font-bold text-gray-800">{value}</div>
        <div className="text-gray-600">{title}</div>
    </div>
);

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ activeView }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
    const addToast = useToast();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const coursesData = await api.getCourses();
            const registrationsData = await api.getRegistrations();
            setCourses(coursesData);
            setRegistrations(registrationsData);
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

    const handleCloseModals = () => {
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
            handleCloseModals();
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
        handleCloseModals();
    };
    
    const handleExportCsv = () => {
        if (registrations.length === 0) {
            addToast('No registration data to export.', 'error');
            return;
        }

        const headers = ['registrationId', 'courseName', 'firstName', 'lastName', 'organization', 'registrationDate', 'status'];
        const csvContent = [
            headers.join(','),
            ...registrations.map(reg => 
                headers.map(header => `"${(reg as any)[header]}"`).join(',')
            )
        ].join('\n');

        const bom = '\uFEFF';
        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'registrations.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            addToast('Export successful!', 'success');
        }
    };
    
    const handleExportPdf = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const tableRows = registrations.map(reg => `
                <tr>
                    <td>${reg.firstName} ${reg.lastName}</td>
                    <td>${reg.courseName}</td>
                    <td>${reg.organization}</td>
                    <td>${formatDate(reg.registrationDate)}</td>
                    <td>${reg.status}</td>
                </tr>
            `).join('');

            const reportHtml = `
                <html>
                    <head>
                        <title>Course Registration Report</title>
                        <meta charset="UTF-8">
                        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap" rel="stylesheet">
                        <style>
                            body { font-family: 'Kanit', sans-serif; padding: 20px; }
                            h1 { color: #333; }
                            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            thead { background-color: #f2f2f2; }
                            @media print {
                                body { -webkit-print-color-adjust: exact; }
                            }
                        </style>
                    </head>
                    <body>
                        <h1>รายงานการลงทะเบียนหลักสูตร</h1>
                        <p>วันที่ออกรายงาน: ${new Date().toLocaleDateString('th-TH')}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>ชื่อ-นามสกุล</th>
                                    <th>หลักสูตร</th>
                                    <th>องค์กร</th>
                                    <th>วันที่ลงทะเบียน</th>
                                    <th>สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </body>
                </html>
            `;

            printWindow.document.write(reportHtml);
            printWindow.document.close();
            printWindow.focus();
            
            printWindow.onload = function() {
                printWindow.print();
            };
        }
    };

    const lineChartData = [
        { name: 'ม.ค.', registrations: 12 },
        { name: 'ก.พ.', registrations: 19 },
        { name: 'มี.ค.', registrations: 3 },
        { name: 'เม.ย.', registrations: 5 },
        { name: 'พ.ค.', registrations: 2 },
        { name: 'มิ.ย.', registrations: 3 },
    ];

    const barChartData = courses.map(c => ({
        name: c.courseName.length > 20 ? c.courseName.substring(0, 20) + '...' : c.courseName,
        ผู้ลงทะเบียน: c.currentParticipants
    }));

    const statusStyles: Record<Course['status'], string> = {
        active: 'bg-green-100 text-green-800',
        upcoming: 'bg-yellow-100 text-yellow-800',
        closed: 'bg-gray-100 text-gray-800'
    };
    
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };
    
    const viewTitles: Record<AdminView, string> = {
        dashboard: "Admin Dashboard",
        courses: "จัดการหลักสูตร",
        registrations: "จัดการการลงทะเบียน"
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">{viewTitles[activeView]}</h2>
            
            {activeView === 'dashboard' && (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard title="จำนวนผู้ลงทะเบียนทั้งหมด" value={registrations.length} color="border-blue-500" />
                        <StatCard title="หลักสูตรที่เปิดรับสมัคร" value={courses.filter(c => c.status === 'active').length} color="border-green-500" />
                        <StatCard title="หลักสูตรที่กำลังจะเปิด" value={courses.filter(c => c.status === 'upcoming').length} color="border-yellow-500" />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">สถิติการลงทะเบียน</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="registrations" stroke="#3b82f6" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-4">จำนวนผู้ลงทะเบียนตามหลักสูตร</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" width={150} tick={{fontSize: 12}} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="ผู้ลงทะเบียน" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {activeView === 'courses' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                         {/* This title is now redundant as it's at the top */}
                        <div></div>
                        <button onClick={handleOpenAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto">เพิ่มหลักสูตรใหม่</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left font-semibold">ชื่อหลักสูตร</th>
                                    <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">วันที่รับสมัคร</th>
                                    <th className="py-3 px-4 text-left font-semibold">ผู้ลงทะเบียน</th>
                                    <th className="py-3 px-4 text-left font-semibold">สถานะ</th>
                                    <th className="py-3 px-4 text-left font-semibold">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course.courseId} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-800">{course.courseName}</td>
                                        <td className="py-3 px-4 whitespace-nowrap hidden md:table-cell">{formatDate(course.registrationStart)} - {formatDate(course.registrationEnd)}</td>
                                        <td className="py-3 px-4">{course.currentParticipants}/{course.maxParticipants}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[course.status]}`}>
                                                {course.status}
                                            </span>
                                        </td>
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
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                        <div></div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <button 
                                onClick={handleExportCsv}
                                className="flex items-center justify-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full sm:w-auto"
                            >
                                <ExportIcon />
                                <span>Export CSV</span>
                            </button>
                             <button 
                                onClick={handleExportPdf}
                                className="flex items-center justify-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
                            >
                                <PDFIcon />
                                <span>Export PDF</span>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left font-semibold">ชื่อ-นามสกุล</th>
                                    <th className="py-3 px-4 text-left font-semibold">หลักสูตร</th>
                                    <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">องค์กร</th>
                                    <th className="py-3 px-4 text-left font-semibold hidden sm:table-cell">วันที่ลงทะเบียน</th>
                                    <th className="py-3 px-4 text-left font-semibold">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map(reg => (
                                    <tr key={reg.registrationId} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-800">{reg.firstName} {reg.lastName}</td>
                                        <td className="py-3 px-4">{reg.courseName}</td>
                                        <td className="py-3 px-4 hidden md:table-cell">{reg.organization}</td>
                                        <td className="py-3 px-4 whitespace-nowrap hidden sm:table-cell">{formatDate(reg.registrationDate)}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {reg.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            <CourseModal 
                isOpen={isCourseModalOpen} 
                onClose={handleCloseModals} 
                onSave={handleSaveCourse}
                course={editingCourse}
            />
            
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={handleCloseModals}
                onConfirm={handleDeleteCourse}
                title="ยืนยันการลบ"
                message={`คุณแน่ใจหรือไม่ว่าต้องการลบหลักสูตร "${deletingCourse?.courseName}"? การกระทำนี้ไม่สามารถยกเลิกได้`}
            />
        </div>
    );
};

export default AdminDashboardView;