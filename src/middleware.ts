import * as jose from 'jose'
import { NextRequest, NextResponse } from 'next/server'

type JWTBody = {
  email: string
}

export async function middleware(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  let jwtBody: JWTBody = { email: '' }
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET),
      {
        algorithms: ['HS256'],
      }
    )
    jwtBody = payload as JWTBody
  } catch (e) {
    NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const newHeaders = new Headers(req.headers)
  newHeaders.set('x-email', jwtBody.email)
  return NextResponse.next({
    request: {
      headers: newHeaders,
    },
  })
}

export const config = {
  matcher: ['/api/auth/me'],
}
