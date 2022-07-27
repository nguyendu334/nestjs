import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../src/modules/user/user.entity';
import { UserService } from '../../src/modules/user/user.service';
import { MockType, repositoryMockFactory } from '../../test/mocker';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../../src/modules/auth/auth.service';

describe('AuthService', () => {
  let jwtService: MockType<JwtService>;
  let authService: AuthService;
  let repositoryMock: MockType<Repository<User>>;
  const bcryptMock = {
    compareSync: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    repositoryMock = moduleRef.get(getRepositoryToken(User));
    jwtService = moduleRef.get(JwtService);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be comparePassword', () => {
    const password = 'password';
    const hash = '$2a$09$Voy2nGUVcei2VLjJPnT/i.K4veOwXF5aSoubiJyvTm48BuTel4d7a';
    bcryptMock.compareSync.mockReturnValue(true);
    expect(authService.comparePassword(password, hash)).toBeTruthy();
  });

  it('should be signToken', () => {
    const user = {
      _id: '62d133dff7b8b0612355b4a6',
      email: 'user',
    };
    jwtService.sign.mockReturnValue(user);
    expect(authService.login(user)).toBeTruthy();
  });

  it('should validate user', async () => {
    const user = {
      password: 'password',
      email: 'user',
    };
    repositoryMock.findOneBy.mockReturnValue(user);
    bcryptMock.compareSync.mockReturnValue(true);
    authService.comparePassword = jest.fn().mockReturnValue(true);
    expect(await authService.validateUser(user.email, user.password)).toEqual({
      email: user.email,
    });
  });
});
