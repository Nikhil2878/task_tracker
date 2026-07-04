import TaskItem from './TaskItem';
//Tasklist
const TaskList = ({ tasks, loading, error, onEdit, onDelete, onToggleStatus, onRetry }) => {
  if (loading) {
    return (
      <div className="state-panel">
        <div className="spinner" />
        <p>Loading tasks…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-panel state-panel--error">
        <p>{error}</p>
        <button className="btn btn--ghost" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="state-panel">
        <p className="state-panel__title">No tasks match these filters</p>
        <p>Add a task above, or adjust your filters to see more.</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </ul>
  );
};

export default TaskList;
