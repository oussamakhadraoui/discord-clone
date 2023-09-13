import currentProfile from '@/lib/currentProfile'
import { NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'
import { Message } from '@prisma/client'
const MSG_BATCH = 10
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const channelId = searchParams.get('channelId')
    const cursor = searchParams.get('cursor')
    if (!channelId) {
      return new NextResponse('Missing server ID', { status: 400 })
    }
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('not authorize', { status: 401 })
    }
    let messages: Message[] = []
    if (cursor) {
      messages = await db.message.findMany({
        take: MSG_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: { channelId },
        include: { member: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      messages = await db.message.findMany({
        take: MSG_BATCH,
        where: { channelId },
        include: { member: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      })
    }
    let nextCursor= null
   if(messages.length===MSG_BATCH){
    nextCursor=messages[MSG_BATCH-1].id
   }
   return NextResponse.json({items:messages,nextCursor})
  } catch (error) {
    console.log('message error server', error)
    return new NextResponse('internal server error!', { status: 500 })
  }
}
