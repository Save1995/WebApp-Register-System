
import React, { useState, useEffect } from 'react';
import api from '../../services/mockApi';
import type { Faq } from '../../types';
import LoadingSpinner from '../../contexts/components/LoadingSpinner';

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full p-4 text-left"
      >
        <h3 className="font-semibold text-base sm:text-lg text-blue-700 dark:text-blue-400">{question}</h3>
        <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </span>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-gray-700 dark:text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

const FaqView: React.FC = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await api.getFaqs();
        setFaqs(data);
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">คำถามที่พบบ่อย</h2>
      {faqs.length > 0 ? (
        <div className="space-y-4">
          {faqs.map(faq => (
            <FaqItem key={faq.id} question={faq.question}>
              <p>{faq.answer}</p>
            </FaqItem>
          ))}
        </div>
      ) : (
         <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">ไม่พบข้อมูลคำถามที่พบบ่อย</p>
        </div>
      )}
    </div>
  );
};

export default FaqView;