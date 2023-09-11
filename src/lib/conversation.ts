import { prisma as db } from '@/lib/db'

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
  console.log("Find Conversation",error)
 }
}

const createNewConversation = async (
  memberTwoId: string,
  memberOneId: string
) => {
  try {
    return db.conversation.create({
      data: { memberOneId, memberTwoId },
      include: {
        memberOne: { include: { profile: true } },
        memberTwo: { include: { profile: true } },
      },
    })
  } catch (error) {
    return console.log("create conversation",error)
  }
}
