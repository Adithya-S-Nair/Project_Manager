import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ProjectStatusChart from '../../Components/ProjectStatusChart';
import PageTitle from '../../Components/PageTitle';

const ProjectDetail = () => {
    return (
        <>
            <PageTitle titleText={'Project Name'} />
            <div className="flex justify-center item-center">
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className="flex-grow md:w-2/3">
                        <Card className="w-full">
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <h2 className='text-xl font-bold'>Project Details</h2>
                                </div>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center">
                                    <div className="completion-graph">
                                        <ProjectStatusChart />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex-grow md:w-1/3">
                        <Card style={{ width: 'fit-content' }}>
                            <CardContent>
                                <h2 className='text-xl font-bold'>Completion Status</h2>
                                <hr className='mt-2 mb-2' />
                                <div className="flex items-center">
                                    <div className="completion-graph">
                                        <ProjectStatusChart />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div >
            </div >
        </>
    )
}

export default ProjectDetail;
