import React, { useState } from 'react'
import { Edit, Hash, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const BlogTitles = () => {
  const blogCategories = ['General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food']
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('')
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`
      const { data } = await axios.post('/api/ai/generate-blog-title', { prompt }, { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-8 text-slate-700 bg-gradient-to-br from-purple-50 via-white to-pink-50'>
      
      {/* Left col */}
      <form 
        onSubmit={onSubmitHandler} 
        className='w-full max-w-lg p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300'
      >
        <div className='flex items-center gap-3 mb-4'>
          <Sparkles className='w-7 h-7 text-[#8E37EB]' />
          <h1 className='text-2xl font-bold text-gray-800'>AI Title Generator</h1>
        </div>

        <label className='mt-4 block text-sm font-semibold text-gray-700'>Keyword</label>
        <input 
          onChange={(e) => setInput(e.target.value)} 
          value={input} 
          type="text" 
          className='w-full p-3 mt-2 outline-none text-sm rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all placeholder-gray-400' 
          placeholder='The future of Artificial Intelligence is...' 
          required 
        />

        <label className='mt-6 block text-sm font-semibold text-gray-700'>Category</label>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {blogCategories.map((item) =>
            <span 
              onClick={() => setSelectedCategory(item)}
              key={item}
              className={`px-5 py-2 text-xs border rounded-full cursor-pointer transition-all duration-300 ${
                selectedCategory === item 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105 ring-2 ring-purple-300' 
                : 'text-gray-600 border-gray-300 hover:bg-gray-100 hover:shadow'
              }`} 
            >
              {item}
            </span>
          )}
        </div>

        <button 
          disabled={loading} 
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] via-[#9F3CEB] to-[#8E37EB] hover:from-[#B338E5] hover:to-[#7A2FCB] text-white px-5 py-3 mt-6 text-sm font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading
            ? <span className='w-5 h-5 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            : <Hash className='w-5' />
          }
          Generate Title
        </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-6 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl flex flex-col min-h-96 transition-all duration-300'>
        <div className='flex items-center gap-3 mb-2'>
          <Hash className='w-6 h-6 text-[#8E37EB]' />
          <h1 className='text-2xl font-bold text-gray-800'>Generated Title</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Hash className='w-10 h-10'/>
              <p className='text-center'>Enter a topic and click "Generate Title" to get started.</p>
            </div>
          </div>
        ) : (
          <div className='mt-4 h-full overflow-y-scroll text-sm text-slate-700 leading-relaxed pr-2'>
            <div className='reset-tw prose prose-purple max-w-none'>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogTitles
