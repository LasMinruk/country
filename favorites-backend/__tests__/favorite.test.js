const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Favorites API', () => {
  beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    // Close the database connection
    await mongoose.connection.close();
  });

  describe('POST /api/favorites', () => {
    it('should add a new favorite', async () => {
      const response = await request(app)
        .post('/api/favorites')
        .send({
          email: 'test@example.com',
          country: {
            name: { common: 'Test Country' },
            cca3: 'TEST',
            flags: { png: 'test-flag.png' }
          }
        });
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('country');
      expect(response.body.country).toHaveProperty('cca3', 'TEST');
    });
  });

  describe('GET /api/favorites/:email', () => {
    it('should get favorites for a user', async () => {
      const response = await request(app)
        .get('/api/favorites/test@example.com');
      
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('DELETE /api/favorites/:email/:code', () => {
    it('should remove a favorite', async () => {
      const response = await request(app)
        .delete('/api/favorites/test@example.com/TEST');
      
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Removed');
    });
  });
}); 