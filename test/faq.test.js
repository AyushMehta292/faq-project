const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const FAQ = require('../src/models/faq');
const faqRoutes = require('../src/routes/faq');

const app = express();
app.use(express.json());
app.use('/api', faqRoutes);

beforeAll(async () => {
  // Connect to a test database
  const mongoURI = 'mongodb://localhost:27017/faqdb_test';
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await FAQ.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('FAQ API', () => {
  let faqId;

  test('POST /api/faqs creates a new FAQ', async () => {
    const response = await request(app)
      .post('/api/faqs')
      .send({
        question: 'What is Node.js?',
        answer: '<p>Node.js is a JavaScript runtime built on Chrome\'s V8 engine.</p>'
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    faqId = response.body.id;
  });

  test('GET /api/faqs returns FAQs in default language (English)', async () => {
    const response = await request(app).get('/api/faqs');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].question).toBeDefined();
  });

  test('GET /api/faqs?lang=hi returns translated FAQ (Hindi)', async () => {
    const response = await request(app).get('/api/faqs?lang=hi');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].question).not.toEqual('');
  });
});