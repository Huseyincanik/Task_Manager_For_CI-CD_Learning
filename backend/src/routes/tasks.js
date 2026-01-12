const express = require('express');
const { body, param, validationResult } = require('express-validator');
const db = require('../database');

const router = express.Router();

// Validation middleware
const validateTask = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority')
];

const validateId = [
    param('id').isInt({ min: 1 }).withMessage('Invalid task ID')
];

// Error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// GET /api/tasks - Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await db.all('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json({ success: true, data: tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
    }
});

// GET /api/tasks/:id - Get single task
router.get('/:id', validateId, handleValidationErrors, async (req, res) => {
    try {
        const task = await db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        if (!task) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.json({ success: true, data: task });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch task' });
    }
});

// POST /api/tasks - Create new task
router.post('/', validateTask, handleValidationErrors, async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;
        const result = await db.run(
            'INSERT INTO tasks (title, description, status, priority) VALUES (?, ?, ?, ?)',
            [title, description || '', status || 'pending', priority || 'medium']
        );

        const newTask = await db.get('SELECT * FROM tasks WHERE id = ?', [result.id]);
        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ success: false, error: 'Failed to create task' });
    }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', [...validateId, ...validateTask], handleValidationErrors, async (req, res) => {
    try {
        const { title, description, status, priority } = req.body;
        const result = await db.run(
            'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
            [title, description || '', status || 'pending', priority || 'medium', req.params.id]
        );

        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        const updatedTask = await db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
        res.json({ success: true, data: updatedTask });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ success: false, error: 'Failed to update task' });
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', validateId, handleValidationErrors, async (req, res) => {
    try {
        const result = await db.run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ success: false, error: 'Failed to delete task' });
    }
});

// GET /api/tasks/stats - Get task statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await db.all(`
      SELECT 
        status,
        COUNT(*) as count
      FROM tasks
      GROUP BY status
    `);

        const summary = {
            total: 0,
            pending: 0,
            'in-progress': 0,
            completed: 0
        };

        stats.forEach(stat => {
            summary[stat.status] = stat.count;
            summary.total += stat.count;
        });

        res.json({ success: true, data: summary });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
    }
});

module.exports = router;
