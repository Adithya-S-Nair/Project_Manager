import React, { useContext, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ProjectStatusChart from './ProjectStatusChart';
import RadarChart from './RadarChart'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DatagridComponent from './DatagridComponent';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SparkLineChart from './SparkLineChart';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditModalMUI from './EditModalMUI'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { makeRequest } from '../Axios';
import TextField from '@mui/material/TextField';
import { useMediaQuery } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import { useNavigate } from 'react-router-dom';
import WorkProgress from '../Pages/Admin/WorkProgress';
import { useEffect } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useQuery, useQueryClient } from 'react-query';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ProjectDetailDaisyUiUser = ({ value, setValue, projectData, gridApi, setGridApi, anchorEl, setAnchorEl, chevronRotation, setChevronRotation, radarChartData, userPriorityTaskCount, userPrioritySubtaskCount, userPendingTaskCount, userPendingSubtaskCount, sparklineData, navigate, taskData, setTaskData, createTask, subtaskData, handleMenuOpen, handleMenuClose, handleChange, navigateToAllProject, getPriorityColor, getChartPriorityColor, projectCompletionStatus, userAllTaskData, userTaskCount, projectId, userAllSubtaskData, userSubtaskCount, userTotalPendingTaskCount, userTotalPendingSubtaskCount, personalPriorityTaskCount, personalPendingTaskCount, personalTotalPendingTaskCount, personalTaskData, personalTaskCount, personalPrioritySubtaskCount, personalPendingSubtaskCount, personalSubtaskCount, personalSubtaskData, personalTotalPendingSubtaskCount }) => {
    const { user } = useContext(AuthContext)
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalEditType, setModalEditType] = useState("")
    const [anchorEls, setAnchorEls] = React.useState(null);
    const [taskNames, setTaskNames] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [filteredTaskData, setFilteredTaskData] = useState(taskData);
    const [filteredSubtaskData, setFilteredSubtaskData] = useState(subtaskData);
    const [currentTab, setCurrentTab] = useState(0);
    const isMobile = useMediaQuery('(max-width:1080px)');
    const [type, setType] = useState('');
    const [updater, setUpdater] = useState(0);

    // const navigates = useNavigate();
    const open = Boolean(anchorEls);
    const handleClick = (event) => {
        setAnchorEls(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEls(null);
    };

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
        setCurrentTab(newValue); // Update the current tab index when the tab is changed
    };

    console.log(currentTab);
    const [selectedTask, setSelectedTask] = useState(null);

    const handleSelectedTask = (task, selectedNodes) => {
        console.log(task);
        setSelectedTask(task);
        // console.log(selectedNodes[0]);
        setTableData(selectedNodes[0])

    };
    // console.log(selectedTask);
    const taskId = tableData ? Object.keys(tableData) : null;

    if (taskId) {
        console.log(taskId[0]);
    }
    // console.log(taskNames);
    const handleEditModalOpen = (type) => {
        setModalEditType(type)
        if (type === "assignedTask") {
            makeRequest.post(`/task/gettasknamebyid`, selectedTask)
                .then((res) => {
                    console.log(res.data);
                    setTaskNames(res.data);
                }).catch((error) => {
                    console.log(error);
                })


            makeRequest.get('/employee/getallemployees')
                .then((res) => {
                    setEmployeeName(res.data);
                }).catch((error) => {
                    console.log(error);
                })
        }
        else if (type === "editTask") {

        } else if (type === "deleteTask") {
            makeRequest.post(`/task/gettasknamebyid`, selectedTask)
                .then((res) => {
                    setTaskNames(res.data);
                }).catch((error) => {
                    console.log(error);
                })
        } else if (type == "assignedSubtask") {
            console.log(selectedTask);
            makeRequest.post(`/subtask/getsubtasknamebyid`, selectedTask)
                .then((res) => {
                    console.log("hii");
                    setTaskNames(res.data);
                }).catch((error) => {
                    console.log(error);
                })

            makeRequest.get('/employee/getallemployees')
                .then((res) => {
                    setEmployeeName(res.data);
                }).catch((error) => {
                    console.log(error);
                })

        } else if (type == "editSubtask") {

        } else if (type === "deleteSubtask") {
            makeRequest.post(`/subtask/getsubtasknamebyid`, selectedTask)
                .then((res) => {
                    setTaskNames(res.data);
                }).catch((error) => {
                    console.log(error);
                })
        } else if (type === "assignedProject") {
            makeRequest.get('/employee/getallemployees')
                .then((res) => {
                    setEmployeeName(res.data);
                }).catch((error) => {
                    console.log(error);
                })
        } else if (type === "createPersonalTask") {

        }
        setEditModalOpen(true);
    };

    const handleEditModalClose = () => setEditModalOpen(false);

    const handleSearchInput = (event, tabIndex) => {
        console.log(tabIndex);
        const searchKey = event.target.value;

        let dataToFilter = null;
        console.log(subtaskData);

        // Determine which data to filter based on the tab index
        if (tabIndex === 0) {
            dataToFilter = taskData;
        } else if (tabIndex === 1) {
            dataToFilter = subtaskData;
        }

        // Perform filtering
        const filteredData = dataToFilter.filter((item) => {
            return Object.values(item).some(
                (field) =>
                    field &&
                    field.toString().toLowerCase().includes(searchKey.toLowerCase())
            );
        });
        console.log(filteredData);
        // Update the filtered data based on the active tab
        if (tabIndex === 0) {
            setFilteredTaskData(filteredData);
        } else if (tabIndex === 1) {
            setFilteredSubtaskData(filteredData);
        }
    };
    // console.log(gridApi);
    const handleTaskDataClick = (choice) => {
        // console.log(gridApi);
        setType(choice);
        navigate(`/user/workprogress/${projectId}/${choice}`)
    }

    const handleSubtaskDataClick = (choice) => {
        // console.log(gridApi);
        setType('sub' + choice);
        navigate(`/user/workprogress/${projectId}/subtask${choice}`)
    }

    const handlePersonalTaskDataClick = (choice) => {
        // console.log(gridApi);
        setType(choice);
        navigate(`/user/workprogress/${projectId}/personalTask${choice}`)
    }

    const handlePersonalSubtaskDataClick = (choice) => {
        // console.log(gridApi);
        setType('sub' + choice);
        navigate(`/user/workprogress/${projectId}/personalSubtask${choice}`)
    }

    return (
        <>
            <div className="mb-5">
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleMenuOpen}>
                    <h1 className='text-4xl font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight'>{projectData.project_name}</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-4 h-4 transform ${chevronRotation === 180 ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
                <hr className='mb-2' />

                {/* Material-UI Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={navigateToAllProject}>See all projects</MenuItem>
                    {user.user_type === 'Admin' &&
                        <MenuItem onClick={handleMenuClose}>Add a project</MenuItem>
                    }
                    {/* Add more menu items as needed */}
                </Menu>
            </div>
            <div className='flex flex-col md:flex-row gap-4' style={{ width: '100%' }}>
                <div className="flex-grow md:w-2/3">
                    <div className='card card-compact shadow-xl w-full' style={{ height: isMobile ? 'auto' : '28em' }}>
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <h2 className='text-xl font-bold'>Project Details</h2>
                                {user.user_type === 'Admin' &&
                                    < div className='flex items-center gap-2'>
                                        <Tooltip title="Assign Project">
                                            <IconButton aria-label="Edit" onClick={() => { handleEditModalOpen("assignedProject") }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                                </svg>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit Project Details">
                                            <IconButton aria-label="Edit" onClick={() => { handleEditModalOpen("project") }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 font-bold">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                </svg>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                }
                                {user.user_type === 'Users' &&
                                    < div className='flex items-center '>
                                        <Tooltip title="Create Personal Task">
                                            <IconButton aria-label="Edit" onClick={() => { handleEditModalOpen("createPersonalTask") }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Create Personal Subtask">
                                            <IconButton aria-label="Edit" onClick={() => { handleEditModalOpen("createPersonalTask") }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                }
                            </div>
                            <hr className='mt-2 mb-2' />
                            <div className="flex justify-between">
                                <div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Project Manager :</span> Mr. Xyx
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Project Start Date :</span> {moment(projectData.project_start_date).format('DD-MMM-YYYY')}
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Project End Date :</span> {moment(projectData.project_end_date).format('DD-MMM-YYYY')}
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Actual Start Date :</span> {moment(projectData.actual_start_date).format('DD-MMM-YYYY')}
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Actual End Date :</span> {moment(projectData.actual_end_date).format('DD-MMM-YYYY')}
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Assigned Team :</span> Team 07
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Project Description :</span> {projectData.project_description}
                                        <hr />
                                    </div>
                                </div>
                                <RadarChart data={radarChartData} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:w-1/3">
                    <div className="card card-compact w-full shadow-xl" style={{ height: '28em' }}>
                        <div className='card-body'>
                            <h2 className='text-xl font-bold'>Completion Status</h2>
                            <hr className='mt-2 mb-2' />
                            <div className="flex justify-center items-center">
                                <div className="completion-graph">
                                    <ProjectStatusChart data={projectCompletionStatus} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <>
                <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <h2 className='text-xl font-bold'>Personal Task Status</h2>
                        </div>
                        <hr className='mt-2 mb-2' />
                        <div className="grid grid-cols-2 gap-6">
                            {personalPriorityTaskCount && personalPriorityTaskCount.map((personalPriorityTaskCount) => (
                                <div key={updater} style={{ width: 'auto' }} className='card card-compact shadow-xl cursor-pointer' onClick={() => handlePersonalTaskDataClick(personalPriorityTaskCount.Priority)} >
                                    <div className='card-body'>
                                        <div className="flex items-center justify-between">
                                            <h2 className='text-xl font-bold' style={{ color: getChartPriorityColor(personalPriorityTaskCount.Priority) }}>
                                                {`${personalPriorityTaskCount.Priority} Priority Task`}
                                            </h2>
                                        </div>
                                        <hr className='mt-2 mb-2' />
                                        <div className="flex items-center justify-between">
                                            <div className='grid grid-cols-1 gap-1'>
                                                <h2 className='text-xs font-light' style={{ color: getChartPriorityColor(personalPriorityTaskCount.Priority) }}>
                                                    TOTAL {personalPriorityTaskCount.Priority.toUpperCase()} PERSONAL TASK COUNT: {personalPriorityTaskCount.task_count}
                                                </h2>
                                                <h2 className='text-xs font-light' style={{ color: getChartPriorityColor(personalPriorityTaskCount.Priority) }}>
                                                    {personalPriorityTaskCount.Priority === 'Low' &&
                                                        <>
                                                            TOTAL PENDING PERSONAL TASK COUNT:{personalPendingTaskCount[0].pending_count}
                                                        </>
                                                    }
                                                    {personalPriorityTaskCount.Priority === 'Medium' &&
                                                        <>
                                                            TOTAL PENDING PERSONAL TASK COUNT:{personalPendingTaskCount[1].pending_count}
                                                        </>
                                                    }
                                                    {personalPriorityTaskCount.Priority === 'High' &&
                                                        <>
                                                            TOTAL PENDING PERSONAL TASK COUNT:{personalPendingTaskCount[2].pending_count}
                                                        </>
                                                    }
                                                </h2>
                                            </div>
                                            <SparkLineChart data={sparklineData} color={getChartPriorityColor(personalPriorityTaskCount.Priority)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {personalTaskData &&
                                <div className='card card-compact shadow-xl cursor-pointer' style={{ width: 'auto' }} onClick={() => handlePersonalTaskDataClick('data')}>
                                    <div className='card-body'>
                                        <div className="flex items-center justify-between">
                                            <h2 className={`text-xl font-bold text-blue-800`}>
                                                {`All Personal Tasks`}
                                            </h2>
                                        </div>
                                        <hr className='mt-2 mb-2' />
                                        <div className="flex items-center justify-between">
                                            <div className='grid grid-cols-1 gap-1'>
                                                <h2 className='text-xs font-light text-blue-800'>
                                                    TOTAL PERSONAL TASK COUNT: {personalTaskCount}
                                                </h2>
                                                <h2 className='text-xs font-light text-blue-800'>
                                                    TOTAL PENDING PERSONAL TASK COUNT: {personalTotalPendingTaskCount.pending_task_count}
                                                </h2>
                                            </div>
                                            <SparkLineChart data={sparklineData} color={'blue'} />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div >

                <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <h2 className='text-xl font-bold'>Personal Subtask Status</h2>
                        </div>
                        <hr className='mt-2 mb-2' />
                        <div className="grid grid-cols-2 gap-6">
                            {personalPrioritySubtaskCount.map((personalPrioritySubtaskCount) => (
                                <div key={personalPrioritySubtaskCount.Priority} className='card card-compact shadow-xl cursor-pointer' style={{ width: 'auto' }} onClick={() => handlePersonalSubtaskDataClick(personalPrioritySubtaskCount.Priority)} >
                                    <div className='card-body'>
                                        <div className="flex items-center justify-between">
                                            <h2 className='text-xl font-bold' style={{ color: getChartPriorityColor(personalPrioritySubtaskCount.Priority) }}>
                                                {`${personalPrioritySubtaskCount.Priority} Priority Subtask`}
                                            </h2>
                                        </div>
                                        <hr className='mt-2 mb-2' />
                                        <div className="flex items-center justify-between">
                                            <div className='grid grid-cols-1 gap-1'>
                                                <h2 className='text-xs font-light' style={{ color: getChartPriorityColor(personalPrioritySubtaskCount.Priority) }}>
                                                    TOTAL PERSONAL SUBTASK COUNT: {personalPrioritySubtaskCount.subtask_count}
                                                </h2>
                                                <h2 className='text-xs font-light' style={{ color: getChartPriorityColor(personalPrioritySubtaskCount.Priority) }}>
                                                    {personalPrioritySubtaskCount.Priority === 'Low' &&
                                                        <>
                                                            TOTAL PENDING PERSONAL SUBTASK COUNT:{personalPendingSubtaskCount[0].pending_count}
                                                        </>
                                                    }
                                                    {personalPrioritySubtaskCount.Priority === 'Medium' &&
                                                        <>
                                                            TOTAL PENDING PERSONAL SUBTASK COUNT:{personalPendingSubtaskCount[1].pending_count}
                                                        </>
                                                    }
                                                    {personalPrioritySubtaskCount.Priority === 'High' &&
                                                        <>
                                                            TOTAL PENDING PERSONAL SUBTASK COUNT:{personalPendingSubtaskCount[2].pending_count}
                                                        </>
                                                    }
                                                </h2>
                                            </div>
                                            <SparkLineChart data={sparklineData} color={getChartPriorityColor(personalPrioritySubtaskCount.Priority)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {personalSubtaskData &&
                                <div className='card card-compact shadow-xl cursor-pointer' style={{ width: 'auto' }} onClick={() => handlePersonalSubtaskDataClick('data')}>
                                    <div className='card-body'>
                                        <div className="flex items-center justify-between">
                                            <h2 className={`text-xl font-bold text-blue-800`}>
                                                {'All Personal Subtasks'}
                                            </h2>
                                        </div>
                                        <hr className='mt-2 mb-2' />
                                        <div className="flex items-center justify-between">
                                            <div className='grid grid-cols-1 gap-1'>
                                                <h2 className='text-xs font-light text-blue-800'>
                                                    TOTAL PERSONAL SUBTASK COUNT: {personalSubtaskCount}
                                                </h2>
                                                {userTotalPendingSubtaskCount &&
                                                    <h2 className='text-xs font-light text-blue-800'>
                                                        TOTAL PENDING PERSONAL SUBTASK COUNT: {personalTotalPendingSubtaskCount.pending_subtask_count}
                                                    </h2>
                                                }
                                            </div>
                                            <SparkLineChart data={sparklineData} color={'blue'} />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </>

            <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className='text-xl font-bold'>Task Status</h2>
                    </div>
                    <hr className='mt-2 mb-2' />
                    <div className="grid grid-cols-2 gap-6">
                        {userPriorityTaskCount && userPriorityTaskCount.map((userPriorityTaskCount) => (
                            <div style={{ width: 'auto' }} className='card card-compact shadow-xl cursor-pointer' onClick={() => handleTaskDataClick(userPriorityTaskCount.Priority)} >
                                <div className='card-body'>
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-xl font-bold' style={{ color: getChartPriorityColor(userPriorityTaskCount.Priority) }}>
                                            {`${userPriorityTaskCount.Priority} Priority Task`}
                                        </h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <div className='grid grid-cols-1 gap-1'>
                                            <h2 className='text-xs font-light' style={{ color: getChartPriorityColor(userPriorityTaskCount.Priority) }}>
                                                TOTAL {userPriorityTaskCount.Priority.toUpperCase()} TASK COUNT: {userPriorityTaskCount.task_count}
                                            </h2>
                                            <h2 className='text-xs font-light' style={{ color: getChartPriorityColor(userPriorityTaskCount.Priority) }}>
                                                {userPriorityTaskCount.Priority === 'Low' &&
                                                    <>
                                                        TOTAL PENDING TASK COUNT:{userPendingTaskCount[0].pending_count}
                                                    </>
                                                }
                                                {userPriorityTaskCount.Priority === 'Medium' &&
                                                    <>
                                                        TOTAL PENDING TASK COUNT:{userPendingTaskCount[1].pending_count}
                                                    </>
                                                }
                                                {userPriorityTaskCount.Priority === 'High' &&
                                                    <>
                                                        TOTAL PENDING TASK COUNT:{userPendingTaskCount[2].pending_count}
                                                    </>
                                                }
                                            </h2>
                                        </div>
                                        <SparkLineChart data={sparklineData} color={getChartPriorityColor(userPriorityTaskCount.Priority)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {userAllTaskData &&
                            <div className='card card-compact shadow-xl cursor-pointer' style={{ width: 'auto' }} onClick={() => handleTaskDataClick('alltaskdata')}>
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-xl font-bold text-blue-800`}>
                                            {`All Tasks`}
                                        </h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <div className='grid grid-cols-1 gap-1'>
                                            <h2 className='text-xs font-light text-blue-800'>
                                                TOTAL TASK COUNT: {userTaskCount}
                                            </h2>
                                            <h2 className='text-xs font-light text-blue-800'>
                                                TOTAL PENDING TASK COUNT: {userTotalPendingTaskCount.total_pending_tasks}
                                            </h2>
                                        </div>
                                        <SparkLineChart data={sparklineData} color={'blue'} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {/* Pending subtask status */}

            <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className='text-xl font-bold'>Subtask Status</h2>
                    </div>
                    <hr className='mt-2 mb-2' />
                    <div className="grid grid-cols-2 gap-6">
                        {userPrioritySubtaskCount.map((userPrioritySubtaskCount) => (
                            <div key={userPrioritySubtaskCount.Priority} className='card card-compact shadow-xl cursor-pointer' style={{ width: 'auto' }} onClick={() => handleSubtaskDataClick(userPrioritySubtaskCount.Priority)} >
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-xl font-bold' style={{ color: getChartPriorityColor(userPrioritySubtaskCount.Priority) }}>
                                            {`${userPrioritySubtaskCount.Priority} Priority Subtask`}
                                        </h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <div className='grid grid-cols-1 gap-1'>
                                            <h2 className='text-xs font-light' style={{ color: getChartPriorityColor(userPrioritySubtaskCount.Priority) }}>
                                                TOTAL SUBTASK COUNT: {userPrioritySubtaskCount.subtask_count}
                                            </h2>
                                            <h2 className='text-xs font-light' style={{ color: getChartPriorityColor(userPrioritySubtaskCount.Priority) }}>
                                                {userPrioritySubtaskCount.Priority === 'Low' &&
                                                    <>
                                                        TOTAL PENDING SUBTASK COUNT:{userPendingSubtaskCount[0].pending_count}
                                                    </>
                                                }
                                                {userPrioritySubtaskCount.Priority === 'Medium' &&
                                                    <>
                                                        TOTAL PENDING SUBTASK COUNT:{userPendingSubtaskCount[1].pending_count}
                                                    </>
                                                }
                                                {userPrioritySubtaskCount.Priority === 'High' &&
                                                    <>
                                                        TOTAL PENDING SUBTASK COUNT:{userPendingSubtaskCount[2].pending_count}
                                                    </>
                                                }
                                            </h2>
                                        </div>
                                        <SparkLineChart data={sparklineData} color={getChartPriorityColor(userPrioritySubtaskCount.Priority)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {userAllSubtaskData &&
                            <div className='card card-compact shadow-xl cursor-pointer' style={{ width: 'auto' }} onClick={() => handleSubtaskDataClick('allsubtaskdata')}>
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-xl font-bold text-blue-800`}>
                                            {'All Subtasks'}
                                        </h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <div className='grid grid-cols-1 gap-1'>
                                            <h2 className='text-xs font-light text-blue-800'>
                                                TOTAL SUBTASK COUNT: {userSubtaskCount}
                                            </h2>
                                            {userTotalPendingSubtaskCount &&
                                                <h2 className='text-xs font-light text-blue-800'>
                                                    TOTAL PENDING SUBTASK COUNT: {userTotalPendingSubtaskCount.pending_subtask_count}
                                                </h2>
                                            }
                                        </div>
                                        <SparkLineChart data={sparklineData} color={'blue'} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {
                projectData &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    projectData={projectData}
                    setUpdater={setUpdater}
                />
            }
            {
                modalEditType === "assignedProject" &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    projectData={projectData}
                    employeeName={employeeName}

                />
            }
            {
                modalEditType === "createPersonalTask" &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    projectId={projectId}
                />
            }

        </>
    )
}

export default ProjectDetailDaisyUiUser