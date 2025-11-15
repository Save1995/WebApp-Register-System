
import React, { useState } from 'react';

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-4 text-left"
      >
        <h3 className="font-semibold text-base sm:text-lg text-blue-700">{question}</h3>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </span>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

const FaqView: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">คำถามที่พบบ่อย</h2>
      <div className="space-y-4">
        <FaqItem question="จะลงทะเบียนเข้าร่วมอบรมได้อย่างไร?">
          <p>ให้เลือกหลักสูตรที่ต้องการจากหน้า "Courses" จากนั้นคลิกปุ่ม "ลงทะเบียน" และกรอกข้อมูลตามแบบฟอร์มที่ปรากฏ</p>
        </FaqItem>
        <FaqItem question="ต้องเตรียมเอกสารอะไรบ้างในการสมัคร?">
          <p>ต้องเตรียมสำเนาบัตรประชาชน และใบทะเบียนวุฒิการศึกษา ซึ่งจะต้องอัปโหลดในขั้นตอนการลงทะเบียน</p>
        </FaqItem>
        <FaqItem question="สามารถยกเลิกการลงทะเบียนได้หรือไม่?">
          <p>สามารถยกเลิกได้ก่อนวันปิดรับสมัคร โดยติดต่อเจ้าหน้าที่ผ่านช่องทางที่ระบุในหน้า "About"</p>
        </FaqItem>
         <FaqItem question="จะตรวจสอบสถานะการลงทะเบียนได้อย่างไร?">
          <p>หลังจากลงทะเบียนสำเร็จ ท่านจะได้รับอีเมลยืนยันการสมัคร พร้อมลิงก์สำหรับตรวจสอบสถานะและดาวน์โหลดเอกสาร PDF</p>
        </FaqItem>
      </div>
    </div>
  );
};

export default FaqView;
