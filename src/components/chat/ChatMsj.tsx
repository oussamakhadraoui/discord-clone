'use client'
import { ChannelType, Member, Message, Profile } from '@prisma/client'
import React, { Fragment } from 'react'
import ChatWelcome from './ChatWelcome'
import { format } from 'date-fns'
import { Loader2, ServerCrash } from 'lucide-react'
import UseChatQuery from '@/hooks/use-query-chat'
import { ChatItem } from './ChatItem'
import useChatIo from '@/hooks/use-chat-io'

const DATE_FORMAT = 'd MMM yyyy, HH:mm'

type MSGProfileMember = Message & { member: Member & { profile: Profile } }
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
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update` 
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    UseChatQuery({ apiUrl, paramKey, paramValue, queryKey })
   useChatIo({addKey,queryKey,updateKey})
  if (status === 'loading') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Loading messages...
        </p>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className='flex flex-col flex-1 justify-center items-center'>
        <ServerCrash className='h-7 w-7 text-zinc-500 my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Something went wrong !!
        </p>
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
      <div className='flex-1' />
      <ChatWelcome type={type} name={name} />
      <div className='flex flex-col-reverse mt-auto'>
        {data?.pages?.map((group, index) => {
          return (
            <Fragment key={index}>
              {group.items.map((message: MSGProfileMember) => (
                <ChatItem
                  key={message.id}
                  id={message.id}
                  currentMember={member}
                  member={message.member}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  isUpdated={message.updatedAt !== message.createdAt}
                  socketUrl={socketUrl}
                  socketQuery={socketQuery}
                />
              ))}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default ChatMessages
