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
import { ThemeContext } from '../../Context/ThemeContext';

const ProjectDashboard = () => {

  /* ------------ Toast State ------------ */

  const [toastOpen, setToastOpen] = useState({ open: false, msg: "" })

  /* ------------ End Of Toast State ------------ */

  /* ---------- Creating project by admin ---------------*/

  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext)

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
    projectId: "",
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
    projectId: "",
    taskId: "",
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
