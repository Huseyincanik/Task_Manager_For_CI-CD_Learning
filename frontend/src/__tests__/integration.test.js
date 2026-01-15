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
} from '../__mocks__/mockData';

// Mock the API
jest.mock('../services/api');

describe('Integration Tests - Full User Workflows', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        taskAPI.getAllTasks.mockResolvedValue({ data: { data: mockTasks } });
        taskAPI.getStats.mockResolvedValue({ data: { data: mockStats } });
    });

    describe('Complete Task Creation Workflow', () => {
        it('should create a task and see it in the list', async () => {
            // Setup mocks
            taskAPI.createTask.mockResolvedValue({ data: { data: mockCreatedTask } });
            taskAPI.getAllTasks
                .mockResolvedValueOnce({ data: { data: mockTasks } })
                .mockResolvedValueOnce({ data: { data: [...mockTasks, mockCreatedTask] } });

            const updatedStats = { ...mockStats, total: 4, pending: 2 };
            taskAPI.getStats
                .mockResolvedValueOnce({ data: { data: mockStats } })
                .mockResolvedValueOnce({ data: { data: updatedStats } });

            render(<App />);

            // Wait for initial load
            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            // Verify initial state
            expect(screen.getByText(/Tasks \(3\)/i)).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument(); // total count

            // Fill out the form
            const titleInput = screen.getByLabelText(/Task Title/i);
            const descriptionInput = screen.getByLabelText(/Description/i);
            const statusSelect = screen.getByLabelText(/Status/i);
            const prioritySelect = screen.getByLabelText(/Priority/i);

            await userEvent.type(titleInput, mockNewTask.title);
            await userEvent.type(descriptionInput, mockNewTask.description);
            await userEvent.selectOptions(statusSelect, mockNewTask.status);
            await userEvent.selectOptions(prioritySelect, mockNewTask.priority);

            // Submit the form
            const submitButton = screen.getByRole('button', { name: /Create Task/i });
            fireEvent.click(submitButton);

            // Verify API calls
            await waitFor(() => {
                expect(taskAPI.createTask).toHaveBeenCalledWith(
                    expect.objectContaining({
                        title: mockNewTask.title,
                        description: mockNewTask.description,
                        status: mockNewTask.status,
                        priority: mockNewTask.priority,
                    })
                );
                expect(taskAPI.getAllTasks).toHaveBeenCalledTimes(2);
                expect(taskAPI.getStats).toHaveBeenCalledTimes(2);
            });

            // Verify form was cleared
            expect(titleInput.value).toBe('');
            expect(descriptionInput.value).toBe('');
        });
    });

    describe('Complete Task Edit Workflow', () => {
        it('should edit a task and see the changes', async () => {
            const updatedTask = {
                ...mockTasks[0],
                title: 'Updated Task Title',
                status: 'completed',
            };

            taskAPI.updateTask.mockResolvedValue({ data: { data: updatedTask } });
            taskAPI.getAllTasks
                .mockResolvedValueOnce({ data: { data: mockTasks } })
                .mockResolvedValueOnce({ data: { data: [updatedTask, ...mockTasks.slice(1)] } });

            render(<App />);

            // Wait for initial load
            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            // Click edit on first task
            const editButtons = screen.getAllByRole('button', { name: /Edit/i });
            fireEvent.click(editButtons[0]);

            // Wait for edit mode
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
            });

            // Modify the task
            const titleInputs = screen.getAllByDisplayValue(mockTasks[0].title);
            const titleInput = titleInputs[0];

            await userEvent.clear(titleInput);
            await userEvent.type(titleInput, 'Updated Task Title');

            // Save changes
            const saveButton = screen.getByRole('button', { name: /Save/i });
            fireEvent.click(saveButton);

            // Verify API calls
            await waitFor(() => {
                expect(taskAPI.updateTask).toHaveBeenCalledWith(
                    mockTasks[0].id,
                    expect.objectContaining({
                        title: 'Updated Task Title',
                    })
                );
                expect(taskAPI.getAllTasks).toHaveBeenCalledTimes(2);
            });

            // Verify edit mode is closed
            await waitFor(() => {
                expect(screen.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
            });
        });

        it('should cancel edit without saving changes', async () => {
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

            // Make some changes
            const titleInputs = screen.getAllByDisplayValue(mockTasks[0].title);
            await userEvent.type(titleInputs[0], ' Modified');

            // Cancel
            const cancelButton = screen.getByRole('button', { name: /Cancel/i });
            fireEvent.click(cancelButton);

            // Verify no API calls were made
            expect(taskAPI.updateTask).not.toHaveBeenCalled();

            // Verify edit mode is closed
            await waitFor(() => {
                expect(screen.queryByRole('button', { name: /Save/i })).not.toBeInTheDocument();
            });
        });
    });

    describe('Complete Task Delete Workflow', () => {
        it('should delete a task and update the list', async () => {
            global.confirm = jest.fn(() => true);

            taskAPI.deleteTask.mockResolvedValue({ data: { success: true } });
            taskAPI.getAllTasks
                .mockResolvedValueOnce({ data: { data: mockTasks } })
                .mockResolvedValueOnce({ data: { data: mockTasks.slice(1) } });

            const updatedStats = { ...mockStats, total: 2, pending: 0 };
            taskAPI.getStats
                .mockResolvedValueOnce({ data: { data: mockStats } })
                .mockResolvedValueOnce({ data: { data: updatedStats } });

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            // Verify initial count
            expect(screen.getByText(/Tasks \(3\)/i)).toBeInTheDocument();

            // Delete first task
            const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
            fireEvent.click(deleteButtons[0]);

            // Verify confirmation was shown
            expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');

            // Verify API calls
            await waitFor(() => {
                expect(taskAPI.deleteTask).toHaveBeenCalledWith(mockTasks[0].id);
                expect(taskAPI.getAllTasks).toHaveBeenCalledTimes(2);
                expect(taskAPI.getStats).toHaveBeenCalledTimes(2);
            });
        });

        it('should not delete when user cancels confirmation', async () => {
            global.confirm = jest.fn(() => false);

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
            fireEvent.click(deleteButtons[0]);

            // Verify confirmation was shown but no API call was made
            expect(global.confirm).toHaveBeenCalled();
            expect(taskAPI.deleteTask).not.toHaveBeenCalled();
        });
    });

    describe('Error Recovery Workflow', () => {
        it('should recover from failed task creation', async () => {
            // First attempt fails
            taskAPI.createTask.mockRejectedValueOnce(new Error('Network error'));
            // Second attempt succeeds
            taskAPI.createTask.mockResolvedValueOnce({ data: { data: mockCreatedTask } });

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            // First attempt
            const titleInput = screen.getByLabelText(/Task Title/i);
            await userEvent.type(titleInput, mockNewTask.title);

            const submitButton = screen.getByRole('button', { name: /Create Task/i });
            fireEvent.click(submitButton);

            // Verify error is shown
            await waitFor(() => {
                expect(screen.getByText(/Failed to create task/i)).toBeInTheDocument();
            });

            // Second attempt
            await userEvent.type(titleInput, mockNewTask.title);
            fireEvent.click(submitButton);

            // Verify success
            await waitFor(() => {
                expect(taskAPI.createTask).toHaveBeenCalledTimes(2);
            });
        });

        it('should show error and allow retry when fetch fails', async () => {
            // First fetch fails
            taskAPI.getAllTasks.mockRejectedValueOnce(new Error('Network error'));
            // Second fetch succeeds
            taskAPI.getAllTasks.mockResolvedValueOnce({ data: { data: mockTasks } });

            const { rerender } = render(<App />);

            // Verify error is shown
            await waitFor(() => {
                expect(screen.getByText(/Failed to fetch tasks/i)).toBeInTheDocument();
            });

            // Trigger re-render (simulating retry)
            rerender(<App />);

            // Verify tasks are loaded
            await waitFor(() => {
                expect(screen.queryByText(/Failed to fetch tasks/i)).not.toBeInTheDocument();
                expect(screen.getByText('Test Task 1')).toBeInTheDocument();
            });
        });
    });

    describe('Multiple Operations Workflow', () => {
        it('should handle creating, editing, and deleting tasks in sequence', async () => {
            global.confirm = jest.fn(() => true);

            // Setup progressive mocks
            let currentTasks = [...mockTasks];

            taskAPI.getAllTasks.mockImplementation(() =>
                Promise.resolve({ data: { data: currentTasks } })
            );

            taskAPI.createTask.mockImplementation((task) => {
                const newTask = { ...task, id: currentTasks.length + 1 };
                currentTasks = [...currentTasks, newTask];
                return Promise.resolve({ data: { data: newTask } });
            });

            taskAPI.updateTask.mockImplementation((id, updates) => {
                const index = currentTasks.findIndex(t => t.id === id);
                currentTasks[index] = { ...currentTasks[index], ...updates };
                return Promise.resolve({ data: { data: currentTasks[index] } });
            });

            taskAPI.deleteTask.mockImplementation((id) => {
                currentTasks = currentTasks.filter(t => t.id !== id);
                return Promise.resolve({ data: { success: true } });
            });

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
            });

            // 1. Create a task
            const titleInput = screen.getByLabelText(/Task Title/i);
            await userEvent.type(titleInput, 'Sequential Test Task');

            const submitButton = screen.getByRole('button', { name: /Create Task/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(taskAPI.createTask).toHaveBeenCalled();
            });

            // 2. Edit the created task
            await waitFor(() => {
                const editButtons = screen.getAllByRole('button', { name: /Edit/i });
                fireEvent.click(editButtons[editButtons.length - 1]);
            });

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
            });

            const saveButton = screen.getByRole('button', { name: /Save/i });
            fireEvent.click(saveButton);

            await waitFor(() => {
                expect(taskAPI.updateTask).toHaveBeenCalled();
            });

            // 3. Delete a task
            await waitFor(() => {
                const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
                fireEvent.click(deleteButtons[0]);
            });

            await waitFor(() => {
                expect(taskAPI.deleteTask).toHaveBeenCalled();
            });

            // Verify all operations completed
            expect(taskAPI.createTask).toHaveBeenCalledTimes(1);
            expect(taskAPI.updateTask).toHaveBeenCalledTimes(1);
            expect(taskAPI.deleteTask).toHaveBeenCalledTimes(1);
        });
    });
});
