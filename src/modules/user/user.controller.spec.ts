import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Validate } from '../../validators/validation';

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
            getAllUsers: jest.fn(),
            editUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  const targetId: Validate = new Validate();
  describe('getAllUsers', () => {
    const users = [
      {
        _id: '62dfb63b69ced24c135822be',
        username: 'test',
        email: 'email@gmail.com',
        password:
          '$2b$10$jK0XLNBqcFz32f0TwL.bGuK6QFdYku/eOCdYsZZPEz/Mj1Ie.6cB2',
        createdAt: '2022-07-27T10:07:29.846Z',
        updatedAt: '2022-07-27T10:07:29.846Z',
      },
      {
        _id: '62e10dc1e3d543c27dfd37eb',
        username: 'test1',
        email: 'email1@gmail.com',
        password:
          '$2b$10$mXdlsZwVTcuZ55ggppyUa.pC.DIji5QaIXKlNfqtnwz3P9PPH.F32',
        createdAt: '2022-07-27T10:07:29.846Z',
        updatedAt: '2022-07-27T10:07:29.846Z',
      },
      {
        _id: '62e10e6195ec6347a0b86c11',
        username: 'test2',
        email: 'email2@gmail.com',
        password:
          '$2b$10$eknUszzUq7SnyRFWbJ0bL.JjrI4kbCK/Q7gPSJol4f6sW38vJJmse',
        createdAt: '2022-07-27T10:07:29.846Z',
        updatedAt: '2022-07-27T10:07:29.846Z',
      },
    ];
    it('should return an array of users', async () => {
      userService.findAll.mockReturnValue(users);
      expect(userController.getAllUsers()).toBe(users);
    });
  });

  describe('editUser', () => {
    it('should edit a user', async () => {
      const id = '62e114723f97b1a3c8df5f0c';
      const user = new User();
      const editUser = {
        ...user,
        email: 'email@gmail.com',
        username: 'username',
        password: 'password',
      };
      userService.update.mockReturnValue(editUser);
      expect(await userController.editUser(id, user)).toEqual(editUser);
    });

    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid');
      }
    });

    it('should throw an error message if the user is not found', async () => {
      const id = '62e114723f97b1a3c8df5f0c';
      userService.update.mockReturnValue('User not found');
      expect(await userService.update(id, new User())).toEqual(
        'User not found',
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const id = '62e114723f97b1a3c8df5f0c';
      const user = new User();
      userService.deleteUser.mockReturnValue(user);
      expect(await userController.deleteUser(id)).toEqual(user);
    });

    it('should throw an error message if invalid id', async () => {
      const id = 'randomid';
      try {
        targetId.transform(id);
      } catch (err) {
        expect(err.getResponse().message).toEqual('Invalid');
      }
    });

    it('should throw an error message if the user is not found', async () => {
      const id = '62dfb63b69ced24c135822be';
      userService.remove.mockReturnValue('User not found');
      expect(await userController.deleteUser(id)).toEqual('User not found');
    });
  });
});
