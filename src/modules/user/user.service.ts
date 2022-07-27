import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: MongoRepository<User>,
  ) {}

  findOne(email: string) {
    return this.userRepository.findOneBy({ email: email });
  }

  // CREATE USER
  async createUser(userDto: UserDto) {
    const emailExist = await this.findOne(userDto.email);

    if (emailExist) {
      throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
    }
    const user = new User();
    user.username = userDto.username;
    user.email = userDto.email;
    user.password = userDto.password;
    return this.userRepository.save(user);
  }

  // GET ALL USERS
  getAllUsers() {
    return this.userRepository.find({});
  }

  // DELETE USER
  async deleteUser(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.userRepository.delete(user);
  }

  // EDIT USER
  async editUser(id: string, UpdateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    return this.userRepository.update(user, UpdateUserDto);
  }
}
