// ProjectDashboard.js
import React, { useContext, useRef, useState } from 'react';
import ProjectCard from '../../Components/ProjectCard';
import Drawer from '@mui/material/Drawer';
import FloatingActionButtonComponent from '../../Components/FloatingActionButtonComponent';
import PageTitle from '../../Components/PageTitle';
import Box from '@mui/material/Box';
import { makeRequest } from '../../Axios';
import { AuthContext } from '../../Context/AuthContext';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import ToastComponent from '../../Components/ToastComponent';
import CreateProjectForm from '../../Components/CreateProjectForm';
import CreateTaskForm from '../../Components/CreateTaskForm ';
import CreateSubtaskForm from '../../Components/CreateSubtaskForm';

const ProjectDashboard = () => {

  /* ------------ Toast State ------------ */

  const [toastOpen, setToastOpen] = useState({ open: false, msg: "" })

  /* ------------ End Of Toast State ------------ */

  /* ---------- Creating project by admin ---------------*/

  const { user } = useContext(AuthContext);
  const [projectid, setProjectid] = React.useState(0);
  const [type, setType] = useState(null);
  const [daisyType, setDaisyType] = useState(null);
  const [projectDetail, setProjectDetail] = useState([]);
  const [drawerState, setDrawerState] = useState({
    anchor: 'right',
    open: false,
  });

  const [inputs, setInputs] = useState({
    projectName: "",
    projectStartDate: "",
    projectEndDate: "",
    actualStartDate: "",
    actualEndDate: "",
    projectDescription: ""
  });

  const toggleDrawer = (open) => (event) => {

    // console.log('Toggling drawer:', open);

    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerState({ ...drawerState, open });

  };

  const handleCreateProjectChange = (e) => {

    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  };

  const queryClient = useQueryClient()

  const createProjectMutation = useMutation((newProjectData) => {
    makeRequest.post("/project/createproject", newProjectData)
      .then((res) => {
        setToastOpen({ open: true, msg: "project  created successfully" })
        setInputs({
          projectName: "",
          projectStartDate: "",
          projectEndDate: "",
          actualStartDate: "",
          actualEndDate: "",
          projectDescription: ""
        })
        // setProjectCreated(true);
        setDrawerState({ anchor: 'right', open: false, });

      }).catch((error) => {
        console.log(error);
      })
  }, {
    onSuccess: () => {

      setProjectid((prev) => prev + 1);
      queryClient.invalidateQueries(["projectIdAndName"]);

    },
  })

  /* ---------- End of Creating project by admin ------------*/

  /* ----------- Creating task by admin ----------------*/

  const [taskid, setTaskid] = useState(0);
  const [taskDetail, setTaskDetail] = useState([]);
  const [input, setInput] = useState({
    taskName: "",
    projectName: "",
    priority: "",
    taskDescription: "",
    plannedStartDate: "",
    plannedEndDate: "",
    actualStartTime: "",
    actualEndTime: "",
    status: ""
  });

  const handleCreateTaskChange = (e) => {

    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  };

  const { isLoading, error, data } = useQuery(["projectIdAndName", projectid], () =>

    makeRequest.get('/project/getprojectidandname')
      .then((res) => {

        setProjectDetail(res.data);
      }).catch((err) => {
        console.log(err);
      })
  )

  const createTaskMutation = useMutation((newTaskData) => {
    makeRequest.post("/task/createnewtask", newTaskData)
      .then((res) => {
        setToastOpen({ open: true, msg: "Task  created successfully" })
        setInput({
          taskName: "",
          projectName: "",
          priority: "",
          taskDescription: "",
          plannedStartDate: "",
          plannedEndDate: "",
          plannedBudget: "",
          actualStartTime: "",
          actualEndTime: "",
          actualBudget: "",
          status: ""
        })
        setDrawerState({ anchor: 'right', open: false, })
      }).catch((error) => {
        console.log(error);
      })
  }, {
    onSuccess: () => {

      setTaskid((prev) => prev + 1);
      queryClient.invalidateQueries(["taskIdAndName"])
    },
  })

  /* ----------- End of creating task by admin ------------- */

  /* ----------- creating subtask by admin ---------------- */

  const [info, setInfo] = useState({
    subtaskName: "",
    projectName: "",
    taskName: "",
    priority: "",
    subtaskDescription: "",
    plannedStartDate: "",
    plannedEndDate: "",
    plannedBudget: "",
    actualStartTime: "",
    actualEndTime: "",
    actualBudget: "",
    status: ""
  });

  const handleCreateSubtaskChange = (e) => {

    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  };

  const { isloading, err, value } = useQuery(["taskIdAndName", taskid], () =>
    makeRequest.get('/task/gettaskidandname')
      .then((res) => {
        console.log(res.data);
        setTaskDetail(res.data);
      }).catch((err) => {
        console.log(err);
      })
  )

  const createSubtaskMutation = useMutation((newSubtaskData) => {
    makeRequest.post("/subtask/createnewsubtask", newSubtaskData)
      .then((res) => {
        setToastOpen({ open: true, msg: "Subtask  created successfully" })
        setInfo({
          subtaskName: "",
          projectName: "",
          taskName: "",
          priority: "",
          subtaskDescription: "",
          plannedStartDate: "",
          plannedEndDate: "",
          plannedBudget: "",
          actualStartTime: "",
          actualEndTime: "",
          actualBudget: "",
        })
        setDrawerState({ anchor: 'right', open: false, })

      }).catch((error) => {
        console.log(error);
      })
  }, {
    onSuccess: () => {

      queryClient.invalidateQueries(["user"])
    },
  })

  /* ------------ End of creating subtask by admin ------------- */

  const handleCreate = () => {
    console.log(type);
    if (user.user_type === "Admin" && type === "createproject") {
      createProjectMutation.mutate(inputs)
    } else if (user.user_type === "Admin" && type === "createtask") {
      createTaskMutation.mutate(input)
    } else if (user.user_type === "Admin" && type === "createsubtask") {
      createSubtaskMutation.mutate(info)
    }
  }

  const list = () => (
    // <Box
    //   sx={{ width: drawerState.anchor === 'top' || drawerState.anchor === 'bottom' ? 'auto' : 500 }}
    //   role="presentation"
    // // onClick={toggleDrawer(true)}
    // // onKeyDown={toggleDrawer(true)}
    // >
    //   <>
    //     {type === "createproject" &&
    //       <>
    //         <div className='flex justify-between p-5'>
    //           <h1 className='font-bold '>Project</h1>
    //           <CloseIcon onClick={() => setDrawerState({ anchor: 'right', open: false, })} />
    //         </div>
    //         <hr />

    //         <div className='grid grid-cols-1 gap-y-6 p-5'>
    //           <TextField

    //             id="outlined-password-input"
    //             label="Project Name"
    //             name="projectName"
    //             type="text"
    //             value={inputs.projectName}
    //             autoComplete="project-name"
    //             onChange={(e) => handleCreateProjectChange(e)}
    //           />
    //           <LocalizationProvider dateAdapter={AdapterDayjs}>
    //             <DatePicker
    //               label="Project Start Date"
    //               name="projectStartDate"
    //               slots={{ openPickerIcon: DateRangeIcon }}
    //               onChange={(date) => {
    //                 // Format the date and update the state
    //                 const formattedDate = date ? date.format('YYYY-MM-DD') : '';
    //                 handleCreateProjectChange({ target: { name: 'projectStartDate', value: formattedDate } });
    //               }}

    //             />
    //           </LocalizationProvider>
    //           <LocalizationProvider dateAdapter={AdapterDayjs}>
    //             <DatePicker
    //               label="Project End Date"
    //               name="projectEndDate"
    //               slots={{ openPickerIcon: DateRangeIcon }}
    //               onChange={(date) => {
    //                 // Format the date and update the state
    //                 const formattedDate = date ? date.format('YYYY-MM-DD') : '';
    //                 handleCreateProjectChange({ target: { name: 'projectEndDate', value: formattedDate } });
    //               }}

    //             />
    //           </LocalizationProvider>
    //           <LocalizationProvider dateAdapter={AdapterDayjs}>
    //             <DatePicker
    //               label="Actual Start Date"
    //               name="actualStartDate"
    //               slots={{ openPickerIcon: DateRangeIcon }}
    //               onChange={(date) => {
    //                 // Format the date and update the state
    //                 const formattedDate = date ? date.format('YYYY-MM-DD') : '';
    //                 handleCreateProjectChange({ target: { name: 'actualStartDate', value: formattedDate } });
    //               }}

    //             />
    //           </LocalizationProvider>
    //           <LocalizationProvider dateAdapter={AdapterDayjs}>
    //             <DatePicker
    //               label="Actual End Date"
    //               name="actualEndDate"
    //               slots={{ openPickerIcon: DateRangeIcon }}
    //               onChange={(date) => {
    //                 // Format the date and update the state
    //                 const formattedDate = date ? date.format('YYYY-MM-DD') : '';
    //                 handleCreateProjectChange({ target: { name: 'actualEndDate', value: formattedDate } });
    //               }}
    //             />
    //           </LocalizationProvider>
    //           <TextField
    //             multiline
    //             fullWidth
    //             rows={3}
    //             name='projectDescription'
    //             label="Project Description"
    //             value={inputs.projectDescription}
    //             onChange={(e) => handleCreateProjectChange(e)}
    //           />
    //         </div>
    //         <div className='flex justify-center space-x-5'>
    //           <Button variant="contained" size="medium" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
    //             Cancel
    //           </Button>
    //           <Button variant="contained" size="medium" onClick={handleCreate}>
    //             Submit
    //           </Button>
    //         </div>
    //       </>
    //     }

    //     {type === "createtask" &&
    // <>
    //   <div className='flex justify-between p-5'>
    //     <h1 className='font-bold '>Task</h1>
    //     <CloseIcon onClick={() => setDrawerState({ anchor: 'right', open: false, })} />
    //   </div>
    //   <hr />

    //   <div className='grid grid-cols-1 gap-y-6 p-5'>
    //     <TextField

    //       id="outlined-password-input"
    //       label="Task Name"
    //       type="text"
    //       autoComplete="task-name"
    //       value={input.taskName}
    //       name='taskName'
    //       onChange={(e) => { handleCreateTaskChange(e) }}
    //     />
    //     <FormControl fullWidth>
    //       <InputLabel id="demo-simple-select-label">Project Id</InputLabel>

    //       <Select
    //         labelId="demo-simple-select-label"
    //         id="demo-simple-select"
    //         label="Project Name"
    //         name='projectId'
    //         value={input.projectId}
    //         onChange={(e) => { handleCreateTaskChange(e) }}

    //       >{Array.isArray(projectDetail) && projectDetail.map((details) => (
    //         <MenuItem value={details.project_id}>{details.project_name}</MenuItem>
    //       ))}
    //       </Select>
    //     </FormControl>
    //     <FormControl fullWidth>
    //       <InputLabel id="demo-simple-select-label">Priority</InputLabel>
    //       <Select
    //         labelId="demo-simple-select-label"
    //         id="demo-simple-select"

    //         label="priority"
    //         name='priority'
    //         value={input.priority}
    //         onChange={(e) => { handleCreateTaskChange(e) }}
    //       >
    //         <MenuItem value={10}>Ten</MenuItem>
    //         <MenuItem value={20}>Twenty</MenuItem>
    //         <MenuItem value={30}>Thirty</MenuItem>
    //       </Select>
    //     </FormControl>
    //     <TextField
    //       multiline
    //       fullWidth
    //       rows={3}
    //       name='taskDescription'
    //       label="Task Description"
    //       value={input.projectDescription}
    //       onChange={(e) => handleCreateTaskChange(e)}
    //     />
    //     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //       <DatePicker
    //         label="Planned Start Date"
    //         slots={{ openPickerIcon: DateRangeIcon }}
    //         name='plannedStartDate'
    //         // value={input.plannedStartDate}
    //         onChange={(date) => {
    //           // Format the date and update the state
    //           const formattedDate = date ? date.format('YYYY-MM-DD') : '';
    //           handleCreateTaskChange({ target: { name: 'plannedStartDate', value: formattedDate } });
    //         }}
    //       />
    //     </LocalizationProvider>
    //     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //       <DatePicker
    //         label="Planned End Date"
    //         slots={{ openPickerIcon: DateRangeIcon }}
    //         name='plannedEndDate'
    //         // value={input.plannedEndDate}
    //         onChange={(date) => {
    //           // Format the date and update the state
    //           const formattedDate = date ? date.format('YYYY-MM-DD') : '';
    //           handleCreateTaskChange({ target: { name: 'plannedEndDate', value: formattedDate } });
    //         }} />
    //     </LocalizationProvider>
    //     <TextField

    //       id="outlined-password-input"
    //       label="Planned Budget"
    //       type="text"
    //       autoComplete="planned-budget"
    //       name='plannedBudget'
    //       value={input.plannedBudget}
    //       onChange={(e) => { handleCreateTaskChange(e) }}
    //     />
    //     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //       <DatePicker
    //         label="Actual Start Time"
    //         slots={{ openPickerIcon: DateRangeIcon }}
    //         onChange={(date) => {
    //           // Format the date and update the state
    //           const formattedDate = date ? date.format('YYYY-MM-DD') : '';
    //           handleCreateTaskChange({ target: { name: 'actualStartTime', value: formattedDate } });
    //         }}
    //         name='actualStartTime'
    //       // value={input.actualStartTime}
    //       />
    //     </LocalizationProvider>
    //     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //       <DatePicker
    //         label="Actual End Time"
    //         slots={{ openPickerIcon: DateRangeIcon }}
    //         onChange={(date) => {
    //           // Format the date and update the state
    //           const formattedDate = date ? date.format('YYYY-MM-DD') : '';
    //           handleCreateTaskChange({ target: { name: 'actualEndTime', value: formattedDate } });
    //         }}
    //         name='actualEndTime'
    //       // value={input.actualEndTime}
    //       />
    //     </LocalizationProvider>
    //     <TextField

    //       id="outlined-password-input"
    //       label="Actual Budget"
    //       type="text"
    //       autoComplete="actual-budget"
    //       name='actualBudget'
    //       value={input.actualBudget}
    //       onChange={(e) => { handleCreateTaskChange(e) }}
    //     />
    //     <FormControl fullWidth>
    //       <InputLabel id="demo-simple-select-label">Status</InputLabel>
    //       <Select
    //         labelId="demo-simple-select-label"
    //         id="demo-simple-select"
    //         value={input.status}
    //         label="status"
    //         name='status'
    //         onChange={(e) => { handleCreateTaskChange(e) }}
    //       >
    //         <MenuItem value={10}>Ten</MenuItem>
    //         <MenuItem value={20}>Twenty</MenuItem>
    //         <MenuItem value={30}>Thirty</MenuItem>
    //       </Select>
    //     </FormControl>
    //   </div>
    //   <div className='flex justify-center space-x-5 mb-4'>
    //     <Button variant="contained" size="medium" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
    //       Cancel
    //     </Button>
    //     <Button variant="contained" size="medium" onClick={handleCreate}>
    //       Submit
    //     </Button>
    //   </div>
    // </>
    //     }

    //     {type === "createsubtask" &&
    // <>
    //   <div className='flex justify-between p-5'>
    //     <h1 className='font-bold '>Subtask</h1>
    //     <CloseIcon onClick={() => setDrawerState({ anchor: 'right', open: false, })} />
    //   </div>
    //   <hr />

    //   <div className='grid grid-cols-1 gap-y-6 p-5'>
    //     <TextField

    //       id="outlined-password-input"
    //       label="Subask Name"
    //       type="text"
    //       autoComplete="subtask-name"
    //     />
    //     <FormControl fullWidth>
    //       <InputLabel id="demo-simple-select-label">Project Id</InputLabel>
    //       <Select
    //         labelId="demo-simple-select-label"
    //         id="demo-simple-select"
    //         value={projectId}
    //         label="projectId"
    //         onChange={handleChange}
    //       >
    //         <MenuItem value={10}>Ten</MenuItem>
    //         <MenuItem value={20}>Twenty</MenuItem>
    //         <MenuItem value={30}>Thirty</MenuItem>
    //       </Select>
    //     </FormControl>
    //     <FormControl fullWidth>
    //       <InputLabel id="demo-simple-select-label">Priority</InputLabel>
    //       <Select
    //         labelId="demo-simple-select-label"
    //         id="demo-simple-select"
    //         value={priority}
    //         label="projectId"
    //         onChange={handleChanges}
    //       >
    //         <MenuItem value={10}>Ten</MenuItem>
    //         <MenuItem value={20}>Twenty</MenuItem>
    //         <MenuItem value={30}>Thirty</MenuItem>
    //       </Select>
    //     </FormControl>
    //     <TextField className='w-full' aria-label="minimum height" minRows={3} placeholder="Minimum 3 rows" />
    //     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //       <DatePicker
    //         label="Planned Start Date"
    //         slots={{ openPickerIcon: DateRangeIcon }}
    //       />
    //     </LocalizationProvider>
    //     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //       <DatePicker
    //         label="Planned End Date"
    //         slots={{ openPickerIcon: DateRangeIcon }}
    //       />
    //     </LocalizationProvider>
    //     <TextField

    //       id="outlined-password-input"
    //       label="Planned Budget"
    //       type="text"
    //       autoComplete="planned-budget"
    //     />
    //     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //       <DatePicker
    //         label="Actual Start Time"
    //         slots={{ openPickerIcon: DateRangeIcon }}
    //       />
    //     </LocalizationProvider>
    //     <LocalizationProvider dateAdapter={AdapterDayjs}>
    //       <DatePicker
    //         label="Actual End Time"
    //         slots={{ openPickerIcon: DateRangeIcon }}
    //       />
    //     </LocalizationProvider>
    //     <FormControl fullWidth>
    //       <InputLabel id="demo-simple-select-label">Status</InputLabel>
    //       <Select
    //         labelId="demo-simple-select-label"
    //         id="demo-simple-select"
    //         value={subtaskStatus}
    //         label="status"
    //         onChange={subtaskStatushandleChange}
    //       >
    //         <MenuItem value={10}>Ten</MenuItem>
    //         <MenuItem value={20}>Twenty</MenuItem>
    //         <MenuItem value={30}>Thirty</MenuItem>
    //       </Select>
    //     </FormControl>
    //   </div>
    //   <div className='flex justify-center space-x-5 mb-4'>
    //     <Button variant="contained" size="medium" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
    //       Cancel
    //     </Button>
    //     <Button variant="contained" size="medium" >
    //       Submit
    //     </Button>
    //   </div>
    // </>
    //     }

    //     {
    //       daisyType === "createproject" &&
    //       <>
    //         <div className='flex justify-between p-5'>
    //           <h1 className='font-bold '>Project</h1>
    //           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
    //             <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    //           </svg>
    //         </div>
    //         <hr />

    //         <div className='grid grid-cols-1 gap-y-4 p-5'>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Project Name:</label>
    //             <input type="text" placeholder="Enter Project Name" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Project Start Date:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Project End Date:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Actual Start Date:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Actual End Date:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Project Description:</label>
    //             <textarea className="textarea textarea-bordered" placeholder="Describe About Your Project"></textarea>
    //           </div>
    //         </div>

    //         <div className='flex justify-center space-x-5 mb-4'>
    //           <button className="btn btn-active btn-primary" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>Cancel</button>
    //           <button className="btn btn-active btn-primary">Submit</button>
    //         </div>
    //       </>
    //     }

    //     {
    //       daisyType === "createtask" &&
    //       <>
    //         <div className='flex justify-between p-5'>
    //           <h1 className='font-bold '>Task</h1>
    //           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
    //             <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    //           </svg>
    //         </div>
    //         <hr />

    //         <div className='grid grid-cols-1 gap-y-4 p-5'>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Task Name:</label>
    //             <input type="text" placeholder="Enter Project Name" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Project Id:</label>
    //             <select className="select select-bordered">
    //               <option selected>hi</option>
    //               <option>Han Solo</option>
    //               <option>Greedo</option>
    //             </select>
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Priority:</label>
    //             <select className="select select-bordered">
    //               <option selected>hi</option>
    //               <option>Han Solo</option>
    //               <option>Greedo</option>
    //             </select>
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Project Description:</label>
    //             <textarea className="textarea textarea-bordered" placeholder="Describe About Your Project"></textarea>
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Planned Start Date:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Planned End Date:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Planned Budget:</label>
    //             <input type="text" placeholder="Enter Project Name" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Actual Start Time:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Actual End Time:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Status:</label>
    //             <select className="select select-bordered">
    //               <option selected>hi</option>
    //               <option>Han Solo</option>
    //               <option>Greedo</option>
    //             </select>
    //           </div>
    //         </div>

    //         <div className='flex justify-center space-x-5 mb-4'>
    //           <button className="btn btn-active btn-primary" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>Cancel</button>
    //           <button className="btn btn-active btn-primary">Submit</button>
    //         </div>
    //       </>
    //     }

    //     {
    //       daisyType === "createsubtask" &&
    //       <>
    //         <div className='flex justify-between p-5'>
    //           <h1 className='font-bold '>Subtask</h1>
    //           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
    //             <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    //           </svg>
    //         </div>
    //         <hr />

    //         <div className='grid grid-cols-1 gap-y-4 p-5'>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Subtask Name:</label>
    //             <input type="text" placeholder="Enter Project Name" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Project Id:</label>
    //             <select className="select select-bordered">
    //               <option selected>hi</option>
    //               <option>Han Solo</option>
    //               <option>Greedo</option>
    //             </select>
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Priority:</label>
    //             <select className="select select-bordered">
    //               <option selected>hi</option>
    //               <option>Han Solo</option>
    //               <option>Greedo</option>
    //             </select>
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Project Description:</label>
    //             <textarea className="textarea textarea-bordered" placeholder="Describe About Your Project"></textarea>
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Planned Start Date:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Planned End Date:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Planned Budget:</label>
    //             <input type="text" placeholder="Enter Project Name" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Actual Start Time:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Actual End Time:</label>
    //             <input type="date" placeholder="" className="input input-bordered" />
    //           </div>
    //           <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
    //             <label>Status:</label>
    //             <select className="select select-bordered">
    //               <option selected>hi</option>
    //               <option>Han Solo</option>
    //               <option>Greedo</option>
    //             </select>
    //           </div>
    //         </div>

    //         <div className='flex justify-center space-x-5 mb-4'>
    //           <button className="btn btn-active btn-primary" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>Cancel</button>
    //           <button className="btn btn-active btn-primary">Submit</button>
    //         </div>
    //       </>
    //     }

    //   </>
    // </Box >

    <Box
      sx={{ width: drawerState.anchor === 'top' || drawerState.anchor === 'bottom' ? 'auto' : 500 }}
      role="presentation"
    >
      {type === "createproject" && (
        <CreateProjectForm
          setDrawerState={setDrawerState}
          handleCreateProjectChange={handleCreateProjectChange}
          handleCreate={handleCreate}
          inputs={inputs}
        />
      )}
      {isLoading
        ? "loading"
        : type === "createtask"
          ? (
            <CreateTaskForm
              setDrawerState={setDrawerState}
              handleCreateTaskChange={handleCreateTaskChange}
              handleCreate={handleCreate}
              input={input}
              projectDetail={projectDetail}
            />
          )
          : error
      }
      {isloading
        ? "loading"
        : type === "createsubtask"
          ? (
            <CreateSubtaskForm
              setDrawerState={setDrawerState}
              handleCreateSubtaskChange={handleCreateSubtaskChange}
              handleCreate={handleCreate}
              info={info}
              projectDetail={projectDetail}
              taskDetail={taskDetail}
            />)
          : err
      }
    </Box>

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
      {
        toastOpen.open &&
        <ToastComponent toastOpen={toastOpen} />
      }

    </>
  );
};

export default ProjectDashboard;
