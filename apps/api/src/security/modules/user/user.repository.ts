import { Injectable } from '@nestjs/common'
import type { Prisma } from '@repo/db/models'
import * as Repository from 'src/core/utils/repository'

@Injectable()
class UserRepositoryClass extends Repository.base('user') {}
export type UserRepository = Repository.type<Prisma.UserDelegate>
export const UserRepository = UserRepositoryClass
