process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

jest.mock('../src/services/auth.service', () => ({
  login: jest.fn(),
  getCurrentUser: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const authService = require('../src/services/auth.service');

describe('Spare Parts API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /health returns a healthy response', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'API is healthy',
    });
  });

  test('returns 404 in the common API response shape', async () => {
    const response = await request(app).get('/api/not-a-route');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Route not found');
  });

  test('POST /api/auth/login validates required fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalid', password: '123' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation failed');
    expect(authService.login).not.toHaveBeenCalled();
  });

  test('POST /api/auth/login calls the auth service', async () => {
    authService.login.mockResolvedValue({
      user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'staff' },
      token: 'access-token',
      refreshToken: 'refresh-token',
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBe('access-token');
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  test('GET /api/auth/me rejects requests without a token', async () => {
    const response = await request(app).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('No token provided');
  });

  test('GET /api/auth/me returns the current user with a valid token', async () => {
    const token = jwt.sign(
      { id: 7, email: 'test@example.com', role: 'staff' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    authService.getCurrentUser.mockResolvedValue({
      id: 7,
      name: 'Test User',
      email: 'test@example.com',
      role: 'staff',
    });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe(7);
    expect(authService.getCurrentUser).toHaveBeenCalledWith(7);
  });

  test('POST /api/auth/refresh validates the refresh token', async () => {
    const response = await request(app)
      .post('/api/auth/refresh')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Validation failed');
  });

  test('POST /api/auth/refresh returns a rotated token pair', async () => {
    authService.refreshToken.mockResolvedValue({
      token: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    const response = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'old-refresh-token' });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBe('new-access-token');
    expect(response.body.data.refreshToken).toBe('new-refresh-token');
  });
});
