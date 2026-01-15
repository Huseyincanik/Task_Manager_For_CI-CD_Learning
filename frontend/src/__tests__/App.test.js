import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { taskAPI } from '../services/api';
import {
    mockTasks,
    mockStats,
    mockNewTask,
    mockCreatedTask,
    mockUpdatedTask,
} from '../__mocks__/mockData';

// Mock the API
jest.mock('../services/api');

describe('App Component Tests', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Default successful API responses
        taskAPI.getAllTasks.mockResolvedValue({ data: { data: mockTasks } });
        taskAPI.getStats.mockResolvedValue({ data: { data: mockStats } });
    });

    describe('Initial Rendering', () => {
        it('should render without crashing', () => {
            render(<App />);
            expect(screen.getByText(/DevOps Task Manager/i)).toBeInTheDocument();
        });

        it('should show loading state initially', () => {
            render(<App />);
            expect(screen.getByText(/Loading tasks.../i)).toBeInTheDocument();
        });

        it('should display header with title and badge', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByText(/DevOps Task Manager/i)).toBeInTheDocument();
                expect(screen.getByText(/GitHub Actions CI\/CD Learning Project/i)).toBeInTheDocument();
                expect(screen.getByText(/Production Ready/i)).toBeInTheDocument();
            });
        });
    });

    describe('Data Fetching', () => {
        it('should fetch and display tasks after loading', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading tasks.../i)).not.toBeInTheDocument();
            });

            expect(taskAPI.getAllTasks).toHaveBeenCalledTimes(1);
            expect(taskAPI.getStats).toHaveBeenCalledTimes(1);

            expect(screen.getByText('Test Task 1')).toBeInTheDocument();
            expect(screen.getByText('Test Task 2')).toBeInTheDocument();
            expect(screen.getByText('Test Task 3')).toBeInTheDocument();
        });

        it('should display error message when fetch fails', async () => {
            taskAPI.getAllTasks.mockRejectedValue(new Error('Network error'));

            render(<App />);

            await waitFor(() => {
                expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
            });
        });

        it('should clear error after successful fetch', async () => {
            // First call fails
            taskAPI.getAllTasks.mockRejectedValueOnce(new Error('Network error'));
            // Second call succeeds
            taskAPI.getAllTasks.mockResolvedValueOnce({ data: { data: mockTasks } });

            const { rerender } = render(<App />);

            await waitFor(() => {
                expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
            });

            // Trigger re-fetch
            rerender(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Failed to fetch tasks/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('Statistics Display', () => {
        it('should display statistics correctly', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByText('Total Tasks')).toBeInTheDocument();
                expect(screen.getByText('3')).toBeInTheDocument(); // total
                expect(screen.getByText('Pending')).toBeInTheDocument();
                expect(screen.getByText('In Progress')).toBeInTheDocument();
                expect(screen.getByText('Completed')).toBeInTheDocument();
            });
        });

        it('should update stats after creating a task', async () => {
            const updatedStats = { ...mockStats, total: 4, pending: 2 };
            taskAPI.createTask.mockResolvedValue({ data: { data: mockCreatedTask } });
            taskAPI.getStats.mockResolvedValueOnce({ data: { data: mockStats } });
            taskAPI.getStats.mockResolvedValueOnce({ data: { data: updatedStats } });

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            // Fill and submit form
            const titleInput = screen.getByLabelText(/Task Title/i);
            await userEvent.type(titleInput, mockNewTask.title);

            const submitButton = screen.getByRole('button', { name: /Create Task/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(taskAPI.getStats).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('Empty State', () => {
        it('should show empty state when no tasks', async () => {
            taskAPI.getAllTasks.mockResolvedValue({ data: { data: [] } });

            render(<App />);

            await waitFor(() => {
                expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
                expect(screen.getByText(/Create your first task to get started!/i)).toBeInTheDocument();
            });
        });

        it('should show task count in header', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByText(/Tasks \(3\)/i)).toBeInTheDocument();
            });
        });
    });

    describe('Create Task Form', () => {
        it('should render create task form', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByText(/Create New Task/i)).toBeInTheDocument();
                expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
                expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
                expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
                expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
            });
        });

        it('should handle form input changes', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const titleInput = screen.getByLabelText(/Task Title/i);
            const descriptionInput = screen.getByLabelText(/Description/i);

            await userEvent.type(titleInput, 'New Task');
            await userEvent.type(descriptionInput, 'Task description');

            expect(titleInput.value).toBe('New Task');
            expect(descriptionInput.value).toBe('Task description');
        });

        it('should create a new task successfully', async () => {
            taskAPI.createTask.mockResolvedValue({ data: { data: mockCreatedTask } });
            taskAPI.getAllTasks.mockResolvedValueOnce({ data: { data: mockTasks } });
            taskAPI.getAllTasks.mockResolvedValueOnce({ data: { data: [...mockTasks, mockCreatedTask] } });

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            // Fill form
            const titleInput = screen.getByLabelText(/Task Title/i);
            const descriptionInput = screen.getByLabelText(/Description/i);

            await userEvent.type(titleInput, mockNewTask.title);
            await userEvent.type(descriptionInput, mockNewTask.description);

            // Submit
            const submitButton = screen.getByRole('button', { name: /Create Task/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(taskAPI.createTask).toHaveBeenCalledWith(expect.objectContaining({
                    title: mockNewTask.title,
                    description: mockNewTask.description,
                }));
            });
        });

        it('should clear form after successful submission', async () => {
            taskAPI.createTask.mockResolvedValue({ data: { data: mockCreatedTask } });

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const titleInput = screen.getByLabelText(/Task Title/i);
            await userEvent.type(titleInput, 'Test Task');

            const submitButton = screen.getByRole('button', { name: /Create Task/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(titleInput.value).toBe('');
            });
        });

        it('should show error when task creation fails', async () => {
            taskAPI.createTask.mockRejectedValue(new Error('Failed to create'));

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const titleInput = screen.getByLabelText(/Task Title/i);
            await userEvent.type(titleInput, 'Test Task');

            const submitButton = screen.getByRole('button', { name: /Create Task/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/Failed to create task/i)).toBeInTheDocument();
            });
        });
    });

    describe('Task List Display', () => {
        it('should display all tasks', async () => {
            render(<App />);

            await waitFor(() => {
                mockTasks.forEach(task => {
                    expect(screen.getByText(task.title)).toBeInTheDocument();
                    expect(screen.getByText(task.description)).toBeInTheDocument();
                });
            });
        });

        it('should display task status and priority badges', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByText('pending')).toBeInTheDocument();
                expect(screen.getByText('in-progress')).toBeInTheDocument();
                expect(screen.getByText('completed')).toBeInTheDocument();
                expect(screen.getByText('high')).toBeInTheDocument();
                expect(screen.getByText('medium')).toBeInTheDocument();
                expect(screen.getByText('low')).toBeInTheDocument();
            });
        });

        it('should display task creation date', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByText(/Created:/i)).toBeInTheDocument();
            });
        });
    });

    describe('Edit Task Functionality', () => {
        it('should enter edit mode when edit button is clicked', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const editButtons = screen.getAllByRole('button', { name: /Edit/i });
            fireEvent.click(editButtons[0]);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
            });
        });

        it('should populate edit form with task data', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const editButtons = screen.getAllByRole('button', { name: /Edit/i });
            fireEvent.click(editButtons[0]);

            await waitFor(() => {
                const inputs = screen.getAllByDisplayValue(mockTasks[0].title);
                expect(inputs.length).toBeGreaterThan(0);
            });
        });

        it('should update task successfully', async () => {
            taskAPI.updateTask.mockResolvedValue({ data: { data: mockUpdatedTask } });

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            // Click edit
            const editButtons = screen.getAllByRole('button', { name: /Edit/i });
            fireEvent.click(editButtons[0]);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
            });

            // Click save
            const saveButton = screen.getByRole('button', { name: /Save/i });
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(taskAPI.updateTask).toHaveBeenCalled();
            });
        });

        it('should cancel edit mode', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            // Enter edit mode
            const editButtons = screen.getAllByRole('button', { name: /Edit/i });
            fireEvent.click(editButtons[0]);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
            });

            // Cancel
            const cancelButton = screen.getByRole('button', { name: /Cancel/i });
            fireEvent.click(cancelButton);

            await waitFor(() => {
                expect(screen.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
            });
        });

        it('should show error when update fails', async () => {
            taskAPI.updateTask.mockRejectedValue(new Error('Update failed'));

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const editButtons = screen.getAllByRole('button', { name: /Edit/i });
            fireEvent.click(editButtons[0]);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
            });

            const saveButton = screen.getByRole('button', { name: /Save/i });
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(screen.getByText(/Failed to update task/i)).toBeInTheDocument();
            });
        });
    });

    describe('Delete Task Functionality', () => {
        it('should show confirmation dialog when delete is clicked', async () => {
            global.confirm = jest.fn(() => true);

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
            fireEvent.click(deleteButtons[0]);

            expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');
        });

        it('should delete task when confirmed', async () => {
            global.confirm = jest.fn(() => true);
            taskAPI.deleteTask.mockResolvedValue({ data: { success: true } });

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
            fireEvent.click(deleteButtons[0]);

            await waitFor(() => {
                expect(taskAPI.deleteTask).toHaveBeenCalledWith(mockTasks[0].id);
            });
        });

        it('should not delete task when cancelled', async () => {
            global.confirm = jest.fn(() => false);

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
            fireEvent.click(deleteButtons[0]);

            expect(taskAPI.deleteTask).not.toHaveBeenCalled();
        });

        it('should show error when delete fails', async () => {
            global.confirm = jest.fn(() => true);
            taskAPI.deleteTask.mockRejectedValue(new Error('Delete failed'));

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
            fireEvent.click(deleteButtons[0]);

            await waitFor(() => {
                expect(screen.getByText(/Failed to delete task/i)).toBeInTheDocument();
            });
        });
    });

    describe('Form Select Elements', () => {
        it('should have correct status options', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const statusSelect = screen.getByLabelText(/Status/i);
            expect(statusSelect).toHaveTextContent('Pending');
            expect(statusSelect).toHaveTextContent('In Progress');
            expect(statusSelect).toHaveTextContent('Completed');
        });

        it('should have correct priority options', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const prioritySelect = screen.getByLabelText(/Priority/i);
            expect(prioritySelect).toHaveTextContent('Low');
            expect(prioritySelect).toHaveTextContent('Medium');
            expect(prioritySelect).toHaveTextContent('High');
        });
    });
});
