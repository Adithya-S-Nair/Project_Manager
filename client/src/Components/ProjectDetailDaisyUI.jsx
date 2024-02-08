import React, { useState } from 'react';
import ProjectStatusChart from './ProjectStatusChart';
import RadarChart from './RadarChart'
import DatagridComponent from './DatagridComponent';
import SparkLineChart from './SparkLineChart';
import moment from 'moment';

function ProjectDetailDaisyUI({ value, setValue, projectData, gridApi, setGridApi, anchorEl, setAnchorEl, chevronRotation, setChevronRotation, radarChartData, pendingTaskCount, pendingSubtaskCount, sparklineData, navigate, taskData, handleMenuOpen, handleMenuClose, handleChange, navigateToAllProject, getPriorityColor, getChartPriorityColor, projectCompletionStatus }) {
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
                    <div className="card card-compact w-full shadow-xl" style={{ height: '28em' }}>
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <h2 className='text-xl font-bold'>Project Details</h2>
                                <div className="tooltip bg-white" data-tip="Edit Project Details">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>

                                </div>
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
                        </div>
                    </div>
                </div>

                <div className="md:w-1/3">
                    <div className="card card-compact w-full shadow-xl" style={{ height: '28em' }}>
                        <div className='card-body'>
                            <h2 className='text-xl font-bold'>Completion Status</h2>
                            <hr className='mt-2 mb-2' />
                            <div className="flex justify-center items-center">
                                <div className="completion-graph">
                                    <ProjectStatusChart data={projectCompletionStatus} />
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

export default ProjectDetailDaisyUI