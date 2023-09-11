import { prisma as db } from '@/lib/db'

export const getORcreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await FindConversation(memberOneId, memberTwoId)) ||
    (await FindConversation(memberTwoId, memberOneId))
  if (!conversation) {
    conversation = await createNewConversation(memberOneId,memberTwoId)
  }
  return conversation
}

///////////////////////////////
const FindConversation = async (memberTwoId: string, memberOneId: string) => {
  try {
    return await db.conversation.findFirst({
      where: { AND: { memberOneId, memberTwoId } },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    })
  } catch (error) {
    return null
  }
}

const createNewConversation = async (
  memberTwoId: string,
  memberOneId: string
) => {
  try {
    return await db.conversation.create({
      data: { memberOneId, memberTwoId },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    })
  } catch (error) {
    return null
  }
}
