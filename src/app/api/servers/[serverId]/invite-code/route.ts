import currentProfile from '@/lib/currentProfile'
import { NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'
import { v4 as uuid } from 'uuid'
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Not Authorize', { status: 401 })
    }
    if (!params.serverId) {
      return new NextResponse('Missing server Id', { status: 400 })
    }
    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: { inviteCode: uuid() },
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('serverId', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
