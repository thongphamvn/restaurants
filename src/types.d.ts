export type JWTBody = {
  email?: string
}

export type User = {
  id: number
  firstName: string
  lastName: string
  phone: string
  city: string
  email: string
  password: string
}

export type SigninPayload = {
  email: string
  password: string
}

export type SignupPayload = Omit<User, 'id'>
export type AuthUserResponse = {
  user: omit<User, 'password'>
  token: string
}
