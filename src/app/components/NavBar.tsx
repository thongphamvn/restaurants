'use client'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

export default function NavBar() {
  const { isAuthenticated, initializing, user, signout } = useAuth()

  const renderActions = () => {
    if (initializing) {
      return <div></div>
    }

    if (isAuthenticated) {
      return (
        <div className='flex items-center'>
          <div className='mr-2'>{user?.email}</div>
          <button
            onClick={signout}
            className='bg-red-500 text-white px-2 py-1 rounded'
          >
            Logout
          </button>
        </div>
      )
    }

    return (
      <>
        <AuthModal isSignin />
        <AuthModal isSignin={false} />
      </>
    )
  }

  return (
    <nav className='bg-white p-2 flex justify-between'>
      <Link href='' className='font-bold text-gray-700 text-2xl'>
        OpenTable
      </Link>
      <div>
        <div className='flex'>{renderActions()}</div>
      </div>
    </nav>
  )
}
