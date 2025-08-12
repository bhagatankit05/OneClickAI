import { Image, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    'Realistic',
    'Ghibli Style',
    'Cartoon',
    'Anime',
    'Pixel Art',
    'Watercolor',
    'Oil Painting',
    'Cyberpunk',
    'Fantasy',
    'Minimalist',
    'Sketch',
    '3D Render'
  ];

  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;
      const { data } = await axios.post(
        '/api/ai/generate-image',
        { prompt, publish },
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
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-8 text-slate-700 bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-7 h-7 text-[#00AD25]" />
          <h1 className="text-2xl font-bold text-gray-800">AI Image Generator</h1>
        </div>

        <label className="mt-4 block text-sm font-semibold text-gray-700">
          Describe Your Image
        </label>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-3 mt-2 outline-none text-sm rounded-xl border border-gray-300 focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all placeholder-gray-400"
          placeholder="Describe what you want to see in the image..."
          required
        />

        <label className="mt-6 block text-sm font-semibold text-gray-700">
          Style
        </label>
        <div className="mt-3 flex gap-3 flex-wrap">
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              key={item}
              className={`px-5 py-2 text-xs border rounded-full cursor-pointer transition-all duration-300 ${
                selectedStyle === item
                  ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg scale-105 ring-2 ring-green-300'
                  : 'text-gray-600 border-gray-300 hover:bg-gray-100 hover:shadow'
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Publish toggle */}
        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm text-gray-700">Make this Image Public</p>
        </div>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00AD25] via-[#00C93A] to-[#04FF50] hover:from-[#00A120] hover:to-[#03E846] text-white px-5 py-3 mt-6 text-sm font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-5" />
          )}
          Generate Image
        </button>
      </form>

      {/* Right col */}
      <div className="w-full max-w-lg p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl flex flex-col min-h-96 transition-all duration-300">
        <div className="flex items-center gap-3 mb-2">
          <Image className="w-6 h-6 text-[#00AD25]" />
          <h1 className="text-2xl font-bold text-gray-800">Generated Image</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="w-10 h-10" />
              <p className="text-center">
                Enter a topic and click "Generate Image" to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-hidden rounded-xl shadow-md">
            <img
              src={content}
              alt="Generated"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
