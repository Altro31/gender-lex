import { Controller } from '@nestjs/common'
import { BaseController } from 'src/core/utils/controller'

@Controller('user')
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */
export class UserController extends BaseController {}
