// import React, { useState } from 'react'
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import DateRangeIcon from '@mui/icons-material/DateRange';
// import CloseIcon from '@mui/icons-material/Close';
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import dayjs from 'dayjs';
// import { makeRequest } from '../Axios';

// const style = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 'auto',
//     bgcolor: 'background.paper',
//     border: '2px solid #fff',
//     borderRadius: '1em',
//     boxShadow: 24,
//     pt: 4,
//     pb: 4,
//     pl: 3,
//     pr: 3
// };

// const EditModal = ({ open, setOpen, handleClose, projectData }) => {

//     const [formData, setFormData] = useState({ ...projectData });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     const handleSubmit = () => {

//         if (
//             formData.project_name === '' ||
//             formData.project_start_date === '' ||
//             formData.project_end_date === '' ||
//             formData.actual_start_date === '' ||
//             formData.actual_end_date === ''
//         ) {
//             console.error('Please fill in all required fields');
//             return;
//         }

//         makeRequest.patch(`/project/updateprojectdetail/${projectData.project_id}`, formData)
//             .then((response) => {

//                 console.log('Project updated successfully:', response)
//                 handleClose();

//             })
//             .catch((error) => {
//                 console.error('Error updating project:', error);
//             });
//     }

//     return (
//         <Modal
//             open={open}
//             onClose={handleClose}
//             aria-labelledby="modal-modal-title"
//             aria-describedby="modal-modal-description"
//         >
//             <Box sx={style}>
//                 <div className="flex items-center justify-between mb-2">
//                     <Typography id="modal-modal-title" variant="h6" component="h2">
//                         Edit Project Details
//                     </Typography>
//                     <Tooltip title="Close">
//                         <IconButton onClick={() => { setOpen(!open) }}>
//                             <CloseIcon />
//                         </IconButton>
//                     </Tooltip>
//                 </div>
//                 <hr />
//                 <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//                     <div className='grid grid-cols-1 gap-y-6'>
//                         <TextField
//                             id="outlined-password-input"
//                             label="Project Name"
//                             name="project_name"
//                             type="text"
//                             value={formData.project_name}
//                             autoComplete="project-name"
//                             onChange={handleChange}

//                         // onChange={(e) => handleCreateProjectChange(e)}
//                         />
//                         <div className="flex gap-6">
//                             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DatePicker
//                                     label="Project Start Date"
//                                     name="project_start_date"
//                                     slots={{ openPickerIcon: DateRangeIcon }}
//                                     // value={projectData.project_start_date ? moment(projectData.project_start_date, 'YYYY-MM-DD') : null}
//                                     defaultValue={dayjs(projectData.project_start_date)}
//                                     onChange={(date) => setFormData((prevData) => ({
//                                         ...prevData,
//                                         project_start_date: date.format('YYYY-MM-DD')
//                                     }))}
//                                 />
//                             </LocalizationProvider>
//                             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DatePicker
//                                     label="Project End Date"
//                                     name="project_end_date"
//                                     slots={{ openPickerIcon: DateRangeIcon }}
//                                     defaultValue={dayjs(projectData.project_end_date)}
//                                     onChange={(date) => setFormData((prevData) => ({
//                                         ...prevData,
//                                         project_end_date: date.format('YYYY-MM-DD')
//                                     }))}

//                                 />
//                             </LocalizationProvider>
//                         </div>
//                         <div className="flex gap-6">
//                             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DatePicker
//                                     label="Actual Start Date"
//                                     name="actual_start_date"
//                                     slots={{ openPickerIcon: DateRangeIcon }}
//                                     defaultValue={dayjs(projectData.actual_start_date)}
//                                     onChange={(date) => setFormData((prevData) => ({
//                                         ...prevData,
//                                         actual_start_date: date.format('YYYY-MM-DD')
//                                     }))}

//                                 />
//                             </LocalizationProvider>
//                             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DatePicker
//                                     label="Actual End Date"
//                                     name="actual_end_date"
//                                     slots={{ openPickerIcon: DateRangeIcon }}
//                                     defaultValue={dayjs(projectData.actual_end_date)}
//                                     onChange={(date) => setFormData((prevData) => ({
//                                         ...prevData,
//                                         actual_end_date: date.format('YYYY-MM-DD')
//                                     }))}
//                                 />
//                             </LocalizationProvider>
//                         </div>
//                         <TextField
//                             multiline
//                             fullWidth
//                             rows={3}
//                             name='project_description'
//                             label="Project Description"
//                             value={formData.project_description}
//                         // onChange={(e) => handleCreateProjectChange(e)}
//                         />
//                     </div>
//                     <br />
//                     <div className='flex justify-center space-x-5'>
//                         <Button variant="contained" size="medium" onClick={() => setOpen(!open)}>
//                             Cancel
//                         </Button>
//                         <Button variant="contained" size="medium" onClick={handleSubmit}>
//                             Save Changes
//                         </Button>
//                     </div>
//                 </Typography>
//             </Box>
//         </Modal>
//     )
// }

// export default EditModal