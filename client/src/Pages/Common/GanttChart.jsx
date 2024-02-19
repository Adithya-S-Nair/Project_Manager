import React from 'react'
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const GanttChart = () => {

    const tasks = [
        {
            id: 'task1',
            start: new Date(2020, 1, 1),
            end: new Date(2020, 1, 2),
            name: 'Task 1',
            subtasks: [
                { id: 'subtask1', start: '2022-01-01', end: '2022-01-05', name: 'Subtask 1.1' },
                { id: 'subtask2', start: '2022-01-06', end: '2022-01-10', name: 'Subtask 1.2' },
            ],
        },
        {
            id: 'task2',
            start: new Date(2022, 1, 11),
            end: new Date(2022, 1, 20),
            name: 'Task 2',
            subtasks: [
                { id: 'subtask3', start: '2022-01-11', end: '2022-01-15', name: 'Subtask 2.1' },
                { id: 'subtask4', start: '2022-01-16', end: '2022-01-20', name: 'Subtask 2.2' },
            ],
        },
    ];

    return (
        <Gantt tasks={tasks} />
    )
}

export default GanttChart