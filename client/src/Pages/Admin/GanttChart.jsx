import React, { useState } from 'react'
import TreeViewComponent from '../../Components/TreeViewComponent'
import { useQuery } from 'react-query';
import { makeRequest } from '../../Axios';
import CircularProgress from '@mui/material/CircularProgress';
import GanttChartComponent from '../../Components/GanttChartComponent';

const GanttChart = () => {
  const [treeData, setTreeData] = useState([])
  const [selectedData, setSelectedData] = useState([])

  const handleItemClick = (selectedId, selectedType) => {
    console.log(selectedType);
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
  console.log(treeData[0])

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

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <TreeViewComponent treeData={treeData} handleItemClick={handleItemClick} />
      <div style={{ flex: 1 }}>
        {treeData.length > 0 && <GanttChartComponent selectedData={selectedData} initialData={treeData[0]} />}
      </div>
    </div>
  )
}

export default GanttChart;
