// Mock data for testing

export const mockTasks = [
    {
        id: 1,
        title: 'Test Task 1',
        description: 'This is a test task',
        status: 'pending',
        priority: 'high',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
    },
    {
        id: 2,
        title: 'Test Task 2',
        description: 'Another test task',
        status: 'in-progress',
        priority: 'medium',
        created_at: '2024-01-02T00:00:00.000Z',
        updated_at: '2024-01-02T00:00:00.000Z',
    },
    {
        id: 3,
        title: 'Test Task 3',
        description: 'Completed test task',
        status: 'completed',
        priority: 'low',
        created_at: '2024-01-03T00:00:00.000Z',
        updated_at: '2024-01-03T00:00:00.000Z',
    },
];

export const mockStats = {
    total: 3,
    pending: 1,
    'in-progress': 1,
    completed: 1,
};

export const mockNewTask = {
    title: 'New Task',
    description: 'New task description',
    status: 'pending',
    priority: 'medium',
};

export const mockCreatedTask = {
    id: 4,
    ...mockNewTask,
    created_at: '2024-01-04T00:00:00.000Z',
    updated_at: '2024-01-04T00:00:00.000Z',
};

export const mockUpdatedTask = {
    id: 1,
    title: 'Updated Task',
    description: 'Updated description',
    status: 'completed',
    priority: 'low',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z',
};

export const mockApiError = {
    message: 'Network Error',
    response: {
        status: 500,
        data: {
            error: 'Internal Server Error',
        },
    },
};

export const mockApiResponses = {
    getAllTasks: {
        data: {
            success: true,
            data: mockTasks,
        },
    },
    getTask: {
        data: {
            success: true,
            data: mockTasks[0],
        },
    },
    createTask: {
        data: {
            success: true,
            data: mockCreatedTask,
        },
    },
    updateTask: {
        data: {
            success: true,
            data: mockUpdatedTask,
        },
    },
    deleteTask: {
        data: {
            success: true,
            message: 'Task deleted successfully',
        },
    },
    getStats: {
        data: {
            success: true,
            data: mockStats,
        },
    },
};
