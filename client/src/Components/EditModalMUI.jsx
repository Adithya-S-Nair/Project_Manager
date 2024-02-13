import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeRequest } from '../Axios';
import { useQuery } from 'react-query';

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

const EditModal = ({ open, setOpen, handleClose, projectData, editType, selectedTask, employeeName, selectedTaskId, selectedTaskNames }) => {

    let modalContent;
    const [employeeId, setEmployeeId] = React.useState('');
    const [projectId, setProjectId] = React.useState('');
    const [formData, setFormData] = useState({ ...projectData });
    const [taskFormData, setTaskFormData] = useState();

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

    console.log(selectedTaskNames);
    console.log(selectedTaskId);
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

    const handleEmployeeSubmit = () => {
        makeRequest.post(`/assign/assigntask`, data)
            .then(response => {
                console.log('Data sent successfully:', response.data);
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
    }

    // console.log(selectedTask);
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
                console.log("project updated successfully");
            }).catch((error) => {
                console.log("task updating error:", error);
            })
    }

    const handleTaskDelete = () => {
        console.log(selectedTaskId);
        makeRequest.delete(`/task/deletemultipletask/${selectedTaskId}`)
            .then((res) => {
                console.log("deleted successfully");
            }).catch((error) => {
                console.log("error in deleting");
            })
    }

    const handleEmployeeSubtaskSubmit = () =>{
        makeRequest.post(`/assign/assigntask`, data)
        .then(response => {
            console.log('Data sent successfully:', response.data);
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
    }

    console.log(editType);
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
                            // onChange={(e) => handleCreateProjectChange(e)}
                            />
                        </div>
                        <br />
                        <div className='flex justify-center space-x-5'>
                            <Button variant="contained" size="medium" onClick={() => setOpen(!open)}>
                                Cancel
                            </Button>
                            <Button variant="contained" size="medium" onClick={handleSubmit}>
                                Save Changes
                            </Button>
                        </div>
                    </Typography>
                </>
            )
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
                                <Chip label={task.task_name} variant="outlined" onDelete={handleDeleteTask} />
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
                                        label="Task Name"
                                        name="task_name"
                                        type="text"
                                        value={taskFormData.task_name}
                                        onChange={handleTaskChange}

                                    // onChange={(e) => handleCreateProjectChange(e)}
                                    />
                                    <div className='mt-7'>
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
                                                {editTaskProjectName && editTaskProjectName.map((project) => (
                                                    <MenuItem
                                                        key={project.project_id}
                                                        value={project.project_id}
                                                    // selected={project.project_id === editTaskData.project_id}
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
                                                value={taskFormData.priority}
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
                                    <div className="flex gap-6">
                                        <TextField
                                            id="outlined-password-input"
                                            label="Planned Budget"
                                            name="planned_budget"
                                            type="text"
                                            value={taskFormData.planned_budget}
                                            autoComplete="planned-budget"
                                            onChange={handleTaskChange}
                                        />
                                        <TextField
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
                                <Chip label={task.task_name} variant="outlined" onDelete={handleDeleteTask} />
                            </Tooltip>
                        ))}
                    </div>

                    <div className='flex justify-center mt-4'>
                        <Button variant="contained" onClick={handleTaskDelete}>Delete Tasks</Button>
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
                                <Chip label={subtask.subtask_name} variant="outlined" onDelete={handleDeleteTask} />
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
        default:
            modalContent = (
                <div>
                    <Typography variant="body1">Unsupported editType: {editType}</Typography>
                </div>
            );
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {modalContent}
            </Box>
        </Modal>
    )
}

export default EditModal