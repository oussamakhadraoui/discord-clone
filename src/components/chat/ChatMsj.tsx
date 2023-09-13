import { ChannelType, Member } from '@prisma/client'
import React from 'react'
import ChatWelcome from './ChatWelcome'

interface ChatMessagesProps {
  member: Member
  name: string
  chatId: string
  type: 'channel' | 'conversation'
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

const ChatMessages = ({
  apiUrl,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: ChatMessagesProps) => {
  return <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
   <div className='flex-1'/>
   <ChatWelcome type={type} name={name}/>
  </div>
}

export default ChatMessages
