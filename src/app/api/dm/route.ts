import currentProfile from '@/lib/currentProfile'
import { NextResponse } from 'next/server'
import { prisma as db } from '@/lib/db'
import { DirectMessage} from '@prisma/client'
const MSG_BATCH = 10
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversationId')
    const cursor = searchParams.get('cursor')
    if (!conversationId) {
      return new NextResponse('Missing conversation ID', { status: 400 })
    }
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('not authorize', { status: 401 })
    }
    let messages: DirectMessage[] = []
    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MSG_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: { conversationId },
        include: { member: { include: { profile: true } } },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      messages = await db.directMessage.findMany({
        take: MSG_BATCH,
        where: { conversationId },
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
    console.log('dm message error server', error)
    return new NextResponse('internal server error!', { status: 500 })
  }
}
