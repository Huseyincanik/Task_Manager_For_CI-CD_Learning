import { taskAPI } from '../services/api';
import { mockApiResponses, mockNewTask, mockApiError } from '../__mocks__/mockData';

// Mock axios module
jest.mock('axios', () => {
    const mockAxiosInstance = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
            request: { use: jest.fn((success, error) => { }) },
            response: { use: jest.fn((success, error) => { }) },
        },
    };

    return {
        create: jest.fn(() => mockAxiosInstance),
        default: {
            create: jest.fn(() => mockAxiosInstance),
        },
    };
});

// Get the mocked axios instance
import axios from 'axios';
const mockAxiosInstance = axios.create();

describe('API Service Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('taskAPI.getAllTasks()', () => {
        it('should fetch all tasks successfully', async () => {
            mockAxiosInstance.get.mockResolvedValue(mockApiResponses.getAllTasks);

            const result = await taskAPI.getAllTasks();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tasks');
            expect(result).toEqual(mockApiResponses.getAllTasks);
        });

        it('should handle errors when fetching tasks', async () => {
            mockAxiosInstance.get.mockRejectedValue(mockApiError);

            await expect(taskAPI.getAllTasks()).rejects.toEqual(mockApiError);
        });
    });

    describe('taskAPI.getTask()', () => {
        it('should fetch a single task by ID', async () => {
            const taskId = 1;
            mockAxiosInstance.get.mockResolvedValue(mockApiResponses.getTask);

            const result = await taskAPI.getTask(taskId);

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tasks/1');
            expect(result).toEqual(mockApiResponses.getTask);
        });

        it('should handle errors when fetching a task', async () => {
            mockAxiosInstance.get.mockRejectedValue(mockApiError);

            await expect(taskAPI.getTask(1)).rejects.toEqual(mockApiError);
        });
    });

    describe('taskAPI.createTask()', () => {
        it('should create a new task successfully', async () => {
            mockAxiosInstance.post.mockResolvedValue(mockApiResponses.createTask);

            const result = await taskAPI.createTask(mockNewTask);

            expect(mockAxiosInstance.post).toHaveBeenCalledWith('/tasks', mockNewTask);
            expect(result).toEqual(mockApiResponses.createTask);
        });

        it('should handle errors when creating a task', async () => {
            mockAxiosInstance.post.mockRejectedValue(mockApiError);

            await expect(taskAPI.createTask(mockNewTask)).rejects.toEqual(mockApiError);
        });

        it('should send correct task data format', async () => {
            mockAxiosInstance.post.mockResolvedValue(mockApiResponses.createTask);

            await taskAPI.createTask(mockNewTask);

            const sentData = mockAxiosInstance.post.mock.calls[0][1];
            expect(sentData).toHaveProperty('title');
            expect(sentData).toHaveProperty('description');
            expect(sentData).toHaveProperty('status');
            expect(sentData).toHaveProperty('priority');
        });
    });

    describe('taskAPI.updateTask()', () => {
        it('should update a task successfully', async () => {
            const taskId = 1;
            const updateData = { title: 'Updated Title' };
            mockAxiosInstance.put.mockResolvedValue(mockApiResponses.updateTask);

            const result = await taskAPI.updateTask(taskId, updateData);

            expect(mockAxiosInstance.put).toHaveBeenCalledWith('/tasks/1', updateData);
            expect(result).toEqual(mockApiResponses.updateTask);
        });

        it('should handle errors when updating a task', async () => {
            mockAxiosInstance.put.mockRejectedValue(mockApiError);

            await expect(taskAPI.updateTask(1, {})).rejects.toEqual(mockApiError);
        });
    });

    describe('taskAPI.deleteTask()', () => {
        it('should delete a task successfully', async () => {
            const taskId = 1;
            mockAxiosInstance.delete.mockResolvedValue(mockApiResponses.deleteTask);

            const result = await taskAPI.deleteTask(taskId);

            expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/tasks/1');
            expect(result).toEqual(mockApiResponses.deleteTask);
        });

        it('should handle errors when deleting a task', async () => {
            mockAxiosInstance.delete.mockRejectedValue(mockApiError);

            await expect(taskAPI.deleteTask(1)).rejects.toEqual(mockApiError);
        });
    });

    describe('taskAPI.getStats()', () => {
        it('should fetch statistics successfully', async () => {
            mockAxiosInstance.get.mockResolvedValue(mockApiResponses.getStats);

            const result = await taskAPI.getStats();

            expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tasks/stats/summary');
            expect(result).toEqual(mockApiResponses.getStats);
        });

        it('should handle errors when fetching stats', async () => {
            mockAxiosInstance.get.mockRejectedValue(mockApiError);

            await expect(taskAPI.getStats()).rejects.toEqual(mockApiError);
        });

        it('should return stats with correct structure', async () => {
            mockAxiosInstance.get.mockResolvedValue(mockApiResponses.getStats);

            const result = await taskAPI.getStats();

            expect(result.data.data).toHaveProperty('total');
            expect(result.data.data).toHaveProperty('pending');
            expect(result.data.data).toHaveProperty('in-progress');
            expect(result.data.data).toHaveProperty('completed');
        });
    });

    describe('API Configuration', () => {
        it('should have correct base URL configuration', () => {
            expect(axios.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseURL: expect.any(String),
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                    }),
                })
            );
        });

        it('should setup request and response interceptors', () => {
            expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
            expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
        });
    });
});
