import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('resume', input);

      const { data } = await axios.post(
        '/api/ai/resume-review',
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-8 text-slate-700 bg-gradient-to-br from-green-50 via-white to-cyan-50">
      {/* Left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-7 h-7 text-[#00DA83]" />
          <h1 className="text-2xl font-bold text-gray-800">Resume Review</h1>
        </div>

        <label className="mt-4 block text-sm font-semibold text-gray-700">
          Upload Resume
        </label>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="application/pdf"
          className="w-full p-3 mt-2 text-sm rounded-xl border border-gray-300 text-gray-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 outline-none transition-all"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports PDF Resume only!
        </p>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] hover:from-[#00C975] hover:to-[#008EA6] text-white px-5 py-3 mt-6 text-sm font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <FileText className="w-5" />
          )}
          Review Resume
        </button>
      </form>

      {/* Right col */}
      <div className="w-full max-w-lg p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl flex flex-col min-h-96 max-h-[600px] transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-6 h-6 text-[#00DA83]" />
          <h1 className="text-2xl font-bold text-gray-800">Analysis Results</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <FileText className="w-10 h-10" />
              <p className="text-center">
                Upload a Resume and click "Review Resume" to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600 pr-2">
            <div className="prose prose-sm max-w-none">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
