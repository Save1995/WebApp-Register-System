import type { Course, Registration } from '../types';

let mockCourses: Course[] = [
    {
        courseId: "C001",
        courseName: "การบริหารจัดการโรงพยาบาล",
        courseGen: "รุ่นที่ 15",
        description: "หลักสูตรพัฒนาทักษะการบริหารจัดการโรงพยาบาลสำหรับผู้บริหารระดับกลาง",
        startDate: "2025-03-15",
        endDate: "2025-03-20",
        registrationStart: "2025-01-01",
        registrationEnd: "2025-08-28",
        maxParticipants: 50,
        currentParticipants: 35,
        location: "โรงแรมสยาม บางกอก",
        instructor: "ดร.สมชาย ใจดี",
        status: "active"
    },
    {
        courseId: "C002",
        courseName: "นโยบายสาธารณสุขแห่งชาติ",
        courseGen: "รุ่นที่ 8",
        description: "หลักสูตรวิเคราะห์นโยบายสาธารณสุขและการวางแผนเชิงกลยุทธ์",
        startDate: "2025-04-10",
        endDate: "2025-04-15",
        registrationStart: "2025-02-01",
        registrationEnd: "2025-09-30",
        maxParticipants: 40,
        currentParticipants: 28,
        location: "ศูนย์ฝึกอบรมกระทรวงสาธารณสุข",
        instructor: "นางสาวสุภาพร แสงทอง",
        status: "active"
    },
    {
        courseId: "C003",
        courseName: "การจัดการทรัพยากรบุคคลในหน่วยงานสาธารณสุข",
        courseGen: "รุ่นที่ 12",
        description: "พัฒนาทักษะการบริหารทรัพยากรบุคคลในองค์กรภาครัฐ",
        startDate: "2025-11-05",
        endDate: "2025-11-10",
        registrationStart: "2025-10-01",
        registrationEnd: "2025-10-30",
        maxParticipants: 35,
        currentParticipants: 15,
        location: "โรงแรมเซ็นทารา แกรนด์ บางกอก",
        instructor: "ผศ.ดร.วิชัย ทองคำ",
        status: "upcoming"
    },
    {
        courseId: "C004",
        courseName: "การเงินและการคลังสำหรับผู้บริหาร",
        courseGen: "รุ่นที่ 5",
        description: "หลักสูตรพื้นฐานด้านการเงินและการคลังสำหรับโรงพยาบาล",
        startDate: "2024-11-10",
        endDate: "2024-11-15",
        registrationStart: "2024-09-01",
        registrationEnd: "2024-10-15",
        maxParticipants: 30,
        currentParticipants: 30,
        location: "ออนไลน์ผ่าน Zoom",
        instructor: "รศ.ดร. สุดา การเงิน",
        status: "closed"
    }
];

let mockRegistrations: Registration[] = [
    {
        registrationId: "R001",
        courseId: "C001",
        courseName: "การบริหารจัดการโรงพยาบาล",
        firstName: "สมศักดิ์",
        lastName: "เจริญผล",
        idCard: "1-2345-67890-12-3",
        birthDate: "1985-05-15",
        phone: "081-234-5678",
        email: "somsak@example.com",
        organization: "โรงพยาบาลนครราชสีมา",
        position: "ผู้อำนวยการฝ่ายบริหาร",
        address: "123 ถนนสุขภาพ ตำบลในเมือง อำเภอเมือง จังหวัดนครราชสีมา 30000",
        registrationDate: "2025-01-15",
        status: "confirmed"
    },
    {
        registrationId: "R002",
        courseId: "C001",
        courseName: "การบริหารจัดการโรงพยาบาล",
        firstName: "กนกวรรณ",
        lastName: "พงษ์ศรี",
        idCard: "2-3456-78901-23-4",
        birthDate: "1988-08-22",
        phone: "082-345-6789",
        email: "kanokwan@example.com",
        organization: "โรงพยาบาลสระบุรี",
        position: "หัวหน้าแผนกพยาบาล",
        address: "456 หมู่ 7 ตำบลบ้านใหม่ อำเภอเมือง จังหวัดสระบุรี 18000",
        registrationDate: "2025-01-20",
        status: "confirmed"
    }
];

const api = {
  getCourses: async (): Promise<Course[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockCourses]), 500));
  },
  getRegistrations: async (): Promise<Registration[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockRegistrations]), 500));
  },
  addCourse: async (courseData: Omit<Course, 'courseId' | 'currentParticipants'>): Promise<Course> => {
    return new Promise(resolve => {
      const newCourse: Course = {
        ...courseData,
        courseId: `C${Date.now()}`,
        currentParticipants: 0,
      };
      mockCourses.push(newCourse);
      setTimeout(() => resolve(newCourse), 500);
    });
  },
  updateCourse: async (courseData: Course): Promise<Course> => {
     return new Promise((resolve, reject) => {
      const index = mockCourses.findIndex(c => c.courseId === courseData.courseId);
      if (index !== -1) {
        mockCourses[index] = courseData;
        setTimeout(() => resolve(courseData), 500);
      } else {
        reject(new Error("Course not found"));
      }
    });
  },
  deleteCourse: async (courseId: string): Promise<{ success: boolean }> => {
    return new Promise(resolve => {
        mockCourses = mockCourses.filter(c => c.courseId !== courseId);
        setTimeout(() => resolve({ success: true }), 500);
    });
  },
};

export default api;