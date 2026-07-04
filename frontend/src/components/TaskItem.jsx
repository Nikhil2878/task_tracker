const statusLabel = {
  pending: 'Pending',
  'in-progress': 'In progress',
  completed: 'Completed',
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (dateStr, status) => {
  if (!dateStr || status === 'completed') return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
};

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <li className={`task-card task-card--${task.status}`}>
      <button
        className="task-card__status-dot"
        title="Click to advance status"
        onClick={() => onToggleStatus(task)}
        aria-label={`Status: ${statusLabel[task.status]}. Click to change.`}
      />

      <div className="task-card__body">
        <div className="task-card__top">
          <h3 className="task-card__title">{task.title}</h3>
          <span className={`badge badge--${task.priority}`}>{task.priority}</span>
        </div>

        {task.description && <p className="task-card__desc">{task.description}</p>}

        <div className="task-card__meta">
          <span className={`chip chip--${task.status}`}>{statusLabel[task.status]}</span>
          {task.dueDate && (
            <span className={`due ${overdue ? 'due--overdue' : ''}`}>
              {overdue ? 'Overdue: ' : 'Due '}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="task-card__actions">
        <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task">
          Edit
        </button>
        <button
          className="icon-btn icon-btn--danger"
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
