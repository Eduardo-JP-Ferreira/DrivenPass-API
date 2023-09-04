import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { cleanDb } from './ultis';

describe('Auth Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = await moduleFixture.get(PrismaService);

    await cleanDb();
    await app.init();
  });

  it('/users/auth/sign-up (post signUp) should create user"', async () => {
    await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my@email.com",      
    });
    expect(HttpStatus.CREATED);

    const check = await prisma.user.findFirst({ where: { email: "my@email.com" }})
    expect(check).not.toBe(null)
  });

  it('/users/auth/sign-in (post signIp) should authenticate user"', async () => {
    await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my@email.com",      
    });
    const token = await request(app.getHttpServer()).post('/users/auth/sign-in').send({      
      password: "s3nh@f0rTe!",
      email: "my@email.com",      
    });
    // console.log("Auth",token.body.token)
    expect(HttpStatus.OK);
    expect(token).not.toBe(null)
  });
});
