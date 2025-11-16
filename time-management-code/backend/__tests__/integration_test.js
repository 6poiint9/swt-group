// backend/__tests__/integration/login-flow.integration.test.js

/**
 * INTEGRATION TEST: Complete Login Flow
 * 
 * This test verifies the entire login process from API to database:
 * 1. Database contains test user
 * 2. API accepts login request
 * 3. Password is validated correctly
 * 4. JWT token is generated
 * 5. Token can be used to access protected routes
 */

const request = require('supertest');
const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

// Import your actual routes
const authRoutes = require('../../routes/authenticateuser');
const myViewRoutes = require('../../routes/myview');

// Setup Express app with actual routes
const app = express();
app.use(express.json());
app.use('/api/authenticateUser', authRoutes);
app.use('/api/myView', myViewRoutes);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

describe('Integration Test: Complete Login Flow', () => {
  
  // Test user credentials (from your init.sql)
  const testUser = {
    username: 'dummyuser',
    password: '1234567890',
    expectedRole: 'employee'
  };

  let authToken = null;

  // ============================================
  // SETUP: Verify database is ready
  // ============================================
  beforeAll(async () => {
    try {
      // Test database connection
      await pool.query('SELECT NOW()');
      console.log('✓ Database connection successful');

      // Verify test user exists
      const result = await pool.query(
        'SELECT username, rolename FROM users WHERE username = $1',
        [testUser.username]
      );

      if (result.rows.length === 0) {
        throw new Error(`Test user '${testUser.username}' not found in database!`);
      }

      console.log(`✓ Test user found: ${result.rows[0].username} (${result.rows[0].rolename})`);

    } catch (error) {
      console.error('Database setup failed:', error.message);
      throw error;
    }
  });

  // ============================================
  // CLEANUP: Close database connection
  // ============================================
  afterAll(async () => {
    await pool.end();
  });

  // ============================================
  // TEST 1: Successful Login Flow
  // ============================================
  test('INTEGRATION: User can login and receive valid JWT token', async () => {
    console.log('\n--- TEST 1: Login Flow ---');

    // Step 1: Send login request
    const loginResponse = await request(app)
      .post('/api/authenticateUser/login')
      .send({
        username: testUser.username,
        password: testUser.password
      });

    // Step 2: Verify response
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.token).toBeDefined();
    expect(loginResponse.body.username).toBe(testUser.username);

    // Save token for next tests
    authToken = loginResponse.body.token;
    console.log('✓ Login successful, token received');

    // Step 3: Verify token structure
    const tokenParts = authToken.split('.');
    expect(tokenParts.length).toBe(3); // JWT has 3 parts: header.payload.signature
    console.log('✓ Token has valid JWT structure');
  });

  // ============================================
  // TEST 2: Token Authentication Flow
  // ============================================
  test('INTEGRATION: JWT token grants access to protected route', async () => {
    console.log('\n--- TEST 2: Protected Route Access ---');

    // Use token from previous test
    expect(authToken).not.toBeNull();

    // Step 1: Access protected route with token
    const protectedResponse = await request(app)
      .get('/api/myView/')
      .set('Authorization', `Bearer ${authToken}`);

    // Step 2: Verify access granted
    expect(protectedResponse.status).toBe(200);
    expect(protectedResponse.body.message).toBeDefined();
    console.log('✓ Protected route accessed successfully');
    console.log(`  Message: ${protectedResponse.body.message}`);
  });

  // ============================================
  // TEST 3: Invalid Credentials Flow
  // ============================================
  test('INTEGRATION: Invalid credentials are rejected', async () => {
    console.log('\n--- TEST 3: Invalid Credentials ---');

    const invalidResponse = await request(app)
      .post('/api/authenticateUser/login')
      .send({
        username: testUser.username,
        password: 'wrongpassword'
      });

    expect(invalidResponse.status).toBe(401);
    expect(invalidResponse.body.success).toBe(false);
    expect(invalidResponse.body.message).toBe('invalid login');
    console.log('✓ Invalid credentials properly rejected');
  });

  // ============================================
  // TEST 4: Unauthorized Access Flow
  // ============================================
  test('INTEGRATION: Protected route denies access without token', async () => {
    console.log('\n--- TEST 4: Unauthorized Access ---');

    const unauthorizedResponse = await request(app)
      .get('/api/myView/');
    // No Authorization header

    expect(unauthorizedResponse.status).toBe(401);
    expect(unauthorizedResponse.body.message).toBeDefined();
    console.log('✓ Access denied without token');
  });

  // ============================================
  // TEST 5: Invalid Token Flow
  // ============================================
  test('INTEGRATION: Protected route denies access with invalid token', async () => {
    console.log('\n--- TEST 5: Invalid Token ---');

    const invalidTokenResponse = await request(app)
      .get('/api/myView/')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(invalidTokenResponse.status).toBe(401);
    console.log('✓ Invalid token rejected');
  });

  // ============================================
  // TEST 6: Database Consistency
  // ============================================
  test('INTEGRATION: User data remains consistent in database', async () => {
    console.log('\n--- TEST 6: Database Consistency ---');

    // Verify user still exists with correct data
    const result = await pool.query(
      'SELECT id, username, email, rolename FROM users WHERE username = $1',
      [testUser.username]
    );

    expect(result.rows.length).toBe(1);
    expect(result.rows[0].username).toBe(testUser.username);
    expect(result.rows[0].rolename).toBe(testUser.expectedRole);
    console.log('✓ Database data consistent');
  });
});
