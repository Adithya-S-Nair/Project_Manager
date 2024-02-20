import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { v4 as uuidv4 } from 'uuid';

const TreeViewComponent = ({ treeData, handleItemClick }) => {
    const [expanded, setExpanded] = React.useState([]);
    const [selected, setSelected] = React.useState([0]);
    var uniqueId = 0;

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };

    const handleSelect = (event, nodeIds) => {
        setSelected(nodeIds);
    };

    const handleExpandClick = () => {
        setExpanded((oldExpanded) =>
            oldExpanded.length === 0 ? ['0', '12', '16'] : [],
        );
    };

    return (
        <Box sx={{ minHeight: 270, flexGrow: 1, maxWidth: 300 }}>
            <Box sx={{ mb: 1 }}>
                <Button onClick={handleExpandClick}>
                    {expanded.length === 0 ? 'Expand all' : 'Collapse all'}
                </Button>
            </Box>
            <TreeView
                aria-label="controlled"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={expanded}
                selected={selected}
                onNodeToggle={handleToggle}
                onNodeSelect={handleSelect}
            >
                {treeData && treeData.map((projectData) => (
                    <TreeItem onClick={() => { handleItemClick(projectData.project_id, "project") }} nodeId={uniqueId++} label={projectData.name} key={uniqueId++}>
                        {projectData.tasks.length > 0 &&
                            projectData.tasks.map((taskData) => (
                                <TreeItem onClick={() => { handleItemClick(taskData.task_id, "task") }} key={uniqueId++} nodeId={uniqueId++} label={taskData.name}>
                                    {taskData.subtasks.length > 0 &&
                                        taskData.subtasks.map((subtaskData) => (
                                            <TreeItem onClick={() => { handleItemClick(subtaskData.subtask_id, "subtask") }} key={uniqueId++} nodeId={uniqueId++} label={subtaskData.name} />
                                        ))}
                                </TreeItem>
                            ))}
                    </TreeItem>
                ))}
            </TreeView>
        </Box >
    );
}

export default TreeViewComponent;
