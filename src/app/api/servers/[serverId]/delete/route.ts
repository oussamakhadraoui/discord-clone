import { NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'
import currentProfile from '@/lib/currentProfile'
export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    if (!params.serverId) {
      return new NextResponse('Missing server ID', { status: 400 })
    }

    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Not authorize', { status: 401 })
    }
    const server = await db.server.delete({
      where: { id: params.serverId, profileId: profile.id },
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('Delete server', error)
    return new NextResponse('internal server error', { status: 500 })
  }
}
