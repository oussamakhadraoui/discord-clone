import currentProfilePagesRoute from '@/lib/currentProfilePagesRoute'
import { NextApiResponseServerIo } from '@/types/Server'
import { NextApiRequest } from 'next'
import { prisma as db } from '@/lib/db'
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'post') {
    return res.status(400).json({ message: 'This method does not exist!' })
  }
  try {
    const { serverId, channelId } = req.query
    if (!serverId) {
      return res.status(400).json({ message: 'Missing server ID' })
    }

    if (!channelId) {
      return res.status(400).json({ message: 'Missing channel ID' })
    }

    const { content, fileUrl } = await req.body

    if (!content) {
      return res.status(400).json({ message: 'body missing some values' })
    }

    const profile = await currentProfilePagesRoute(req)
    if (!profile) {
      return res.status(401).json({ message: 'not Authorize' })
    }
    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    })

    if (!server) {
      return res.status(404).json({ message: 'Server not found' })
    }

    const channel = await db.channel.findFirst({
      where: { serverId: serverId as string, id: channelId as string },
    })
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' })
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    )

    if (!member) {
      return res.status(404).json({ message: 'Member not found' })
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
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

    const channelKey = `chat:${channelId}:messages`

    res?.socket?.server?.io?.emit(channelKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('message error implementation ')
    return res.status(500).json({ message: 'there is something wrong' })
  }
}
