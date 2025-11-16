
import React, { useState, useEffect } from 'react';
import type { Announcement } from '../../types';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (announcement: Omit<Announcement, 'id' | 'postedDate'> | Announcement) => void;
  announcement: Announcement | null;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ isOpen, onClose, onSave, announcement }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<Announcement['type']>('info');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (announcement) {
        setTitle(announcement.title);
        setContent(announcement.content);
        setType(announcement.type);
      } else {
        setTitle('');
        setContent('');
        setType('info');
      }
    }
  }, [announcement, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = announcement 
        ? { id: announcement.id, postedDate: announcement.postedDate, title, content, type } 
        : { title, content, type };
      await onSave(dataToSave);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-4 border-b dark:border-gray-700 pb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{announcement ? 'แก้ไขประกาศ' : 'เพิ่มประกาศใหม่'}</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl">&times;</button>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">หัวข้อ</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">เนื้อหา</label>
              <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={4} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">ประเภท</label>
              <select id="type" value={type} onChange={(e) => setType(e.target.value as Announcement['type'])} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="info">Info (Blue)</option>
                <option value="success">Success (Green)</option>
                <option value="warning">Warning (Yellow)</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 gap-2 sm:gap-0 mt-6 pt-4 border-t dark:border-gray-700">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">ยกเลิก</button>
            <button type="submit" disabled={isSaving} className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
              {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementModal;