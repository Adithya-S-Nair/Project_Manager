import React, { useContext } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ThemeContext } from '../Context/ThemeContext';
import GuageChart from '../Components/GuageChart';
import { motion } from 'framer-motion';

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

const MUICard = React.memo(({ project }) => {
    return (
        <Card sx={{ width: '18em' }}>
            <div>
                <GuageChartMemoized project={project} />
            </div>
            <CardContent>
                <Typography className='text-center' variant="h5" component="div">
                    {project.ProjectName}
                </Typography>
                <Typography className='text-center' variant="body2">
                    {project.ProjectDescription}
                </Typography>
            </CardContent>
        </Card>
    );
});

const DaisyUICard = React.memo(({ project }) => {
    return (
        <motion.div
            className="card w-[18em] shadow-xl"
            variants={container}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={item}>
                <GuageChartMemoized project={project} />
            </motion.div>
            <motion.div className="card-body" variants={item}>
                <h2 className="font-bold text-center">{project.ProjectName}</h2>
                <p>{project.ProjectDescription}</p>
            </motion.div>
        </motion.div>
    )
});

const ProjectCard = () => {
    const { theme } = useContext(ThemeContext)
    const projectData = [
        {
            ProjectID: 1,
            ProjectName: 'Project A',
            ProjectDescription: 'Description for Project A',
            Priority: 2,
            StartDate: '2022-02-01',
            EndDate: '2022-03-15',
            TeamID: 1,
        },
        {
            ProjectID: 2,
            ProjectName: 'Project B',
            ProjectDescription: 'Description for Project B',
            Priority: 1,
            StartDate: '2022-03-01',
            EndDate: '2022-04-15',
            TeamID: 2,
        },
        {
            ProjectID: 3,
            ProjectName: 'Project C',
            ProjectDescription: 'Description for Project C',
            Priority: 3,
            StartDate: '2022-04-01',
            EndDate: '2022-05-15',
            TeamID: 3,
        },
        {
            ProjectID: 4,
            ProjectName: 'Project D',
            ProjectDescription: 'Description for Project D',
            Priority: 1,
            StartDate: '2022-05-01',
            EndDate: '2022-06-15',
            TeamID: 1,
        },
        {
            ProjectID: 5,
            ProjectName: 'Project E',
            ProjectDescription: 'Description for Project E',
            Priority: 2,
            StartDate: '2022-06-01',
            EndDate: '2022-07-15',
            TeamID: 2,
        },
        {
            ProjectID: 6,
            ProjectName: 'Project F',
            ProjectDescription: 'Description for Project F',
            Priority: 3,
            StartDate: '2022-07-01',
            EndDate: '2022-08-15',
            TeamID: 3,
        }
    ];

    const CardComponent = theme === 'theme1' ? MUICard : DaisyUICard;

    return (
        <div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 mx-auto text-center`}>
                {projectData.map((project) => (
                    <div key={project.ProjectID} className='inline-block w-full sm:w-1/2 md:w-1/3'>
                        <CardComponent className='p-5' project={project} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectCard;
