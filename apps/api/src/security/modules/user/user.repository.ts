import { Injectable } from '@nestjs/common'
import type { Prisma } from '@repo/db/models'
import Repository from 'src/core/utils/repository'

@Injectable()
class UserRepositoryClass extends Repository.base('user') {}
export type UserRepository = Prisma.UserDelegate
export const UserRepository = UserRepositoryClass
