const request = require('supertest');
const sinon = require('sinon');
const { User } = require('../../src/models');
const app = require('../../index');
const argon2 = require('argon2');
const jsonwebtoken = require('jsonwebtoken');



describe('POST /login', () => {
    const OLD_ENV = process.env;
    const APP_SECRET_KEY = 'test_secret';

    beforeEach(() => {
        process.env = { ...OLD_ENV, APP_SECRET_KEY };
    });

    afterEach(() => {
        process.env = OLD_ENV;
        sinon.restore();
    });

    it('should login successfully and return a token', async () => {
        const mockUser = {
            id: 1,
            name: 'Test User',
            age: 20,
            username: 'testuser',
            password: await argon2.hash('testpassword'),
            session_uuid: 'test_uuid',
            update: sinon.stub().resolves(true),
            toJSON: sinon.stub().returns({
                id: 1,
                name: 'Test User',
                age: 20,
                username: 'testuser',
                session_uuid: 'test_uuid',
            }),
        };

        sinon.stub(User, 'findOne').resolves(mockUser)

        const response = await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'testpassword' })
        .expect(200)

        const decoded = jsonwebtoken.verify(response.text, process.env.APP_SECRET_KEY);

        expect(decoded.id).toBe(1);
        expect(decoded.name).toBe('Test User');
        expect(decoded.age).toBe(20);
        expect(decoded.username).toBe('testuser');
    });

    it('should return 401 if user is not found', async () => {
        sinon.stub(User, 'findOne').resolves(null);

        await request(app)
        .post('/login')
        .send({ username: 'testuser', password: 'testpassword' })
        .expect(401)
    });
});