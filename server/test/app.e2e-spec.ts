import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { vi } from 'vitest';
import { AppModule } from './../src/app.module.js';
import { MailService } from '../src/mail/mail.service.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', database: 'up' });
  });

  it('changes the password and consumes the email reset token', async () => {
    const sendResetEmail = vi.spyOn(MailService.prototype, 'sendPasswordResetEmail')
      .mockResolvedValue(undefined);
    const api = request(app.getHttpServer());
    const email = `reset-${randomUUID()}@example.test`;
    const originalPassword = 'BeforeReset-42';
    const newPassword = 'AfterReset-42';

    await api.post('/auth/register').send({ email, password: originalPassword }).expect(201);
    await api.post('/auth/forgot-password').send({ email }).expect(201);
    const [[recipient, token]] = sendResetEmail.mock.calls;
    expect(recipient).toBe(email);

    await api.post('/auth/reset-password').send({ token, newPassword }).expect(201);
    await api.post('/auth/reset-password').send({ token, newPassword }).expect(401);
    await api.post('/auth/login').send({ email, password: originalPassword }).expect(401);
    await api.post('/auth/login').send({ email, password: newPassword }).expect(201);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await app?.close();
  });
});
