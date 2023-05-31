import { prisma } from '@/utils'
import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(request: NextRequest) {
  const email = request.headers.get('x-email') as string
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    city: user.city,
    phone: user.phone,
  })
}
