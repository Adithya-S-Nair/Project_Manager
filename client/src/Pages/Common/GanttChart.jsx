import React from 'react';
import { Gantt, Task } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

const MyGanttChart = () => {
  const tasks = [
    {
      start: new Date(2020, 1, 1),
      end: new Date(2020, 1, 2),
      name: 'Idea',
      id: 'Task 0',
      type: 'task',
      progress: 45,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
      children: [
        {
          start: new Date(2020, 1, 1),
          end: new Date(2020, 1, 1, 12),
          name: 'Subtask 1',
          id: 'Subtask 1',
          type: 'task',
          progress: 20,
          isDisabled: true,
          styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        },
        {
          start: new Date(2020, 1, 1, 12),
          end: new Date(2020, 1, 2),
          name: 'Subtask 2',
          id: 'Subtask 2',
          type: 'task',
          progress: 70,
          isDisabled: true,
          styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        },
      ],
    },
    // Add more tasks here if needed
  ];

  return <Gantt tasks={tasks} />;
};

export default MyGanttChart;
