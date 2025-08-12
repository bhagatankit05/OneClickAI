import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (object.split(' ').length > 1) {
        setLoading(false);
        return toast('Please enter only one object name!');
      }

      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const { data } = await axios.post(
        '/api/ai/remove-image-object',
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
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-8 text-slate-700 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-7 h-7 text-[#4A7AFF]" />
          <h1 className="text-2xl font-bold text-gray-800">Object Removal</h1>
        </div>

        <label className="mt-4 block text-sm font-semibold text-gray-700">
          Upload Image
        </label>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-3 mt-2 text-sm rounded-xl border border-gray-300 text-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none transition-all"
          required
        />

        <label className="mt-6 block text-sm font-semibold text-gray-700">
          Describe Object Name to Remove
        </label>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className="w-full p-3 mt-2 text-sm rounded-xl border border-gray-300 text-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all resize-none"
          placeholder="e.g., watch or spoon (only single object name)"
          required
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] via-[#6F5CFF] to-[#8E37EB] hover:from-[#2E6FF0] hover:to-[#7426E3] text-white px-5 py-3 mt-6 text-sm font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>

      {/* Right col */}
      <div className="w-full max-w-lg p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl flex flex-col min-h-96 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <Scissors className="w-6 h-6 text-[#4A7AFF]" />
          <h1 className="text-2xl font-bold text-gray-800">Processed Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Scissors className="w-10 h-10" />
              <p className="text-center">
                Upload an image and click "Remove Object" to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-hidden rounded-xl shadow-md">
            <img
              src={content}
              alt="Processed"
              className="w-full h-full object-contain bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
