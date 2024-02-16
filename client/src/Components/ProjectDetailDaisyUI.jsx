import React, { useState, useEffect } from 'react';
import ProjectStatusChart from './ProjectStatusChart';
import RadarChart from './RadarChart'
import DatagridComponent from './DatagridComponent';
import SparkLineChart from './SparkLineChart';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import EditModalDaisyUI from './EditModalDaisyUI';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { makeRequest } from '../Axios';

function ProjectDetailDaisyUI({ value, setValue, projectData, gridApi, setGridApi, chevronRotation, setChevronRotation, radarChartData, pendingTaskCount, pendingSubtaskCount, sparklineData, navigate, taskData, subtaskData, handleMenuOpen, handleMenuClose, handleChange, navigateToAllProject, getPriorityColor, getChartPriorityColor, projectCompletionStatus }) {
    const [activeTab, setActiveTab] = useState(0);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [employeeList, setEmployeeList] = useState([])
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [modalEditType, setModalEditType] = useState("")
    const [selectedTask, setSelectedTask] = useState(null);
    const [filteredtaskData, setFilteredTaskData] = useState(taskData)
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


    const handleSaveChanges = () => {

    }

    const handleKeyInput = (e) => {
        const key = e.target.value;

        const filteredtaskData = taskData.filter((item) => {
            return Object.values(item).some(
                (field) =>
                    field &&
                    field.toString().toLowerCase().includes(key.toLocaleLowerCase())
            );
        })

        setFilteredTaskData(filteredtaskData);
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
        console.log(activeTab);
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
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <DatagridComponent
                            gridApi={gridApi}
                            setGridApi={setGridApi}
                            data={subtaskData}
                            columnDefs={subtaskColumns}
                            type="subtaskdatagrid"
                            handleSelectedTask={handleSelectedTask}
                        />
                    {console.log("finished")}
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
                {Boolean(anchorEl) && (
                    <ul className={`menu bg-white-200 w-56 rounded-box`} style={{ position: 'absolute', top: '100%', left: 0 }}>
                        <li><a>Item 1</a></li>
                        <li><a>Item 2</a></li>
                        <li><a>Item 3</a></li>
                    </ul>
                )}
            </div>
            <div className='flex flex-col md:flex-row gap-4' style={{ width: '100%' }}>
                <div className="flex-grow md:w-2/3">
                    <div className="card card-compact w-full shadow-xl" style={{ height: '28em' }}>
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
                        <h2 className='text-xl font-bold'>Pending Task Status</h2>
                    </div>
                    <hr className='mt-2 mb-2' />
                    <div className="flex items-center justify-between p-5">
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-red-400'>High Priority Task</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-red-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#ef7070'} />
                                </div>
                            </div>
                        </div>
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-yellow-400'>Medium Priority Task</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-yellow-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#facd48'} />
                                </div>
                            </div>
                        </div>
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-green-400'>Low Priority Task</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-green-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#66de81'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Pending Subtask status */}

            <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className='text-xl font-bold'>Pending Subtask Status</h2>
                    </div>
                    <hr className='mt-2 mb-2' />
                    <div className="flex items-center justify-between p-5">
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-red-400'>High Priority Subtask</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-red-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#ef7070'} />
                                </div>
                            </div>
                        </div>
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-yellow-400'>Medium Priority Subtask</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-yellow-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#facd48'} />
                                </div>
                            </div>
                        </div>
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-green-400'>Low Priority Subtask</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-green-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#66de81'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
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
                                        anchorEl={anchorEl}
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
            </div>
            {projectData &&
                <EditModalDaisyUI
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