import React, { useState, useEffect } from 'react';
import ProjectStatusChart from './ProjectStatusChart';
import RadarChart from './RadarChart'
import DatagridComponent from './DatagridComponent';
import SparkLineChart from './SparkLineChart';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import EditModal from './EditModalMUI';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { makeRequest } from '../Axios';
import { useMediaQuery } from '@mui/material';


function ProjectDetailDaisyUI({ value, setValue, anchorEl, setAnchorEl, projectData, gridApi, setGridApi, chevronRotation, setChevronRotation, radarChartData, pendingTaskCount, pendingSubtaskCount, sparklineData, navigate, taskData, subtaskData, handleMenuOpen, handleMenuClose, handleChange, navigateToAllProject, getPriorityColor, getChartPriorityColor, projectCompletionStatus, allTaskData, taskCount, allSubtaskData, subtaskCount, projectId }) {
    const [activeTab, setActiveTab] = useState(0);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [anchorEl1, setAnchorEl1] = useState(null);
    const [employeeList, setEmployeeList] = useState([])
    const [changedDataArray, setChangedDataArray] = useState([]);
    const isMobile = useMediaQuery('(max-width:1180px)');
    const open = Boolean(anchorEl1);
    const [type, setType] = useState('');
    const handleClick = (event) => {
        setAnchorEl1(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl1(null);
    };
    const [modalEditType, setModalEditType] = useState("")
    const [selectedTask, setSelectedTask] = useState(null);
    const [filteredtaskData, setFilteredTaskData] = useState(taskData)
    const [filteredSubtaskData, setFilteredSubtaskData] = useState(subtaskData)
    const [taskColumns, setTaskColumns] = useState([
        {
            colId: '0_1',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50
        },
        { colId: '1_1', field: 'task_name', headerName: 'Task Name', hide: false },
        {
            colId: '2_1',
            field: 'Priority',
            headerName: 'Priority',
            hide: false,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['High', 'Medium', 'Low'],
            },
        },
        { colId: '3_1', field: 'task_description', headerName: 'Task Description', hide: false },
        { colId: '4_1', field: 'planned_start_date', headerName: 'Planned Start Date', hide: false },
        { colId: '5_1', field: 'planned_end_date', headerName: 'Planned End Date', hide: false },
        { colId: '6_1', field: 'planned_budget', headerName: 'Planned Budget', hide: false },
        { colId: '7_1', field: 'actual_start_time', headerName: 'Actual Start Time', hide: false },
        { colId: '8_1', field: 'actual_end_time', headerName: 'Actual End Time', hide: false },
        { colId: '9_1', field: 'actual_budget', headerName: 'Actual Budget', hide: false },
        {
            colId: '10_1',
            field: 'status',
            headerName: 'Status',
            hide: false,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['On Hold', 'Work In Progress', 'Pending', 'Completed'], // Specify the options for the select box
            },
        },
        {
            colId: '11_1',
            field: 'employee_name',
            headerName: 'Assigned Employee',
            hide: false,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: [],
            },
        },
    ])

    const [subtaskColumns, setSubtaskColumns] = useState([
        {
            colId: '0_1',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: 50
        },
        { colId: '1_1', field: 'subtask_name', headerName: 'Subtask Name', hide: false },
        {
            colId: '2_1',
            field: 'Priority',
            headerName: 'Priority',
            hide: false,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['High', 'Medium', 'Low'],
            },
        },
        { colId: '3_1', field: 'subtask_description', headerName: 'Subtask Description', hide: false },
        { colId: '4_1', field: 'planned_start_date', headerName: 'Planned Start Date', hide: false },
        { colId: '5_1', field: 'planned_end_date', headerName: 'Planned End Date', hide: false },
        { colId: '6_1', field: 'planned_budget', headerName: 'Planned Budget', hide: false },
        { colId: '7_1', field: 'actual_start_time', headerName: 'Actual Start Time', hide: false },
        { colId: '8_1', field: 'actual_end_time', headerName: 'Actual End Time', hide: false },
        { colId: '9_1', field: 'actual_budget', headerName: 'Actual Budget', hide: false },
        {
            colId: '10_1',
            field: 'status',
            headerName: 'Status',
            hide: false,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['On Hold', 'Work In Progress', 'Pending', 'Completed'], // Specify the options for the select box
            },
        },
        {
            colId: '11_1',
            field: 'assigned_employee_name',
            headerName: 'Assigned Employee Name',
            hide: false,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: [], // Specify the options for the select box
            },
        },
    ])

    const handleTaskDataClick = (choice) => {
        // console.log(gridApi);
        setType(choice);
        navigate(`/admin/workprogress/${projectId}/${choice}`)
    }

    const handleSubtaskDataClick = (choice) => {
        // console.log(gridApi);
        setType('sub' + choice);
        navigate(`/admin/workprogress/${projectId}/subtask${choice}`)
    }

    useEffect(() => {
        makeRequest.get('/employee/getallemployees')
            .then((res) => {
                setEmployeeList(res.data);

                // Update taskColumns after fetching employeeList
                setTaskColumns(prevColumns => {
                    return prevColumns.map(column => {
                        if (column.field === 'employee_name') {
                            return {
                                ...column,
                                cellEditorParams: {
                                    values: res.data.map(employee => employee.employee_name),
                                },
                            };
                        }
                        return column;
                    });
                });

                setSubtaskColumns(prevColumns => {
                    return prevColumns.map(column => {
                        if (column.field === 'assigned_employee_name') {
                            return {
                                ...column,
                                cellEditorParams: {
                                    values: res.data.map(employee => employee.employee_name),
                                },
                            };
                        }
                        return column;
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    console.log(changedDataArray);
    // const handleCellValueChanged = (event) => {
    //     const { data } = event.node;
    //     console.log(data);
    //     // Check if the data is already in the array
    //     const arrayvalue = changedDataArray.length;
    //     console.log(arrayvalue);
    //     const existingIndex = changedDataArray.findIndex(indexMatch)
    //     if (existingIndex !== -1) {
    //         console.log(existingIndex)
    //         // If the data is already in the array, update it
    //         // const newArray = [...changedDataArray];
    //         // newArray[existingIndex] = data;
    //         changedDataArray[existingIndex] = data;

    //     // Update the state with the modified array
    //     setChangedDataArray(changedDataArray);

    //         // setChangedDataArray(newArray);
    //     } else {
    //         // If the data is not in the array, add it
    //         setChangedDataArray(prevArray => [...prevArray, data]);

    //     }

    //     function indexMatch(value) {
    //         console.log(value);
    //         return value.task_id === data.task_id;
    //     }
    // }

    const handleCellValueChanged = (event) => {
        const { data } = event.node;
        const isTaskIdPresent = changedDataArray.some(item => item.task_id === data.task_id);

        if (!isTaskIdPresent) {
            changedDataArray.push(data);
        }
    }

    const handleSaveChanges = () => {
        changedDataArray.map((updateData) => {
            console.log(updateData);
            if (!updateData.subtask_id) {
                makeRequest.patch(`/task/updatetask/${updateData.task_id}`, updateData)
            } else {
                makeRequest.patch(`/subtask/updatesubtaskbyid/${updateData.subtask_id}`, updateData)
            }
        })
    }

    const handleKeyInput = (e) => {
        const key = e.target.value;
        if (activeTab === 0) {
            const filteredtaskData = taskData.filter((item) => {
                return Object.values(item).some(
                    (field) =>
                        field &&
                        field.toString().toLowerCase().includes(key.toLocaleLowerCase())
                );
            })

            setFilteredTaskData(filteredtaskData);
        } else if (activeTab === 1) {
            const filteredSubtaskData = subtaskData.filter((item) => {
                return Object.values(item).some(
                    (field) =>
                        field &&
                        field.toString().toLowerCase().includes(key.toLocaleLowerCase())
                );
            })
            setFilteredSubtaskData(filteredSubtaskData);
        }
    };

    const handleSelectedTask = (task) => {
        console.log(task);
        setSelectedTask(task);
    };

    const changeTab = (tabIndex) => {
        console.log(tabIndex);
        setActiveTab(tabIndex);
    };

    const handleEditModalOpen = () => {
        setModalEditType("project")
        setEditModalOpen(true)
    };

    const renderTabContent = () => {
        // console.log(activeTab);
        switch (activeTab) {
            case 0:

                return (
                    <>
                        <DatagridComponent
                            gridApi={gridApi}
                            setGridApi={setGridApi}
                            data={filteredtaskData}
                            columnDefs={taskColumns}
                            type="task"
                            handleSelectedTask={handleSelectedTask}
                            handleCellValueChanged={handleCellValueChanged}
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <DatagridComponent
                            gridApi={gridApi}
                            setGridApi={setGridApi}
                            data={filteredSubtaskData}
                            columnDefs={subtaskColumns}
                            type="subtaskdatagrid"
                            handleSelectedTask={handleSelectedTask}
                            handleCellValueChanged={handleCellValueChanged}
                        />
                        {/* {console.log("finished")} */}
                    </>

                );


            default:
                return null;
        }
    };

    return (
        <>
            <div className="mb-5">
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleMenuOpen}>
                    <h1 className='text-4xl font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight'>Project Name</h1>
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
                    <MenuItem >See all projects</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Add a project</MenuItem>
                </Menu>
            </div>
            <div className='flex flex-col md:flex-row gap-4' style={{ width: '100%' }}>
                <div className="flex-grow md:w-2/3">
                    <div className="card card-compact w-full shadow-xl" style={{ height: isMobile ? 'auto' : '28em' }}>
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <h2 className='text-xl font-bold '>Project Details</h2>
                                <div className="tooltip bg-white" data-tip="Edit Project Details">
                                    <IconButton aria-label="Edit" onClick={handleEditModalOpen}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 cursor-pointer">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                        </svg>
                                    </IconButton>
                                </div>
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
            </div>

            {/* Pending task status */}

            <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className='text-xl font-bold'>Task Status</h2>
                    </div>
                    <hr className='mt-2 mb-2' />
                    <div className="grid grid-cols-2 gap-6">
                        {pendingTaskCount && pendingTaskCount.map((pendingTaskCount) => (
                            <div className='card card-compact shadow-xl mt-5 cursor-pointer' style={{ width: 'auto' }} onClick={() => handleTaskDataClick(pendingTaskCount.Priority)}>
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-xl font-bold' style={{ color: getChartPriorityColor(pendingTaskCount.Priority) }}>{pendingTaskCount.Priority} Priority Task</h2>
                                        {console.log(pendingTaskCount.Priority)}
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-4xl font-extrabold' style={{ color: getChartPriorityColor(pendingTaskCount.Priority) }}>{pendingTaskCount.task_count}</h2>
                                        <SparkLineChart data={sparklineData} color={getChartPriorityColor(pendingTaskCount.Priority)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {allTaskData &&
                            <div className='card card-compact shadow-xl mt-5 cursor-pointer' style={{ width: 'auto' }} onClick={() => handleTaskDataClick('alltaskdata')}>
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-xl font-bold text-blue-800'>All Task</h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-4xl font-extrabold text-blue-800'>{taskCount}</h2>
                                        <SparkLineChart data={sparklineData} color="blue" />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {/* Pending Subtask status */}

            <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className='text-xl font-bold'>Subtask Status</h2>
                    </div>
                    <hr className='mt-2 mb-2' />
                    <div className="grid grid-cols-2 gap-6">
                        {pendingSubtaskCount.map((pendingSubtaskCount) => (
                            <div className='card card-compact shadow-xl mt-5 cursor-pointer' style={{ width: 'auto' }} onClick={() => handleSubtaskDataClick(pendingSubtaskCount.Priority)} >
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-xl font-bold' style={{ color: getChartPriorityColor(pendingSubtaskCount.Priority) }}>{pendingSubtaskCount.Priority} Priority Subtask</h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-4xl font-extrabold' style={{ color: getChartPriorityColor(pendingSubtaskCount.Priority) }}>{pendingSubtaskCount.subtask_count}</h2>
                                        <SparkLineChart data={sparklineData} color={getChartPriorityColor(pendingSubtaskCount.Priority)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {allSubtaskData &&
                            <div className='card card-compact shadow-xl mt-5 cursor-pointer' style={{ width: 'auto' }} onClick={() => handleSubtaskDataClick('allsubtaskdata')}>
                                <div className="card-body">
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-xl font-bold text-blue-800`}>All Subtask</h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-4xl font-extrabold text-blue-800`}>{subtaskCount}</h2>
                                        <SparkLineChart data={sparklineData} color="blue" />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            {/* <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
                <div className='card-body'>
                    <div>
                        <div className='flex items-center justify-between'>
                            <div role="tablist" className="tabs tabs-bordered bg-white">
                                <a role="tab" className={`tab ${activeTab === 0 ? 'tab-active text-black' : ''}`} onClick={() => changeTab(0)}>Tasks</a>
                                <a role="tab" className={`tab ${activeTab === 1 ? 'tab-active text-black' : ''}`} onClick={() => changeTab(1)}>Sub Tasks</a>
                            </div>
                            <div className="flex items-center gap-5">
                                <input onChange={handleKeyInput} type="text" placeholder="Type to search" className="input input-bordered w-full max-w-xs bg-white h-10" />
                                <div>
                                    <div className="tooltip bg-white" data-tip="More">
                                        <IconButton aria-label="Edit" onClick={handleClick} className='cursor-pointer'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                            </svg>
                                        </IconButton>
                                    </div>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl1}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleSaveChanges}>Save Changes</MenuItem>
                                        <MenuItem onClick={handleClose}>Delete</MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                        <hr className='mt-4' />
                        <div className='mt-4'>
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div> */}
            {projectData &&
                <EditModal
                    open={editModalOpen}
                    editType={modalEditType}
                    setOpen={setEditModalOpen}
                    // handleClose={handleEditModalClose}
                    projectData={projectData}
                />
            }
        </>
    );
}

export default ProjectDetailDaisyUI