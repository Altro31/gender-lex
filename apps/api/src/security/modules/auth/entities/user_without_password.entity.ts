import type { User } from '@repo/db/models'

export type UserWithoutPassword = Omit<User, 'password'>
