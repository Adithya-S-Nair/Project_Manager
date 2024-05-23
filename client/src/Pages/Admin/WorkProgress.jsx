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
import { Button, useMediaQuery } from '@mui/material';
import { useEffect } from 'react';
import { useContext } from 'react';
import { ThemeContext } from '../../Context/ThemeContext';
import DatePickerModal from '../../Components/DatePickerModal';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { AuthContext } from '../../Context/AuthContext';

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
    const { user } = useContext(AuthContext)
    const { theme } = useContext(ThemeContext)
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [modalEditType, setModalEditType] = useState("")
    const [anchorEls, setAnchorEls] = React.useState(null);
    const [taskNames, setTaskNames] = useState(null);
    const [employeeName, setEmployeeName] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [filteredTaskData, setFilteredTaskData] = useState();
    const [filteredSubtaskData, setFilteredSubtaskData] = useState();
    const [filteredPersonalTaskData, setFilteredPersonalTaskData] = useState();
    const [filteredPersonalSubtaskData, setFilteredPersonalSubtaskData] = useState();
    const [currentTab, setCurrentTab] = useState(0);
    const isMobile = useMediaQuery('(max-width:1080px)');
    const { projectId, type } = useParams();
    const [gridApi, setGridApi] = useState(null);
    const open = Boolean(anchorEls);
    const [value, setValue] = useState(0);
    const [taskData, setTaskData] = useState();
    const [subtaskData, setSubtaskData] = useState();
    const [personalTaskData, setPersonalTaskData] = useState();
    const [personalSubtaskData, setPersonalSubtaskData] = useState();
    const [changedDataArray, setChangedDataArray] = useState([]);
    const [dateModalOpen, setDateModalOpen] = React.useState(false);
    const [calendarStartDate, setCalendarStartDate] = useState(null)
    const [calendarEndDate, setCalendarEndDate] = useState(null)
    const [activeTab, setActiveTab] = useState('personalTask');

    const handleOpen = () => setDateModalOpen(true);
    console.log(dateModalOpen);

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

    const [personalTaskColumns, setPersonalTaskColumns] = useState([
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50
        },
        { colId: '0_1', field: 'personal_task_name', headerName: 'Personal Task Name', hide: false },
        { colId: '1_1', field: 'Priority', headerName: 'Priority', hide: false },
        { colId: '2_1', field: 'personal_task_description', headerName: 'Personal Task Description', hide: false },
        { colId: '3_1', field: 'planned_start_date', headerName: 'Planned Start Date', hide: false },
        { colId: '4_1', field: 'planned_end_date', headerName: 'Planned End Date', hide: false },
        { colId: '5_1', field: 'planned_budget', headerName: 'Planned Budget', hide: false },
        { colId: '6_1', field: 'actual_start_time', headerName: 'Actual Start Time', hide: false },
        { colId: '7_1', field: 'actual_end_time', headerName: 'Actual End Time', hide: false },
        { colId: '8_1', field: 'actual_budget', headerName: 'Actual Budget', hide: false },
        { colId: '9_1', field: 'status', headerName: 'Status', hide: false },
    ])

    const [personalSubtaskColumns, setPersonalSubtaskColumns] = useState([
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50
        },
        { colId: '0_1', field: 'personalsubtask_name', headerName: 'Personal Subtask Name', hide: false },
        { colId: '1_1', field: 'Priority', headerName: 'Priority', hide: false },
        { colId: '2_1', field: 'personalsubtask_description', headerName: 'Personal Subtask Description', hide: false },
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
        console.log(selectedNodes[0]);
        setTableData(selectedNodes[0]);
    };
    // console.log(selectedTask);
    const taskId = tableData ? Object.keys(tableData) : null;

    useEffect(() => {
        console.log(taskId);
    }, [taskId])
    // console.log(taskNames);
    const handleEditModalOpen = (type) => {
        if (type === "delete") {
            if (tableData.task_id && !tableData.subtask_id) {
                setModalEditType("deleteTask")
                makeRequest.post(`/task/gettasknamebyid`, selectedTask)
                    .then((res) => {
                        setTaskNames(res.data);
                    }).catch((error) => {
                        console.log(error);
                    })
            } else if (tableData.subtask_id) {
                setModalEditType("deleteSubtask")
                makeRequest.post(`/subtask/getsubtasknamebyid`, selectedTask)
                    .then((res) => {
                        setTaskNames(res.data);
                    }).catch((error) => {
                        console.log(error);
                    })
            } else if (!tableData.personalsubtask_id && tableData.personal_task_id) {
                setModalEditType("deletePersonalTask")
                makeRequest.post(`/personaltask/getpersonaltasknamebyid`, selectedTask)
                    .then((res) => {
                        // console.log(res.data);
                        setTaskNames(res.data);
                    }).catch((error) => {
                        console.log(error);
                    })

            } else if (tableData.personalsubtask_id) {
                setModalEditType("deletePersonalSubtask")
                makeRequest.post(`/personalsubtask/getpersonalsubtasknamebyid`, selectedTask)
                    .then((res) => {
                        setTaskNames(res.data);
                    }).catch((error) => {
                        console.log(error);
                    })
            }
        } else {
            setModalEditType(type)
        }
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
            console.log(selectedTask);
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
        } else if (type == "editPersonalTask") {

        } else if (type === "deletePersonalTask") {
            // console.log(selectedTask);
            makeRequest.post(`/personaltask/getpersonaltasknamebyid`, selectedTask)
                .then((res) => {
                    // console.log(res.data);
                    setTaskNames(res.data);
                }).catch((error) => {
                    console.log(error);
                })
        } else if (type == "editPersonalTask") {

        } else if (type === "deletePersonalSubtask") {
            makeRequest.post(`/personalsubtask/getpersonalsubtasknamebyid`, selectedTask)
                .then((res) => {
                    setTaskNames(res.data);
                }).catch((error) => {
                    console.log(error);
                })
        }
        setEditModalOpen(true);
    };
    // console.log(taskNames);
    const handleEditModalClose = () => setEditModalOpen(false);

    const handleSearchInput = (event) => {
        const searchKey = event.target.value;

        let dataToFilter = null;

        if (activeTab === 'personalSubtask') {
            dataToFilter = personalSubtaskData;
        } else if (activeTab === 'personalTask') {
            dataToFilter = personalTaskData;
        } else if (activeTab === 'Task') {
            if (taskData.length > 0) {
                dataToFilter = taskData;
            }
        } else if (activeTab === 'Subtask') {
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

        // Update the filtered data based on the active tab
        if (activeTab === 'personalSubtask') {
            setFilteredPersonalSubtaskData(filteredData);
        } else if (activeTab === 'personalTask') {
            setFilteredPersonalTaskData(filteredData);
        } else if (activeTab === 'Task') {
            setFilteredTaskData(filteredData);
        } else if (activeTab === 'Subtask') {
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
            if (user.user_type === 'Admin') {
                makeRequest.get(`/task/getprojecttasks/${projectId}`)
                    .then((res) => {
                        setTaskData(res.data.tasks)
                        setFilteredTaskData(res.data.tasks);
                        setActiveTab('Task')
                    }).catch((error) => {
                        console.log(error);
                    })
            } else {
                console.log("hiiiiiiiii");
                makeRequest.get(`/task/getusertasks/${projectId}/${user.user_id}`)
                    .then((res) => {
                        setTaskData(res.data)
                        setFilteredTaskData(res.data);
                        setActiveTab('Task')
                    }).catch((error) => {
                        console.log(error);
                    })
            }
        } else if (type === 'High' || type === 'Medium' || type === 'Low') {
            // console.log(type);
            if (user.user_type === 'Admin') {
                makeRequest.get(`/task/getprojectprioritybasedtask/${projectId}/${type}`)
                    .then((res) => {
                        setTaskData(res.data)
                        setFilteredTaskData(res.data);
                        setActiveTab('Task')

                    }).catch((error) => {
                        console.log(error);
                    })
            } else {
                makeRequest.get(`/task/getuserprojectprioritybasedtask/${projectId}/${type}/${user.user_id}`)
                    .then((res) => {
                        setTaskData(res.data)
                        setFilteredTaskData(res.data);
                        setActiveTab('Task')

                    }).catch((error) => {
                        console.log(error);
                    })
            }
        } else if (type === 'subtaskallsubtaskdata') {
            if (user.user_type === 'Admin') {
                makeRequest.get(`/subtask/getprojectsubtaskbyprojectid/${projectId}`)
                    .then((res) => {
                        setSubtaskData(res.data)
                        setFilteredSubtaskData(res.data);
                        setActiveTab('Subtask')

                    }).catch((error) => {
                        console.log(error);
                    })
            } else {
                makeRequest.get(`/subtask/getuserprojectsubtasks/${projectId}/${user.user_id}`)
                    .then((res) => {
                        setSubtaskData(res.data.subtasks)
                        setFilteredSubtaskData(res.data.subtasks);
                        setActiveTab('Subtask')

                    }).catch((error) => {
                        console.log(error);
                    })
            }
        } else if (type === 'subtaskHigh' || type === 'subtaskMedium' || type === 'subtaskLow') {
            const choice = type.slice(7);
            // console.log(choice);
            if (user.user_type === 'Admin') {
                makeRequest.get(`/subtask/getprojectprioritybasedsubtask/${projectId}/${choice}`)
                    .then((res) => {
                        setSubtaskData(res.data)
                        setFilteredSubtaskData(res.data);
                        setActiveTab('Subtask')

                    }).catch((error) => {
                        console.log(error);
                    })
            } else {
                makeRequest.get(`/subtask/getuserprojectprioritybasedsubtask/${projectId}/${choice}/${user.user_id}`)
                    .then((res) => {
                        setSubtaskData(res.data)
                        setFilteredSubtaskData(res.data);
                        setActiveTab('Subtask')

                    }).catch((error) => {
                        console.log(error);
                    })
            }
        } else if (type === 'personalTaskHigh' || type === 'personalTaskMedium' || type === 'personalTaskLow') {
            const choice = type.slice(12);
            console.log(choice);

            makeRequest.get(`/personaltask/getprojectprioritybasedpersonaltask/${projectId}/${choice}`)
                .then((res) => {
                    setPersonalTaskData(res.data)
                    setFilteredPersonalTaskData(res.data);
                    setActiveTab('personalTask')

                }).catch((error) => {
                    console.log(error);
                })
        } else if (type === 'personalTaskdata') {

            makeRequest.get(`/personaltask/getpersonaltasks/${projectId}`)
                .then((res) => {
                    setPersonalTaskData(res.data.personalTasks)
                    setFilteredPersonalTaskData(res.data.personalTasks);
                    setActiveTab('personalTask')

                }).catch((error) => {
                    console.log(error);
                })
        } else if (type === 'personalSubtaskHigh' || type === 'personalSubtaskMedium' || type === 'personalSubtaskLow') {
            const choice = type.slice(15);
            console.log(choice);

            makeRequest.get(`/personalsubtask/getprojectprioritybasedpersonalsubtask/${projectId}/${choice}`)
                .then((res) => {
                    setPersonalSubtaskData(res.data)
                    setFilteredPersonalSubtaskData(res.data);
                    setActiveTab('personalSubtask')

                }).catch((error) => {
                    console.log(error);
                })
        } else if (type === 'personalSubtaskdata') {
            makeRequest.get(`/personalsubtask/getallpersonalsubtask/${projectId}`)
                .then((res) => {
                    setPersonalSubtaskData(res.data.personalSubtasks)
                    setFilteredPersonalSubtaskData(res.data.personalSubtasks);
                    setActiveTab('personalSubtask')

                }).catch((error) => {
                    console.log(error);
                })
        }
    }, [])

    // console.log(filteredPersonalTaskData);
    const handleCellValueChanged = (event) => {
        const { data } = event.node;
        const isTaskIdPresent = changedDataArray.some(item => item.task_id === data.task_id);

        if (!isTaskIdPresent) {
            changedDataArray.push(data);
        }
    }

    const handleSaveChanges = () => {
        changedDataArray.map((updateData) => {
            if (updateData.subtask_id) {
                makeRequest.patch(`/subtask/updatesubtaskbyid/${updateData.subtask_id}`, updateData)
            } else if (updateData.task_id) {
                makeRequest.patch(`/task/updatetask/${updateData.task_id}`, updateData)
            } else if (!updateData.personalsubtask_id) {
                makeRequest.patch(`/personaltask/updatepersonaltask/${updateData.personal_task_id}`, updateData)
            } else {
                makeRequest.patch(`/personalsubtask/updatepersonalsubtaskbyid/${updateData.personalsubtask_id}`, updateData)
                console.log(updateData);
            }
        })
    }

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
            {personalTaskData &&
                <PageTitle titleText='Personal Task Data' titleIcon={titleIcon} />
            }
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-x-4 mb-3'>
                            <TextField
                                sx={{ width: '15em', paddingY: '5px' }}
                                label="Search"
                                InputProps={{
                                    style: { height: '40px' }
                                }}
                                onChange={(event) => handleSearchInput(event, currentTab)}
                            />
                            <TextField
                                className='cursor-pointer'
                                sx={{ width: '18em', paddingY: '5px' }}
                                label="Search By Date"
                                InputProps={{
                                    startAdornment: (
                                        <CalendarMonthIcon sx={{ color: 'black', marginRight: '5px' }} />
                                    ),
                                    style: { height: '40px', cursor: 'pointer' }, // Add cursor: pointer here
                                    onClick: handleOpen
                                }}
                                value={calendarStartDate ? `FROM ${moment(calendarStartDate).format('YYYY-MM-DD')} TO ${moment(calendarEndDate).format('YYYY-MM-DD')}` : `FROM YYYY-MM-DD TO YYYY-MM-DD`}
                            // onClick={handleOpen}
                            />
                            {/* <Button sx={{borderColor: 'black',color: 'black'}} variant="outlined" startIcon={<CalendarMonthIcon sx={{color: 'black'}}/>} onClick={handleOpen}>
                                Search By date
                            </Button> */}
                        </div>
                        <div>
                            {theme === 'theme1' ?
                                <>
                                    {selectedTask && selectedTask.length > 0 &&
                                        <>
                                            <IconButton onClick={handleClick}>
                                                <MoreVertIcon className='mt-1' />
                                            </IconButton>
                                            <Menu
                                                id="basic-menu"
                                                anchorEl={anchorEls}
                                                open={open}
                                                onClose={handleClose}
                                                MenuListProps={{
                                                    'aria-labelledby': 'basic-button',
                                                }}
                                            >
                                                {taskId && taskId[0] === "task_id" && user.user_type === 'Admin' &&
                                                    <>
                                                        <MenuItem onClick={() => { handleEditModalOpen("assignedTask") }}>Assigned Tasks</MenuItem>
                                                        {selectedTask && selectedTask.length <= 1 &&
                                                            <MenuItem onClick={() => { handleEditModalOpen("editTask") }}>Edit Tasks</MenuItem>
                                                        }
                                                        <MenuItem onClick={() => { handleEditModalOpen("deleteTask") }}>Delete Tasks</MenuItem>
                                                    </>
                                                }
                                                {taskId && taskId[0] === "subtask_id" && user.user_type === 'Admin' &&
                                                    <>
                                                        <MenuItem onClick={() => { handleEditModalOpen("assignedSubtask") }}>Assigned Subtasks</MenuItem>
                                                        {selectedTask && selectedTask.length <= 1 &&
                                                            <MenuItem onClick={() => { handleEditModalOpen("editSubtask") }}>Edit Subtasks</MenuItem>
                                                        }
                                                        <MenuItem onClick={() => { handleEditModalOpen("deleteSubtask") }}>Delete Subtasks</MenuItem>
                                                    </>
                                                }
                                                {taskId && taskId[0] === "personal_task_id" && 
                                                    <>
                                                        {selectedTask && selectedTask.length <= 1 &&
                                                            <MenuItem onClick={() => { handleEditModalOpen("editPersonalTask") }}>Edit Personal Task</MenuItem>
                                                        }
                                                        <MenuItem onClick={() => { handleEditModalOpen("deletePersonalTask") }}>Delete Personal Task</MenuItem>
                                                    </>
                                                }
                                                {taskId && taskId[0] === "personalsubtask_id" && 
                                                    <>
                                                        {selectedTask && selectedTask.length <= 1 &&
                                                            <MenuItem onClick={() => { handleEditModalOpen("editPersonalSubtask") }}>Edit Personal Subtask</MenuItem>
                                                        }
                                                        <MenuItem onClick={() => { handleEditModalOpen("deletePersonalSubtask") }}>Delete Personal Subtask</MenuItem>
                                                    </>
                                                }
                                            </Menu>
                                        </>
                                    }
                                </> :
                                <>
                                    <IconButton onClick={handleClick}>
                                        <MoreVertIcon className='mt-1' />
                                    </IconButton>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEls}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >

                                        <MenuItem onClick={handleSaveChanges}>Save Changes</MenuItem>
                                        <MenuItem onClick={() => { handleEditModalOpen("delete") }}>Delete</MenuItem>
                                    </Menu>
                                </>}
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
                {type === 'alltaskdata' || type === 'High' || type === 'Low' || type === 'Medium' ? (
                    <>
                        {theme === 'theme1' ? (
                            <DatagridComponent
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={filteredTaskData}
                                columnDefs={taskColumns}
                                handleSelectedTask={handleSelectedTask}
                            />
                        ) :
                            <DatagridComponent
                                key={value}
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={filteredTaskData}
                                columnDefs={taskColumns}
                                type="task"
                                handleSelectedTask={handleSelectedTask}
                                handleCellValueChanged={handleCellValueChanged}
                            />
                        }
                    </>
                ) : (
                    <>
                        {(type === 'subtaskallsubtaskdata' || type === 'subtaskHigh' || type === 'subtaskMedium' || type === 'subtaskLow') ? theme === 'theme1' ? (
                            <DatagridComponent
                                gridApi={gridApi}
                                setGridApi={setGridApi}
                                data={filteredSubtaskData}
                                columnDefs={subtaskColumns}
                                handleSelectedTask={handleSelectedTask}
                            />
                        ) :
                            <>

                                <DatagridComponent
                                    key={value}
                                    gridApi={gridApi}
                                    setGridApi={setGridApi}
                                    data={filteredSubtaskData}
                                    columnDefs={subtaskColumns}
                                    type="subtask"
                                    handleSelectedTask={handleSelectedTask}
                                    handleCellValueChanged={handleCellValueChanged}
                                />

                            </>
                            :
                            <></>
                        }
                        {(type === 'personalTaskdata' || type === 'personalTaskHigh' || type === 'personalTaskMedium' || type === 'personalTaskLow') ? (
                            theme === 'theme1' ? (
                                <DatagridComponent
                                    gridApi={gridApi}
                                    setGridApi={setGridApi}
                                    data={filteredPersonalTaskData}
                                    columnDefs={personalTaskColumns}
                                    handleSelectedTask={handleSelectedTask}
                                />
                            ) : (
                                <DatagridComponent
                                    gridApi={gridApi}
                                    setGridApi={setGridApi}
                                    data={filteredPersonalTaskData}
                                    columnDefs={personalTaskColumns}
                                    type="personaltask"
                                    handleSelectedTask={handleSelectedTask}
                                    handleCellValueChanged={handleCellValueChanged}
                                />
                            )
                        ) : (
                            <>
                                {(type === 'personalSubtaskdata' || type === 'personalSubtaskHigh' || type === 'personalSubtaskMedium' || type === 'personalSubtaskLow') ?
                                    theme === 'theme1' ? (
                                        <DatagridComponent
                                            gridApi={gridApi}
                                            setGridApi={setGridApi}
                                            data={filteredPersonalSubtaskData}
                                            columnDefs={personalSubtaskColumns}
                                            handleSelectedTask={handleSelectedTask}
                                        />
                                    ) : (
                                        <DatagridComponent
                                            gridApi={gridApi}
                                            setGridApi={setGridApi}
                                            data={filteredPersonalSubtaskData}
                                            columnDefs={personalSubtaskColumns}
                                            type="personalsubtask"
                                            handleSelectedTask={handleSelectedTask}
                                            handleCellValueChanged={handleCellValueChanged}
                                        />
                                    )
                                    :
                                    <></>
                                }
                            </>
                        )}
                    </>
                )}


            </Box>

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
                (modalEditType === "deleteTask" || modalEditType === "delete") && selectedTask && taskNames &&
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
            {
                modalEditType === "editPersonalTask" &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    selectedTask={selectedTask}
                />
            }
            {
                modalEditType === "deletePersonalTask" && selectedTask && taskNames &&
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
                modalEditType === "editPersonalSubtask" &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    selectedTask={selectedTask}
                />
            }
            {
                modalEditType === "deletePersonalSubtask" && selectedTask && taskNames &&
                <EditModalMUI
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    handleClose={handleEditModalClose}
                    selectedTaskId={selectedTask}
                    selectedTaskNames={taskNames}
                />
            }
            {dateModalOpen &&
                <DatePickerModal
                    dateModalOpen={dateModalOpen}
                    setDateModalOpen={setDateModalOpen}
                    taskData={taskData}
                    subtaskData={subtaskData}
                    personalTaskData={personalTaskData}
                    personalSubtaskData={personalSubtaskData}
                    filteredTaskData={filteredTaskData}
                    setFilteredTaskData={setFilteredTaskData}
                    filteredPersonalTaskData={filteredPersonalTaskData}
                    setFilteredPersonalTaskData={setFilteredPersonalTaskData}
                    filteredPersonalSubtaskData={filteredPersonalSubtaskData}
                    setFilteredPersonalSubtaskData={setFilteredPersonalSubtaskData}
                    filteredSubtaskData={filteredSubtaskData}
                    setFilteredSubtaskData={setFilteredSubtaskData}
                    setCalendarStartDate={setCalendarStartDate}
                    setCalendarEndDate={setCalendarEndDate}
                />
            }
            {/* <EditModalMUI
                open={editModalOpen}
                editType={modalEditType}
                setOpen={setEditModalOpen}
                handleClose={handleEditModalClose}
                selectedTask={selectedTask}
            /> */}
        </div >
    )
}

export default WorkProgress