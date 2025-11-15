
import React from 'react';

const AboutView: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">ติดต่อเรา</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">ข้อมูลการติดต่อ</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <div>
                <p className="font-medium">โทรศัพท์</p>
                <p className="text-gray-600">02-XXX-XXXX</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <div>
                <p className="font-medium">อีเมล</p>
                <p className="text-gray-600">admin@example.com</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <div>
                <p className="font-medium">ที่อยู่</p>
                <p className="text-gray-600">วิทยาลัยนักบริหารสาธารณสุข<br/>กระทรวงสาธารณสุข</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">แผนที่</h3>
          <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
            <p className="text-gray-500">Google Maps placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
