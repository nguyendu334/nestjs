import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/modules/user/user.service';
import { UserController } from '../../src/modules/user/user.controller';

describe('UserController', () => {
  let userController: UserController;
  let userService: any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('getAllUsers', () => {
    const users = [
      { email: 'nguyendu', password: 'password', _id: '1d12edas' },
      { email: 'nguyen', password: 'pass', _id: 'Casct' },
      { email: 'du', password: 'word', _id: 'jtydasd' },
    ];
    it('should return an array of users', async () => {
      userService.findAll.mockReturnValue(users);
      expect(userController.getAllUsers()).toBe(users);
    });
  });
});
