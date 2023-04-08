'use client'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

export default function NavBar() {
  const { isAuthenticated, data } = useAuth()

  return (
    <nav className='bg-white p-2 flex justify-between'>
      <Link href='' className='font-bold text-gray-700 text-2xl'>
        OpenTable
      </Link>
      <div>
        <div className='flex'>
          {isAuthenticated ? (
            <div className='flex items-center'>
              <div className='mr-2'>{data?.email}</div>
            </div>
          ) : (
            <>
              <AuthModal isSignin />
              <AuthModal isSignin={false} />
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
