import currentProfilePagesRoute from '@/lib/currentProfilePagesRoute'
import { NextApiResponseServerIo } from '@/types/Server'
import { NextApiRequest } from 'next'
import { prisma as db } from '@/lib/db'
import { MemberRole } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Bad Method!' })
  }
  try {
    const { serverId, channelId, messageId } = req.query
    console.log(serverId, messageId)
    if (!serverId) {
      return res.status(400).json({ error: 'Missing server ID!' })
    }
    if (!channelId) {
      return res.status(400).json({ error: 'Missing channel ID!' })
    }
    const { content } = req.body

    const profile = await currentProfilePagesRoute(req)
    if (!profile) {
      return res.status(401).json({ error: 'unAuthorize' })
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: { some: { profileId: profile.id } },
      },
      include: { members: true },
    })
    if (!server) {
      return res.status(404).json({ error: 'No server founded!' })
    }

    const channel = await db.channel.findFirst({
      where: { id: channelId as string, serverId: serverId as string },
    })
    if (!channel) {
      return res.status(404).json({ error: 'No channel founded!' })
    }

    const member = server.members.find((member) => member.profileId === profile.id)
    if (!member) {
      return res.status(404).json({ error: 'member not found!' })
    }

    let message = await db.message.findFirst({
      where: { id: messageId as string, channelId: channelId as string },
      include: { member: { include: { profile: true } } },
    })
    if (!message || message.deleted) {
      return res.status(404).json({ error: 'message not found!' })
    }

    const isOwner = message.memberId === member.id
    const isAdmin = member.role === MemberRole.ADMIN
    const isModerator = member.role === MemberRole.MODERATOR
    const canModify = isAdmin || isOwner || isModerator
    if (!canModify) {
      return res.status(401).json({ error: 'unAuthorize' })
    }
    if (req.method === 'DELETE') {
      message = await db.message.update({
        where: { id: messageId as string },
        data: {
          content: 'this message was deleted ! ',
          deleted: true,
          fileUrl: null,
        },
        include: { member: { include: { profile: true } } },
      })
    }

    if (req.method === 'PATCH') {
      if (!isOwner) {
        return res.status(401).json({ error: 'not Authorize' })
      }
      message = await db.message.update({
        where: { id: messageId as string },
        data: {
          content,
        },
        include: { member: { include: { profile: true } } },
      })
    }

    const updateKey = `chat:${channelId}:messages:update`

    res?.socket?.server?.io?.emit(updateKey, message)

    return res.status(200).json(message)
  } catch (error) {
    console.log('message', error)
    return res.status(500).json({ error: 'internal error' })
  }
}
