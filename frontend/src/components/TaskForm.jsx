import { useState, useEffect } from 'react';

const emptyTask = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
};

const TaskForm = ({ onSubmit, editingTask, onCancelEdit }) => {
  const [form, setForm] = useState(emptyTask);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'pending',
        priority: editingTask.priority || 'medium',
        dueDate: editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(emptyTask);
    }
    setErrors({});
  }, [editingTask]);

  const validate = () => {
    const next = {};
    const title = form.title.trim();
    if (!title) next.title = 'Title is required';
    else if (title.length < 3) next.title = 'Title must be at least 3 characters';
    else if (title.length > 100) next.title = 'Title cannot exceed 100 characters';

    if (form.description.length > 500) {
      next.description = 'Description cannot exceed 500 characters';
    }

    if (form.dueDate) {
      const chosen = new Date(form.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!editingTask && chosen < today) {
        next.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate || null,
    };
    const result = editingTask
      ? await onSubmit(editingTask._id, payload)
      : await onSubmit(payload);
    setSubmitting(false);

    if (result?.success && !editingTask) setForm(emptyTask);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2 className="task-form__heading">{editingTask ? 'Edit task' : 'New task'}</h2>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Redesign Propertyle listing card"
          aria-invalid={!!errors.title}
          maxLength={100}
        />
        {errors.title && <span className="field__error">{errors.title}</span>}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          placeholder="Optional details..."
          maxLength={500}
        />
        {errors.description && <span className="field__error">{errors.description}</span>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="dueDate">Due date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            aria-invalid={!!errors.dueDate}
          />
          {errors.dueDate && <span className="field__error">{errors.dueDate}</span>}
        </div>
      </div>

      <div className="task-form__actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving...' : editingTask ? 'Save changes' : 'Add task'}
        </button>
        {editingTask && (
          <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
