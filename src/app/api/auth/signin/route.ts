import { prisma } from '@/utils'
import bcrypt from 'bcrypt'
import Joi from 'joi'
import * as jose from 'jose'
import { NextResponse } from 'next/server'

const joiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

export async function POST(request: Request, response: NextResponse) {
  const body = await request.json()
  const { error } = joiSchema.validate(body)
  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  })
  if (!user) {
    return NextResponse.json(
      { message: 'User or password invalid' },
      { status: 401 }
    )
  }

  const isValidPassword = await bcrypt.compare(body.password, user.password)
  if (!isValidPassword) {
    return NextResponse.json(
      { message: 'User or password invalid' },
      { status: 401 }
    )
  }

  const token = await new jose.SignJWT({
    email: user.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))

  const { password, ...userWithoutPassword } = user
  return NextResponse.json({ user: userWithoutPassword, token })
}
