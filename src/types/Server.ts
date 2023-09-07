import { Member, Profile, Server } from '@prisma/client'

export type ServerMemberProfile = Server & {
  members: (Member & { profile: Profile })[]
}
