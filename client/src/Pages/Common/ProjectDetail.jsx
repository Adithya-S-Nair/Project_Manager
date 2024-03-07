import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeContext } from '../../Context/ThemeContext'
import { makeRequest } from '../../Axios';
import { useQuery } from 'react-query';
import CircularProgress from '@mui/material/CircularProgress';
import ProjectDetailMUI from '../../Components/ProjectDetailMUI';
import ProjectDetailDaisyUI from '../../Components/ProjectDetailDaisyUI';
import WorkProgress from '../Admin/WorkProgress';
import { AuthContext } from '../../Context/AuthContext';
import ProjectDetailMUIUser from '../../Components/ProjectDetailMUIUser'


const ProjectDetail = () => {
    const {user} = useContext(AuthContext);
    const { projectId } = useParams();
    const { theme } = useContext(ThemeContext)
    const [value, setValue] = useState(0);
    const [taskData, setTaskData] = useState([]);
    const [allTaskData, setAllTaskData] = useState();
    const [taskCount, setTaskCount] = useState();
    const [userAllTaskData, setUserAllTaskData] = useState();
    const [userTaskCount, setUserTaskCount] = useState();
    const [allSubtaskData, setAllSubtaskData] = useState();
    const [subtaskCount, setSubtaskCount] = useState();
    const [userAllSubtaskData, setUserAllSubtaskData] = useState();
    const [userSubtaskCount, setUserSubtaskCount] = useState();
    const [gridApi, setGridApi] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [chevronRotation, setChevronRotation] = useState(0);
    console.log(user);
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

    const { data: prioritySubtaskCount, error: prioritySubtaskError, isLoading: prioritySubtaskLoading } = useQuery(
        ['prioritySubtaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/subtask/getprioritysubtaskcount/${projectId}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

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

    const { data: totalPendingSubtaskCount, error: totalPendingSubtaskError, isLoading: totalPendingSubtaskLoading } = useQuery(
        ['totalPendingSubtaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/subtask/gettotalpendingsubtaskcount/${projectId}`);

            return response.data;
        },
        {
            enabled: !!projectData,
        }
    );

    const { data: priorityTaskCount, error: priorityTaskError, isLoading: priorityTaskLoading } = useQuery(
        ['priorityTaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/task/getprioritytaskcount/${projectId}`);
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
            enabled: !!projectData,
        }
    );

    // const { data: totalTaskCount, error: totalTaskError, isLoading: totalTaskLoading } = useQuery(
    //     ['totalTaskCount', projectId],
    //     async () => {
    //         const response = await makeRequest.get(`/task/gettotaltaskcount/${projectId}`);
    //         return response.data;
    //     },
    //     {
    //         enabled: !!projectData, 
    //     }
    // );

    const { data: totalPendingTaskCount, error: totalPendingTaskError, isLoading: totalPendingTaskLoading } = useQuery(
        ['totalPendingTaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/task/gettotalpendingtaskcount/${projectId}`);
            return response.data;
        },
        {
            enabled: !!projectData,
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

    const { data: userPriorityTaskCount, error: userPriorityTaskError, isLoading: userPriorityTaskLoading } = useQuery(
        ['priorityTaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/task/getuserprioritytaskcount/${projectId}/${user.user_id}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );
    
    const { data: userPendingTaskCount, error: userPendingTaskError, isLoading: userPendingTaskLoading } = useQuery(
        ['UserPendingTaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/task/getuserpendingtaskcount/${projectId}/${user.user_id}`);
            return response.data;
        },
        {
            enabled: !!projectData,
        }
    );

    const { data: getUserAllTaskData, error: getUserAllTaskDataError, isLoading: getUserAllTaskDataLoading } = useQuery(
        ['UserAllTaskData', projectId],
        async () => {
            const response = await makeRequest.get(`/task/getprojecttasks/${projectId}`);
            setUserTaskCount(response.data.taskCount)
            setUserAllTaskData(response.data.tasks);
            // console.log(response.data.tasks);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: userTotalPendingTaskCount, error: userTotalPendingTaskError, isLoading: userTotalPendingTaskLoading } = useQuery(
        ['UserTotalPendingTaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/task/getusertotalpendingtaskcount/${projectId}/${user.user_id}`);
            return response.data;
        },
        {
            enabled: !!projectData,
        }
    );

    const { data: userPrioritySubtaskCount, error: userPrioritySubtaskError, isLoading: userPrioritySubtaskLoading } = useQuery(
        ['UserPrioritySubtaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/subtask/getuserprioritysubtaskcount/${projectId}/${user.user_id}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: userPendingSubtaskCount, error: userPendingSubtaskError, isLoading: userPendingSubtaskLoading } = useQuery(
        ['UserPendingSubtaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/subtask/getuserpendingsubtaskcount/${projectId}/${user.user_id}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: getUserAllSubtaskData, error: getUserAllSubtaskDataError, isLoading: getUserAllSubtaskDataLoading } = useQuery(
        ['UserAllSubtaskData', projectId],
        async () => {
            const response = await makeRequest.get(`/subtask/getuserprojectsubtasks/${projectId}/${user.user_id}`);
            setUserSubtaskCount(response.data.subtaskCount)
            setUserAllSubtaskData(response.data.subtasks);
            // console.log(response.data.tasks);
            return response.data;
        },
        {
            enabled: !!projectData && user.user_type==='Users', // Only fetch if projectData is available
        }
    );

    const { data: userTotalPendingSubtaskCount, error: userTotalPendingSubtaskError, isLoading: userTotalPendingSubtaskLoading } = useQuery(
        ['UserTotalPendingSubtaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/subtask/getusertotalpendingsubtaskcount/${projectId}/${user.user_id}`);

            return response.data;
        },
        {
            enabled: !!projectData,
        }
    );

    if (projectError || userPrioritySubtaskError  || getUserAllSubtaskDataError || userTotalPendingSubtaskError || pendingTaskError || userTotalPendingTaskError || getUserAllTaskDataError || userPriorityTaskError || totalPendingSubtaskLoading || totalPendingSubtaskError || totalPendingTaskError || priorityTaskError || prioritySubtaskError || pendingSubtaskError || projectCompletionStatusError || radarChartError || taskDataError || updateTaskError) {
        console.error('Error fetching data:', projectError || pendingTaskError || getUserAllSubtaskDataError || userTotalPendingTaskError || getUserAllTaskDataError || userPriorityTaskError || totalPendingSubtaskError || totalPendingTaskError || priorityTaskError || userTotalPendingSubtaskError || pendingSubtaskError || prioritySubtaskError || projectCompletionStatusError || radarChartError || updateTaskError);
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
                return 'green-800';
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

    if (userPrioritySubtaskLoading || userTotalPendingSubtaskLoading || getUserAllSubtaskDataLoading || getUserAllTaskDataLoading || userTotalPendingTaskLoading || projectLoading || pendingTaskLoading || totalPendingTaskLoading || taskDataLoading || priorityTaskLoading || prioritySubtaskLoading || pendingSubtaskLoading || projectCompletionStatusLoading || radarChartLoading || updateTaskLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }
    console.log(gridApi);
    if (theme === 'theme1' && user.user_type === 'Admin') {
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
                        priorityTaskCount={priorityTaskCount}
                        prioritySubtaskCount={prioritySubtaskCount}
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
                        totalPendingTaskCount={totalPendingTaskCount}
                        totalPendingSubtaskCount={totalPendingSubtaskCount}
                    />
                )}

            </>
        );
    }

    else if (theme === 'theme2' && user.user_type === 'Admin') {
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
                        priorityTaskCount={priorityTaskCount}
                        prioritySubtaskCount={prioritySubtaskCount}
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
                        allTaskData={allTaskData}
                        taskCount={taskCount}
                        allSubtaskData={allSubtaskData}
                        subtaskCount={subtaskCount}
                        projectId={projectId}
                        pendingTaskCount={pendingTaskCount}
                        pendingSubtaskCount={pendingSubtaskCount}
                        totalPendingTaskCount={totalPendingTaskCount}
                        totalPendingSubtaskCount={totalPendingSubtaskCount}
                    />
                </>
            )
        );
    } else if (theme === 'theme1' && user.user_type === 'Users' ) {
        return (
            <>
                {projectData && (
                    <ProjectDetailMUIUser
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
                        userPriorityTaskCount={userPriorityTaskCount}
                        userPrioritySubtaskCount={userPrioritySubtaskCount}
                        userPendingTaskCount={userPendingTaskCount}
                        userPendingSubtaskCount={userPendingSubtaskCount}
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
                        userAllTaskData={userAllTaskData}
                        userTaskCount={userTaskCount}
                        userAllSubtaskData={userAllSubtaskData}
                        userSubtaskCount={userSubtaskCount}
                        projectId={projectId}
                        userTotalPendingTaskCount={userTotalPendingTaskCount}
                        userTotalPendingSubtaskCount={userTotalPendingSubtaskCount}
                    />
                )}

            </>
        );
    }
    else {
        // Handle unsupported theme
        return null;
    }
}

export default ProjectDetail;
