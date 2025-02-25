const request = require('supertest');
const app = require('../frontend/app'); // 引入Express应用

describe('Authentication Routes', () => {
  describe('GET /auth/login', () => {
    it('should return status code 200 and render login page', async () => {
      const response = await request(app).get('/auth/login');
      expect(response.status).toBe(200);
    });
  });

  describe('POST /auth/login', () => {
    it('should return status code 302 on successful login', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'user', password: 'pass' });
      expect(response.status).toBe(302);
    });

    it('should return status code 401 on failed login', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ username: 'user', password: 'wrong-password' });
      expect(response.status).toBe(401);
    });
  });
});
