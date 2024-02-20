import React, { useState } from 'react'
import TreeViewComponent from '../../Components/TreeViewComponent'

const GanttChart = () => {
  const [treeData, setTreeData] = useState([
    {
      "project_id": 1,
      "project_name": "Sample Project 1",
      "project_start_date": "2024-01-31T18:30:00.000Z",
      "project_end_date": "2024-02-27T18:30:00.000Z",
      "tasks": [
        {
          "task_id": 4,
          "task_name": "sample 1",
          "task_start_date": "2024-02-08T18:30:00.000Z",
          "task_end_date": "2024-02-18T18:30:00.000Z",
          "subtasks": [
            {
              "subtask_id": 2,
              "subtask_name": "Sample Subtask ",
              "subtask_start_date": "2024-02-04T18:30:00.000Z",
              "subtask_end_date": "2024-02-09T18:30:00.000Z"
            }
          ]
        },
        {
          "task_id": 5,
          "task_name": "Sample Task 2",
          "task_start_date": "2024-02-09T18:30:00.000Z",
          "task_end_date": "2024-02-19T18:30:00.000Z",
          "subtasks": [
            {
              "subtask_id": 3,
              "subtask_name": "Sample Subtask 2",
              "subtask_start_date": "2024-02-04T18:30:00.000Z",
              "subtask_end_date": "2024-02-09T18:30:00.000Z"
            }
          ]
        },
        {
          "task_id": 6,
          "task_name": "Sample Task 3",
          "task_start_date": "2024-02-09T18:30:00.000Z",
          "task_end_date": "2024-02-19T18:30:00.000Z",
          "subtasks": []
        }
      ]
    },
    {
      "project_id": 2,
      "project_name": "Sample Project 2",
      "project_start_date": "2024-02-29T18:30:00.000Z",
      "project_end_date": "2024-03-30T18:30:00.000Z",
      "tasks": [
        {
          "task_id": 14,
          "task_name": "Sample Task 20",
          "task_start_date": "2024-02-09T18:30:00.000Z",
          "task_end_date": "2024-02-19T18:30:00.000Z",
          "subtasks": []
        }
      ]
    },
    {
      "project_id": 3,
      "project_name": "Sample Project 3",
      "project_start_date": "2024-03-31T18:30:00.000Z",
      "project_end_date": "2024-04-29T18:30:00.000Z",
      "tasks": []
    }
  ])
  return (
    <div>
      <TreeViewComponent treeData={treeData} />
    </div>
  )
}

export default GanttChart;
