import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { cleanDb } from './ultis';

describe('Credentials Tests', () => {
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

  it('/credentials (post credential) should create a credential"', async () => {
    await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my@email.com",      
    });
    const token = await request(app.getHttpServer()).post('/users/auth/sign-in').send({      
      password: "s3nh@f0rTe!",
      email: "my@email.com",      
    });

    await request(app.getHttpServer()).post('/credentials').send({      
      title: "new credential",
      username: "edu",
      password: "123456",
      url: "https://www.google.com.br/"    
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.CREATED);

    const check = await prisma.credential.findFirst({ where: { title: "new credential" }})
    expect(check).not.toBe(null)
  });

  it('/credential (get credential) should get a credential"', async () => {
    const user = await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });
    const token = await request(app.getHttpServer()).post('/users/auth/sign-in').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });

    await request(app.getHttpServer()).post('/credentials').send({      
      title: "new credential",
      username: "edu",
      password: "123456",
      url: "https://www.google.com.br/"    
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.CREATED);

    const getcredential = await request(app.getHttpServer()).get('/credentials').set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.OK);
    expect(getcredential.body).toHaveLength(1)
  });

  it('/credential/:id (get credential) should get a credential by id"', async () => {
    const user = await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });
    const token = await request(app.getHttpServer()).post('/users/auth/sign-in').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });
    await request(app.getHttpServer()).post('/credentials').send({      
      title: "new credential",
      username: "edu",
      password: "123456",
      url: "https://www.google.com.br/"    
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.CREATED);

    const credential = await prisma.credential.findFirst({where: {title: "new credential"}})

    const getcredential = await request(app.getHttpServer()).get(`/credentials/${credential.id}`).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.OK);
    expect(getcredential.body).not.toBe(null);
  });

  it('/credential/:id (delete credential) should delete a credential by id"', async () => {
    const user = await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });
    const token = await request(app.getHttpServer()).post('/users/auth/sign-in').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });
    await request(app.getHttpServer()).post('/credentials').send({      
      title: "new credential",
      username: "edu",
      password: "123456",
      url: "https://www.google.com.br/"    
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.CREATED);

    const credential = await prisma.credential.findFirst({where: {title: "new credential"}})

    await request(app.getHttpServer()).delete(`/credentials/${credential.id}`).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.OK);

    const credential2 = await prisma.credential.findFirst({where: {title: "new credential"}})
    expect(credential2).toBe(null);
  });
});
