import { Server } from '@prisma/client'
import currentProfile from '@/lib/currentProfile'
import { NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    if (!params.serverId) {
      return new NextResponse('Missing server ID', { status: 400 })
    }
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('not Authorize', { status: 401 })
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: { not: profile.id },
        members: { some: { profileId: profile.id } },
      },
      data: { members: { deleteMany: { profileId: profile.id } } },
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('leave server side', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
