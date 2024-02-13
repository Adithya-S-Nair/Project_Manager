import React, { useState } from 'react';
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

const ProjectDetailMUI = ({ value, setValue, projectData, gridApi, setGridApi, anchorEl, setAnchorEl, chevronRotation, setChevronRotation, radarChartData, pendingTaskCount, pendingSubtaskCount, sparklineData, navigate, taskData, createTask, subtaskData, handleMenuOpen, handleMenuClose, handleChange, navigateToAllProject, getPriorityColor, getChartPriorityColor, projectCompletionStatus }) => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalEditType, setModalEditType] = useState("")
    const [anchorEls, setAnchorEls] = React.useState(null);
    const [taskNames, setTaskNames] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);
    const [tableData, setTableData] = useState(null);
    const open = Boolean(anchorEls);
    const handleClick = (event) => {
        setAnchorEls(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEls(null);
    };


    const [selectedTask, setSelectedTask] = useState(null);
    const [taskColumns, setTaskColumns] = useState([
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50
        },
        { colId: '0_1', field: 'task_name', headerName: 'Task Name', hide: false },
        { colId: '1_1', field: 'Priority', headerName: 'Priority', hide: false },
        { colId: '2_1', field: 'task_description', headerName: 'Task Description', hide: false },
        { colId: '3_1', field: 'planned_start_date', headerName: 'Planned Start Date', hide: false },
        { colId: '4_1', field: 'planned_end_date', headerName: 'Planned End Date', hide: false },
        { colId: '5_1', field: 'planned_budget', headerName: 'Planned Budget', hide: false },
        { colId: '6_1', field: 'actual_start_time', headerName: 'Actual Start Time', hide: false },
        { colId: '7_1', field: 'actual_end_time', headerName: 'Actual End Time', hide: false },
        { colId: '8_1', field: 'actual_budget', headerName: 'Actual Budget', hide: false },
        { colId: '9_1', field: 'status', headerName: 'Status', hide: false },
    ])

    const [subtaskColumns, setSubtaskColumns] = useState([
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50
        },
        { colId: '0_1', field: 'subtask_name', headerName: 'Subtask Name', hide: false },
        { colId: '1_1', field: 'Priority', headerName: 'Priority', hide: false },
        { colId: '2_1', field: 'subtask_description', headerName: 'Subtask Description', hide: false },
        { colId: '3_1', field: 'planned_start_date', headerName: 'Planned Start Date', hide: false },
        { colId: '4_1', field: 'planned_end_date', headerName: 'Planned End Date', hide: false },
        { colId: '5_1', field: 'planned_budget', headerName: 'Planned Budget', hide: false },
        { colId: '6_1', field: 'actual_start_time', headerName: 'Actual Start Time', hide: false },
        { colId: '7_1', field: 'actual_end_time', headerName: 'Actual End Time', hide: false },
        { colId: '8_1', field: 'actual_budget', headerName: 'Actual Budget', hide: false },
        { colId: '9_1', field: 'status', headerName: 'Status', hide: false },
    ])

    const handleSelectedTask = (task, selectedNodes) => {
        console.log(task);
        setSelectedTask(task);
        // console.log(selectedNodes[0]);
        setTableData(selectedNodes[0])

    };
    console.log(selectedTask);
    const taskId = tableData ? Object.keys(tableData) : null;

    if (taskId) {
        console.log(taskId[0]);

    }
    // console.log(projectTaskId);
    const handleEditModalOpen = (type) => {
        setModalEditType(type)

        if (type === "assignedTask") {
            makeRequest.post(`/task/getTaskNameById`, selectedTask)
                .then((res) => {
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
        } else if (type === "editTask") {

        } else if (type === "deleteTask") {
            makeRequest.post(`/task/getTaskNameById`, selectedTask)
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

        }
        console.log(modalEditType);
        setEditModalOpen(true);
    };
    console.log(selectedTask);
    console.log(taskNames);

    const handleEditModalClose = () => setEditModalOpen(false);


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
                    <MenuItem onClick={handleMenuClose}>Add a project</MenuItem>
                    {/* Add more menu items as needed */}
                </Menu>
            </div>
            <div className='flex flex-col md:flex-row gap-4' style={{ width: '100%' }}>
                <div className="flex-grow md:w-2/3">
                    <Card className="w-full" style={{ height: '28em' }}>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <h2 className='text-xl font-bold'>Project Details</h2>
                                <Tooltip title="Edit Project Details">
                                    <IconButton aria-label="Edit" onClick={() => { handleEditModalOpen("project") }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 font-bold">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </IconButton>
                                </Tooltip>
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
                        </CardContent>
                    </Card>
                </div>
                <div className="md:w-1/3">
                    <Card style={{ width: '100%', height: '28em' }}>
                        <CardContent>
                            <h2 className='text-xl font-bold'>Completion Status</h2>
                            <hr className='mt-2 mb-2' />
                            <div className="flex justify-center items-center">
                                <div className="completion-graph">
                                    <ProjectStatusChart data={projectCompletionStatus} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div >

            {/* Pending task status */}

            <Card className='mt-5' style={{ width: '100%' }}>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <h2 className='text-xl font-bold'>Pending Task Status</h2>
                    </div>
                    <hr className='mt-2 mb-2' />
                    <div className="flex items-center justify-between p-5">
                        {pendingTaskCount && pendingTaskCount.map((pendingTaskCount) => (
                            <Card style={{ width: 'auto' }}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-xl font-bold text-${getPriorityColor(pendingTaskCount.Priority)}`}>
                                            {`${pendingTaskCount.Priority} Priority Task`}
                                        </h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-4xl font-extrabold text-${getPriorityColor(pendingTaskCount.Priority)}`}>
                                            {pendingTaskCount.pending_count}
                                        </h2>
                                        <SparkLineChart data={sparklineData} color={getChartPriorityColor(pendingTaskCount.Priority)} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Pending subtask status */}

            <Card className='mt-5' style={{ width: '100%' }}>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <h2 className='text-xl font-bold'>Pending Subtask Status</h2>
                    </div>
                    <hr className='mt-2 mb-2' />
                    <div className="flex items-center justify-between p-5">
                        {pendingSubtaskCount.map((pendingSubtaskCount) => (
                            <Card key={pendingSubtaskCount.Priority} style={{ width: 'auto' }}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-xl font-bold text-${getPriorityColor(pendingSubtaskCount.Priority)}`}>
                                            {`${pendingSubtaskCount.Priority} Priority Subtask`}
                                        </h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-4xl font-extrabold text-${getPriorityColor(pendingSubtaskCount.Priority)}`}>
                                            {pendingSubtaskCount.pending_count}
                                        </h2>
                                        <SparkLineChart data={sparklineData} color={getChartPriorityColor(pendingSubtaskCount.Priority)} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className='mt-5' style={{ width: '100%' }}>
                <CardContent>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <div className='flex items-center justify-between'>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">

                                    {/* <Tab label="Show All" {...a11yProps(0)} /> */}
                                    <Tab label="Task" {...a11yProps(1)} />
                                    <Tab label="Sub Task" {...a11yProps(2)} />

                                </Tabs>
                                <div>
                                    {taskId && taskId[0] === "task_id"
                                        ?
                                        <>

                                            <IconButton onClick={handleClick}>
                                                <MoreVertIcon />
                                            </IconButton>

                                            < Menu
                                                id="basic-menu"
                                                anchorEl={anchorEls}
                                                open={open}
                                                onClose={handleClose}
                                                MenuListProps={{
                                                    'aria-labelledby': 'basic-button',
                                                }}
                                            >
                                                <MenuItem onClick={() => { handleEditModalOpen("assignedTask") }}>Assigned Tasks</MenuItem>
                                                {selectedTask && selectedTask.length <= 1 &&
                                                    <MenuItem onClick={() => { handleEditModalOpen("editTask") }}>Edit Tasks</MenuItem>
                                                }
                                                <MenuItem onClick={() => { handleEditModalOpen("deleteTask") }}>Delete Tasks</MenuItem>
                                            </Menu>

                                        </>
                                        :
                                        null
                                    }
                                    {taskId && taskId[0] === "subtask_id"
                                        ?
                                        <>

                                            <IconButton onClick={handleClick}>
                                                <MoreVertIcon />
                                            </IconButton>

                                            < Menu
                                                id="basic-menu"
                                                anchorEl={anchorEls}
                                                open={open}
                                                onClose={handleClose}
                                                MenuListProps={{
                                                    'aria-labelledby': 'basic-button',
                                                }}
                                            >
                                                <MenuItem onClick={() => { handleEditModalOpen("assignedSubtask") }}>Assigned Subtasks</MenuItem>
                                                {selectedTask && selectedTask.length <= 1 &&
                                                    <MenuItem onClick={() => { handleEditModalOpen("editSubtask") }}>Edit Subtasks</MenuItem>
                                                }
                                                <MenuItem onClick={() => { handleEditModalOpen("deleteSubtask") }}>Delete Subtasks</MenuItem>
                                            </Menu>

                                        </>
                                        :
                                        null
                                    }
                                </div>
                            </div>
                        </Box>
                        {/* <CustomTabPanel value={value} index={0}>
                            <DatagridComponent
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={taskData}
                                columnDefs={taskColumns}
                                handleSelectedTask={handleSelectedTask}
                            />

                        </CustomTabPanel> */}
                        <CustomTabPanel value={value} index={0}>
                            <DatagridComponent
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={taskData}
                                columnDefs={taskColumns}
                                handleSelectedTask={handleSelectedTask}

                            />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <DatagridComponent
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={subtaskData}
                                columnDefs={subtaskColumns}
                                handleSelectedTask={handleSelectedTask}

                            />
                        </CustomTabPanel>
                    </Box>
                </CardContent>
            </Card >
            {projectData &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    projectData={projectData}
                />
            }
            {
                taskNames &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    selectedTask={taskNames}
                    employeeName={employeeName}
                />
            }
            {
                modalEditType === "editTask" &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    selectedTask={selectedTask}
                />
            }
            {
                modalEditType === "deleteTask" && selectedTask && taskNames &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    selectedTaskId={selectedTask}
                    selectedTaskNames={taskNames}
                />
            }
            {
                modalEditType === "deleteTask" && selectedTask && taskNames &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    selectedTask={taskNames}
                    employeeName={employeeName}
                />
            }
        </>
    )
}

export default ProjectDetailMUI;
