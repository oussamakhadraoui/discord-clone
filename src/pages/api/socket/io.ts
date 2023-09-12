import { NextApiResponseServerIo } from '../../../types/Server'
import { NextApiRequest } from 'next'
import { Server as NetServer } from 'http'
import { Server as serverIo } from 'socket.io'
export const config = {
  api: { bodyParser: false },
}
 const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    const httpServer: NetServer = res.socket.server as any
    const io = new serverIo(httpServer, {
      path,
      //@ts-ignore
      addTrailingSlash: false,
    })
    res.socket.server.io=io
  }
  res.end()
}
export default ioHandler
