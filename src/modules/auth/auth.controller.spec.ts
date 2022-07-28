import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { UserDto } from '../user/dto/user.dto';
import { createRequest, createResponse } from 'node-mocks-http';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: any;
  const req = createRequest();
  req.res = createResponse();

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const target: ValidationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
  });

  const metadataBody: ArgumentMetadata = {
    type: 'body',
    metatype: UserDto,
    data: '',
  };

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        username: 'username',
        email: 'email@gmail.com',
        password: 'password',
      };
      authService.register.mockReturnValue(dto);
      expect(await authController.register(dto)).toEqual(dto);
    });

    it('should validate email and password', async () => {
      const dto = {};
      await target.transform(<UserDto>dto, metadataBody).catch((err) => {
        expect(err.getResponse().message).toEqual([
          'Email is not valid',
          'Password must be at least 6 characters long',
          'Password is required',
        ]);
      });
    });
  });

  describe.only('login', () => {
    it('should return a login jwt token', async () => {
      const dto = {
        email: 'email',
        password: 'password',
      };
      const token = 'token';
      authService.login.mockReturnValue(token);
      expect(await authController.login(dto)).toEqual(token);
    });
  });

  describe('logout', () => {
    it('should return a logout', async () => {
      expect(await authController.logout(req.res)).toEqual(undefined);
    });
  });
});
