import React, { useState } from 'react'
import TreeViewComponent from '../../Components/TreeViewComponent'
import { useQuery } from 'react-query';
import { makeRequest } from '../../Axios';
import CircularProgress from '@mui/material/CircularProgress';
import GanttChartComponent from '../../Components/GanttChartComponent';
import PageTitle from '../../Components/PageTitle';

const GanttChart = () => {
  const [treeData, setTreeData] = useState([])
  const [selectedData, setSelectedData] = useState([])

  const handleItemClick = (selectedId, selectedType) => {
    treeData.filter((data) => {
      if (selectedType === "project") {
        if (data.project_id == selectedId) {
          setSelectedData(data)
        }
      } else if (selectedType === "task") {
        data.tasks.filter((taskData) => {
          if (taskData.task_id == selectedId) {
            setSelectedData(taskData)
          }
        })
      } else if (selectedType === "subtask") {
        data.tasks.filter((taskData) => {
          taskData.subtasks.filter((subtaskData) => {
            if (subtaskData.subtask_id == selectedId) {
              setSelectedData(subtaskData)
            }
          })
        })
      }
    })
  };

  const { data: projectDetails, error: projectDetailsError, isLoading: projectDetailsLoading } = useQuery(['projectDetails'], async () => {
    const response = await makeRequest.get(`/project/getallprojectdetails`);
    setTreeData(response.data);
    // return response.data;
  });

  if (projectDetailsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (projectDetailsError) {
    console.error('Error fetching data:', projectDetailsError);
    return <div>Error fetching data</div>;
  }

  const ganttIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  )

  return (
    <>
      <PageTitle titleText="Gantt Chart" titleIcon={ganttIcon} />
      <div style={{ display: 'flex', height: '100vh' }}>
        <TreeViewComponent treeData={treeData} handleItemClick={handleItemClick} />
        <div style={{ flex: 1 }}>
          {treeData.length > 0 && <GanttChartComponent selectedData={selectedData} initialData={treeData[0]} />}
        </div>
      </div>
    </>
  )
}

export default GanttChart;
