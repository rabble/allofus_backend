import request from 'supertest';
import { app } from '../../app';

describe('Authentication Flow', () => {
  it('should handle complete auth flow', async () => {
    // Register
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'newuser',
        email: 'new@user.com',
        password: 'password123'
      });
    expect(registerResponse.status).toBe(201);

    // Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'newuser',
        password: 'password123'
      });
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');

    // Get current user
    const meResponse = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);
    expect(meResponse.status).toBe(200);
    expect(meResponse.body.username).toBe('newuser');

    // Logout
    const logoutResponse = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);
    expect(logoutResponse.status).toBe(200);
  });
});
