import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ArticleIcon from '@mui/icons-material/Article';
import TaskIcon from '@mui/icons-material/Task';

const actions = [
    { icon: <NewspaperIcon />, name: 'Create Project' },
    { icon: <TaskIcon />, name: 'Create Task' },
    { icon: <ArticleIcon />, name: 'Create Subtask' },
];

const FloatingActionButtonComponent = () => {
    return (
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'fixed', bottom: 30, right: 25 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                    />
                ))}
            </SpeedDial>
    );
}

export default FloatingActionButtonComponent;
