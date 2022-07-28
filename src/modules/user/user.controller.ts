import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Validate } from '../../validators/validation';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../constants/role.constants';
import { Roles } from '../../decorators/role.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET ALL USERS
  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  // DELETE USER
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid' })
  @ApiResponse({ status: 200, description: 'Successfully deleted' })
  async deleteUser(@Param('id', Validate) id: string) {
    return await this.userService.deleteUser(id);
  }

  // EDIT USER
  @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Invalid' })
  @ApiResponse({ status: 200, description: 'Successfully updated' })
  async editUser(
    @Param('id', Validate) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.editUser(id, updateUserDto);
  }
}
