import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { ThemeContext } from '../../Context/ThemeContext'
import { makeRequest } from '../../Axios';
import moment from 'moment';
import { useQuery } from 'react-query';
import CircularProgress from '@mui/material/CircularProgress';

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

function ProjectDetailMui({ value, setValue, projectData, gridApi, setGridApi, anchorEl, setAnchorEl, chevronRotation, setChevronRotation, radarChartData, pendingTaskCount, pendingSubtaskCount, sparklineData, navigate, handleMenuOpen, handleMenuClose, handleChange, navigateToAllProject, getPriorityColor, getChartPriorityColor, projectCompletionStatus }) {

    return (
        <>
            <div className="mb-5">
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleMenuOpen}>
                    <h1 className='text-4xl font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight'>{projectData.project_name}</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-4 h-4 transform ${chevronRotation === 180 ? 'rotate-180' : ''}`}>
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
            <div className='flex flex-col md:flex-row gap-4' style={{ width: '100%' }}>
                <div className="flex-grow md:w-2/3">
                    <Card className="w-full" style={{ height: '28em' }}>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <h2 className='text-xl font-bold'>Project Details</h2>
                            </div>
                            <hr className='mt-2 mb-2' />
                            <div className="flex justify-between">
                                <div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Project Manager :</span> Mr. Xyx
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Project Start Date :</span> {moment(projectData.project_start_date).format('DD-MMM-YYYY')}
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Project End Date :</span> {moment(projectData.project_end_date).format('DD-MMM-YYYY')}
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Actual Start Date :</span> {moment(projectData.actual_start_date).format('DD-MMM-YYYY')}
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Actual End Date :</span> {moment(projectData.actual_end_date).format('DD-MMM-YYYY')}
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Assigned Team :</span> Team 07
                                        <hr />
                                    </div>
                                    <div className='mt-6'>
                                        <span className='font-bold'>Project Description :</span> {projectData.project_description}
                                        <hr />
                                    </div>
                                </div>
                                <RadarChart data={radarChartData} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:w-1/3">
                    <Card style={{ width: '100%', height: '28em' }}>
                        <CardContent>
                            <h2 className='text-xl font-bold'>Completion Status</h2>
                            <hr className='mt-2 mb-2' />
                            <div className="flex justify-center items-center">
                                <div className="completion-graph">
                                    <ProjectStatusChart data={projectCompletionStatus} />
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
                        {pendingTaskCount && pendingTaskCount.map((pendingTaskCount) => (
                            <Card style={{ width: 'auto' }}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-xl font-bold text-${getPriorityColor(pendingTaskCount.Priority)}`}>
                                            {`${pendingTaskCount.Priority} Priority Task`}
                                        </h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-4xl font-extrabold text-${getPriorityColor(pendingTaskCount.Priority)}`}>
                                            {pendingTaskCount.pending_count}
                                        </h2>
                                        <SparkLineChart data={sparklineData} color={getChartPriorityColor(pendingTaskCount.Priority)} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
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
                        {pendingSubtaskCount.map((pendingSubtaskCount) => (
                            <Card key={pendingSubtaskCount.Priority} style={{ width: 'auto' }}>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-xl font-bold text-${getPriorityColor(pendingSubtaskCount.Priority)}`}>
                                            {`${pendingSubtaskCount.Priority} Priority Subtask`}
                                        </h2>
                                    </div>
                                    <hr className='mt-2 mb-2' />
                                    <div className="flex items-center justify-between">
                                        <h2 className={`text-4xl font-extrabold text-${getPriorityColor(pendingSubtaskCount.Priority)}`}>
                                            {pendingSubtaskCount.pending_count}
                                        </h2>
                                        <SparkLineChart data={sparklineData} color={getChartPriorityColor(pendingSubtaskCount.Priority)} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
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
        </>
    );
}

function ProjectDetailDaisy({ value, setValue, gridApi, setGridApi, anchorEl, setAnchorEl, chevronRotation, setChevronRotation, data, sparklineData, navigate, handleMenuOpen, handleMenuClose, handleChange, navigateToAllProject }) {
    const [activeTab, setActiveTab] = useState(0);

    const changeTab = (tabIndex) => {
        console.log(tabIndex);
        setActiveTab(tabIndex);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return (
                    <>
                        <DatagridComponent
                            gridApi={gridApi}
                            setGridApi={setGridApi}
                        />
                        <DatagridComponent
                            gridApi={gridApi}
                            setGridApi={setGridApi}
                        />
                    </>
                );
            case 1:
                return (
                    <>
                        <DatagridComponent
                            gridApi={gridApi}
                            setGridApi={setGridApi}
                        />
                    </>
                );
            case 2:
                return (
                    <>
                        <DatagridComponent
                            gridApi={gridApi}
                            setGridApi={setGridApi}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <div className="mb-5">
                <div className="flex items-center gap-2 cursor-pointer" onClick={handleMenuOpen}>
                    <h1 className='text-4xl font-bold leading-7 text-gray-900 sm:truncate sm:text-xl sm:tracking-tight'>Project Name</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-4 h-4 transform ${chevronRotation === 180 ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
                <hr className='mb-2' />
                {Boolean(anchorEl) && (
                    <ul className={`menu bg-white-200 w-56 rounded-box`} style={{ position: 'absolute', top: '100%', left: 0 }}>
                        <li><a>Item 1</a></li>
                        <li><a>Item 2</a></li>
                        <li><a>Item 3</a></li>
                    </ul>
                )}
            </div>
            <div className='flex flex-col md:flex-row gap-4' style={{ width: '100%' }}>
                <div className="flex-grow md:w-2/3">
                    <div className="card card-compact w-full shadow-xl" style={{ height: '24em' }}>
                        <div className="card-body">
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
                        </div>
                    </div>
                </div>

                <div className="md:w-1/3">
                    <div className="card card-compact w-full shadow-xl" style={{ height: '24em' }}>
                        <div className='card-body'>
                            <h2 className='text-xl font-bold'>Completion Status</h2>
                            <hr className='mt-2 mb-2' />
                            <div className="flex justify-center items-center">
                                <div className="completion-graph">
                                    <ProjectStatusChart />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pending task status */}

            <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className='text-xl font-bold'>Pending Task Status</h2>
                    </div>
                    <hr className='mt-2 mb-2' />
                    <div className="flex items-center justify-between p-5">
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-red-400'>High Priority Task</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-red-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#ef7070'} />
                                </div>
                            </div>
                        </div>
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-yellow-400'>Medium Priority Task</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-yellow-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#facd48'} />
                                </div>
                            </div>
                        </div>
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-green-400'>Low Priority Task</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-green-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#66de81'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Pending Subtask status */}

            <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
                <div className="card-body">
                    <div className="flex items-center justify-between">
                        <h2 className='text-xl font-bold'>Pending Subtask Status</h2>
                    </div>
                    <hr className='mt-2 mb-2' />
                    <div className="flex items-center justify-between p-5">
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-red-400'>High Priority Subtask</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-red-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#ef7070'} />
                                </div>
                            </div>
                        </div>
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-yellow-400'>Medium Priority Subtask</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-yellow-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#facd48'} />
                                </div>
                            </div>
                        </div>
                        <div className='card card-compact shadow-xl mt-5' style={{ width: 'auto' }}>
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold text-green-400'>Low Priority Subtask</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center justify-between">
                                    <h2 className='text-4xl font-extrabold text-green-400'>0</h2>
                                    <SparkLineChart data={sparklineData} color={'#66de81'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='card card-compact shadow-xl mt-5' style={{ width: '100%' }}>
                <div className='card-body'>
                    <div>
                        <div role="tablist" className="tabs tabs-lifted" style={{ backgroundColor: 'transparent' }}>
                            <a role="tab" className={`tab ${activeTab === 0 ? 'tab-active' : ''}`} onClick={() => changeTab(0)}>Tab 1</a>
                            <a role="tab" className={`tab ${activeTab === 1 ? 'tab-active' : ''}`} onClick={() => changeTab(1)}>Tab 2</a>
                            <a role="tab" className={`tab ${activeTab === 2 ? 'tab-active' : ''}`} onClick={() => changeTab(2)}>Tab 3</a>
                        </div>
                        <div>
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const ProjectDetail = () => {
    const { projectId } = useParams();
    const { theme } = useContext(ThemeContext)
    const [value, setValue] = useState(0);
    const [gridApi, setGridApi] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [chevronRotation, setChevronRotation] = useState(0);
    const sparklineData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                data: [30, 40, 25, 50, 35, 60],
            },
        ],
    };
    const navigate = useNavigate()

    const { data: projectData, error: projectError, isLoading: projectLoading } = useQuery(['project', projectId], async () => {
        const response = await makeRequest.get(`/project/getproject/${projectId}`);
        return response.data;
    });

    const { data: pendingSubtaskCount, error: pendingSubtaskError, isLoading: pendingSubtaskLoading } = useQuery(
        ['pendingSubtaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/subtask/getpendingsubtaskcount/${projectId}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: pendingTaskCount, error: pendingTaskError, isLoading: pendingTaskLoading } = useQuery(
        ['pendingTaskCount', projectId],
        async () => {
            const response = await makeRequest.get(`/task/getpendingtaskcount/${projectId}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: projectCompletionStatus, error: projectCompletionStatusError, isLoading: projectCompletionStatusLoading } = useQuery(
        ['projectCompletionStatus', projectId],
        async () => {
            const response = await makeRequest.get(`/project/getprojectcompletionstatus/${projectId}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    const { data: radarChartData, error: radarChartError, isLoading: radarChartLoading } = useQuery(
        ['radarChartData', projectId],
        async () => {
            const response = await makeRequest.get(`/project/getradarchartdata/${projectId}`);
            return response.data;
        },
        {
            enabled: !!projectData, // Only fetch if projectData is available
        }
    );

    if (projectError || pendingTaskError || pendingSubtaskError || projectCompletionStatusError || radarChartError) {
        console.error('Error fetching data:', projectError || pendingTaskError || pendingSubtaskError || projectCompletionStatusError || radarChartError);
        return <div>Error fetching data</div>;
    }


    const handleMenuOpen = (event) => {
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

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'red-400';
            case 'medium':
                return 'yellow-400';
            case 'low':
                return 'green-400';
            default:
                return 'black'; // Default color or handle other cases
        }
    };

    const getChartPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return '#ef7070';
            case 'medium':
                return '#facd48';
            case 'low':
                return '#66de81';
            default:
                return 'black'; // Default color or handle other cases
        }
    };

    if (projectLoading || pendingTaskLoading || pendingSubtaskLoading || projectCompletionStatusLoading || radarChartLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    if (theme === 'theme1') {
        return (
            projectData && (
                <>
                    <ProjectDetailMui
                        value={value}
                        setValue={setValue}
                        gridApi={gridApi}
                        setGridApi={setGridApi}
                        anchorEl={anchorEl}
                        setAnchorEl={setAnchorEl}
                        chevronRotation={chevronRotation}
                        setChevronRotation={setChevronRotation}
                        radarChartData={radarChartData}
                        projectData={projectData}
                        pendingTaskCount={pendingTaskCount}
                        pendingSubtaskCount={pendingSubtaskCount}
                        sparklineData={sparklineData}
                        navigate={navigate}
                        handleMenuOpen={handleMenuOpen}
                        handleMenuClose={handleMenuClose}
                        handleChange={handleChange}
                        navigateToAllProject={navigateToAllProject}
                        getPriorityColor={getPriorityColor}
                        getChartPriorityColor={getChartPriorityColor}
                        projectCompletionStatus={projectCompletionStatus}
                    />
                </>
            )
        );
    } else if (theme === 'theme2') {
        return (
            <ProjectDetailDaisy
                value={value}
                setValue={setValue}
                gridApi={gridApi}
                setGridApi={setGridApi}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                chevronRotation={chevronRotation}
                setChevronRotation={setChevronRotation}
                sparklineData={sparklineData}
                navigate={navigate}
                handleMenuOpen={handleMenuOpen}
                handleMenuClose={handleMenuClose}
                handleChange={handleChange}
                navigateToAllProject={navigateToAllProject}
            />
        );
    } else {
        // Handle unsupported theme
        return null;
    }
}

export default ProjectDetail;
