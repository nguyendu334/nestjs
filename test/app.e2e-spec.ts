import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/product/ GET', () => {
    it('should return an array of products', () => {
      return request(app.getHttpServer())
        .get('/product')
        .expect(200)
        .expect({
          data: [
            {
              reviews: [
                {
                  rating: 9,
                  comment: 'test',
                  createdAt: '2022-07-27 17:37:47',
                },
              ],
              _id: '62e114723f97b1a3c8df5f0c',
              name: 'test',
              price: 12,
              description: 'test',
              category: 'test',
              rating: 9,
              totalReviews: 1,
              createdAt: '2022-07-27T10:33:22.659Z',
              updatedAt: '2022-07-27T10:37:47.166Z',
            },
            {
              reviews: [
                {
                  rating: 7,
                  comment: 'test',
                  createdAt: '2022-07-27 17:37:47',
                },
              ],
              _id: '62e114723f97b1a3c8df5f0c',
              name: 'test1',
              price: 12,
              description: 'test1',
              category: 'test1',
              rating: 7,
              totalReviews: 1,
              createdAt: '2022-07-27T10:33:22.659Z',
              updatedAt: '2022-07-27T10:37:47.166Z',
            },
          ],
        });
    });
  });

  describe('/product/:id GET', () => {
    it('should return false for a not found id', () => {
      return request(app.getHttpServer())
        .get('/product/12345')
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Bad request',
          message: 'Product not found',
        });
    });
    it('should return an acutal product', () => {
      return request(app.getHttpServer())
        .get('/product/62e114723f97b1a3c8df5f0c')
        .expect(200)
        .expect({
          data: {
            reviews: [
              {
                rating: 7,
                comment: 'test',
                createdAt: '2022-07-27 17:37:47',
              },
            ],
            _id: '62e114723f97b1a3c8df5f0c',
            name: 'test1',
            price: 12,
            description: 'test1',
            category: 'Bottle1',
            rating: 7,
            totalReviews: 1,
            createdAt: '2022-07-27T10:33:22.659Z',
            updatedAt: '2022-07-27T10:37:47.166Z',
          },
        });
    });
  });

  describe('product/create POST', () => {
    it('should throw an error for a bad name', () => {
      return request(app.getHttpServer())
        .post('/product/create')
        .set('authorization', 'auth')
        .send({
          price: 12,
          description: 'test',
          category: 'test',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad request',
          message: 'name must be a string',
        });
    });
  });
  it('should throw an error for a bad price', () => {
    return request(app.getHttpServer())
      .post('/product/create')
      .set('authorization', 'auth')
      .send({
        name: 'test',
        description: 'test',
        category: 'test',
      })
      .expect(400)
      .expect({
        statusCode: 400,
        error: 'Bad request',
        message: 'price must be an integer number',
      });
  });
  it('should throw an error for a bad description', () => {
    return request(app.getHttpServer())
      .post('/product/create')
      .set('authorization', 'auth')
      .send({
        name: 'test',
        price: 12,
        category: 'test',
      })
      .expect(400)
      .expect({
        statusCode: 400,
        error: 'Bad request',
        message: 'description must be a string',
      });
  });
  it('should throw an error for a bad category', () => {
    return request(app.getHttpServer())
      .post('/product/create')
      .set('authorization', 'auth')
      .send({
        name: 'test',
        price: 12,
        description: 'test',
      })
      .expect(400)
      .expect({
        statusCode: 400,
        error: 'Bad request',
        message: 'category must be a string',
      });
  });
  it('should throw an error for a bad category', () => {
    return request(app.getHttpServer())
      .post('/product/create')
      .set('authorization', 'auth')
      .send({
        name: 'test',
        price: 12,
        description: 'test',
        category: 'test',
      })
      .expect(200)
      .expect({
        reviews: [],
        name: 'test',
        price: 12,
        description: 'test',
        category: 'test',
        createdAt: '2022-07-28T02:47:51.917Z',
        updatedAt: '2022-07-28T02:47:51.917Z',
        _id: '62e1f8d77ff080fbe5e3a0bb',
      });
  });

  describe('/product/:id DELETE', () => {
    it('should return false for a not found id', () => {
      return request(app.getHttpServer())
        .delete('/product/62e1f8d77ff080fbe5e3a0bb')
        .set('authorization', 'auth')
        .expect(200)
        .expect({ data: false });
    });
    it('should return true for a found id', () => {
      return request(app.getHttpServer())
        .delete('/product/62e1f8d77ff080fbe5e3a0bb')
        .set('authorization', 'auth')
        .expect(200)
        .expect({ data: true });
    });
  });

  describe('/product/:id PUT', () => {
    it('should return false for a not found id', () => {
      return request(app.getHttpServer())
        .get('/product/1234')
        .expect(400)
        .expect({
          statusCode: 400,
          error: 'Bad request',
          message: 'Product not found',
        });
    });
    it('should return true for a found id', () => {
      return request(app.getHttpServer())
        .delete('/product/62e1f8d77ff080fbe5e3a0bb')
        .set('authorization', 'auth')
        .send({
          name: 'test1',
          price: 12,
          description: 'test1',
          category: 'test1',
        })
        .expect({
          data: {
            reviews: [],
            _id: '62e1f8d77ff080fbe5e3a0bb',
            name: 'test1',
            price: 12,
            description: 'test1',
            category: 'test1',
            createdAt: '2022-07-27T10:33:22.659Z',
            updatedAt: '2022-07-27T10:37:47.166Z',
          },
        });
    });
  });

  describe('product/:id/review POST', () => {
    it('should throw an error for a bad rating', () => {
      return request(app.getHttpServer())
        .post('/product/62e114723f97b1a3c8df5f0c/review')
        .set('authorization', 'auth')
        .send({
          comment: 'test',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'rating must not be greater than 10',
            'rating must not be less than 1',
            'rating must be an integer number',
          ],
          error: 'Bad Request',
        });
    });
  });
  it('should throw an error for a bad price', () => {
    return request(app.getHttpServer())
      .post('/product/62e114723f97b1a3c8df5f0c/review')
      .set('authorization', 'auth')
      .send({
        rating: 1,
      })
      .expect(400)
      .expect({
        statusCode: 400,
        error: 'Bad request',
        message: 'comment must be an integer number',
      });
  });
  it('should throw an error for a bad category', () => {
    return request(app.getHttpServer())
      .post('/product/62e114723f97b1a3c8df5f0c/review')
      .set('authorization', 'auth')
      .send({
        rating: 1,
        comment: 'test',
      })
      .expect(200)
      .expect({
        reviews: [
          {
            rating: 1,
            comment: 'test',
          },
        ],
        _id: '62e114723f97b1a3c8df5f0c',
        name: 'test',
        price: 15,
        description: 'test',
        category: 'test',
        rating: 1,
        totalReviews: 1,
        createdAt: '2022-07-27T10:33:22.659Z',
        updatedAt: '2022-07-27T10:37:47.166Z',
      });
  });
  describe('/register POST', () => {
    it('should throw an error for a bad email', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'username',
          password: 'password',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Email is not valid'],
          error: 'Bad Request',
        });
    });
    it('should throw an error for a bad username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          email: 'email@gmail.com',
          password: 'password',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['username should not be empty'],
          error: 'Bad Request',
        });
    });
    it('should throw an error for a bad password', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          email: 'email@gmail.com',
          username: 'username',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'Password must be at least 6 characters long',
            'Password is required',
          ],
          error: 'Bad Request',
        });
    });
    it('should not regiter a new user if email already exist', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          email: 'email@gmail.com',
          username: 'username',
          password: 'password',
        })
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Email already exist'],
        });
    });
    it('should register a new user ', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          email: 'email@gmail.com',
          username: 'username',
          password: 'password',
        })
        .expect(200)
        .expect({
          username: 'username',
          email: 'email@gmail.com',
          password:
            '$2b$10$OFLwZbYCXU2jGfSsoBOhQ.wiKE0sou/N3G8U5.qkyUJvVe9OFRU8G',
          createdAt: '2022-07-28T04:16:34.636Z',
          updatedAt: '2022-07-28T04:16:34.636Z',
          _id: '62e20da2f124515a7f65a1e3',
        });
    });
  });

  describe('/login POST', () => {
    it('should return a login jwt token ', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({
          email: 'email@gmail.com',
          password: 'password',
        })
        .expect(200)
        .expect({
          user: {
            _id: '62dfb63b69ced24c135822be',
            username: 'username',
            email: 'email@gmail.com',
          },
          access_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ndXllbmR1MzM4QGdtYWlsLmNvbSIsInN1YiI6IjYyZGZiNjNiNjljZWQyNGMxMzU4MjJiZSIsImlhdCI6MTY1ODk4MTIyNCwiZXhwIjoxNjYxNTczMjI0fQ.iur5Y6B5QDuzjwG7KQyGjFKmXw21KpLKlq3sTZeNyhs',
        });
    });
    it('should return false a login jwt token ', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({
          password: 'password',
        })
        .expect(401)
        .expect({
          statusCode: 401,
          error: 'Unauthorized',
        });
    });
  });
});
