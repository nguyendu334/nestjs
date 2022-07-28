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

  describe('/product GET', () => {
    it('should return an array of products', () => {
      return request(app.getHttpServer()).get('/product').expect(200);
    });
  });

  describe('/product/:id GET', () => {
    it('should return false for a not found id', () => {
      return request(app.getHttpServer()).get('/product/12345').expect(400);
    });
    it('should return an acutal product', () => {
      return request(app.getHttpServer())
        .get('/product/62e114723f97b1a3c8df5f0c')
        .expect(200);
    });
  });

  describe('product/create POST', () => {
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
        .expect(201);
    });
    it('should throw an error for a bad name', () => {
      return request(app.getHttpServer())
        .post('/product/create')
        .set('authorization', 'auth')
        .send({
          price: 12,
          description: 'test',
          category: 'test',
        })
        .expect(401);
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
      .expect(401);
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
      .expect(401);
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
      .expect(401);
  });

  describe('/product/:id DELETE', () => {
    it('should return true for a found id', () => {
      return request(app.getHttpServer())
        .delete('/product/62e1f8d77ff080fbe5e3a0bb')
        .set('authorization', 'auth')
        .expect(401);
    });
    it('should return false for a not found id', () => {
      return request(app.getHttpServer())
        .delete('/product/62e1f8d77ff080fbe5e3a0bb')
        .set('authorization', 'auth')
        .expect(401);
    });
  });

  describe('/product/:id PUT', () => {
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
        .expect(401);
    });
    it('should return false for a not found id', () => {
      return request(app.getHttpServer()).get('/product/1234').expect(400);
    });
  });

  describe('product/:id/review POST', () => {
    it('should throw an error for a bad category', () => {
      return request(app.getHttpServer())
        .post('/product/62e114723f97b1a3c8df5f0c/review')
        .send({
          rating: 1,
          comment: 'test',
        })
        .expect(401);
    });
    it('should throw an error for a bad rating', () => {
      return request(app.getHttpServer())
        .post('/product/62e114723f97b1a3c8df5f0c/review')
        .send({
          comment: 'test',
        })
        .expect(401);
    });
  });
  it('should throw an error for a bad price', () => {
    return request(app.getHttpServer())
      .post('/product/62e114723f97b1a3c8df5f0c/review')
      .send({
        rating: 1,
      })
      .expect(401);
  });

  describe('/register POST', () => {
    it('should register a new user ', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          email: 'email@gmail.com',
          username: 'username',
          password: 'password',
        })
        .expect(201);
    });
    it('should throw an error for a bad email', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'username',
          password: 'password',
        })
        .expect(400);
    });
    it('should throw an error for a bad username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          email: 'email@gmail.com',
          password: 'password',
        })
        .expect(400);
    });
    it('should throw an error for a bad password', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          email: 'email@gmail.com',
          username: 'username',
        })
        .expect(400);
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
        .expect(201);
    });
    it('should return false a login jwt token ', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({
          password: 'password',
        })
        .expect(401);
    });
  });
});
