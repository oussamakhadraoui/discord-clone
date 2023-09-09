import currentProfile from '@/lib/currentProfile'
import { NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    if (!params.memberId) {
      return new NextResponse('Missing member Id', { status: 400 })
    }
    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    if (!serverId) {
      return new NextResponse('Missing server ID', { status: 400 })
    }
    const profile = await currentProfile()
    const server = await db.server.update({
      where: { id: serverId, profileId: profile?.id },
      data: {
        members: {
          deleteMany: { id: params.memberId, profileId: { not: profile?.id } },
        },
      },
      include: {
        members: { include: { profile: true }, orderBy: { role: 'asc' } },
      },
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('delete member')
    return new NextResponse('Internal Error', { status: 500 })
  }
}

/////////////////////////////////
export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { role } = await req.json()
    if (!role) {
      return new NextResponse('missing Role!', { status: 400 })
    }

    if (!params.memberId) {
      return new NextResponse('Missing member ID', { status: 400 })
    }

    const { searchParams } = new URL(req.url)
    const serverId = searchParams.get('serverId')
    if (!serverId) {
      return new NextResponse('missing server ID', { status: 400 })
    }

    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Not authorize', { status: 401 })
    }
    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          update: {
            where: { id: params.memberId, profileId: { not: profile.id } },
            data: { role: role },
          },
        },
      },
      include: {
        members: { include: { profile: true }, orderBy: { role: 'asc' } },
      },
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('Patch member', error)
    return new NextResponse('internal Error', { status: 500 })
  }
}
