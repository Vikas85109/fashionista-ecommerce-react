import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger show animation after mount
    const showTimer = requestAnimationFrame(() => setIsVisible(true));

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => {
      cancelAnimationFrame(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onClose]);

  const icons = {
    success: <FiCheck />,
    error: <FiX />,
    warning: <FiAlertCircle />,
    info: <FiInfo />
  };

  return (
    <div className={`toast toast-${type} ${isVisible ? '' : 'hide'}`} role="alert" aria-live="polite">
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} aria-label="Close notification">
        <FiX />
      </button>
    </div>
  );
};

export default Toast;
