import { NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'
import currentProfile from '@/lib/currentProfile'
import { MemberRole } from '@prisma/client'
import { channel } from 'diagnostics_channel'

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    if (!params.channelId) {
      return new NextResponse('Missing channel ID', { status: 400 })
    }
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    if (!serverId) {
      return new NextResponse('Missing server ID', { status: 400 })
    }
    const { type, name } = await req.json()
    if (!name || !type) {
      return new NextResponse('Missing name or type ', { status: 400 })
    }
    if (name === 'general') {
      return new NextResponse('General name is reserved', { status: 400 })
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
          updateMany: {
            where: { id: params.channelId, NOT: { name: 'general' } },
            data: { type, name },
          },
        },
      },
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('edit channel server side', error)
    return new NextResponse('internal error server', { status: 500 })
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    if (!params.channelId) {
      return new NextResponse('Missing channel ID', { status: 400 })
    }
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    if (!serverId) {
      return new NextResponse('Missing server ID', { status: 400 })
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
      data: { channels: { deleteMany: { id: params.channelId } } },
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('delete channel server side', error)
    return new NextResponse('internal error server', { status: 500 })
  }
}
