import { NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'
import currentProfile from '@/lib/currentProfile'
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile()
    const { imageUrl, name } = await req.json()
    if (!profile) {
      return new NextResponse('not Authorize', { status: 401 })
    }
    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: { imageUrl, name },
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('configuration server', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
