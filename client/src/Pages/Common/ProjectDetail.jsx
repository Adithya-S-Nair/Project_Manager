import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ProjectStatusChart from '../../Components/ProjectStatusChart';
import RadarChart from '../../Components/RadarChart'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DatagridComponent from '../../Components/DatagridComponent';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SparkLineChart from '../../Components/SparkLineChart';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const ProjectDetail = () => {
    const [value, setValue] = useState(0);
    const [gridApi, setGridApi] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [chevronRotation, setChevronRotation] = useState(0);
    const [data, setData] = useState([70, 80, 20, 10, 50])
    const sparklineData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                data: [30, 40, 25, 50, 35, 60],
            },
        ],
    };
    const navigate = useNavigate()

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setChevronRotation(180);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setChevronRotation(0);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const navigateToAllProject = () => {
        navigate('/admin/dashboard')
        handleMenuClose()
    }
    return (
        <>
            <div className="mb-5">
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleMenuOpen}>
                    <h1 className='text-4xl font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight'>Project Name</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transform ${chevronRotation === 180 ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
                <hr className='mb-2' />

                {/* Material-UI Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={navigateToAllProject}>See all projects</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Add a project</MenuItem>
                    {/* Add more menu items as needed */}
                </Menu>
            </div>
            <div>
                <div className='flex flex-col md:flex-row gap-4' style={{ width: '100%' }}>
                    <div className="flex-grow md:w-2/3">
                        <Card className="w-full" style={{ height: '24em' }}>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold'>Project Details</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex justify-between">
                                    <div>
                                        <div className='mt-6'>
                                            <span className='font-bold'>Project Description :</span> Full Stack Project
                                            <hr />
                                        </div>
                                        <div className='mt-6'>
                                            <span className='font-bold'>Project Start Date :</span> 03 Jan 2024
                                            <hr />
                                        </div>
                                        <div className='mt-6'>
                                            <span className='font-bold'>Project End Date :</span> 03 Jun 2024
                                            <hr />
                                        </div>
                                        <div className='mt-6'>
                                            <span className='font-bold'>Actual Start Date :</span> 02 Jan 2024
                                            <hr />
                                        </div>
                                        <div className='mt-6'>
                                            <span className='font-bold'>Actual End Date :</span> On Progress
                                            <hr />
                                        </div>
                                        <div className='mt-6'>
                                            <span className='font-bold'>Assigned Team :</span> Team 07
                                            <hr />
                                        </div>
                                    </div>
                                    <RadarChart data={data} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:w-1/3">
                        <Card style={{ width: '100%', height: '24em' }}>
                            <CardContent>
                                <h2 className='text-xl font-bold'>Completion Status</h2>
                                <hr className='mt-2 mb-2' />
                                <div className="flex justify-center items-center">
                                    <div className="completion-graph">
                                        <ProjectStatusChart />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div >

                {/* Pending task status */}

                <Card className='mt-5' style={{ width: '100%' }}>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <h2 className='text-xl font-bold'>Pending Task Status</h2>
                        </div>
                        <hr className='mt-2 mb-2' />
                        <div className="flex items-center justify-between p-5">
                            <Card style={{ width: 'auto' }}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-xl font-bold text-red-400'>High Priority Task</h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-4xl font-extrabold text-red-400'>0</h2>
                                        <SparkLineChart data={sparklineData} color={'#ef7070'} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card style={{ width: 'auto' }}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-xl font-bold text-yellow-400'>Medium Priority Task</h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-4xl font-extrabold text-yellow-400'>0</h2>
                                        <SparkLineChart data={sparklineData} color={'#facd48'} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card style={{ width: 'auto' }}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-xl font-bold text-green-400'>Low Priority Task</h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-4xl font-extrabold text-green-400'>0</h2>
                                        <SparkLineChart data={sparklineData} color={'#66de81'} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                {/* Pending subtask status */}

                <Card className='mt-5' style={{ width: '100%' }}>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <h2 className='text-xl font-bold'>Pending Subtask Status</h2>
                        </div>
                        <hr className='mt-2 mb-2' />
                        <div className="flex items-center justify-between p-5">
                            <Card style={{ width: 'auto' }}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-xl font-bold text-red-400'>High Priority Subtask</h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-4xl font-extrabold text-red-400'>0</h2>
                                        <SparkLineChart data={sparklineData} color={'#ef7070'} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card style={{ width: 'auto' }}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-xl font-bold text-yellow-400'>Medium Priority Subtask</h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-4xl font-extrabold text-yellow-400'>0</h2>
                                        <SparkLineChart data={sparklineData} color={'#facd48'} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card style={{ width: 'auto' }}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-xl font-bold text-green-400'>Low Priority Subtask</h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className='text-4xl font-extrabold text-green-400'>0</h2>
                                        <SparkLineChart data={sparklineData} color={'#66de81'} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>

                <Card className='mt-5' style={{ width: '100%' }}>
                    <CardContent>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Show All" {...a11yProps(0)} />
                                    <Tab label="Task" {...a11yProps(1)} />
                                    <Tab label="Sub Task" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={value} index={0}>
                                <DatagridComponent
                                    gridApi={gridApi}
                                    setGridApi={setGridApi}
                                />
                                <DatagridComponent
                                    gridApi={gridApi}
                                    setGridApi={setGridApi}
                                />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={1}>
                                <DatagridComponent
                                    gridApi={gridApi}
                                    setGridApi={setGridApi}
                                />
                            </CustomTabPanel>
                            <CustomTabPanel value={value} index={2}>
                                <DatagridComponent
                                    gridApi={gridApi}
                                    setGridApi={setGridApi}
                                />
                            </CustomTabPanel>
                        </Box>
                    </CardContent>
                </Card>
            </div >
        </>
    )
}

export default ProjectDetail;
