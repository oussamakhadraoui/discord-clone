import * as zod from 'zod'

export const formSchema = zod.object({
  name: zod.string().min(1, { message: 'the server must have a name!' }),
  imageUrl: zod.string().min(1, { message: 'the server must have an image!' }),
})

export type FormValues = zod.infer<typeof formSchema>
