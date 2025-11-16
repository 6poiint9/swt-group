// backend/__tests__/auth.test.js
const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authenticateuser');
const authService = require('../utils/validatePwd');
const createToken = require('../utils/createToken');

// Mock dependencies
jest.mock('../utils/validatePwd');
jest.mock('../utils/createToken');

const app = express();
app.use(express.json());
app.use('/api/authenticateUser', authRoutes);

describe('Authentication API Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST CASE 1: Successful Login
  describe('POST /api/authenticateUser/login - Success', () => {
    it('should return token and success message on valid credentials', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'Employee'
      };
      const mockToken = 'mock.jwt.token';

      authService.validatePasswordAndGetUser.mockResolvedValue(mockUser);
      createToken.generateToken.mockReturnValue(mockToken);

      // Act
      const response = await request(app)
        .post('/api/authenticateUser/login')
        .send({
          username: 'testuser',
          password: 'validpassword123'
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        token: mockToken,
        username: 'testuser'
      });
      expect(authService.validatePasswordAndGetUser).toHaveBeenCalledWith(
        'testuser',
        'validpassword123'
      );
      expect(createToken.generateToken).toHaveBeenCalledWith(mockUser);
    });
  });

  // TEST CASE 2: Invalid Credentials
  describe('POST /api/authenticateUser/login - Invalid Credentials', () => {
    it('should return 401 error on invalid credentials', async () => {
      // Arrange
      authService.validatePasswordAndGetUser.mockRejectedValue(
        new Error('invalid login')
      );

      // Act
      const response = await request(app)
        .post('/api/authenticateUser/login')
        .send({
          username: 'wronguser',
          password: 'wrongpassword'
        });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        message: 'invalid login'
      });
      expect(authService.validatePasswordAndGetUser).toHaveBeenCalledWith(
        'wronguser',
        'wrongpassword'
      );
      expect(createToken.generateToken).not.toHaveBeenCalled();
    });
  });

  // TEST CASE 3: Missing Credentials
  describe('POST /api/authenticateUser/login - Missing Fields', () => {
    it('should return 401 error when username is missing', async () => {
      // Arrange
      authService.validatePasswordAndGetUser.mockRejectedValue(
        new Error('invalid login')
      );

      // Act
      const response = await request(app)
        .post('/api/authenticateUser/login')
        .send({
          password: 'somepassword'
        });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 error when password is missing', async () => {
      // Arrange
      authService.validatePasswordAndGetUser.mockRejectedValue(
        new Error('invalid login')
      );

      // Act
      const response = await request(app)
        .post('/api/authenticateUser/login')
        .send({
          username: 'testuser'
        });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
