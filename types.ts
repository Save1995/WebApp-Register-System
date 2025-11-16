
export interface User {
  username: string;
  role: 'admin';
}

export interface Course {
  courseId: string;
  courseName: string;
  courseGen: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  maxParticipants: number;
  currentParticipants: number;
  location: string;
  instructor: string;
  status: 'active' | 'upcoming' | 'closed';
}

export interface Registration {
  registrationId: string;
  courseId: string;
  courseName: string;
  firstName: string;
  lastName: string;
  idCard: string;
  birthDate: string;
  phone: string;
  email: string;
  organization: string;
  position: string;
  address: string;
  registrationDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  postedDate: string;
  type: 'info' | 'success' | 'warning';
}

export type Page = 'home' | 'courses' | 'faq' | 'about' | 'admin';

export type AdminView = 'dashboard' | 'courses' | 'registrations' | 'cms' | 'settings_contact' | 'settings_faq';