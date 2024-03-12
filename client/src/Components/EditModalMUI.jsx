import React, { useEffect, useState, useContext } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateRangeIcon from '@mui/icons-material/DateRange';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeRequest } from '../Axios';
import { QueryClient, useMutation, useQuery, useQueryClient } from 'react-query';
import { ThemeContext } from '../Context/ThemeContext';
import ToastComponent from './ToastComponent';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    maxHeight: '30em',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    borderRadius: '1em',
    boxShadow: 24,
    pt: 4,
    pb: 4,
    pl: 3,
    pr: 3,
    overflowY: 'scroll'
};

// selectedTasks={taskNames}
const EditModal = ({ open, setOpen, handleClose, projectData, editType, selectedTask, employeeName, selectedTaskId, selectedTaskNames, selectedSubtaskId, selectedSubtaskNames, selectedTasks, selectedUser, setRowData, projectId, setUpdater, personalTaskData }) => {
    let modalContent;
    const { theme } = useContext(ThemeContext)
    const queryClient = useQueryClient();
    const [employeeId, setEmployeeId] = React.useState('');
    // const [projectId, setProjectId] = React.useState('');
    const [formData, setFormData] = useState({ ...projectData });
    const [taskFormData, setTaskFormData] = useState();
    const [subtaskFormData, setSubtaskFormData] = useState();
    const [personalTaskFormData, setPersonalTaskFormData] = useState();
    const [personalSubtaskFormData, setPersonalSubtaskFormData] = useState();
    const [toastOpen, setToastOpen] = useState({ open: false, msg: "" })
    const [userData, setUserData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        email: '',
    });
    const [input, setInput] = useState({
        email: '',
        firstname: '',
        lastname: '',
        username: '',
        usertype: 'Users',
        password: ''
    });
    const [personalTask, setPersonalTask] = useState({
        project_id: projectId,
        personal_task_name: '',
        Priority: '',
        status: '',
        planned_budget: '',
        actual_budget: '',
        personal_task_description: ''
    })
    const [personalSubtask, setPersonalSubtask] = useState({
        project_id: projectId,
        personal_task_id: '',
        personalsubtask_name: '',
        Priority: '',
        status: '',
        planned_budget: '',
        actual_budget: '',
        personalsubtask_description: ''
    })

    useEffect(() => {
        if (editType === "edituser") {
            setUserData({
                userName: selectedUser.user_name,
                firstName: selectedUser.first_name,
                lastName: selectedUser.last_name,
                email: selectedUser.email,
            })
        }
    }, [selectedUser])

    const handleUserDataChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    }

    const handlePersonalTaskChange = (e) => {
        setPersonalTask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handlePersonalSubtaskChange = (e) => {
        setPersonalSubtask((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    console.log(personalSubtask);
    const handleSubmitPersonalTask = () => {
        createPersonalTaskMutation.mutate()
    }

    const handleSubmitPersonalSubtask = () => {
        createPersonalSubtaskMutation.mutate()

    }

    const createPersonalTaskMutation = useMutation(() => {
        makeRequest.post(`/personaltask/createpersonaltask`, personalTask)
            .then((response) => {
                queryClient.invalidateQueries(["priorityPersonalTaskCount"]);
                queryClient.invalidateQueries(["personalPendingTaskCount"]);
                queryClient.invalidateQueries(["personalTaskData"]);
                queryClient.invalidateQueries(["personalTotalPendingTaskCount"]);
            }).catch((error) => {
                console.log(error);
            })
    }, {
        onSuccess: () => {
            handleClose();
            setToastOpen({
                open: true,
                msg: "Personal task created successfully"
            });
        }
    })

    const createPersonalSubtaskMutation = useMutation(() => {
        makeRequest.post(`/personalsubtask/createpersonalsubtask`, personalSubtask)
            .then((response) => {
                queryClient.invalidateQueries(["priorityPersonalSubtaskCount"]);
                queryClient.invalidateQueries(["personalPendingSubtaskCount"]);
                queryClient.invalidateQueries(["personalSubtaskData"]);
                queryClient.invalidateQueries(["personalTotalPendingSubtaskCount"]);
            }).catch((error) => {
                console.log(error);
            })
    }, {
        onSuccess: () => {
            handleClose();
            setToastOpen({
                open: true,
                msg: "Personal subtask created successfully"
            });
        }
    })

    const createMutation = useMutation((userId) => {
        makeRequest.patch(`/user/updateuser/${userId}`, userData)
            .then((response) => {
                handleClose();
                queryClient.invalidateQueries(["UserData"]);

            }).catch((error) => {
                console.log(error);
            })
    }, {
        onSuccess: () => {
            setToastOpen({
                open: true,
                msg: "User updated successfully"
            });
        }
    })

    const handleEditUserSubmit = async (userId) => {
        createMutation.mutate(userId)

        // try {
        //     const response = await makeRequest.patch(`/user/updateuser/${userId}`, userData);
        //     if (response) {
        //         makeRequest.get('/user/getallusers').then((res) => {
        //             setRowData(res.data)
        //             handleClose()
        //             setToastOpen({
        //                 open: true,
        //                 msg: "User updated successfully"
        //             })
        //         })
        //     }
        // } catch (error) {
        //     console.error('Error editing user:', error);
        // }
    };

    const status = {
        workinprogress: "Work in Progress",
        pending: "Pending",
        onhold: "On Hold",
        completed: "Completed"
    }
    const priority = {
        high: "High",
        medium: "Medium",
        low: "Low"
    }

    // console.log(selectedSubtaskId);
    // console.log(selectedSubtaskNames);
    // console.log(projectData);
    // console.log("*(*(*(*(*" + selectedTask);
    console.log(formData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = () => {

        if (
            formData.project_name === '' ||
            formData.project_start_date === '' ||
            formData.project_end_date === '' ||
            formData.actual_start_date === '' ||
            formData.actual_end_date === ''
        ) {
            console.error('Please fill in all required fields');
            return;
        }

        makeRequest.patch(`/project/updateprojectdetail/${projectData.project_id}`, formData)
            .then((response) => {
                setToastOpen({ open: true, msg: "Project Updated Successfully" })
                console.log('Project updated successfully:', response)
                handleClose();

            })
            .catch((error) => {
                console.error('Error updating project:', error);
            });
    }


    const handleChangeEmployeeNames = (event) => {
        setEmployeeId(event.target.value);
    };

    const handleDeleteTask = () => {

    }

    const data = {
        employeeId: employeeId,
        taskNames: selectedTask
    }

    var assignedProjectdata = null
    if (projectData) {
        assignedProjectdata = {
            employeeId: employeeId,
            projectId: projectData.project_id
        }
    }


    const handleEmployeeSubmit = () => {
        makeRequest.post(`/assign/assigntask`, data)
            .then(response => {
                setToastOpen({ open: true, msg: "Task Asssigned Successfully" })

                console.log('Data sent successfully:', response.data);
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
    }


    const { data: editTaskData, error: editTaskDataError, isLoading: editTaskDataLoading } = useQuery(
        ['taskData', selectedTask],
        async () => {
            console.log(selectedTask);
            const response = await makeRequest.get(`/task/gettask/${selectedTask}`);
            console.log(response.data);
            setTaskFormData(response.data);
            return response.data;
        }
    );

    console.log(taskFormData);

    const { data: editTaskProjectName, error: editTaskProjectNameError, isLoading: editTaskProjectNameLoading } = useQuery(
        ['projectName', selectedTask],
        async () => {
            const response = await makeRequest.get(`/project/getprojectidandname`);
            return response.data;
        }
    );

    const handleTaskChange = (e) => {
        const { name, value } = e.target;
        setTaskFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEditTask = () => {
        makeRequest.patch(`/task/updatetask/${selectedTask}`, taskFormData)
            .then((res) => {
                setToastOpen({ open: true, msg: "Task Updated Successfully" })
                console.log("task updated successfully");
                handleClose();
            }).catch((error) => {
                console.log("task updating error:", error);
            })
    }

    const handleTaskDelete = () => {
        // console.log(selectedTaskId);
        makeRequest.delete(`/task/deletemultipletask/${selectedTaskId}`)
            .then((res) => {
                setToastOpen({ open: true, msg: "Task Deleted Successfully" })
                console.log("deleted successfully");
            }).catch((error) => {
                console.log("error in deleting");
            })
    }

    const handleEmployeeSubtaskSubmit = () => {
        makeRequest.post(`/assign/assignsubtask`, data)
            .then(response => {
                setToastOpen({ open: true, msg: "Subtask Assigned Successfully" })
                console.log('Data sent successfully:', response.data);
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
    }

    const { data: editSubtaskData, error: editSubtaskDataError, isLoading: editSubtaskDataLoading } = useQuery(
        ['subtaskdata', selectedTask],
        async () => {
            console.log(selectedTask);
            const response = await makeRequest.get(`/subtask/getsubtask/${selectedTask}`);
            console.log(response.data);
            setSubtaskFormData(response.data);
            return response.data;
        }
    );

    const handleSubtaskChange = (e) => {
        const { name, value } = e.target;
        setSubtaskFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const { data: editProjectName, error: editProjectNameError, isLoading: editProjectNameLoading } = useQuery(
        ['projectName', selectedTask],
        async () => {
            const response = await makeRequest.get(`/project/getprojectidandname`);
            return response.data;
        }
    );

    const { data: editSubtaskTaskName, error: editSubtaskTaskNameError, isLoading: editSubtaskTaskNameLoading } = useQuery(
        ['subtasktaskName', selectedTask],
        async () => {
            const response = await makeRequest.get(`/task/gettaskidandname`);
            return response.data;
        }
    );

    const handleEditSubtask = () => {
        console.log(selectedTask);
        makeRequest.patch(`/subtask/updatesubtaskbyid/${selectedTask}`, subtaskFormData)
            .then((res) => {
                setToastOpen({ open: true, msg: "Subtask Updated Successfully" })
                console.log("subtask updated successfully");
            }).catch((error) => {
                console.log("subtask updating error:", error);
            })
    }

    const handleSubtaskDelete = () => {
        console.log(selectedTaskId);
        makeRequest.delete(`/subtask/deletemultiplesubtask/${selectedSubtaskId}`)
            .then((res) => {
                setToastOpen({ open: true, msg: "Subtask Deleted Successfully" })
                console.log("deleted successfully");
            }).catch((error) => {
                console.log("error in deleting");
            })
    }

    console.log(assignedProjectdata);
    const handleEmployeeProjectSubmit = () => {
        makeRequest.post(`/assign/assignproject`, assignedProjectdata)
            .then(response => {
                setToastOpen({ open: true, msg: "Project Assigned Successfully" })
                console.log('Data sent successfully:', response.data);
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
    }

    const handleCreateUser = (e) => {

        setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    }

    const createRegisterMutation = useMutation((input) => {
        makeRequest.post("/auth/register", input)
            .then((res) => {
                queryClient.invalidateQueries(["UserData"])
                setToastOpen({ open: true, msg: "User Created Successfully" })
                setInput({
                    email: "",
                    firstname: "",
                    lastname: "",
                    username: "",
                    usertype: "Users",
                    password: "",
                })

            }).catch((error) => {
                console.log(error);
            })
    }, {
        onSuccess: () => {
            console.log("hii prince");
        },
    })

    const handleRegisterUser = () => {
        createRegisterMutation.mutate(input);
    }

    const { data: editPersonalTaskData, error: editPersonalTaskDataError, isLoading: editPersonalTaskDataLoading } = useQuery(
        ['PersonalTaskdataById', selectedTask],
        async () => {
            // console.log(selectedTask);
            const response = await makeRequest.get(`/personaltask/getpersonaltask/${selectedTask}`);
            // console.log(response.data);
            setPersonalTaskFormData(response.data);
            return response.data;
        }
    );

    const { data: editPersonalTaskName, error: editPersonalTaskNameError, isLoading: editPersonalTaskNameLoading } = useQuery(
        ['personalTaskName', selectedTask],
        async () => {
            const response = await makeRequest.get(`/personaltask/getpersonaltaskidandname`);
            return response.data;
        }
    );

    const handleEditPersonalTaskChange = (e) => {
        const { name, value } = e.target;
        setPersonalTaskFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleEditPersonalTask = () => {
        // console.log(selectedTask);
        makeRequest.patch(`/personaltask/updatepersonaltask/${selectedTask}`, personalTaskFormData)
            .then((res) => {
                setToastOpen({ open: true, msg: "Personal Task Updated Successfully" })
                window.location.reload();
                handleClose();

                // console.log("Personal Task updated successfully");
            }).catch((error) => {
                console.log("Personal Task updating error:", error);
            })
    }

    const handlePersonalTaskDelete = () => {
        // console.log(selectedTaskId);
        makeRequest.delete(`/personaltask/deletepersonaltask/${selectedTaskId}`)
            .then((res) => {
                setToastOpen({ open: true, msg: "Personal Task Deleted Successfully" })
                window.location.reload();
                // console.log("deleted successfully");
            }).catch((error) => {
                console.log("error in deleting");
            })
    }

    const { data: editPersonalSubtaskData, error: editPersonalSubtaskDataError, isLoading: editPersonalSubtaskDataLoading } = useQuery(
        ['PersonalSubtaskDataById', selectedTask],
        async () => {
            // console.log(selectedTask);
            const response = await makeRequest.get(`/personalsubtask/getpersonalsubtask/${selectedTask}`);
            console.log(response.data);
            setPersonalSubtaskFormData(response.data);
            return response.data;
        }
    );

    const handleEditPersonalSubtaskChange = (e) => {
        const { name, value } = e.target;
        setPersonalSubtaskFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };
    console.log(personalSubtaskFormData);

    const handleEditPersonalSubtask = () => {
        makeRequest.patch(`/personalsubtask/updatepersonalsubtaskbyid/${selectedTask}`, personalSubtaskFormData)
            .then((res) => {
                // setToastOpen({ open: true, msg: "Personal Subtask Updated Successfully" })
                window.location.reload();
                handleClose();

            }).catch((error) => {
                console.log("Personal Subtask updating error:", error);
            })
    }

    const handlePersonalSubtaskDelete = () => {
        // console.log(selectedTaskId);
        makeRequest.delete(`/personalsubtask/deletepersonalsubtasks/${selectedTaskId}`)
            .then((res) => {
                // setToastOpen({ open: true, msg: "Personal Subtask Deleted Successfully" })
                window.location.reload();
                // console.log("deleted successfully");
            }).catch((error) => {
                console.log("error in deleting");
            })
    }

    // console.log(editType);
    switch (editType) {
        case "project":
            modalContent = (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Project Details
                        </Typography>
                        <Tooltip title="Close">
                            <IconButton onClick={() => { setOpen(!open) }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr />
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className='grid grid-cols-1 gap-y-6'>
                            <TextField
                                id="outlined-password-input"
                                label="Project Name"
                                name="project_name"
                                type="text"
                                value={formData.project_name}
                                autoComplete="project-name"
                                onChange={handleChange}

                            // onChange={(e) => handleCreateProjectChange(e)}
                            />
                            <div className="flex gap-6">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Project Start Date"
                                        name="project_start_date"
                                        slots={{ openPickerIcon: DateRangeIcon }}
                                        // value={projectData.project_start_date ? moment(projectData.project_start_date, 'YYYY-MM-DD') : null}
                                        defaultValue={dayjs(projectData.project_start_date)}
                                        onChange={(date) => setFormData((prevData) => ({
                                            ...prevData,
                                            project_start_date: date.format('YYYY-MM-DD')
                                        }))}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Project End Date"
                                        name="project_end_date"
                                        slots={{ openPickerIcon: DateRangeIcon }}
                                        defaultValue={dayjs(projectData.project_end_date)}
                                        onChange={(date) => setFormData((prevData) => ({
                                            ...prevData,
                                            project_end_date: date.format('YYYY-MM-DD')
                                        }))}

                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="flex gap-6">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Actual Start Date"
                                        name="actual_start_date"
                                        slots={{ openPickerIcon: DateRangeIcon }}
                                        defaultValue={dayjs(projectData.actual_start_date)}
                                        onChange={(date) => setFormData((prevData) => ({
                                            ...prevData,
                                            actual_start_date: date.format('YYYY-MM-DD')
                                        }))}

                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Actual End Date"
                                        name="actual_end_date"
                                        slots={{ openPickerIcon: DateRangeIcon }}
                                        defaultValue={dayjs(projectData.actual_end_date)}
                                        onChange={(date) => setFormData((prevData) => ({
                                            ...prevData,
                                            actual_end_date: date.format('YYYY-MM-DD')
                                        }))}
                                    />
                                </LocalizationProvider>
                            </div>
                            <TextField
                                multiline
                                fullWidth
                                rows={3}
                                name='project_description'
                                label="Project Description"
                                value={formData.project_description}
                                onChange={handleChange}
                            // onChange={(e) => handleCreateProjectChange(e)}
                            />
                        </div>
                        <br />
                        <div className='flex justify-center space-x-5'>
                            {theme === "theme1" ?
                                <>
                                    <Button variant="contained" size="medium" onClick={() => setOpen(!open)}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" size="medium" onClick={handleSubmit}>
                                        Save Changes
                                    </Button>
                                </> :
                                <>
                                    <button className='text-white font-bold py-2 px-4 rounded' onClick={() => setOpen(!open)} style={{ background: '#5cd4d0' }}>
                                        Cancel
                                    </button>
                                    <button className='text-white font-bold py-2 px-4 rounded' style={{ background: '#5cd4d0' }} onClick={handleSubmit}>
                                        Save Changes
                                    </button>
                                </>
                            }
                        </div>
                    </Typography>
                </>
            )
            break;
        case "assignedProject":
            modalContent = (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Assign Project To Employee
                        </Typography>
                        <Tooltip title="Close">
                            <IconButton onClick={() => { setOpen(!open) }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr />
                    <div className='grid grid-cols-1 gap-y-6 mt-6'>
                        <TextField
                            disabled
                            id="outlined-password-input"
                            label="Project Name"
                            name="project_name"
                            type="text"
                            value={projectData.project_name}
                            autoComplete="project-name"
                        />
                    </div>
                    <div className='mt-5'>
                        <FormControl fullWidth >
                            <InputLabel id="demo-simple-select-label">Employee Names</InputLabel>
                            <Select

                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={employeeId}
                                label="Employee Names"
                                onChange={handleChangeEmployeeNames}
                            >
                                {employeeName && employeeName.map((employee) => (
                                    <MenuItem key={employee.employee_id} value={employee.employee_id}>{employee.employee_name}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <Button variant="contained" onClick={handleEmployeeProjectSubmit}>Save</Button>
                    </div>
                </>
            );
            break;
        case "assignedTask":
            modalContent = (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Assign Task To User
                        </Typography>
                        <Tooltip title="Close">
                            <IconButton onClick={() => { setOpen(!open) }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr />
                    <div className='grid grid-cols-2 justify-content-between mt-4 gap-3 '>
                        {selectedTask && selectedTask.map((task) => (
                            <Tooltip key={task.task_id} title={task.task_name}>
                                <Chip label={task.task_name} variant="outlined"
                                // onDelete={handleDeleteTask} 
                                />
                            </Tooltip>
                        ))}
                    </div>
                    <div className='mt-7'>
                        <FormControl fullWidth >
                            <InputLabel id="demo-simple-select-label">Employee Names</InputLabel>
                            <Select

                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={employeeId}
                                label="Employee Names"
                                onChange={handleChangeEmployeeNames}
                            >
                                {employeeName && employeeName.map((employee) => (
                                    <MenuItem key={employee.employee_id} value={employee.employee_id}>{employee.employee_name}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <Button variant="contained" onClick={handleEmployeeSubmit}>Save</Button>
                    </div>
                </>
            );
            break;
        case "editTask":
            modalContent = (
                <>
                    {editTaskData &&
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Edit Task Details
                                </Typography>
                                <Tooltip title="Close">
                                    <IconButton onClick={() => { setOpen(!open) }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <hr />
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <div className='grid grid-cols-1 gap-y-6'>
                                    <TextField
                                        id="outlined-password-input"
                                        label="task Name"
                                        name="task_name"
                                        type="text"
                                        value={taskFormData.task_name}
                                        onChange={handleTaskChange}

                                    // onChange={(e) => handleCreateProjectChange(e)}
                                    />
                                    <div className=''>
                                        <FormControl fullWidth >
                                            <InputLabel id="demo-simple-select-label">Project Names</InputLabel>
                                            <Select

                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={taskFormData.project_id}
                                                label="Project Names"
                                                name='project_id'
                                                onChange={handleTaskChange}
                                            >
                                                {editProjectName && editProjectName.map((project) => (
                                                    <MenuItem
                                                        key={project.project_id}
                                                        value={project.project_id}
                                                    >
                                                        {project.project_name}
                                                    </MenuItem>
                                                ))}

                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-6">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Planned Start Date"
                                                name="planned_start_date"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(taskFormData.planned_start_date)}
                                                onChange={(date) => setTaskFormData((prevData) => ({
                                                    ...prevData,
                                                    planned_start_date: date.format('YYYY-MM-DD')
                                                }))}
                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Planned End Date"
                                                name="planned_end_date"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(taskFormData.planned_end_date)}
                                                onChange={(date) => setTaskFormData((prevData) => ({
                                                    ...prevData,
                                                    planned_end_date: date.format('YYYY-MM-DD')
                                                }))}

                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="flex gap-6">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Actual Start Time"
                                                name="actual_start_time"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(taskFormData.actual_start_time)}
                                                onChange={(date) => setTaskFormData((prevData) => ({
                                                    ...prevData,
                                                    actual_start_time: date.format('YYYY-MM-DD')
                                                }))}

                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Actual End Time"
                                                name="actual_end_time"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(taskFormData.actual_end_time)}
                                                onChange={(date) => setTaskFormData((prevData) => ({
                                                    ...prevData,
                                                    actual_end_time: date.format('YYYY-MM-DD')
                                                }))}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="flex gap-6">
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"

                                                label="priority"
                                                name='priority'
                                                value={taskFormData.Priority}
                                                onChange={(e) => { handleTaskChange(e) }}
                                            >
                                                <MenuItem value={priority.high}>High</MenuItem>
                                                <MenuItem value={priority.medium}>Medium</MenuItem>
                                                <MenuItem value={priority.low}>Low</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={taskFormData.status}
                                                label="status"
                                                name='status'
                                                onChange={(e) => handleTaskChange(e)}
                                            >
                                                <MenuItem value={status.workinprogress}>Work In Progress</MenuItem>
                                                <MenuItem value={status.pending}>Pending</MenuItem>
                                                <MenuItem value={status.onhold}>On Hold</MenuItem>
                                                <MenuItem value={status.completed}>Completed</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-6 justify-between">
                                        <TextField
                                            fullWidth
                                            id="outlined-password-input"
                                            label="Planned Budget"
                                            name="planned_budget"
                                            type="text"
                                            value={taskFormData.planned_budget}
                                            autoComplete="planned-budget"
                                            onChange={handleTaskChange}
                                        />
                                        <TextField
                                            fullWidth
                                            id="outlined-password-input"
                                            label="Actual Budget"
                                            name="actual_budget"
                                            type="text"
                                            value={taskFormData.actual_budget}
                                            autoComplete="actual-budget"
                                            onChange={handleTaskChange}
                                        />
                                    </div>
                                    <TextField
                                        multiline
                                        fullWidth
                                        rows={3}
                                        name='task_description'
                                        label="Project Description"
                                        value={taskFormData.task_description}
                                        onChange={handleTaskChange}
                                    />
                                </div>
                                <br />
                                <div className='flex justify-center space-x-5'>
                                    <Button variant="contained" size="medium" onClick={() => setOpen(!open)}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" size="medium" onClick={handleEditTask}>
                                        Save Changes
                                    </Button>
                                </div>
                            </Typography>

                        </>
                    }
                </>
            );
            break;
        case "deleteTask":
            modalContent = (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Delete Tasks From Project
                        </Typography>
                        <Tooltip title="Close">
                            <IconButton onClick={() => { setOpen(!open) }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr />
                    <div className='grid grid-cols-2 justify-content-between mt-4 gap-3 '>
                        {selectedTaskNames && selectedTaskNames.map((task) => (
                            <Tooltip key={task.task_id} title={task.task_name}>
                                <Chip label={task.task_name} variant="outlined"
                                // onDelete={handleDeleteTask} 
                                />
                            </Tooltip>
                        ))}
                    </div>

                    <div className='flex justify-center mt-4'>
                        {theme === 'theme1' ?
                            <Button variant="contained" onClick={handleTaskDelete}>Delete Tasks</Button>
                            :
                            <button className='text-white font-bold py-2 px-4 rounded' style={{ background: '#5cd4d0' }} onClick={handleTaskDelete}>Delete Tasks</button>
                        }
                    </div>
                </>
            );
            break;
        case "assignedSubtask":
            modalContent = (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Assign Subtask To User
                        </Typography>
                        <Tooltip title="Close">
                            <IconButton onClick={() => { setOpen(!open) }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr />
                    <div className='grid grid-cols-2 justify-content-between mt-4 gap-3 '>
                        {selectedTask && selectedTask.map((subtask) => (
                            <Tooltip key={subtask.subtask_id} title={subtask.subtask_name}>
                                <Chip label={subtask.subtask_name} variant="outlined"
                                // onDelete={handleDeleteTask} 
                                />
                            </Tooltip>
                        ))}
                    </div>
                    <div className='mt-7'>
                        <FormControl fullWidth >
                            <InputLabel id="demo-simple-select-label">Employee Names</InputLabel>
                            <Select

                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={employeeId}
                                label="Employee Names"
                                onChange={handleChangeEmployeeNames}
                            >
                                {employeeName && employeeName.map((employee) => (
                                    <MenuItem key={employee.employee_id} value={employee.employee_id}>{employee.employee_name}</MenuItem>
                                ))}

                            </Select>
                        </FormControl>
                    </div>
                    <div className='flex justify-center mt-4'>
                        <Button variant="contained" onClick={handleEmployeeSubtaskSubmit}>Save</Button>
                    </div>
                </>
            );
            break;
        case "editSubtask":
            modalContent = (
                <>
                    {editSubtaskData &&
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Edit Subtask Details
                                </Typography>
                                <Tooltip title="Close">
                                    <IconButton onClick={() => { setOpen(!open) }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <hr />
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <div className='grid grid-cols-1 gap-y-6'>
                                    <TextField
                                        id="outlined-password-input"
                                        label="subtask Name"
                                        name="subtask_name"
                                        type="text"
                                        value={subtaskFormData.subtask_name}
                                        onChange={handleSubtaskChange}

                                    // onChange={(e) => handleCreateProjectChange(e)}
                                    />
                                    <div className='mt-7'>
                                        <FormControl fullWidth >
                                            <InputLabel id="demo-simple-select-label">Project Names</InputLabel>
                                            <Select

                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={subtaskFormData.project_id}
                                                label="Project Names"
                                                name='project_id'
                                                onChange={handleSubtaskChange}
                                            >
                                                {editProjectName && editProjectName.map((project) => (
                                                    <MenuItem
                                                        key={project.project_id}
                                                        value={project.project_id}
                                                    >
                                                        {project.project_name}
                                                    </MenuItem>
                                                ))}

                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className='mt-7'>
                                        <FormControl fullWidth >
                                            <InputLabel id="demo-simple-select-label">Task Names</InputLabel>
                                            <Select

                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={subtaskFormData.task_id}
                                                label="Task Names"
                                                name='task_id'
                                                onChange={handleSubtaskChange}
                                            >
                                                {editSubtaskTaskName && editSubtaskTaskName.map((task) => (
                                                    <MenuItem
                                                        key={task.task_id}
                                                        value={task.task_id}
                                                    >
                                                        {task.task_name}
                                                    </MenuItem>
                                                ))}

                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-6">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Planned Start Date"
                                                name="planned_start_date"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(subtaskFormData.planned_start_date)}
                                                onChange={(date) => setSubtaskFormData((prevData) => ({
                                                    ...prevData,
                                                    planned_start_date: date.format('YYYY-MM-DD')
                                                }))}
                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Planned End Date"
                                                name="planned_end_date"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(subtaskFormData.planned_end_date)}
                                                onChange={(date) => setSubtaskFormData((prevData) => ({
                                                    ...prevData,
                                                    planned_end_date: date.format('YYYY-MM-DD')
                                                }))}

                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="flex gap-6">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Actual Start Time"
                                                name="actual_start_time"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(subtaskFormData.actual_start_time)}
                                                onChange={(date) => setSubtaskFormData((prevData) => ({
                                                    ...prevData,
                                                    actual_start_time: date.format('YYYY-MM-DD')
                                                }))}

                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Actual End Time"
                                                name="actual_end_time"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(subtaskFormData.actual_end_time)}
                                                onChange={(date) => setSubtaskFormData((prevData) => ({
                                                    ...prevData,
                                                    actual_end_time: date.format('YYYY-MM-DD')
                                                }))}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="flex gap-6">
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"

                                                label="priority"
                                                name='priority'
                                                value={subtaskFormData.Priority}
                                                onChange={(e) => { handleSubtaskChange(e) }}
                                            >
                                                <MenuItem value={priority.high}>High</MenuItem>
                                                <MenuItem value={priority.medium}>Medium</MenuItem>
                                                <MenuItem value={priority.low}>Low</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={subtaskFormData.status}
                                                label="status"
                                                name='status'
                                                onChange={(e) => handleSubtaskChange(e)}
                                            >
                                                <MenuItem value={status.workinprogress}>Work In Progress</MenuItem>
                                                <MenuItem value={status.pending}>Pending</MenuItem>
                                                <MenuItem value={status.onhold}>On Hold</MenuItem>
                                                <MenuItem value={status.completed}>Completed</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-6 justify-between">
                                        <TextField
                                            fullWidth
                                            id="outlined-password-input"
                                            label="Planned Budget"
                                            name="planned_budget"
                                            type="text"
                                            value={subtaskFormData.planned_budget}
                                            autoComplete="planned-budget"
                                            onChange={handleSubtaskChange}
                                        />
                                        <TextField
                                            fullWidth
                                            id="outlined-password-input"
                                            label="Actual Budget"
                                            name="actual_budget"
                                            type="text"
                                            value={subtaskFormData.actual_budget}
                                            autoComplete="actual-budget"
                                            onChange={handleSubtaskChange}
                                        />
                                    </div>
                                    <TextField
                                        multiline
                                        fullWidth
                                        rows={3}
                                        name='subtask_description'
                                        label="Project Description"
                                        value={subtaskFormData.subtask_description}
                                        onChange={handleSubtaskChange}
                                    />
                                </div>
                                <br />
                                <div className='flex justify-center space-x-5'>
                                    <Button variant="contained" size="medium" onClick={() => setOpen(!open)}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" size="medium" onClick={handleEditSubtask}>
                                        Save Changes
                                    </Button>
                                </div>
                            </Typography>

                        </>
                    }
                </>
            );
            break;
        case "deleteSubtask":
            modalContent = (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Delete Subtasks From Project
                        </Typography>
                        <Tooltip title="Close">
                            <IconButton onClick={() => { setOpen(!open) }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr />
                    <div className='grid grid-cols-2 justify-content-between mt-4 gap-3 '>
                        {selectedSubtaskNames && selectedSubtaskNames.map((subtask) => (
                            <Tooltip key={subtask.subtask_id} title={subtask.subtask_name}>
                                <Chip label={subtask.subtask_name} variant="outlined"
                                // onDelete={handleDeleteTask} 
                                />
                            </Tooltip>
                        ))}
                    </div>

                    <div className='flex justify-center mt-4'>
                        <Button variant="contained" onClick={handleSubtaskDelete}>Delete Subtasks</Button>
                    </div>
                </>
            );
            break;
        case "createUser":
            modalContent = (
                <>
                    <div className='flex items-center justify-between'>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Create User
                        </Typography>
                        <Tooltip title="Close">
                            <IconButton onClick={() => { setOpen(!open) }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr className='mt-2' />
                    <div className='mt-3'>
                        <TextField
                            className='w-full'
                            id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            name='email'
                            value={input.email}
                            onChange={(e) => handleCreateUser(e)}
                        />
                    </div>
                    <div className='flex items-center mt-2 gap-x-3'>
                        <TextField
                            id="outlined-basic"
                            label="First Name"
                            variant="outlined"
                            name='firstname'
                            value={input.firstname}
                            onChange={(e) => handleCreateUser(e)}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Last Name"
                            variant="outlined"
                            name='lastname'
                            value={input.lastname}
                            onChange={(e) => handleCreateUser(e)}
                        />
                    </div>
                    <div className='flex items-center mt-2 gap-x-3'>
                        <TextField
                            className=''
                            id="outlined-basic"
                            label="Username"
                            variant="outlined"
                            name='username'
                            value={input.username}
                            onChange={(e) => handleCreateUser(e)}
                        />
                        <TextField
                            className=''
                            id="outlined-basic"
                            label="User Type"
                            variant="outlined"
                            name='usertype'
                            value={input.usertype}
                            disabled
                        />
                    </div>
                    <div className='mt-2'>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={input.password}
                            onChange={(e) => handleCreateUser(e)}
                        />
                    </div>
                    <div className='flex items-center justify-center mt-4'>
                        <Button variant="contained" onClick={handleRegisterUser}>Create User</Button>
                    </div>
                </>
            )
            break;
        case "edituser":
            modalContent = (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit User
                        </Typography>
                        <Tooltip title="Close">
                            <IconButton onClick={() => { setOpen(!open) }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr />
                    <div>

                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <div className='grid grid-cols-1 gap-y-6'>
                                <TextField
                                    id="outlined-basic"
                                    label="User Name"
                                    variant="outlined"
                                    name='userName'
                                    value={userData.userName}
                                    onChange={handleUserDataChange}
                                />
                                <div className='flex items-center justify-center gap-5'>
                                    <TextField
                                        id="outlined-basic"
                                        label="First Name"
                                        variant="outlined"
                                        name='firstName'
                                        value={userData.firstName}
                                        onChange={handleUserDataChange}
                                    />
                                    <TextField
                                        id="outlined-basic"
                                        label="Last Name"
                                        variant="outlined"
                                        name='lastName'
                                        value={userData.lastName}
                                        onChange={handleUserDataChange}
                                    />
                                </div>
                                <TextField
                                    id="outlined-basic"
                                    label="Email"
                                    type='email'
                                    variant="outlined"
                                    name='email'
                                    value={userData.email}
                                    onChange={handleUserDataChange}

                                />
                            </div>
                            <br />
                            <div className='flex justify-center space-x-5'>
                                {theme === 'theme1' ?
                                    <>
                                        <Button variant="contained" size="medium" onClick={() => setOpen(!open)}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" size="medium" onClick={() => {
                                            handleEditUserSubmit(selectedUser.user_id)
                                        }}>
                                            Save Changes
                                        </Button>
                                    </> :
                                    <>
                                        <button className='text-white font-bold py-2 px-4 rounded' onClick={() => setOpen(!open)} style={{ background: '#5cd4d0' }}>
                                            Cancel
                                        </button>
                                        <button className='text-white font-bold py-2 px-4 rounded' style={{ background: '#5cd4d0' }} onClick={() => {
                                            handleEditUserSubmit(selectedUser.user_id)
                                        }}>
                                            Save Changes
                                        </button>
                                    </>
                                }
                            </div>
                        </Typography >
                    </div>

                </>


            );
            break;
        case "createPersonalTask":
            modalContent = (
                <>
                    <>
                        <div className="flex items-center justify-between mb-2">
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Create Personal Task
                            </Typography>
                            <Tooltip title="Close">
                                <IconButton onClick={() => { setOpen(!open) }}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <hr />
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <div className='grid grid-cols-1 gap-y-6'>
                                <TextField
                                    id="outlined-password-input"
                                    label="Personal Task Name"
                                    name="personal_task_name"
                                    type="text"
                                    value={personalTask.personal_task_name}
                                    onChange={handlePersonalTaskChange}
                                />
                                <div className="flex gap-6">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Planned Start Date"
                                            name="planned_start_date"
                                            slots={{ openPickerIcon: DateRangeIcon }}
                                            // value={dayjs(taskFormData.planned_start_date)}
                                            onChange={(date) => setPersonalTask((prevData) => ({
                                                ...prevData,
                                                planned_start_date: date.format('YYYY-MM-DD')
                                            }))}
                                        />
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Planned End Date"
                                            name="planned_end_date"
                                            slots={{ openPickerIcon: DateRangeIcon }}
                                            // value={dayjs(taskFormData.planned_end_date)}
                                            onChange={(date) => setPersonalTask((prevData) => ({
                                                ...prevData,
                                                planned_end_date: date.format('YYYY-MM-DD')
                                            }))}

                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className="flex gap-6">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Actual Start Time"
                                            name="actual_start_time"
                                            slots={{ openPickerIcon: DateRangeIcon }}
                                            // value={dayjs(taskFormData.actual_start_time)}
                                            onChange={(date) => setPersonalTask((prevData) => ({
                                                ...prevData,
                                                actual_start_time: date.format('YYYY-MM-DD')
                                            }))}

                                        />
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Actual End Time"
                                            name="actual_end_time"
                                            slots={{ openPickerIcon: DateRangeIcon }}
                                            // value={dayjs(taskFormData.actual_end_time)}
                                            onChange={(date) => setPersonalTask((prevData) => ({
                                                ...prevData,
                                                actual_end_time: date.format('YYYY-MM-DD')
                                            }))}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className="flex gap-6">
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"

                                            label="priority"
                                            name='Priority'
                                            // value={taskFormData.priority}
                                            onChange={(e) => { handlePersonalTaskChange(e) }}
                                        >
                                            <MenuItem value={priority.high}>High</MenuItem>
                                            <MenuItem value={priority.medium}>Medium</MenuItem>
                                            <MenuItem value={priority.low}>Low</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            // value={taskFormData.status}
                                            label="status"
                                            name='status'
                                            onChange={(e) => handlePersonalTaskChange(e)}
                                        >
                                            <MenuItem value={status.workinprogress}>Work In Progress</MenuItem>
                                            <MenuItem value={status.pending}>Pending</MenuItem>
                                            <MenuItem value={status.onhold}>On Hold</MenuItem>
                                            <MenuItem value={status.completed}>Completed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="flex gap-6">
                                    <TextField
                                        fullWidth
                                        id="outlined-password-input"
                                        label="Planned Budget"
                                        name="planned_budget"
                                        type="text"
                                        value={personalTask.planned_budget}
                                        autoComplete="planned-budget"
                                        onChange={handlePersonalTaskChange}
                                    />
                                    <TextField
                                        fullWidth
                                        id="outlined-password-input"
                                        label="Actual Budget"
                                        name="actual_budget"
                                        type="text"
                                        value={personalTask.actual_budget}
                                        autoComplete="actual-budget"
                                        onChange={handlePersonalTaskChange}
                                    />
                                </div>
                                <TextField
                                    multiline
                                    fullWidth
                                    rows={3}
                                    name='personal_task_description'
                                    label="Personal Task Description"
                                    value={personalTask.personal_task_description}
                                    onChange={handlePersonalTaskChange}
                                />
                            </div>
                            <br />
                            <div className='flex justify-center space-x-5'>
                                {theme === "theme1" ?
                                    <>
                                        <Button variant="contained" size="medium" onClick={() => setOpen(!open)}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" size="medium" onClick={handleSubmitPersonalTask}>
                                            Create
                                        </Button>
                                    </> :
                                    <>
                                        <button className='text-white font-bold py-2 px-4 rounded' onClick={() => setOpen(!open)} style={{ background: '#5cd4d0' }}>
                                            Cancel
                                        </button>
                                        <button className='text-white font-bold py-2 px-4 rounded' style={{ background: '#5cd4d0' }} onClick={handleSubmitPersonalTask}>
                                            Create
                                        </button>
                                    </>
                                }
                            </div>
                        </Typography>

                    </>
                </>
            );
            break;
        case "createPersonalSubtask":
            modalContent = (
                <>
                    <>
                        <div className="flex items-center justify-between mb-2">
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Create Personal Subtask
                            </Typography>
                            <Tooltip title="Close">
                                <IconButton onClick={() => { setOpen(!open) }}>
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <hr />
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <div className='grid grid-cols-1 gap-y-6'>
                                <TextField
                                    id="outlined-password-input"
                                    label="Personal Subtask Name"
                                    name="personalsubtask_name"
                                    type="text"
                                    value={personalSubtask.personalsubtask_name}
                                    onChange={handlePersonalSubtaskChange}
                                />
                                <div>
                                    <FormControl fullWidth >
                                        <InputLabel id="demo-simple-select-label">Personal Task Names</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={personalSubtask.personal_task_id}
                                            label="Personal Task Names"
                                            name='personal_task_id'
                                            onChange={handlePersonalSubtaskChange}
                                        >
                                            {personalTaskData && personalTaskData.map((personalTask) => (
                                                <MenuItem
                                                    key={personalTask.personal_task_id}
                                                    value={personalTask.personal_task_id}
                                                >
                                                    {personalTask.personal_task_name}
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="flex gap-6">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Planned Start Date"
                                            name="planned_start_date"
                                            slots={{ openPickerIcon: DateRangeIcon }}
                                            // value={dayjs(taskFormData.planned_start_date)}
                                            onChange={(date) => setPersonalSubtask((prevData) => ({
                                                ...prevData,
                                                planned_start_date: date.format('YYYY-MM-DD')
                                            }))}
                                        />
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Planned End Date"
                                            name="planned_end_date"
                                            slots={{ openPickerIcon: DateRangeIcon }}
                                            // value={dayjs(taskFormData.planned_end_date)}
                                            onChange={(date) => setPersonalSubtask((prevData) => ({
                                                ...prevData,
                                                planned_end_date: date.format('YYYY-MM-DD')
                                            }))}

                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className="flex gap-6">
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Actual Start Time"
                                            name="actual_start_time"
                                            slots={{ openPickerIcon: DateRangeIcon }}
                                            // value={dayjs(taskFormData.actual_start_time)}
                                            onChange={(date) => setPersonalSubtask((prevData) => ({
                                                ...prevData,
                                                actual_start_time: date.format('YYYY-MM-DD')
                                            }))}

                                        />
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Actual End Time"
                                            name="actual_end_time"
                                            slots={{ openPickerIcon: DateRangeIcon }}
                                            // value={dayjs(taskFormData.actual_end_time)}
                                            onChange={(date) => setPersonalSubtask((prevData) => ({
                                                ...prevData,
                                                actual_end_time: date.format('YYYY-MM-DD')
                                            }))}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className="flex gap-6">
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"

                                            label="priority"
                                            name='Priority'
                                            // value={taskFormData.priority}
                                            onChange={(e) => { handlePersonalSubtaskChange(e) }}
                                        >
                                            <MenuItem value={priority.high}>High</MenuItem>
                                            <MenuItem value={priority.medium}>Medium</MenuItem>
                                            <MenuItem value={priority.low}>Low</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            // value={taskFormData.status}
                                            label="status"
                                            name='status'
                                            onChange={(e) => handlePersonalSubtaskChange(e)}
                                        >
                                            <MenuItem value={status.workinprogress}>Work In Progress</MenuItem>
                                            <MenuItem value={status.pending}>Pending</MenuItem>
                                            <MenuItem value={status.onhold}>On Hold</MenuItem>
                                            <MenuItem value={status.completed}>Completed</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="flex gap-6">
                                    <TextField
                                        fullWidth
                                        id="outlined-password-input"
                                        label="Planned Budget"
                                        name="planned_budget"
                                        type="text"
                                        value={personalSubtask.planned_budget}
                                        autoComplete="planned-budget"
                                        onChange={handlePersonalSubtaskChange}
                                    />
                                    <TextField
                                        fullWidth
                                        id="outlined-password-input"
                                        label="Actual Budget"
                                        name="actual_budget"
                                        type="text"
                                        value={personalSubtask.actual_budget}
                                        autoComplete="actual-budget"
                                        onChange={handlePersonalSubtaskChange}
                                    />
                                </div>
                                <TextField
                                    multiline
                                    fullWidth
                                    rows={3}
                                    name='personalsubtask_description'
                                    label="Personal Subtask Description"
                                    value={personalSubtask.personal_subtask_description}
                                    onChange={handlePersonalSubtaskChange}
                                />
                            </div>
                            <br />
                            <div className='flex justify-center space-x-5'>
                                {theme === "theme1" ?
                                    <>
                                        <Button variant="contained" size="medium" onClick={() => setOpen(!open)}>
                                            Cancel
                                        </Button>
                                        <Button variant="contained" size="medium" onClick={handleSubmitPersonalSubtask}>
                                            Create
                                        </Button>
                                    </> :
                                    <>
                                        <button className='text-white font-bold py-2 px-4 rounded' onClick={() => setOpen(!open)} style={{ background: '#5cd4d0' }}>
                                            Cancel
                                        </button>
                                        <button className='text-white font-bold py-2 px-4 rounded' style={{ background: '#5cd4d0' }} onClick={handleSubmitPersonalSubtask}>
                                            Create
                                        </button>
                                    </>
                                }

                            </div>
                        </Typography>

                    </>
                </>
            );
            break;
        case "editPersonalTask":
            modalContent = (
                <>
                    {editPersonalTaskData &&
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Edit Personal Task Details
                                </Typography>
                                <Tooltip title="Close">
                                    <IconButton onClick={() => { setOpen(!open) }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <hr />
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <div className='grid grid-cols-1 gap-y-6'>
                                    <TextField
                                        id="outlined-password-input"
                                        label="Personal Task Name"
                                        name="personal_task_name"
                                        type="text"
                                        value={personalTaskFormData.personal_task_name}
                                        onChange={handleEditPersonalTaskChange}

                                    // onChange={(e) => handleCreateProjectChange(e)}
                                    />
                                    <div className=''>
                                        <FormControl fullWidth >
                                            <InputLabel id="demo-simple-select-label">Project Names</InputLabel>
                                            <Select

                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={personalTaskFormData.project_id}
                                                label="Project Names"
                                                name='project_id'
                                                onChange={handleEditPersonalTaskChange}
                                            >
                                                {editProjectName && editProjectName.map((project) => (
                                                    <MenuItem
                                                        key={project.project_id}
                                                        value={project.project_id}
                                                    >
                                                        {project.project_name}
                                                    </MenuItem>
                                                ))}

                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-6">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Planned Start Date"
                                                name="planned_start_date"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(personalTaskFormData.planned_start_date)}
                                                onChange={(date) => setPersonalTaskFormData((prevData) => ({
                                                    ...prevData,
                                                    planned_start_date: date.format('YYYY-MM-DD')
                                                }))}
                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Planned End Date"
                                                name="planned_end_date"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(personalTaskFormData.planned_end_date)}
                                                onChange={(date) => setPersonalTaskFormData((prevData) => ({
                                                    ...prevData,
                                                    planned_end_date: date.format('YYYY-MM-DD')
                                                }))}

                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="flex gap-6">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Actual Start Time"
                                                name="actual_start_time"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(personalTaskFormData.actual_start_time)}
                                                onChange={(date) => setPersonalTaskFormData((prevData) => ({
                                                    ...prevData,
                                                    actual_start_time: date.format('YYYY-MM-DD')
                                                }))}

                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Actual End Time"
                                                name="actual_end_time"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(personalTaskFormData.actual_end_time)}
                                                onChange={(date) => setPersonalTaskFormData((prevData) => ({
                                                    ...prevData,
                                                    actual_end_time: date.format('YYYY-MM-DD')
                                                }))}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="flex gap-6">
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"

                                                label="priority"
                                                name='priority'
                                                value={personalTaskFormData.Priority}
                                                onChange={(e) => { handleEditPersonalTaskChange(e) }}
                                            >
                                                <MenuItem value={priority.high}>High</MenuItem>
                                                <MenuItem value={priority.medium}>Medium</MenuItem>
                                                <MenuItem value={priority.low}>Low</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={personalTaskFormData.status}
                                                label="status"
                                                name='status'
                                                onChange={(e) => handleEditPersonalTaskChange(e)}
                                            >
                                                <MenuItem value={status.workinprogress}>Work In Progress</MenuItem>
                                                <MenuItem value={status.pending}>Pending</MenuItem>
                                                <MenuItem value={status.onhold}>On Hold</MenuItem>
                                                <MenuItem value={status.completed}>Completed</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-6 justify-between">
                                        <TextField
                                            fullWidth
                                            id="outlined-password-input"
                                            label="Planned Budget"
                                            name="planned_budget"
                                            type="text"
                                            value={personalTaskFormData.planned_budget}
                                            autoComplete="planned-budget"
                                            onChange={handleEditPersonalTaskChange}
                                        />
                                        <TextField
                                            fullWidth
                                            id="outlined-password-input"
                                            label="Actual Budget"
                                            name="actual_budget"
                                            type="text"
                                            value={personalTaskFormData.actual_budget}
                                            autoComplete="actual-budget"
                                            onChange={handleEditPersonalTaskChange}
                                        />
                                    </div>
                                    <TextField
                                        multiline
                                        fullWidth
                                        rows={3}
                                        name='personal_task_description'
                                        label="Personal Task Description"
                                        value={personalTaskFormData.personal_task_description}
                                        onChange={handleEditPersonalTaskChange}
                                    />
                                </div>
                                <br />
                                <div className='flex justify-center space-x-5'>
                                    {theme === "theme1" ?
                                        <>
                                            <Button variant="contained" size="medium" onClick={() => setOpen(!open)}>
                                                Cancel
                                            </Button>
                                            <Button variant="contained" size="medium" onClick={handleEditPersonalTask}>
                                                Save Changes
                                            </Button>
                                        </> :
                                        <>
                                            <button className='text-white font-bold py-2 px-4 rounded' onClick={() => setOpen(!open)} style={{ background: '#5cd4d0' }}>
                                                Cancel
                                            </button>
                                            <button className='text-white font-bold py-2 px-4 rounded' style={{ background: '#5cd4d0' }} onClick={handleEditPersonalTask}>
                                                Save Changes
                                            </button>
                                        </>
                                    }
                                </div>
                            </Typography>

                        </>
                    }
                </>
            );
            break;
        case "deletePersonalTask":
            modalContent = (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Delete Personal Tasks From Project
                        </Typography>
                        <Tooltip title="Close">
                            <IconButton onClick={() => { setOpen(!open) }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr />
                    <div className='grid grid-cols-2 justify-content-between mt-4 gap-3 '>
                        {selectedTaskNames && selectedTaskNames.map((personalTask) => (
                            <Tooltip key={personalTask.personal_task_id} title={personalTask.personal_task_name}>
                                <Chip label={personalTask.personal_task_name} variant="outlined"
                                // onDelete={handlePersonalTaskDelete} 
                                />
                            </Tooltip>
                        ))}
                    </div>

                    <div className='flex justify-center mt-4'>
                        {theme === 'theme1' ?
                            <Button variant="contained" onClick={handlePersonalTaskDelete}>Delete Personal Tasks</Button>
                            :
                            <button className='text-white font-bold py-2 px-4 rounded' style={{ background: '#5cd4d0' }} onClick={handleTaskDelete}>Delete Personal Tasks</button>
                        }
                    </div>
                </>
            );
            break;
        case "editPersonalSubtask":
            modalContent = (
                <>
                    {editPersonalSubtaskData &&
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Edit Personal Subtask Details
                                </Typography>
                                <Tooltip title="Close">
                                    <IconButton onClick={() => { setOpen(!open) }}>
                                        <CloseIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <hr />
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                <div className='grid grid-cols-1 gap-y-6'>
                                    <TextField
                                        id="outlined-password-input"
                                        label="Personal Subtask Name"
                                        name="personalsubtask_name"
                                        type="text"
                                        value={personalSubtaskFormData.personalsubtask_name}
                                        onChange={handleEditPersonalSubtaskChange}

                                    />
                                    <div className=''>
                                        <FormControl fullWidth >
                                            <InputLabel id="demo-simple-select-label">Project Names</InputLabel>
                                            <Select

                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={personalSubtaskFormData.project_id}
                                                label="Project Names"
                                                name='project_id'
                                                onChange={handleEditPersonalSubtaskChange}
                                            >
                                                {editProjectName && editProjectName.map((project) => (
                                                    <MenuItem
                                                        key={project.project_id}
                                                        value={project.project_id}
                                                    >
                                                        {project.project_name}
                                                    </MenuItem>
                                                ))}

                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className=''>
                                        <FormControl fullWidth >
                                            <InputLabel id="demo-simple-select-label">Personal Task Names</InputLabel>
                                            <Select

                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={personalSubtaskFormData.personal_task_id}
                                                label="Personal Task Names"
                                                name='personal_task_id'
                                                onChange={handleEditPersonalSubtaskChange}
                                            >
                                                {editPersonalTaskName && editPersonalTaskName.map((personalTask) => (
                                                    <MenuItem
                                                        key={personalTask.personal_task_id}
                                                        value={personalTask.personal_task_id}
                                                    >
                                                        {personalTask.personal_task_name}
                                                    </MenuItem>
                                                ))}

                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-6">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Planned Start Date"
                                                name="planned_start_date"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(personalSubtaskFormData.planned_start_date)}
                                                onChange={(date) => setPersonalSubtaskFormData((prevData) => ({
                                                    ...prevData,
                                                    planned_start_date: date.format('YYYY-MM-DD')
                                                }))}
                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Planned End Date"
                                                name="planned_end_date"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(personalSubtaskFormData.planned_end_date)}
                                                onChange={(date) => setPersonalSubtaskFormData((prevData) => ({
                                                    ...prevData,
                                                    planned_end_date: date.format('YYYY-MM-DD')
                                                }))}

                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="flex gap-6">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Actual Start Time"
                                                name="actual_start_time"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(personalSubtaskFormData.actual_start_time)}
                                                onChange={(date) => setPersonalSubtaskFormData((prevData) => ({
                                                    ...prevData,
                                                    actual_start_time: date.format('YYYY-MM-DD')
                                                }))}

                                            />
                                        </LocalizationProvider>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Actual End Time"
                                                name="actual_end_time"
                                                slots={{ openPickerIcon: DateRangeIcon }}
                                                value={dayjs(personalSubtaskFormData.actual_end_time)}
                                                onChange={(date) => setPersonalSubtaskFormData((prevData) => ({
                                                    ...prevData,
                                                    actual_end_time: date.format('YYYY-MM-DD')
                                                }))}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                    <div className="flex gap-6">
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"

                                                label="priority"
                                                name='Priority'
                                                value={personalSubtaskFormData.Priority}
                                                onChange={(e) => { handleEditPersonalSubtaskChange(e) }}
                                            >
                                                <MenuItem value={priority.high}>High</MenuItem>
                                                <MenuItem value={priority.medium}>Medium</MenuItem>
                                                <MenuItem value={priority.low}>Low</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={personalSubtaskFormData.status}
                                                label="status"
                                                name='status'
                                                onChange={(e) => handleEditPersonalSubtaskChange(e)}
                                            >
                                                <MenuItem value={status.workinprogress}>Work In Progress</MenuItem>
                                                <MenuItem value={status.pending}>Pending</MenuItem>
                                                <MenuItem value={status.onhold}>On Hold</MenuItem>
                                                <MenuItem value={status.completed}>Completed</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="flex gap-6 justify-between">
                                        <TextField
                                            fullWidth
                                            id="outlined-password-input"
                                            label="Planned Budget"
                                            name="planned_budget"
                                            type="text"
                                            value={personalSubtaskFormData.planned_budget}
                                            autoComplete="planned-budget"
                                            onChange={handleEditPersonalSubtaskChange}
                                        />
                                        <TextField
                                            fullWidth
                                            id="outlined-password-input"
                                            label="Actual Budget"
                                            name="actual_budget"
                                            type="text"
                                            value={personalSubtaskFormData.actual_budget}
                                            autoComplete="actual-budget"
                                            onChange={handleEditPersonalSubtaskChange}
                                        />
                                    </div>
                                    <TextField
                                        multiline
                                        fullWidth
                                        rows={3}
                                        name='personalsubtask_description'
                                        label="Personal Subtask Description"
                                        value={personalSubtaskFormData.personalsubtask_description}
                                        onChange={handleEditPersonalSubtaskChange}
                                    />
                                </div>
                                <br />
                                <div className='flex justify-center space-x-5'>
                                    <Button variant="contained" size="medium" onClick={() => setOpen(!open)}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" size="medium" onClick={handleEditPersonalSubtask}>
                                        Save Changes
                                    </Button>
                                </div>
                            </Typography>

                        </>
                    }
                </>
            );
            break;
        case "deletePersonalSubtask":
            modalContent = (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Delete Personal Subtasks From Project
                        </Typography>
                        <Tooltip title="Close">
                            <IconButton onClick={() => { setOpen(!open) }}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <hr />
                    <div className='grid grid-cols-2 justify-content-between mt-4 gap-3 '>
                        {selectedTaskNames && selectedTaskNames.map((personalSubtask) => (
                            <Tooltip key={personalSubtask.personalsubtask_id} title={personalSubtask.personalsubtask_name}>
                                <Chip label={personalSubtask.personalsubtask_name} variant="outlined"
                                // onDelete={handleDeleteSubtask}
                                />
                            </Tooltip>
                        ))}
                    </div>

                    <div className='flex justify-center mt-4'>
                        {/* <Button variant="contained" onClick={handlePersonalSubtaskDelete}>Delete Personal Subtasks</Button> */}
                        {theme === 'theme1' ?
                            <Button variant="contained" onClick={handlePersonalSubtaskDelete}>Delete Personal Subtasks</Button>
                            :
                            <button className='text-white font-bold py-2 px-4 rounded' style={{ background: '#5cd4d0' }} onClick={handlePersonalSubtaskDelete}>Delete Personal Subtasks</button>
                        }
                    </div>

                </>
            );
            break;
        default:
            modalContent = (
                <div>
                    <Typography variant="body1">Unsupported editType: {editType}</Typography>
                </div>
            );
    }

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {editType === 'createUser' ?

                    <Box sx={{ ...style, overflowY: 'hidden' }}>
                        {modalContent}
                    </Box>
                    :
                    <Box sx={style}>
                        {modalContent}
                    </Box>
                }
            </Modal>
            {
                toastOpen.open &&
                <ToastComponent toastOpen={toastOpen} />
            }
        </>
    )
}

export default EditModal