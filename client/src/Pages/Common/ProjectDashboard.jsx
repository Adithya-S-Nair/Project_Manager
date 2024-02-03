// ProjectDashboard.js
import React, { useState } from 'react';
import ProjectCard from '../../Components/ProjectCard';
import Drawer from '@mui/material/Drawer';
import FloatingActionButtonComponent from '../../Components/FloatingActionButtonComponent';
import PageTitle from '../../Components/PageTitle';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close'; import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

const ProjectDashboard = () => {

  const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#1976d2',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
  };

  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };

  const Textarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
   
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: black;
    }

    &:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );

  const [projectId, setProjectId] = React.useState('');

  const handleChange = (event) => {
    setProjectId(event.target.value);
  };

  const [priority, setPriority] = React.useState('');

  const handleChanges = (event) => {
    setPriority(event.target.value);
  };

  const [taskStatus, setTaskStatus] = React.useState('');

  const taskStatushandleChange = (event) => {
    setTaskStatus(event.target.value);
  };

  const [subtaskStatus, setsubtaskStatus] = React.useState('');

  const subtaskStatushandleChange = (event) => {
    setsubtaskStatus(event.target.value);
  };

  const [type, setType] = useState(null)
  const [daisyType, setDaisyType] = useState(null)
  const [drawerState, setDrawerState] = useState({
    anchor: 'right',
    open: false,
  });

  const toggleDrawer = (open) => (event) => {
    console.log('Toggling drawer:', open);

    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerState({ ...drawerState, open });
  };

  const list = () => (
    <Box
      sx={{ width: drawerState.anchor === 'top' || drawerState.anchor === 'bottom' ? 'auto' : 500 }}
      role="presentation"
    // onClick={toggleDrawer(true)}
    // onKeyDown={toggleDrawer(true)}
    >
      <>
        {type === "createproject" &&
          <>
            <div className='flex justify-between p-5'>
              <h1 className='font-bold '>Project</h1>
              <CloseIcon onClick={() => setDrawerState({ anchor: 'right', open: false, })} />
            </div>
            <hr />

            <div className='grid grid-cols-1 gap-y-6 p-5'>
              <TextField

                id="outlined-password-input"
                label="Project Name"
                type="text"
                autoComplete="project-name"
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Actual Start Date"
                  slots={{ openPickerIcon: DateRangeIcon }}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Actual End Date"
                  slots={{ openPickerIcon: DateRangeIcon }}
                />
              </LocalizationProvider>
              <Textarea className='w-full' aria-label="minimum height" minRows={3} placeholder="Minimum 3 rows" />
            </div>
            <div className='flex justify-center space-x-5'>
              <Button variant="contained" size="medium" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
                Cancel
              </Button>
              <Button variant="contained" size="medium" >
                Submit
              </Button>
            </div>
          </>
        }

        {type === "createtask" &&
          <>
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
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Project Id</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={projectId}
                  label="projectId"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={priority}
                  label="projectId"
                  onChange={handleChanges}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <Textarea className='w-full' aria-label="minimum height" minRows={3} placeholder="Minimum 3 rows" />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Planned Start Date"
                  slots={{ openPickerIcon: DateRangeIcon }}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Planned End Date"
                  slots={{ openPickerIcon: DateRangeIcon }}
                />
              </LocalizationProvider>
              <TextField

                id="outlined-password-input"
                label="Planned Budget"
                type="text"
                autoComplete="planned-budget"
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Actual Start Time"
                  slots={{ openPickerIcon: DateRangeIcon }}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Actual End Time"
                  slots={{ openPickerIcon: DateRangeIcon }}
                />
              </LocalizationProvider>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={taskStatus}
                  label="status"
                  onChange={taskStatushandleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className='flex justify-center space-x-5 mb-4'>
              <Button variant="contained" size="medium" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
                Cancel
              </Button>
              <Button variant="contained" size="medium" >
                Submit
              </Button>
            </div>
          </>
        }

        {type === "createsubtask" &&
          <>
            <div className='flex justify-between p-5'>
              <h1 className='font-bold '>Subtask</h1>
              <CloseIcon onClick={() => setDrawerState({ anchor: 'right', open: false, })} />
            </div>
            <hr />

            <div className='grid grid-cols-1 gap-y-6 p-5'>
              <TextField

                id="outlined-password-input"
                label="Subask Name"
                type="text"
                autoComplete="subtask-name"
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Project Id</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={projectId}
                  label="projectId"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={priority}
                  label="projectId"
                  onChange={handleChanges}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <Textarea className='w-full' aria-label="minimum height" minRows={3} placeholder="Minimum 3 rows" />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Planned Start Date"
                  slots={{ openPickerIcon: DateRangeIcon }}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Planned End Date"
                  slots={{ openPickerIcon: DateRangeIcon }}
                />
              </LocalizationProvider>
              <TextField

                id="outlined-password-input"
                label="Planned Budget"
                type="text"
                autoComplete="planned-budget"
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Actual Start Time"
                  slots={{ openPickerIcon: DateRangeIcon }}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Actual End Time"
                  slots={{ openPickerIcon: DateRangeIcon }}
                />
              </LocalizationProvider>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={subtaskStatus}
                  label="status"
                  onChange={subtaskStatushandleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className='flex justify-center space-x-5 mb-4'>
              <Button variant="contained" size="medium" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
                Cancel
              </Button>
              <Button variant="contained" size="medium" >
                Submit
              </Button>
            </div>
          </>
        }

        {
          daisyType === "createproject" &&
          <>
            <div className='flex justify-between p-5'>
              <h1 className='font-bold '>Project</h1>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <hr />

            <div className='grid grid-cols-1 gap-y-4 p-5'>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Project Name:</label>
                <input type="text" placeholder="Enter Project Name" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Actual Start Date:</label>
                <input type="date" placeholder="" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Actual End Date:</label>
                <input type="date" placeholder="" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Project Description:</label>
                <textarea className="textarea textarea-bordered" placeholder="Describe About Your Project"></textarea>
              </div>
            </div>

            <div className='flex justify-center space-x-5 mb-4'>
              <button className="btn btn-active btn-primary" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>Cancel</button>
              <button className="btn btn-active btn-primary">Submit</button>
            </div>
          </>
        }

        {
          daisyType === "createtask" &&
          <>
            <div className='flex justify-between p-5'>
              <h1 className='font-bold '>Task</h1>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <hr />

            <div className='grid grid-cols-1 gap-y-4 p-5'>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Task Name:</label>
                <input type="text" placeholder="Enter Project Name" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Project Id:</label>
                <select className="select select-bordered">
                  <option selected>hi</option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Priority:</label>
                <select className="select select-bordered">
                  <option selected>hi</option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Project Description:</label>
                <textarea className="textarea textarea-bordered" placeholder="Describe About Your Project"></textarea>
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Planned Start Date:</label>
                <input type="date" placeholder="" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Planned End Date:</label>
                <input type="date" placeholder="" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Planned Budget:</label>
                <input type="text" placeholder="Enter Project Name" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Actual Start Time:</label>
                <input type="date" placeholder="" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Actual End Time:</label>
                <input type="date" placeholder="" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Status:</label>
                <select className="select select-bordered">
                  <option selected>hi</option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>
            </div>

            <div className='flex justify-center space-x-5 mb-4'>
              <button className="btn btn-active btn-primary" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>Cancel</button>
              <button className="btn btn-active btn-primary">Submit</button>
            </div>
          </>
        }

{
          daisyType === "createsubtask" &&
          <>
            <div className='flex justify-between p-5'>
              <h1 className='font-bold '>Subtask</h1>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <hr />

            <div className='grid grid-cols-1 gap-y-4 p-5'>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Subtask Name:</label>
                <input type="text" placeholder="Enter Project Name" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Project Id:</label>
                <select className="select select-bordered">
                  <option selected>hi</option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Priority:</label>
                <select className="select select-bordered">
                  <option selected>hi</option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Project Description:</label>
                <textarea className="textarea textarea-bordered" placeholder="Describe About Your Project"></textarea>
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Planned Start Date:</label>
                <input type="date" placeholder="" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Planned End Date:</label>
                <input type="date" placeholder="" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Planned Budget:</label>
                <input type="text" placeholder="Enter Project Name" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Actual Start Time:</label>
                <input type="date" placeholder="" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Actual End Time:</label>
                <input type="date" placeholder="" className="input input-bordered" />
              </div>
              <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                <label>Status:</label>
                <select className="select select-bordered">
                  <option selected>hi</option>
                  <option>Han Solo</option>
                  <option>Greedo</option>
                </select>
              </div>
            </div>

            <div className='flex justify-center space-x-5 mb-4'>
              <button className="btn btn-active btn-primary" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>Cancel</button>
              <button className="btn btn-active btn-primary">Submit</button>
            </div>
          </>
        }

      </>
    </Box >

  );

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
    <>
      <PageTitle titleText={'Project Dashboard'} titleIcon={titleIcon} />
      <div className="flex justify-center items-center">
        <ProjectCard />
      </div>
      <FloatingActionButtonComponent toggle={() => setDrawerState({ ...drawerState, open: !drawerState.open })} setType={setType} setDaisyType={setDaisyType} />
      <Drawer
        anchor={drawerState.anchor}
        open={drawerState.open}
        onClose={toggleDrawer(false)}
      >
        {list()}
      </Drawer>
    </>
  );
};

export default ProjectDashboard;
