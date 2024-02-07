import React, { useContext, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';



const CreateTaskForm = ({ setDrawerState, handleCreateTaskChange, handleCreate, input, projectDetail }) => {

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

    return (
        <>
            <div>
                <div className='flex justify-between p-5'>
                    <h1 className='font-bold '>Task</h1>
                    <CloseIcon onClick={() => setDrawerState({ anchor: 'right', open: false, })} />
                </div>
                <hr />

                <div className='grid grid-cols-1 gap-y-6 p-5'>
                    <TextField

                        id="outlined-password-input"
                        label="Task Name"
                        type="text"
                        autoComplete="task-name"
                        value={input.taskName}
                        name='taskName'
                        onChange={(e) => { handleCreateTaskChange(e) }}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Project Id</InputLabel>

                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Project Name"
                            name='projectId'
                            value={input.projectId}
                            onChange={(e) => { handleCreateTaskChange(e) }}

                        >{Array.isArray(projectDetail) && projectDetail.map((details) => (
                            <MenuItem value={details.project_id}>{details.project_name}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"

                            label="priority"
                            name='priority'
                            value={input.priority}
                            onChange={(e) => { handleCreateTaskChange(e) }}
                        >
                            <MenuItem value={priority.high}>High</MenuItem>
                            <MenuItem value={priority.medium}>Medium</MenuItem>
                            <MenuItem value={priority.low}>Low</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        multiline
                        fullWidth
                        rows={3}
                        name='taskDescription'
                        label="Task Description"
                        value={input.projectDescription}
                        onChange={(e) => handleCreateTaskChange(e)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Planned Start Date"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            name='plannedStartDate'
                            // value={input.plannedStartDate}
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateTaskChange({ target: { name: 'plannedStartDate', value: formattedDate } });
                            }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Planned End Date"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            name='plannedEndDate'
                            // value={input.plannedEndDate}
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateTaskChange({ target: { name: 'plannedEndDate', value: formattedDate } });
                            }} />
                    </LocalizationProvider>
                    <TextField

                        id="outlined-password-input"
                        label="Planned Budget"
                        type="text"
                        autoComplete="planned-budget"
                        name='plannedBudget'
                        value={input.plannedBudget}
                        onChange={(e) => { handleCreateTaskChange(e) }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Actual Start Time"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateTaskChange({ target: { name: 'actualStartTime', value: formattedDate } });
                            }}
                            name='actualStartTime'
                        // value={input.actualStartTime}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Actual End Time"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateTaskChange({ target: { name: 'actualEndTime', value: formattedDate } });
                            }}
                            name='actualEndTime'
                        // value={input.actualEndTime}
                        />
                    </LocalizationProvider>
                    <TextField

                        id="outlined-password-input"
                        label="Actual Budget"
                        type="text"
                        autoComplete="actual-budget"
                        name='actualBudget'
                        value={input.actualBudget}
                        onChange={(e) => { handleCreateTaskChange(e) }}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={input.status}
                            label="status"
                            name='status'
                            onChange={(e) => { handleCreateTaskChange(e) }}
                        >
                            <MenuItem value={status.workinprogress}>Work In Progress</MenuItem>
                            <MenuItem value={status.pending}>Pending</MenuItem>
                            <MenuItem value={status.onhold}>On Hold</MenuItem>
                            <MenuItem value={status.completed}>Completed</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className='flex justify-center space-x-5 mb-4'>
                    <Button variant="contained" size="medium" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
                        Cancel
                    </Button>
                    <Button variant="contained" size="medium" onClick={handleCreate}>
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default CreateTaskForm 