import React, { useContext, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ThemeContext } from '../Context/ThemeContext';
import GuageChart from '../Components/GuageChart';

const MUICard = ({ project }) => {
    return (
        <Card sx={{ width: '18em' }}>
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
};

const DaisyUICard = ({ project }) => {
    return (
        <div className="card w-96 shadow-xl">
            <div>
                <GuageChart project={project} />
            </div>
            <div className="card-body">
                <h2 className="font-bold text-center">{project.ProjectName}</h2>
                <p>{project.ProjectDescription}</p>
            </div>
        </div>
    )
}
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
    return (
        <div>
            {
                theme === 'theme1' &&
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto text-center'>
                    {projectData.map((project) => (
                        <div key={project.ProjectID} className='inline-block'>
                            <MUICard project={project} />
                        </div>
                    ))}
                </div>
            }
            {
                theme === 'theme2' &&
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mx-auto text-center'>
                    {projectData.map((project) => (
                        <div key={project.ProjectID} className='inline-block'>
                            <DaisyUICard project={project} />
                        </div>
                    ))}
                </div>
            }
        </div>
    );
};

export default ProjectCard

