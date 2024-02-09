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
import moment from 'moment';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';

const style = {
    position: 'absolute',
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
    pr: 3
};

const EditModal = ({ open, setOpen, handleClose, projectData, editType }) => {

    let modalContent;

    // Render different content based on editType
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
                                name="projectName"
                                type="text"
                                value={projectData.project_name}
                                autoComplete="project-name"
                            // onChange={(e) => handleCreateProjectChange(e)}
                            />
                            <div className="flex gap-6">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Project Start Date"
                                        name="projectStartDate"
                                        slots={{ openPickerIcon: DateRangeIcon }}
                                        // value={projectData.project_start_date ? moment(projectData.project_start_date, 'YYYY-MM-DD') : null}
                                        defaultValue={dayjs(projectData.project_start_date)}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Project End Date"
                                        name="projectEndDate"
                                        slots={{ openPickerIcon: DateRangeIcon }}
                                        defaultValue={dayjs(projectData.project_end_date)}
                                    // onChange={(date) => {
                                    //     // Format the date and update the state
                                    //     const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                    //     handleCreateProjectChange({ target: { name: 'projectEndDate', value: formattedDate } });
                                    // }}

                                    />
                                </LocalizationProvider>
                            </div>
                            <div className="flex gap-6">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Actual Start Date"
                                        name="actualStartDate"
                                        slots={{ openPickerIcon: DateRangeIcon }}
                                        defaultValue={dayjs(projectData.actual_start_date)}
                                    // onChange={(date) => {
                                    //     // Format the date and update the state
                                    //     const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                    //     handleCreateProjectChange({ target: { name: 'actualStartDate', value: formattedDate } });
                                    // }}

                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Actual End Date"
                                        name="actualEndDate"
                                        slots={{ openPickerIcon: DateRangeIcon }}
                                        defaultValue={dayjs(projectData.actual_end_date)}
                                    // onChange={(date) => {
                                    //     // Format the date and update the state
                                    //     const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                    //     handleCreateProjectChange({ target: { name: 'actualEndDate', value: formattedDate } });
                                    // }}
                                    />
                                </LocalizationProvider>
                            </div>
                            <TextField
                                multiline
                                fullWidth
                                rows={3}
                                name='projectDescription'
                                label="Project Description"
                                value={projectData.project_description}
                            // onChange={(e) => handleCreateProjectChange(e)}
                            />
                        </div>
                        <br />
                        <div className='flex justify-center space-x-5'>
                            <Button variant="contained" size="medium" onClick={() => setOpen(!open)}>
                                Cancel
                            </Button>
                            <Button variant="contained" size="medium" >
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