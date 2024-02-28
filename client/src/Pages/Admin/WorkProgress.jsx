import React from 'react'
import PageTitle from '../../Components/PageTitle'
import DatagridComponent from '../../Components/DatagridComponent';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { makeRequest } from '../../Axios';
// import ProjectDetailMUI from '../../Components/ProjectDetailMUI';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import ProjectStatusChart from './ProjectStatusChart';
// import RadarChart from './RadarChart'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import SparkLineChart from './SparkLineChart';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditModalMUI from '../../Components/EditModalMUI';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextField from '@mui/material/TextField';
import { useMediaQuery } from '@mui/material';
import { useEffect } from 'react';

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


const WorkProgress = () => {

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalEditType, setModalEditType] = useState("")
    const [anchorEls, setAnchorEls] = React.useState(null);
    const [taskNames, setTaskNames] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [filteredTaskData, setFilteredTaskData] = useState();
    const [filteredSubtaskData, setFilteredSubtaskData] = useState();
    const [currentTab, setCurrentTab] = useState(0);
    const isMobile = useMediaQuery('(max-width:1080px)');
    const { projectId, type } = useParams();
    const [gridApi, setGridApi] = useState(null);
    const open = Boolean(anchorEls);
    const [value, setValue] = useState(0);
    const [taskData, setTaskData] = useState();
    const [subtaskData, setSubtaskData] = useState();

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
        }
        else if (type === "assignedProject") {
            makeRequest.get('/employee/getallemployees')
                .then((res) => {
                    setEmployeeName(res.data);
                }).catch((error) => {
                    console.log(error);
                })
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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { data: projectData, error: projectError, isLoading: projectLoading } = useQuery(['project', projectId], async () => {
        const response = await makeRequest.get(`/project/getproject/${projectId}`);

        return response.data;
    });


    useEffect(() => {
        window.scrollTo(0, 0);
        if (type === 'alltaskdata') {
            makeRequest.get(`/task/getprojecttaskbyid/${projectId}`)
                .then((res) => {
                    setTaskData(res.data)
                    setFilteredTaskData(res.data);
                }).catch((error) => {
                    console.log(error);
                })
        } else if (type === 'High' || type === 'Medium' || type === 'Low') {
            console.log(type);
            makeRequest.get(`/task/getprojectprioritybasedtask/${projectId}/${type}`)
                .then((res) => {
                    setTaskData(res.data)
                    setFilteredTaskData(res.data);
                }).catch((error) => {
                    console.log(error);
                })
        } else if (type === 'subtaskallsubtaskdata') {
            makeRequest.get(`/subtask/getprojectsubtaskbyprojectid/${projectId}`)
                .then((res) => {
                    setSubtaskData(res.data)
                    setFilteredSubtaskData(res.data);
                }).catch((error) => {
                    console.log(error);
                })
        } else if (type === 'subtaskHigh' || type === 'subtaskMedium' || type === 'subtaskLow') {
            const choice = type.slice(7);
            console.log(choice);
            makeRequest.get(`/subtask/getprojectprioritybasedsubtask/${projectId}/${choice}`)
                .then((res) => {
                    setSubtaskData(res.data)
                    setFilteredSubtaskData(res.data);
                }).catch((error) => {
                    console.log(error);
                })
        }
    }, [])

    const titleIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 font-bold"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
            />
        </svg>
    );


    return (
        <div>
            {taskData &&
                <PageTitle titleText='All Task Data' titleIcon={titleIcon} />
            }
            {subtaskData &&
                <PageTitle titleText='All Subtask Data' titleIcon={titleIcon} />
            }
            <Card className='mt-5' style={{ width: '100%' }}>
                <CardContent>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <div className='flex items-center justify-between'>
                                {/* <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">

                                    <Tab label="Project" {...a11yProps(0)} />
                                    <Tab label="Task" {...a11yProps(1)} />
                                    <Tab label="Sub Task" {...a11yProps(2)} />

                                </Tabs> */}
                                <div>
                                    {/* {currentTab && currentTab === 0
                                        ? */}
                                    <TextField
                                        sx={{ mb: 1, width: '15em', paddingY: '5px' }}
                                        label="Search"
                                        // value={taskData}
                                        InputProps={{
                                            style: { height: '40px' }
                                        }}
                                        onChange={(event) => handleSearchInput(event, currentTab)}
                                    />
                                    {/* :
                                        <TextField
                                            sx={{ mb: 1, width: '15em', paddingY: '5px' }}
                                            label="Search"
                                            // value={taskData}
                                            InputProps={{
                                                style: { height: '40px' }
                                            }}
                                            onChange={(event) => handleSearchInput(event, currentTab)}
                                        />

                                    } */}
                                </div>
                                <div>
                                    {taskId && taskId[0] === "task_id"
                                        ?
                                        <>
                                            <IconButton onClick={handleClick}>
                                                <MoreVertIcon className='mt-1' />
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
                                                <MoreVertIcon className='mt-1' />
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
                                data={projectData}
                                columnDefs={projectColumns}
                                handleSelectedTask={handleSelectedTask}
                            />
                        </CustomTabPanel> */}
                        {type === 'alltaskdata' &&
                            // <CustomTabPanel value={value} index={0}>
                            <DatagridComponent
                                key={value}
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={filteredTaskData}
                                columnDefs={taskColumns}
                                handleSelectedTask={handleSelectedTask}

                            />
                            // </CustomTabPanel>
                        }
                        {type === 'High' &&
                            // <CustomTabPanel value={value} index={0}>
                            <DatagridComponent
                                key={value}
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={filteredTaskData}
                                columnDefs={taskColumns}
                                handleSelectedTask={handleSelectedTask}

                            />
                            // </CustomTabPanel>
                        }
                        {type === 'Medium' &&
                            // <CustomTabPanel value={value} index={0}>
                            <DatagridComponent
                                key={value}
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={filteredTaskData}
                                columnDefs={taskColumns}
                                handleSelectedTask={handleSelectedTask}

                            />
                            //  </CustomTabPanel> 
                        }
                        {type === 'Low' &&
                            // <CustomTabPanel value={value} index={0}>
                            <DatagridComponent
                                key={value}
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={filteredTaskData}
                                columnDefs={taskColumns}
                                handleSelectedTask={handleSelectedTask}

                            />
                            // </CustomTabPanel>
                        }
                        {type === 'subtaskallsubtaskdata' &&
                            // <CustomTabPanel value={value} index={1}>
                            <DatagridComponent
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={filteredSubtaskData}
                                columnDefs={subtaskColumns}
                                handleSelectedTask={handleSelectedTask}

                            />
                            // </CustomTabPanel>
                        }
                        {type === 'subtaskHigh' &&
                            // <CustomTabPanel value={value} index={1}>
                            <DatagridComponent
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={filteredSubtaskData}
                                columnDefs={subtaskColumns}
                                handleSelectedTask={handleSelectedTask}

                            />
                            // </CustomTabPanel>
                        }
                        {type === 'subtaskMedium' &&
                            // <CustomTabPanel value={value} index={1}>
                            <DatagridComponent
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={filteredSubtaskData}
                                columnDefs={subtaskColumns}
                                handleSelectedTask={handleSelectedTask}

                            />
                            // </CustomTabPanel>
                        }
                        {type === 'subtaskLow' &&
                            // <CustomTabPanel value={value} index={1}>
                            <DatagridComponent
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={filteredSubtaskData}
                                columnDefs={subtaskColumns}
                                handleSelectedTask={handleSelectedTask}

                            />
                            // </CustomTabPanel>
                        }
                    </Box>
                </CardContent>
            </Card >
           
            {
                // taskNames &&
                modalEditType === "assignedTask" &&
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
                modalEditType === "assignedSubtask" && selectedTask && taskNames &&
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
                modalEditType === "editSubtask" &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    selectedTask={selectedTask}
                />
            }
            {
                modalEditType === "deleteSubtask" && selectedTask && taskNames &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    selectedSubtaskId={selectedTask}
                    selectedSubtaskNames={taskNames}
                />
            }
        </div >
    )
}

export default WorkProgress