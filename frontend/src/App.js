import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaTasks } from 'react-icons/fa';
import { taskAPI } from './services/api';
import './index.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, 'in-progress': 0, completed: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
    });

    const [editFormData, setEditFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
    });

    useEffect(() => {
        fetchTasks();
        fetchStats();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskAPI.getAllTasks();
            setTasks(response.data.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch tasks. Please make sure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await taskAPI.getStats();
            setStats(response.data.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await taskAPI.createTask(formData);
            setFormData({
                title: '',
                description: '',
                status: 'pending',
                priority: 'medium',
            });
            fetchTasks();
            fetchStats();
        } catch (err) {
            setError('Failed to create task');
            console.error(err);
        }
    };

    const handleEdit = (task) => {
        setEditingId(task.id);
        setEditFormData({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
        });
    };

    const handleUpdate = async (id) => {
        try {
            await taskAPI.updateTask(id, editFormData);
            setEditingId(null);
            fetchTasks();
            fetchStats();
        } catch (err) {
            setError('Failed to update task');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskAPI.deleteTask(id);
                fetchTasks();
                fetchStats();
            } catch (err) {
                setError('Failed to delete task');
                console.error(err);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    if (loading) {
        return <div className="loading">Loading tasks...</div>;
    }

    return (
        <div className="app">
            <header className="header">
                <h1><FaTasks style={{ marginRight: '1rem', verticalAlign: 'middle' }} />DevOps Task Manager</h1>
                <p>GitHub Actions CI/CD Learning Project</p>
                <span className="badge">🚀 Production Ready</span>
            </header>

            {error && <div className="error">{error}</div>}

            <div className="stats-container">
                <div className="stat-card">
                    <h3>Total Tasks</h3>
                    <div className="value">{stats.total}</div>
                </div>
                <div className="stat-card">
                    <h3>Pending</h3>
                    <div className="value" style={{ color: '#f59e0b' }}>{stats.pending}</div>
                </div>
                <div className="stat-card">
                    <h3>In Progress</h3>
                    <div className="value" style={{ color: '#3b82f6' }}>{stats['in-progress']}</div>
                </div>
                <div className="stat-card">
                    <h3>Completed</h3>
                    <div className="value" style={{ color: '#10b981' }}>{stats.completed}</div>
                </div>
            </div>

            <div className="task-form">
                <h2>Create New Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Task Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter task title..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter task description..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        <FaPlus /> Create Task
                    </button>
                </form>
            </div>

            <div className="task-list">
                <h2>Tasks ({tasks.length})</h2>
                {tasks.length === 0 ? (
                    <div className="empty-state">
                        <h3>No tasks yet</h3>
                        <p>Create your first task to get started!</p>
                    </div>
                ) : (
                    <div className="tasks-grid">
                        {tasks.map(task => (
                            <div key={task.id} className={`task-card ${editingId === task.id ? 'editing' : ''}`}>
                                {editingId === task.id ? (
                                    <div className="edit-form">
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={editFormData.title}
                                                onChange={handleEditInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea
                                                name="description"
                                                value={editFormData.description}
                                                onChange={handleEditInputChange}
                                            />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Status</label>
                                                <select
                                                    name="status"
                                                    value={editFormData.status}
                                                    onChange={handleEditInputChange}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="in-progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Priority</label>
                                                <select
                                                    name="priority"
                                                    value={editFormData.priority}
                                                    onChange={handleEditInputChange}
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="task-actions">
                                            <button
                                                className="btn btn-small btn-save"
                                                onClick={() => handleUpdate(task.id)}
                                            >
                                                <FaSave /> Save
                                            </button>
                                            <button
                                                className="btn btn-small btn-cancel"
                                                onClick={handleCancelEdit}
                                            >
                                                <FaTimes /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="task-header">
                                            <div>
                                                <h3 className="task-title">{task.title}</h3>
                                                <div className="task-badges">
                                                    <span className={`status-badge status-${task.status}`}>
                                                        {task.status}
                                                    </span>
                                                    <span className={`priority-badge priority-${task.priority}`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {task.description && (
                                            <p className="task-description">{task.description}</p>
                                        )}
                                        <div className="task-meta">
                                            Created: {new Date(task.created_at).toLocaleDateString('tr-TR')}
                                        </div>
                                        <div className="task-actions">
                                            <button
                                                className="btn btn-small btn-edit"
                                                onClick={() => handleEdit(task)}
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                className="btn btn-small btn-delete"
                                                onClick={() => handleDelete(task.id)}
                                            >
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
