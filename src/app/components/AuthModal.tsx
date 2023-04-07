'use client'

import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useState } from 'react'
import AuthModalInput from './AuthModalInput'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  borderRadius: '4px',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

export default function AuthModal({ isSignin }: { isSignin: boolean }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    city: '',
    email: '',
    password: '',
  })

  const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs({ ...inputs, [name]: value })
  }

  return (
    <div>
      <button
        className={
          isSignin
            ? 'bg-blue-500 text-white border p-1 px-4 rounded mr-3'
            : 'border p-1 px-4 rounded'
        }
        onClick={handleOpen}
      >
        {isSignin ? 'Sign in' : 'Sign up'}
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <div className='p-2 h-120'>
            <div className='uppercase font-bold text-center border-b mb-2 pb-2'>
              {isSignin ? 'Sign in' : 'Create Account'}
            </div>
            <div className='m-auto'>
              <h2 className='text-2xl font-light text-center'>
                {isSignin ? 'Login to your account' : 'Create your account'}
              </h2>
              <AuthModalInput
                inputs={inputs}
                isSignin={isSignin}
                onInputsChange={handleInputsChange}
              />
              <button className='uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400'>
                {isSignin ? 'Sign in' : 'Create Account'}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}
