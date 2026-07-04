import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
  });

  const notify = useCallback((message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskAPI.getAll(filters);
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks. Is the API running?');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    try {
      const res = await taskAPI.create(taskData);
      setTasks((prev) => [res.data, ...prev]);
      notify('Task created');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Could not create task';
      notify(message, 'error');
      return { success: false, message };
    }
  };

  const editTask = async (id, taskData) => {
    try {
      const res = await taskAPI.update(id, taskData);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      notify('Task updated');
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Could not update task';
      notify(message, 'error');
      return { success: false, message };
    }
  };

  const removeTask = async (id) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t._id !== id)); // optimistic update
    try {
      await taskAPI.remove(id);
      notify('Task deleted');
    } catch (err) {
      setTasks(previous); // rollback
      notify(err.response?.data?.message || 'Could not delete task', 'error');
    }
  };

  const toggleStatus = async (task) => {
    const next =
      task.status === 'pending'
        ? 'in-progress'
        : task.status === 'in-progress'
        ? 'completed'
        : 'pending';
    await editTask(task._id, { status: next });
  };

  return {
    tasks,
    loading,
    error,
    filters,
    setFilters,
    notification,
    clearNotification: () => setNotification(null),
    addTask,
    editTask,
    removeTask,
    toggleStatus,
    refetch: fetchTasks,
  };
};
