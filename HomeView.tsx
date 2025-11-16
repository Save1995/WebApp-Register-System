
import React, { useState, useEffect } from 'react';
import api from './services/mockApi';
import type { Announcement } from './types';
import LoadingSpinner from './contexts/components/LoadingSpinner';

const HomeView: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await api.getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  const borderColors: Record<Announcement['type'], string> = {
    info: 'border-blue-500',
    success: 'border-green-500',
    warning: 'border-yellow-500'
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">ประกาศ/ประชาสัมพันธ์</h2>
      {announcements.length > 0 ? (
        <div className="space-y-6">
          {announcements.map(announcement => (
            <div key={announcement.id} className={`border-l-4 ${borderColors[announcement.type]} pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-gray-100">{announcement.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{announcement.content}</p>
              <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">โพสต์เมื่อ: {formatDate(announcement.postedDate)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">ไม่มีประกาศในขณะนี้</p>
        </div>
      )}
    </div>
  );
};

export default HomeView;