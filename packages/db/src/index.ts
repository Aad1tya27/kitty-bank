import { PrismaClient } from '@prisma/client'
import { OnRampStatus } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

export { OnRampStatus }
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma