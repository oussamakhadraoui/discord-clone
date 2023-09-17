import currentProfilePagesRoute from '@/lib/currentProfilePagesRoute'
import { NextApiResponseServerIo } from '@/types/Server'
import { NextApiRequest } from 'next'
import { prisma as db } from '@/lib/db'
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(400).json({ message: 'This method does not exist!' })
  }
  try {
    const { conversationId } = req.query
    if (!conversationId) {
      return res.status(400).json({ message: 'Missing conversation ID' })
    }

    const { content, fileUrl } = await req.body

    if (!content) {
      return res.status(400).json({ message: 'body missing some values' })
    }

    const profile = await currentProfilePagesRoute(req)
    if (!profile) {
      return res.status(401).json({ message: 'not Authorize' })
    }
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' })
    }

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo

    if (!member) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    })

    const channelKey = `chat:${conversationId}:messages`

    res?.socket?.server?.io?.emit(channelKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('message error implementation ')
    return res.status(500).json({ message: 'there is something wrong' })
  }
}
