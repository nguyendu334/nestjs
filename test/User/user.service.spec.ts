import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../src/modules/user/user.entity';
import { UserService } from '../../src/modules/user/user.service';
import { Repository } from 'typeorm';
import { repositoryMockFactory, type MockType } from '../mocker';

describe('UserService', () => {
  let userService: UserService;
  let repositoryMock: MockType<Repository<User>>;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    repositoryMock = moduleRef.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a user by email', async () => {
    const user = { email: '123', password: 'password', _id: '1d12edas' };
    repositoryMock.findOneBy.mockReturnValue(user);
    expect(userService.findOne(user.email)).toEqual(user);
  });

  it('should get all users', async () => {
    const users = [
      { email: '123', password: 'password', _id: '1d12edas' },
      { email: '456', password: 'pass', _id: 'Casct' },
      { email: '789', password: 'word', _id: 'jtydasd' },
    ];
    repositoryMock.find.mockReturnValue(users);
    expect(userService.getAllUsers()).toEqual(users);
  });

  it('should delete a user', async () => {
    const user = {
      email: '123',
      username: 'du',
      password: 'password',
      _id: '1d12edas',
    };
    repositoryMock.delete.mockReturnValue(user);
    expect(await userService.deleteUser(user._id)).toEqual(user);
  });

  it('should edit a user', async () => {
    const user = {
      email: '123',
      username: 'du',
      password: 'password',
      _id: '1d12edas',
    };
    repositoryMock.update.mockReturnValue(user);
    expect(await userService.editUser(user._id, user)).toEqual(user);
  });

  it('should create a user', async () => {
    const user = {
      email: '123',
      username: 'du',
      password: 'password',
      _id: '1d12edas',
    };
    repositoryMock.findOneBy.mockReturnValue(null);
    repositoryMock.save.mockReturnValue(user);
    expect(await userService.createUser(user)).toEqual(user);
  });

  it.only("shouldn't create a user if email already exist", async () => {
    const user = {
      email: '123',
      username: 'du',
      password: 'password',
      _id: '1d12edas',
    };
    repositoryMock.findOneBy.mockReturnValue(user);
    expect(() => userService.createUser(user)).rejects.toThrow(
      'Email already exist',
    );
  });
});
