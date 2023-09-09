import * as zod from 'zod'
import { ChannelType } from '@prisma/client'

export const formSchema = zod.object({
  name: zod.string().min(1, { message: 'the server must have a name!' }),
  imageUrl: zod.string().min(1, { message: 'the server must have an image!' }),
})
export const formChannelSchema = zod.object({
  name: zod
    .string()
    .min(1, {
      message: 'Channel name is required.',
    })
    .refine((name) => name !== 'general', {
      message: "Channel name cannot be 'general'",
    }),
  type: zod.nativeEnum(ChannelType),
})


export type FormValues = zod.infer<typeof formSchema>
export type FormChannelValues= zod.infer<typeof formChannelSchema>