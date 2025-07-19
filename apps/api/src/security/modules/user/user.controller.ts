import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiRequestParams, RequestParams } from 'src/core/utils/params'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'

@Controller('user')
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */
export class UserController {
	constructor(private readonly userService: UserService) {}

	/**
	 * Creates a new user
	 */
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
	}

	/**
	 * Retrieves a list of users
	 */
	@ApiRequestParams()
	@Get()
	findAll(@RequestParams() params: any) {
		return this.userService.findAll(params)
	}

	/**
	 * Retrieves a single user by ID
	 */
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(id)
	}

	/**
	 * Deletes a user by ID
	 */
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(id)
	}
}
