import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeContext } from '../../Context/ThemeContext'
import { makeRequest } from '../../Axios';
import { useQuery } from 'react-query';
import CircularProgress from '@mui/material/CircularProgress';
import ProjectDetailMUI from '../../Components/ProjectDetailMUI';
import ProjectDetailDaisyUI from '../../Components/ProjectDetailDaisyUI';
import WorkProgress from '../Admin/WorkProgress';


const ProjectDetail = () => {
    const { projectId } = useParams();
    const { theme } = useContext(ThemeContext)
    const [value, setValue] = useState(0);
    const [taskData, setTaskData] = useState();
    const [allTaskData, setAllTaskData] = useState();
    const [taskCount, setTaskCount] = useState();
    const [allSubtaskData, setAllSubtaskData] = useState();
    const [subtaskCount, setSubtaskCount] = useState();
    const [gridApi, setGridApi] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [chevronRotation, setChevronRotation] = useState(0);
    const sparklineData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                data: [30, 40, 25, 50, 35, 60],
            },
        ],
    };
    const navigate = useNavigate()

    const { data: projectData, error: projectError, isLoading: projectLoading } = useQuery(['project', projectId], async () => {
        const response = await makeRequest.get(`/project/getproject/${projectId}`);
        return response.data;
    });

    const { data: pendingSubtaskCount, error: pendingSubtaskError, isLoading: pendingSubtaskLoading } = useQuery(
        ['pendingSubtaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/subtask/getpendingsubtaskcount/${projectId}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: pendingTaskCount, error: pendingTaskError, isLoading: pendingTaskLoading } = useQuery(
        ['pendingTaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/task/getpendingtaskcount/${projectId}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: projectCompletionStatus, error: projectCompletionStatusError, isLoading: projectCompletionStatusLoading } = useQuery(
        ['projectCompletionStatus', projectId],
        async () => {
            const response = await makeRequest.get(`/project/getprojectcompletionstatus/${projectId}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: radarChartData, error: radarChartError, isLoading: radarChartLoading } = useQuery(
        ['radarChartData', projectId],
        async () => {
            const response = await makeRequest.get(`/project/getradarchartdata/${projectId}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: taskdata, error: taskDataError, isLoading: taskDataLoading } = useQuery(
        ['taskData', projectId],
        async () => {
            const response = await makeRequest.get(`/task/getprojecttask/${projectId}`);
            setTaskData(response.data);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: subtaskData, error: subtaskDataError, isLoading: subtaskDataLoading } = useQuery(
        ['subtaskData', projectId],
        async () => {
            const response = await makeRequest.get(`/subtask/getprojectsubtask/${projectId}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: updateTaskData, error: updateTaskError, isLoading: updateTaskLoading } = useQuery(['project', projectId], async () => {
        // const response = await makeRequest.get(`/task/updatetaskdata/${project.projectid}`);
        // return response.data;
    });

    // console.log("hiii");
    const { data: getAllTaskData, error: getAllTaskDataError, isLoading: getAllTaskDataLoading } = useQuery(
        ['allTaskData', projectId],
        async () => {
            const response = await makeRequest.get(`/task/getprojecttasks/${projectId}`);
            setTaskCount(response.data.taskCount)
            setAllTaskData(response.data.tasks);
            // console.log(response.data.tasks);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: getAllSubtaskData, error: getAllSubtaskDataError, isLoading: getAllSubtaskDataLoading } = useQuery(
        ['allSubtaskData', projectId],
        async () => {
            const response = await makeRequest.get(`/subtask/getprojectsubtasks/${projectId}`);
            setSubtaskCount(response.data.subtaskCount)
            setAllSubtaskData(response.data.subtasks);
            // console.log(response.data.tasks);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    if (projectError || pendingTaskError || pendingSubtaskError || projectCompletionStatusError || radarChartError || taskDataError || updateTaskError) {
        console.error('Error fetching data:', projectError || pendingTaskError || pendingSubtaskError || projectCompletionStatusError || radarChartError || updateTaskError);
        return <div>Error fetching data</div>;
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setChevronRotation(180);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setChevronRotation(0);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const navigateToAllProject = () => {
        navigate('/admin/dashboard')
        handleMenuClose()
    }

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'red-400';
            case 'medium':
                return 'yellow-400';
            case 'low':
                return 'green-400';
            default:
                return 'Blue-400'; // Default color or handle other cases
        }
    };

    const getChartPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return '#ef7070';
            case 'medium':
                return '#facd48';
            case 'low':
                return '#66de81';
            default:
                return 'black'; // Default color or handle other cases
        }
    };

    if (projectLoading || pendingTaskLoading || pendingSubtaskLoading || projectCompletionStatusLoading || radarChartLoading || updateTaskLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }
    console.log(gridApi);
    if (theme === 'theme1') {
        return (
            <>
                {projectData && (
                    <ProjectDetailMUI
                        value={value}
                        setValue={setValue}
                        gridApi={gridApi}
                        setGridApi={setGridApi}
                        anchorEl={anchorEl}
                        setAnchorEl={setAnchorEl}
                        chevronRotation={chevronRotation}
                        setChevronRotation={setChevronRotation}
                        radarChartData={radarChartData}
                        projectData={projectData}
                        pendingTaskCount={pendingTaskCount}
                        pendingSubtaskCount={pendingSubtaskCount}
                        sparklineData={sparklineData}
                        taskData={taskData}
                        setTaskData={setTaskData}
                        subtaskData={subtaskData}
                        navigate={navigate}
                        handleMenuOpen={handleMenuOpen}
                        handleMenuClose={handleMenuClose}
                        handleChange={handleChange}
                        navigateToAllProject={navigateToAllProject}
                        getPriorityColor={getPriorityColor}
                        getChartPriorityColor={getChartPriorityColor}
                        projectCompletionStatus={projectCompletionStatus}
                        allTaskData={allTaskData}
                        taskCount={taskCount}
                        allSubtaskData={allSubtaskData}
                        subtaskCount={subtaskCount}
                        projectId={projectId}
                    />
                )}
                
            </>
        );
    }

    else if (theme === 'theme2') {
        return (
            projectData && (
                <>
                    <ProjectDetailDaisyUI
                        value={value}
                        setValue={setValue}
                        gridApi={gridApi}
                        setGridApi={setGridApi}
                        anchorEl={anchorEl}
                        setAnchorEl={setAnchorEl}
                        chevronRotation={chevronRotation}
                        setChevronRotation={setChevronRotation}
                        projectData={projectData}
                        pendingTaskCount={pendingTaskCount}
                        pendingSubtaskCount={pendingSubtaskCount}
                        sparklineData={sparklineData}
                        taskData={taskData}
                        subtaskData={subtaskData}
                        radarChartData={radarChartData}
                        navigate={navigate}
                        handleMenuOpen={handleMenuOpen}
                        handleMenuClose={handleMenuClose}
                        handleChange={handleChange}
                        navigateToAllProject={navigateToAllProject}
                        getPriorityColor={getPriorityColor}
                        getChartPriorityColor={getChartPriorityColor}
                        projectCompletionStatus={projectCompletionStatus}
                    />
                </>
            )
        );
    } else {
        // Handle unsupported theme
        return null;
    }
}

export default ProjectDetail;
