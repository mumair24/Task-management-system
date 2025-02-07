import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ValidAuthGuard } from 'src/middleware/auth/guard/valid.guard';
import { UserDto } from './dtos/user.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  
  @Post()
  @UseGuards(ValidAuthGuard)
  @ApiOperation({ summary: 'Create a new User' })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body(new ValidationPipe()) userDto: UserDto, @Req() req: any) {
      return await this.userService.createUser(userDto, req.user);
  }

  @Get()
  @UseGuards(ValidAuthGuard)
  @ApiOperation({ summary: 'Get all Users' })
  @HttpCode(HttpStatus.OK)
  async getAllUsers(@Req() req: any) {
    return await this.userService.getAllUsers(req.user);
  }

  @Patch(':id')
  @UseGuards(ValidAuthGuard)
  @ApiOperation({ summary: 'Update a User' })
  @HttpCode(HttpStatus.OK)
  async updateUser(@Param('id') id: string, @Body(new ValidationPipe()) userDto: UserDto, @Req() req: any) {
    return await this.userService.updateUser(id, userDto, req.user);
  }

  @Delete()
  @UseGuards(ValidAuthGuard)
  @ApiOperation({ summary: 'Delete a User' })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Req() req: any, @Body(new ValidationPipe()) userDto: {id: string}) {
    return await this.userService.deleteUser(userDto.id, req.user);
  }
}
