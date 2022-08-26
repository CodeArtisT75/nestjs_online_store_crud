import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { clearDataBase } from './utils/helpers';
import { AppModule } from '../src/app.module';
import { RegisterDto } from '../src/modules/auth/dto/register.dto';
import { LoginDto } from '../src/modules/auth/dto/login.dto';

describe('Auth module (e2e)', () => {
  let app: INestApplication;
  const userInfo = {
    username: 'mike',
    password: '123456',
    name: 'Mike muller',
    basPassword: 'BAS_PASSWORD'
  };
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  beforeAll(async () => {
    await clearDataBase();
  });

  afterAll(async () => {
    await clearDataBase();
    await app.close();
  });

  describe('Registering a user', () => {
    it('Should register a new user', async () => {
      const data: RegisterDto = {
        username: userInfo.username,
        password: userInfo.password,
        password_confirmation: userInfo.password,
        name: userInfo.name
      };

      const response = await request(app.getHttpServer()).post('/api/v1/auth/register').send(data);

      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('Should return error because we have duplicate username', async () => {
      const data: RegisterDto = {
        username: userInfo.username,
        password: userInfo.password,
        password_confirmation: userInfo.password,
        name: userInfo.name
      };

      const response = await request(app.getHttpServer()).post('/api/v1/auth/register').send(data);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Login user and return access_token', () => {
    it('Should login an existing user', async () => {
      const data: LoginDto = {
        username: userInfo.username,
        password: userInfo.password
      };

      const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send(data);
      accessToken = response.body.data.access_token;

      expect(response.status).toBe(HttpStatus.OK);
      expect(accessToken).toBeDefined();
    });

    it('Should return unauthorized login attempt', async () => {
      const data: LoginDto = {
        username: userInfo.username,
        password: userInfo.basPassword
      };

      const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send(data);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('User info', function () {
    it('Should return user data', async () => {
      const data: LoginDto = {
        username: userInfo.username,
        password: userInfo.password
      };

      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/user')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(data);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.username).toBe(userInfo.username);
      expect(response.body.data.name).toBe(userInfo.name);
    });
  });
});
