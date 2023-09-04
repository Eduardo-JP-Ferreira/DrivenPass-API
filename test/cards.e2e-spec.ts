import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { cleanDb } from './ultis';

describe('Cards Tests', () => {
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

  it('/cards (post cards) should create a card"', async () => {
    await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my@email.com",      
    });
    const token = await request(app.getHttpServer()).post('/users/auth/sign-in').send({      
      password: "s3nh@f0rTe!",
      email: "my@email.com",      
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

    const check = await prisma.card.findFirst({ where: { title: "new card" }})
    expect(check).not.toBe(null)
  });

  it('/cards (get card) should get a card"', async () => {
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

    const getCard = await request(app.getHttpServer()).get('/cards').set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.OK);
    expect(getCard.body).toHaveLength(1)
  });

  it('/cards/:id (get card) should get a card by id"', async () => {
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

    const card = await prisma.card.findFirst({where: {title: "new card"}})

    const getCard = await request(app.getHttpServer()).get(`/cards/${card.id}`).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.OK);
    expect(getCard.body).not.toBe(null);
  });

  it('/cards/:id (delete card) should delete a card by id"', async () => {
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

    const card = await prisma.card.findFirst({where: {title: "new card"}})

    await request(app.getHttpServer()).delete(`/cards/${card.id}`).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.OK);

    const card2 = await prisma.card.findFirst({where: {title: "new card"}})
    expect(card2).toBe(null);
  });
});
