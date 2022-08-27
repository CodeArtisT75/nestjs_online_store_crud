import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  clearDataBase,
  createUser,
  getJWTTokenForUser,
  storeUserInDatabase
} from './utils/helpers';
import { AppModule } from '../src/app.module';
import { User } from '../src/modules/users/entities/user.entity';
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from '../src/modules/users/dto/update-user.dto';

describe('User module (e2e)', () => {
  let app: INestApplication;
  const user: User = createUser();
  let createdUserId;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  beforeAll(async () => {
    await clearDataBase();
    await storeUserInDatabase(user);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Storing and updating users', function () {
    it('Should store a user', async () => {
      const token = await getJWTTokenForUser(app, user);

      const storeUserDto: CreateUserDto = {
        name: 'muller',
        username: 'username',
        password: '123456'
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .set('Authorization', `Bearer ${token}`)
        .send(storeUserDto);

      createdUserId = response.body.data.id;

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(storeUserDto.name);
    });

    it('Should update an existing user', async () => {
      const token = await getJWTTokenForUser(app, user);

      const updateUserDto: UpdateUserDto = {
        name: 'david',
        username: 'username2',
        password: '1234567890'
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/users/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateUserDto);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(updateUserDto.name);
    });
  });

  describe('Getting users', function () {
    it('Get users list', async () => {
      const token = await getJWTTokenForUser(app, user);

      const response = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.length).toBeGreaterThan(0); // we created a user at previous test
    });

    it('Get user by ID', async () => {
      const token = await getJWTTokenForUser(app, user);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.name).toBeDefined(); // we created a user at previous test
    });
  });

  describe('Deleting a user', function () {
    it('Delete a user by ID', async () => {
      const token = await getJWTTokenForUser(app, user);

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/users/${createdUserId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
    });
  });
});
