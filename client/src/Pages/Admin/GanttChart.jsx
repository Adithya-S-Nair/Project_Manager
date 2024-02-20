import React, { useState } from 'react'
import TreeViewComponent from '../../Components/TreeViewComponent'
import { useQuery } from 'react-query';
import { makeRequest } from '../../Axios';
import CircularProgress from '@mui/material/CircularProgress';
import GanttChartComponent from '../../Components/GanttChartComponent';

const GanttChart = () => {
  const [treeData, setTreeData] = useState([])

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
      <TreeViewComponent treeData={treeData} />
      <div style={{ flex: 1 }}>
        <GanttChartComponent />
      </div>
    </div>
  )
}

export default GanttChart;
