import * as React from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ArticleIcon from '@mui/icons-material/Article';
import TaskIcon from '@mui/icons-material/Task';
import { useContext } from 'react';
import { ThemeContext } from '../Context/ThemeContext';

const FloatingActionButtonComponent = ({ toggle, setType, setDaisyType }) => {

    const handleCreateItemClick = (itemType) => {
        setType(itemType);
        toggle();
    };

    // const handleItemClick = (itemType) => {
    //     setDaisyType(itemType);
    //     // setParentType(itemType)
    //     toggle();
    // };

    return (
        <>
            {/* {theme === "theme1" ? ( */}
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'fixed', bottom: 30, right: 25 }}
                    icon={<SpeedDialIcon />}
                >
                    <SpeedDialAction
                        icon={<NewspaperIcon />}
                        tooltipTitle="Create Project"
                        onClick={() => handleCreateItemClick('createproject')}
                    />
                    <SpeedDialAction
                        icon={<TaskIcon />}
                        tooltipTitle="Create Task"
                        onClick={() => handleCreateItemClick('createtask')}
                    />
                    <SpeedDialAction
                        icon={<ArticleIcon />}
                        tooltipTitle="Create Subtask"
                        onClick={() => handleCreateItemClick('createsubtask')}
                    />
                </SpeedDial>
            {/* ) : ( */}
                {/* <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'fixed', bottom: 30, right: 25 }}
                    icon={<SpeedDialIcon />}
                >
                    <SpeedDialAction
                        icon={<NewspaperIcon />}
                        tooltipTitle="Create Project"
                        onClick={() => handleItemClick('createproject')}
                    />
                    <SpeedDialAction
                        icon={<TaskIcon />}
                        tooltipTitle="Create Task"
                        onClick={() => handleItemClick('createtask')}
                    />
                    <SpeedDialAction
                        icon={<ArticleIcon />}
                        tooltipTitle="Create Subtask"
                        onClick={() => handleItemClick('createsubtask')}
                    />
                </SpeedDial>
            )} */}
        </>
    )
}
export default FloatingActionButtonComponent;
