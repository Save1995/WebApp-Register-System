
import React, { useState, useEffect } from 'react';
import type { Faq } from '../../types';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (faq: Omit<Faq, 'id'> | Faq) => void;
  faq: Faq | null;
}

const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose, onSave, faq }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (faq) {
          setQuestion(faq.question);
          setAnswer(faq.answer);
        } else {
          setQuestion('');
          setAnswer('');
        }
    }
  }, [faq, isOpen]);
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dataToSave = faq ? { id: faq.id, question, answer } : { question, answer };
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
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{faq ? 'แก้ไข FAQ' : 'เพิ่ม FAQ ใหม่'}</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl">&times;</button>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300">คำถาม</label>
              <input type="text" id="question" value={question} onChange={(e) => setQuestion(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
            </div>
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">คำตอบ</label>
              <textarea id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} rows={4} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
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

export default FaqModal;