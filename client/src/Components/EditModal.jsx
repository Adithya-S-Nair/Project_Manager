import React from 'react'
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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: 24,
    pt: 4,
    pb: 4,
    pl: 3,
    pr: 3
};

const EditModal = ({ open, setOpen, handleClose, projectData }) => {
    console.log(projectData);
    const defaultStartDate = projectData.project_start_date
  ? moment(projectData.project_start_date, 'YYYY-MM-DD').format('MM-DD-YYYY')
  : null;


    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Edit Project Details
                </Typography>
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Project Start Date"
                                name="projectStartDate"
                                slots={{ openPickerIcon: DateRangeIcon }}
                                value={projectData.project_start_date ? moment(projectData.project_start_date, 'YYYY-MM-DD') : null}
                                // onChange={(date) => {
                            //     // Format the date and update the state
                            //     const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                            //     handleCreateProjectChange({ target: { name: 'projectStartDate', value: formattedDate } });
                            // }}

                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Project End Date"
                                name="projectEndDate"
                                slots={{ openPickerIcon: DateRangeIcon }}
                            // onChange={(date) => {
                            //     // Format the date and update the state
                            //     const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                            //     handleCreateProjectChange({ target: { name: 'projectEndDate', value: formattedDate } });
                            // }}

                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Actual Start Date"
                                name="actualStartDate"
                                slots={{ openPickerIcon: DateRangeIcon }}
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
                            // onChange={(date) => {
                            //     // Format the date and update the state
                            //     const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                            //     handleCreateProjectChange({ target: { name: 'actualEndDate', value: formattedDate } });
                            // }}
                            />
                        </LocalizationProvider>
                        <TextField
                            multiline
                            fullWidth
                            rows={3}
                            name='projectDescription'
                            label="Project Description"
                        // value={inputs.projectDescription}
                        // onChange={(e) => handleCreateProjectChange(e)}
                        />
                    </div>
                    <br />
                    <div className='flex justify-center space-x-5'>
                        <Button variant="contained" size="medium">
                            Cancel
                        </Button>
                        <Button variant="contained" size="medium" >
                            Submit
                        </Button>
                    </div>
                </Typography>
            </Box>
        </Modal>
    )
}

export default EditModal