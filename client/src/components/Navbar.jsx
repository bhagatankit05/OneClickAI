import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { openSignIn } = useClerk();

    return (
        <div className='fixed z-50 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
            <img
                src={assets.logo_1}
                alt='logo'
                className='w-32 sm:w-44 cursor-pointer'
                onClick={() => navigate('/')}
            />

            {
                user ? (
                    <UserButton />
                ) : (
                    <button
                        onClick={openSignIn}
                        className='flex items-center gap-2 cursor-pointer rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 transition duration-300 text-white px-6 sm:px-8 py-2.5 shadow-md'
                    >
                        Get Started <ArrowRight className='w-4 h-4' />
                    </button>
                )
            }
        </div>
    )
}

export default Navbar
