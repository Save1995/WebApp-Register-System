import type { Course, Registration, Faq, ContactInfo, Announcement } from '../types';

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

let mockFaqs: Faq[] = [
    { id: 'faq1', question: "จะลงทะเบียนเข้าร่วมอบรมได้อย่างไร?", answer: "ให้เลือกหลักสูตรที่ต้องการจากหน้า \"Courses\" จากนั้นคลิกปุ่ม \"ลงทะเบียน\" และกรอกข้อมูลตามแบบฟอร์มที่ปรากฏ" },
    { id: 'faq2', question: "ต้องเตรียมเอกสารอะไรบ้างในการสมัคร?", answer: "ต้องเตรียมสำเนาบัตรประชาชน และใบทะเบียนวุฒิการศึกษา ซึ่งจะต้องอัปโหลดในขั้นตอนการลงทะเบียน" },
    { id: 'faq3', question: "สามารถยกเลิกการลงทะเบียนได้หรือไม่?", answer: "สามารถยกเลิกได้ก่อนวันปิดรับสมัคร โดยติดต่อเจ้าหน้าที่ผ่านช่องทางที่ระบุในหน้า \"About\"" },
    { id: 'faq4', question: "จะตรวจสอบสถานะการลงทะเบียนได้อย่างไร?", answer: "หลังจากลงทะเบียนสำเร็จ ท่านจะได้รับอีเมลยืนยันการสมัคร พร้อมลิงก์สำหรับตรวจสอบสถานะและดาวน์โหลดเอกสาร PDF" }
];

let mockContactInfo: ContactInfo = {
    phone: "02-XXX-XXXX",
    email: "admin@example.com",
    address: "วิทยาลัยนักบริหารสาธารณสุข<br/>กระทรวงสาธารณสุข"
};

let mockAnnouncements: Announcement[] = [
    { id: 'anno1', title: 'เปิดรับสมัครหลักสูตรใหม่ ประจำปี 2568', content: 'เปิดรับสมัครตั้งแต่วันที่ 1 มกราคม 2568 ถึง 31 มีนาคม 2568', postedDate: '2024-12-01', type: 'info'},
    { id: 'anno2', title: 'แจ้งปรับปรุงระบบลงทะเบียนออนไลน์', content: 'ระบบได้รับการอัปเกรดเพื่อเพิ่มประสิทธิภาพในการใช้งาน', postedDate: '2024-11-15', type: 'success'},
    { id: 'anno3', title: 'ผลการคัดเลือกผู้เข้าอบรมหลักสูตร "การบริหารจัดการโรงพยาบาล"', content: 'สามารถตรวจสอบรายชื่อผู้ผ่านการคัดเลือกได้ที่นี่', postedDate: '2024-11-10', type: 'warning'},
];


const api = {
  getCourses: async (): Promise<Course[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockCourses]), 500));
  },
  getRegistrations: async (): Promise<Registration[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockRegistrations]), 500));
  },
  addRegistration: async (registrationData: Omit<Registration, 'registrationId' | 'registrationDate' | 'status' | 'courseName'>): Promise<Registration> => {
    return new Promise(resolve => {
        const course = mockCourses.find(c => c.courseId === registrationData.courseId);
        if (course) {
            course.currentParticipants = Math.min(course.maxParticipants, course.currentParticipants + 1);
        }

        const newRegistration: Registration = {
            ...registrationData,
            registrationId: `R${Date.now()}`,
            registrationDate: new Date().toISOString().split('T')[0],
            status: 'confirmed',
            courseName: course?.courseName || 'Unknown Course'
        };
        mockRegistrations.push(newRegistration);
        setTimeout(() => resolve(newRegistration), 1000);
    });
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
  getFaqs: async (): Promise<Faq[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockFaqs]), 500));
  },
  addFaq: async (faqData: Omit<Faq, 'id'>): Promise<Faq> => {
      return new Promise(resolve => {
          const newFaq: Faq = { ...faqData, id: `faq${Date.now()}` };
          mockFaqs.push(newFaq);
          setTimeout(() => resolve(newFaq), 500);
      });
  },
  updateFaq: async (faqData: Faq): Promise<Faq> => {
      return new Promise((resolve, reject) => {
          const index = mockFaqs.findIndex(f => f.id === faqData.id);
          if (index !== -1) {
              mockFaqs[index] = faqData;
              setTimeout(() => resolve(faqData), 500);
          } else {
              reject(new Error("FAQ not found"));
          }
      });
  },
  deleteFaq: async (faqId: string): Promise<{ success: boolean }> => {
      return new Promise(resolve => {
          mockFaqs = mockFaqs.filter(f => f.id !== faqId);
          setTimeout(() => resolve({ success: true }), 500);
      });
  },
  getContactInfo: async (): Promise<ContactInfo> => {
      return new Promise(resolve => setTimeout(() => resolve({ ...mockContactInfo }), 500));
  },
  updateContactInfo: async (contactData: ContactInfo): Promise<ContactInfo> => {
      return new Promise(resolve => {
          mockContactInfo = contactData;
          setTimeout(() => resolve({ ...mockContactInfo }), 500);
      });
  },
  getAnnouncements: async (): Promise<Announcement[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...mockAnnouncements].sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())), 500));
  },
  addAnnouncement: async (announcementData: Omit<Announcement, 'id' | 'postedDate'>): Promise<Announcement> => {
    return new Promise(resolve => {
        const newAnnouncement: Announcement = { 
            ...announcementData, 
            id: `anno${Date.now()}`,
            postedDate: new Date().toISOString().split('T')[0]
        };
        mockAnnouncements.push(newAnnouncement);
        setTimeout(() => resolve(newAnnouncement), 500);
    });
  },
  updateAnnouncement: async (announcementData: Announcement): Promise<Announcement> => {
      return new Promise((resolve, reject) => {
          const index = mockAnnouncements.findIndex(a => a.id === announcementData.id);
          if (index !== -1) {
              mockAnnouncements[index] = announcementData;
              setTimeout(() => resolve(announcementData), 500);
          } else {
              reject(new Error("Announcement not found"));
          }
      });
  },
  deleteAnnouncement: async (announcementId: string): Promise<{ success: boolean }> => {
      return new Promise(resolve => {
          mockAnnouncements = mockAnnouncements.filter(a => a.id !== announcementId);
          setTimeout(() => resolve({ success: true }), 500);
      });
  },
};

export default api;