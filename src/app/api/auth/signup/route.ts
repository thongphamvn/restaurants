import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import Joi from 'joi'
import * as jose from 'jose'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  city: Joi.string(),
  phone: Joi.string(),
})

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const body = await request.json()

  const { error } = schema.validate(body)

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }

  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  })

  if (user) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(body.password, 10)
  const created = await prisma.user.create({
    data: {
      email: body.email,
      first_name: body.firstName,
      last_name: body.lastName,
      city: body.city,
      phone: body.phone,
      password: hashedPassword,
    },
  })

  const token = await new jose.SignJWT({
    email: created.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET))

  return NextResponse.json({ token })
}
