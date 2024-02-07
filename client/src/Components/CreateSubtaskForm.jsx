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
// import { AuthContext } from '../../Context/AuthContext';
// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { useEffect } from 'react';

const CreateSubtaskForm = ({ setDrawerState, handleCreateSubtaskChange, handleCreate, info, projectDetail, taskDetail }) => {
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
        <div>
            <>
                <div className='flex justify-between p-5'>
                    <h1 className='font-bold '>Subtask</h1>
                    <CloseIcon onClick={() => setDrawerState({ anchor: 'right', open: false, })} />
                </div>
                <hr />

                <div className='grid grid-cols-1 gap-y-6 p-5'>
                    <TextField

                        id="outlined-password-input"
                        label="Subtask Name"
                        type="text"
                        autoComplete="subtask-name"
                        value={info.subtaskName}
                        name='subtaskName'
                        onChange={(e) => { handleCreateSubtaskChange(e) }}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Project Name</InputLabel>

                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Project Name"
                            name='projectId'
                            value={info.projectId}
                            onChange={(e) => { handleCreateSubtaskChange(e) }}

                        >{Array.isArray(projectDetail) && projectDetail.map((data) => (
                            <MenuItem value={data.project_id}>{data.project_name}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Task Name</InputLabel>

                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Task Name"
                            name='taskId'
                            value={info.taskId}

                            onChange={(e) => { handleCreateSubtaskChange(e) }}

                        >{Array.isArray(taskDetail) && taskDetail.map((detail) => (
                            < MenuItem value={detail.task_id} > {detail.task_name}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={info.priority}
                            label="Priority"
                            name='priority'
                            onChange={(e) => { handleCreateSubtaskChange(e) }}
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
                        name='subtaskDescription'
                        label="subtask Description"
                        value={info.projectDescription}
                        onChange={(e) => handleCreateSubtaskChange(e)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Planned Start Date"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            name='plannedStartDate'
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateSubtaskChange({ target: { name: 'plannedStartDate', value: formattedDate } });
                            }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Planned End Date"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            name='plannedEndDate'
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateSubtaskChange({ target: { name: 'plannedEndDate', value: formattedDate } });
                            }} />
                    </LocalizationProvider>
                    <TextField

                        id="outlined-password-input"
                        label="Planned Budget"
                        type="text"
                        autoComplete="planned-budget"
                        name='plannedBudget'
                        value={info.plannedBudget}
                        onChange={(e) => { handleCreateSubtaskChange(e) }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Actual Start Time"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateSubtaskChange({ target: { name: 'actualStartTime', value: formattedDate } });
                            }}
                            name='actualStartTime'
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Actual End Time"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateSubtaskChange({ target: { name: 'actualEndTime', value: formattedDate } });
                            }}
                            name='actualEndTime'
                        />
                    </LocalizationProvider>
                    <TextField

                        id="outlined-password-input"
                        label="Actual Budget"
                        type="text"
                        autoComplete="actual-budget"
                        name='actualBudget'
                        value={info.actualBudget}
                        onChange={(e) => { handleCreateSubtaskChange(e) }}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={info.status}
                            label="status"
                            name='status'
                            onChange={(e) => { handleCreateSubtaskChange(e) }}
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
            </>
        </div >
    )
}

export default CreateSubtaskForm