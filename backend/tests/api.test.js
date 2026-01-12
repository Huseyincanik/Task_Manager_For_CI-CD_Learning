const request = require('supertest');
const app = require('../src/server');

describe('API Health Check', () => {
    test('GET /health should return healthy status', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'healthy');
        expect(response.body).toHaveProperty('timestamp');
    });
});

describe('Task API Endpoints', () => {
    let createdTaskId;

    test('POST /api/tasks should create a new task', async () => {
        const newTask = {
            title: 'Test Task',
            description: 'This is a test task',
            status: 'pending',
            priority: 'high'
        };

        const response = await request(app)
            .post('/api/tasks')
            .send(newTask);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.title).toBe(newTask.title);

        createdTaskId = response.body.data.id;
    });

    test('GET /api/tasks should return all tasks', async () => {
        const response = await request(app).get('/api/tasks');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/tasks/:id should return a specific task', async () => {
        const response = await request(app).get(`/api/tasks/${createdTaskId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(createdTaskId);
    });

    test('PUT /api/tasks/:id should update a task', async () => {
        const updatedTask = {
            title: 'Updated Test Task',
            description: 'Updated description',
            status: 'completed',
            priority: 'low'
        };

        const response = await request(app)
            .put(`/api/tasks/${createdTaskId}`)
            .send(updatedTask);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe(updatedTask.title);
        expect(response.body.data.status).toBe(updatedTask.status);
    });

    test('DELETE /api/tasks/:id should delete a task', async () => {
        const response = await request(app).delete(`/api/tasks/${createdTaskId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test('POST /api/tasks should fail with invalid data', async () => {
        const invalidTask = {
            description: 'Missing title'
        };

        const response = await request(app)
            .post('/api/tasks')
            .send(invalidTask);

        expect(response.status).toBe(400);
    });
});
