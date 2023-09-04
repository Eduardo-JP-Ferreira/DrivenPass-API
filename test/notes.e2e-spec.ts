import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { cleanDb } from './ultis';

describe('Notes Tests', () => {
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

  it('/notes (post notes) should create a note"', async () => {
    await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my@email.com",      
    });
    const token = await request(app.getHttpServer()).post('/users/auth/sign-in').send({      
      password: "s3nh@f0rTe!",
      email: "my@email.com",      
    });

    await request(app.getHttpServer()).post('/notes').send({      
      title: "new note",
      note: "note description..."    
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.CREATED);

    const check = await prisma.note.findFirst({ where: { title: "new note" }})
    expect(check).not.toBe(null)
  });

  it('/notes (get note) should get a note"', async () => {
    const user = await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });
    const token = await request(app.getHttpServer()).post('/users/auth/sign-in').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });

    await request(app.getHttpServer()).post('/notes').send({      
      title: "new note",
      note: "note description..."    
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.CREATED);

    const getNote = await request(app.getHttpServer()).get('/notes').set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.OK);
    expect(getNote.body).toHaveLength(1)
  });

  it('/notes/:id (get note) should get a note by id"', async () => {
    const user = await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });
    const token = await request(app.getHttpServer()).post('/users/auth/sign-in').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });
    await request(app.getHttpServer()).post('/notes').send({      
      title: "new note",
      note: "note description..."    
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.CREATED);

    const note = await prisma.note.findFirst({where: {title: "new note"}})

    const getNote = await request(app.getHttpServer()).get(`/notes/${note.id}`).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.OK);
    expect(getNote.body).not.toBe(null);
  });

  it('/notes/:id (get note) should get a note by id"', async () => {
    const user = await request(app.getHttpServer()).post('/users/auth/sign-up').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });
    const token = await request(app.getHttpServer()).post('/users/auth/sign-in').send({      
      password: "s3nh@f0rTe!",
      email: "my2@email.com",      
    });
    await request(app.getHttpServer()).post('/notes').send({      
      title: "new note",
      note: "note description..."    
    }).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.CREATED);

    const note = await prisma.note.findFirst({where: {title: "new note"}})

    await request(app.getHttpServer()).delete(`/notes/${note.id}`).set('Authorization', `bearer ${token.body.token}`);
    expect(HttpStatus.OK);

    const note2 = await prisma.note.findFirst({where: {title: "new note"}})
    expect(note2).toBe(null);
  });
});
