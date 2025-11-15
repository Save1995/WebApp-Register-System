
import React from 'react';

const HomeView: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">ประกาศ/ประชาสัมพันธ์</h2>
      <div className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
          <h3 className="font-semibold text-lg sm:text-xl text-gray-900">เปิดรับสมัครหลักสูตรใหม่ ประจำปี 2568</h3>
          <p className="text-gray-600 mt-1">เปิดรับสมัครตั้งแต่วันที่ 1 มกราคม 2568 ถึง 31 มีนาคม 2568</p>
          <span className="text-sm text-gray-500 mt-2 block">โพสต์เมื่อ: 1 ธันวาคม 2567</span>
        </div>
        <div className="border-l-4 border-green-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
          <h3 className="font-semibold text-lg sm:text-xl text-gray-900">แจ้งปรับปรุงระบบลงทะเบียนออนไลน์</h3>
          <p className="text-gray-600 mt-1">ระบบได้รับการอัปเกรดเพื่อเพิ่มประสิทธิภาพในการใช้งาน</p>
          <span className="text-sm text-gray-500 mt-2 block">โพสต์เมื่อ: 15 พฤศจิกายน 2567</span>
        </div>
        <div className="border-l-4 border-yellow-500 pl-4 py-2 hover:bg-gray-50 transition-colors">
          <h3 className="font-semibold text-lg sm:text-xl text-gray-900">ผลการคัดเลือกผู้เข้าอบรมหลักสูตร "การบริหารจัดการโรงพยาบาล"</h3>
          <p className="text-gray-600 mt-1">สามารถตรวจสอบรายชื่อผู้ผ่านการคัดเลือกได้ที่นี่</p>
          <span className="text-sm text-gray-500 mt-2 block">โพสต์เมื่อ: 10 พฤศจิกายน 2567</span>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
