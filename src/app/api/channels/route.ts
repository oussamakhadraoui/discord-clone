import { NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'
import currentProfile from '@/lib/currentProfile'
import { v4 as uuid } from 'uuid'
import { MemberRole } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    if (!serverId) {
      return new NextResponse('Missing server ID', { status: 400 })
    }
    const { name, type } = await req.json()
    if (!name) {
      return new NextResponse('Missing channel name', { status: 400 })
    }
    if (name === 'general') {
      return new NextResponse('this name is reserved', { status: 400 })
    }
    if (!type) {
      return new NextResponse('Missing type', { status: 400 })
    }
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Unauthorize', { status: 401 })
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('channel Creation', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
