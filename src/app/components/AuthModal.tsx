'use client'

import { SignupPayload } from '@/types'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthModalInput from './AuthModalInput'
import LoadingSpinner from './LoadingSpinner'

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

const formInit = {
  firstName: '',
  lastName: '',
  phone: '',
  city: '',
  email: '',
  password: '',
}
export default function AuthModal({ isSignin }: { isSignin: boolean }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
    setInputs(formInit)
  }

  const [inputs, setInputs] = useState<SignupPayload>(formInit)

  const [disable, setDisable] = useState(true)
  const { error, reset, signin, signup, loading } = useAuth()

  useEffect(() => {
    if (isSignin) {
      if (inputs.email && inputs.password) {
        setDisable(false)
      } else {
        setDisable(true)
      }
    } else {
      if (
        inputs.firstName &&
        inputs.lastName &&
        inputs.phone &&
        inputs.city &&
        inputs.email &&
        inputs.password
      ) {
        setDisable(false)
      } else {
        setDisable(true)
      }
    }
  }, [inputs])

  const handleSubmitClick = async () => {
    if (loading) {
      return
    }

    if (isSignin) {
      await signin({ email: inputs.email, password: inputs.password })
    } else {
      await signup(inputs)
    }
  }

  const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs({ ...inputs, [name]: value })
  }

  const renderSubmitButton = () => {
    if (loading) {
      return <LoadingSpinner />
    }
    return isSignin ? 'Sign in' : 'Create Account'
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
              <div className='h-6 text-sm font-light text-red-600 italic text-center mt-2'>
                {error}
              </div>

              <AuthModalInput
                inputs={inputs}
                isSignin={isSignin}
                onInputsChange={handleInputsChange}
              />
              <button
                onClick={handleSubmitClick}
                disabled={disable}
                className='uppercase bg-red-600 w-full text-white p-3 rounded text-sm mb-5 disabled:bg-gray-400 h-12 px-auto'
              >
                {renderSubmitButton()}
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  )
}
