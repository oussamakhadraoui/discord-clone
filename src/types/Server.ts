import { Member, Profile, Server } from '@prisma/client'
import { Socket, Server as netServer } from 'net'
import { NextApiResponse } from 'next'
import { Server as socketIoServer } from 'socket.io'
export type ServerMemberProfile = Server & {
  members: (Member & { profile: Profile })[]
}
export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & { server: Server & { io: socketIoServer } }
}
