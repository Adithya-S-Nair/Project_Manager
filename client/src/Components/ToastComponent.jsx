// ToastComponent.jsx
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastComponent = ({ toastOpen }) => {

  useEffect(() => {
    if (toastOpen.open) {
      toast.success(toastOpen.msg, {
        autoClose: 6000,
      });
    }
  }, [toastOpen]);

  return (
    <div>
      <ToastContainer />
    </div>
  );
};

export default ToastComponent;
