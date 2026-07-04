import { useEffect } from 'react';

const Notification = ({ notification, onClear }) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(onClear, 3000);
    return () => clearTimeout(timer);
  }, [notification, onClear]);

  if (!notification) return null;

  return (
    <div className={`toast toast--${notification.type}`} role="status">
      {notification.message}
    </div>
  );
};

export default Notification;
