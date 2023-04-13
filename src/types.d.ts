export type JWTBody = {
  email?: string
}

export type SlugParams = {
  params: { slug: string }
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

//
export type ReserveParams = {
  day: string
  time: string
  partySize: string
  slug: string
}

//
export type AvailabilityParams = {
  day: string
  time: string
  partySize: string
}

//
export type ReservationFormType = {
  bookerEmail: string
  bookerFirstName: string
  bookerLastName: string
  bookerPhone: string
  bookerOccasion?: string
  bookerRequest?: string
}
