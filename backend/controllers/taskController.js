import Task from '../models/Task.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// @desc    Get all tasks (supports filtering, sorting, search)
// @route   GET /api/tasks
// @query   status, priority, sortBy, order, search
export const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, sortBy, order, search } = req.query;

  const filter = {};
  if (status && status !== 'all') filter.status = status;
  if (priority && priority !== 'all') filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const sortField = ['title', 'dueDate', 'priority', 'createdAt'].includes(sortBy)
    ? sortBy
    : 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;

  const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });

  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

// @desc    Get a single task
// @route   GET /api/tasks/:id
export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json({ success: true, data: task });
});

// @desc    Create a new task
// @route   POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const task = await Task.create({ title, description, status, priority, dueDate });
  res.status(201).json({ success: true, data: task });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json({ success: true, data: task });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json({ success: true, data: {} });
});
