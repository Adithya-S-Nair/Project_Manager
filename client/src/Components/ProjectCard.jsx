import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ThemeContext } from '../Context/ThemeContext';
import GuageChart from '../Components/GuageChart';
import { motion } from 'framer-motion';
import { makeRequest } from '../Axios';
import { AuthContext } from '../Context/AuthContext';
import { useQuery, useQueryClient } from 'react-query';

const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
        }
    }
}

const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
}

const GuageChartMemoized = React.memo(GuageChart);

const MUICard = React.memo(({ project, gaugeData }) => {
    return (
        <Card className='cursor-pointer' sx={{ width: '18em' }}>
            <div>
                <GuageChartMemoized gaugeData={gaugeData} />
            </div>
            <CardContent>
                <Typography className='text-center' variant="h5" component="div">
                    {project.project_name}
                </Typography>
                {/* <Typography className='text-center' variant="body2">
                    {project.project_description}
                </Typography> */}
            </CardContent>
        </Card>
    );
});

const DaisyUICard = React.memo(({ project, gaugeData }) => {
    return (
        <motion.div
            className="card w-[18em] shadow-xl cursor-pointer"
            variants={container}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={item}>
                <GuageChartMemoized gaugeData={gaugeData} />
            </motion.div>
            <motion.div className="card-body" variants={item}>
                <h2 className="font-bold text-center font-smooch-sans">{project.project_name}</h2>
                {/* <p>{project.project_description}</p> */}
            </motion.div>
        </motion.div>
    )
});

const ProjectCard = () => {
    const { user } = useContext(AuthContext)
    const { theme } = useContext(ThemeContext)
    const [projectData, setProjectData] = useState([]);
    const [gaugeData, setGaugeData] = useState([]);
    const navigate = useNavigate();
    const queryClient = useQueryClient()

    useEffect(() => {
        makeRequest.get('/project/getallprojects')
            .then((res) => {
                console.log(res.data);
                setProjectData(res.data)
            }).catch((err) => {
                console.log(err);
            })
    }, [projectData])

    // const { isloading: projectDataLoading, err: projectErrorLoading, data: projectInfo} = useQuery(["projectData",projectData], async () => {
    //     console.log("hiiiiiii");
    //     const response = await makeRequest.get('/project/getallprojects')
    //     setProjectData(response.data)
    //     return response.data;
    // },{
    //     staleTime: Infinity, // Keep data fresh indefinitely
    // });

    const { isloading, err, data } = useQuery(["gaugeproject"], () => {
        makeRequest.get('/project/getgaugeprojectcompletionstatus')
            .then((res) => {
                setGaugeData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        });

    //   const [gaugeData, setGaugeData] = useState([]);

    const CardComponent = theme === 'theme1' ? MUICard : DaisyUICard;

    const handleNavigate = (projectId) => {
        if (user.user_type === 'Admin')
            navigate(`/admin/projectdetail/${projectId}`)
        else
            navigate(`/user/projectdetail/${projectId}`)

    }

    // if (projectDataLoading) {
    //     return (
    //         <>Loading</>
    //     )
    // }

    if (projectData && projectData.length === 0) {
        return (
            <p className='flex items-center justify-center'>No Projects to be shown</p>
        )
    }

    return (
        <div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 mx-auto text-center`}>
                {projectData && projectData.map((project, index) => (
                    <div onClick={() => handleNavigate(project.project_id)} key={project.project_id} className='inline-block w-full sm:w-1/2 md:w-1/3'>
                        <CardComponent className='p-5' project={project} gaugeData={gaugeData[index]} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectCard;
