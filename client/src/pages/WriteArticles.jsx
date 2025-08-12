import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const WriteArticles = () => {

  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200-1600 words)' },
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading,setLoading] = useState(false);
  const [content,setContent] = useState('')

  const {getToken} = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an article about ${input} in ${selectedLength.text}`
      const {data} = await axios.post('/api/ai/generate-article',{prompt,length:selectedLength.length},{
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if (data.success) {
        setContent(data.content);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-8 text-slate-700 bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      {/* Left col */}
      <form 
        onSubmit={onSubmitHandler} 
        className='w-full max-w-lg p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300'
      >
        <div className='flex items-center gap-3 mb-4'>
          <Sparkles className='w-7 h-7 text-[#4A7AFF]' />
          <h1 className='text-2xl font-bold text-gray-800'>Article Configuration</h1>
        </div>

        <label className='mt-4 block text-sm font-semibold text-gray-700'>Article Topic</label>
        <input 
          onChange={(e) => setInput(e.target.value)} 
          value={input} 
          type="text" 
          className='w-full p-3 mt-2 outline-none text-sm rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all placeholder-gray-400' 
          placeholder='The future of Artificial Intelligence is...' 
          required 
        />

        <label className='mt-6 block text-sm font-semibold text-gray-700'>Article Length</label>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {articleLength.map((item, index) =>
            <span 
              onClick={() => setSelectedLength(item)}
              className={`px-5 py-2 text-xs border rounded-full cursor-pointer transition-all duration-300 ${
                selectedLength.text === item.text 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105 ring-2 ring-blue-300' 
                : 'text-gray-600 border-gray-300 hover:bg-gray-100 hover:shadow'
              }`} 
              key={index}
            >
              {item.text}
            </span>
          )}
        </div>

        <button 
          disabled={loading} 
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] via-[#5C8DFF] to-[#8B5CFF] hover:from-[#1B5DEB] hover:via-[#4E9CFF] hover:to-[#7A4CFF] text-white px-5 py-3 mt-6 text-sm font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading
            ? <span className='w-5 h-5 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Edit className='w-5' />
          }
          Generate Article
        </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl flex flex-col min-h-96 max-h-[600px] transition-all duration-300'>
        <div className='flex items-center gap-3 mb-2'>
          <Edit className='w-6 h-6 text-[#4A7AFF]'/>
          <h1 className='text-2xl font-bold text-gray-800'>Generated Article</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Edit className='w-10 h-10'/>
              <p className='text-center'>Enter a topic and click "Generate Article" to get started.</p>
            </div>
          </div>
        ) : (
          <div className='mt-4 h-full overflow-y-scroll text-sm text-slate-700 leading-relaxed pr-2'>
            <div className='reset-tw prose prose-blue max-w-none'>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WriteArticles
