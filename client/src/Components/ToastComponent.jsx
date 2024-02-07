// ToastComponent.jsx
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastComponent = ({ toastOpen }) => {

  // useEffect(() => {
  //   if (projectCreated) {
  //     console.log("projectcreated value is:" + projectCreated);
  //     toast.success('Project Created Successfully!', {
  //       autoClose: 6000,
  //     });
  //     // setProjectCreated(false);
  //   } else if (taskCreated) {
  //     console.log("taskcreated value is:" + taskCreated);
  //     toast.success('Project Task Created Successfully!', {
  //       autoClose: 6000,
  //     });
  //   } else if (subtaskCreated) {
  //     console.log("subtaskcreated value is:" + subtaskCreated);
  //     toast.success('Project Subtask Created Successfully!', {
  //       autoClose: 6000,
  //     });
  //   }
  // }, [projectCreated, taskCreated, subtaskCreated]);

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
      {/* {setProjectCreated(false)} */}
    </div>
  );
};

export default ToastComponent;
