import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { cleanDb } from './ultis';

describe('Erase Tests', () => {
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
  
  it('/erase (delete all) should delete everything"', async () => {
    const user = await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });
    const token = await request(app.getHttpServer()).post('/users/auth/sign-in').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });

    await request(app.getHttpServer()).post('/cards').send({      
      title: "new card",
      number: "456353466454444",
      name: "edu",
      cvc: "231",
      expirationDate: "10/32",
      password: "123456",
      virtual: false,
      type: "DEBIT"     
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.CREATED);
    await request(app.getHttpServer()).post('/credentials').send({      
      title: "new credential",
      username: "edu",
      password: "123456",
      url: "https://www.google.com.br/"    
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.CREATED);
    await request(app.getHttpServer()).post('/notes').send({      
      title: "new note",
      note: "note description..."    
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.CREATED);

    await request(app.getHttpServer()).delete(`/erase`).send({      
      password: "s3nh@f0rTe!",  
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.OK);

    const card = await prisma.card.findFirst({})
    expect(card).toBe(null);
    const note = await prisma.note.findFirst({})
    expect(note).toBe(null);
    const credential = await prisma.credential.findFirst({})
    expect(credential).toBe(null);
    const findaUser = await prisma.user.findFirst({})
    expect(findaUser).toBe(null);
  });
});
