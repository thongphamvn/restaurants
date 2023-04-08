'use client'

import { AuthUserResponse, SigninPayload, SignupPayload, User } from '@/types'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react'

type AuthState = {
  loading: boolean
  data: User | null
  error: null | string
  token: string | null
}

type AuthContextValue = AuthState & {
  signin: (p: SigninPayload) => void
  signup: (p: SignupPayload) => void
  isAuthenticated: boolean
}

const initState = {
  loading: false,
  data: null,
  error: null,
  token: null,
}

type AuthAction =
  | { type: 'SIGNUP_START' }
  | { type: 'SIGNUP_SUCCESS'; payload: AuthUserResponse }
  | { type: 'SIGNUP_ERROR'; payload: string }
  | { type: 'SIGNIN_START' }
  | { type: 'SIGNIN_SUCCESS'; payload: AuthUserResponse }
  | { type: 'SIGNIN_ERROR'; payload: string }
  | { type: 'SET_USER'; payload: AuthUserResponse }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SIGNUP_START':
      return { ...state, loading: true }
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload.user,
        token: action.payload.token,
        error: null,
      }
    case 'SIGNUP_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SIGNIN_START':
      return { ...state, loading: true }
    case 'SIGNIN_SUCCESS':
      return {
        ...state,
        loading: false,
        data: action.payload.user,
        token: action.payload.token,
        error: null,
      }
    case 'SET_USER':
      return {
        ...state,
        token: action.payload.token,
        data: action.payload.user,
      }
    case 'SIGNIN_ERROR':
      return { ...state, loading: false, error: action.payload }
  }
}

export const AuthContext = createContext<AuthContextValue>({
  ...initState,
  isAuthenticated: false,
  signin: () => {},
  signup: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, dispatch] = useReducer(authReducer, initState)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      axios
        .get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          dispatch({ type: 'SET_USER', payload: { user: res.data, token } })
        })
        .catch((err) => {
          dispatch({
            type: 'SIGNIN_ERROR',
            payload: err.response?.data.message,
          })
        })
    }
  }, [])

  const signup = useMutation<AuthUserResponse, unknown, SignupPayload>({
    mutationFn: async (p) => {
      dispatch({ type: 'SIGNUP_START' })
      const res = await axios.post(`api/auth/signup`, p)
      return res.data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.token)
      dispatch({ type: 'SIGNUP_SUCCESS', payload: data })
    },
    onError: (error: any) => {
      dispatch({ type: 'SIGNUP_ERROR', payload: error.response?.data.message })
    },
  })

  const signin = useMutation<AuthUserResponse, any, SigninPayload>({
    mutationFn: async ({ email, password }) => {
      dispatch({ type: 'SIGNIN_START' })
      return axios
        .post(`api/auth/signin`, {
          email,
          password,
        })
        .then((res) => res.data)
    },
    onError(error: any) {
      dispatch({ type: 'SIGNIN_ERROR', payload: error.response?.data.message })
    },
    onSuccess(data) {
      localStorage.setItem('token', data.token)
      dispatch({ type: 'SIGNIN_SUCCESS', payload: data })
    },
  })

  const isAuthenticated = !!authState.token
  const value: AuthContextValue = {
    ...authState,
    signup: signup.mutate,
    signin: signin.mutate,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext<AuthContextValue>(AuthContext)
