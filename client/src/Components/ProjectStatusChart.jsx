import React, { useState, useEffect, useContext } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ThemeContext } from '../Context/ThemeContext';

const ProjectStatusChart = ({ data }) => {

    const [series, setSeries] = useState([]);
    const [percentages, setPercentages] = useState([]);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        if (data) {
            // Extract the relevant keys from data
            const { completed_count, workinprogress_count, hold_count, pending_count, total_count } = data;

            const percentages = {
                completed_count: (completed_count / total_count) * 100,
                workinprogress_count: (workinprogress_count / total_count) * 100,
                hold_count: (hold_count / total_count) * 100,
                pending_count: (pending_count / total_count) * 100,
            };

            const percentagesDisplay = {
                completed_count: ((completed_count / total_count) * 100).toFixed(2),
                workinprogress_count: ((workinprogress_count / total_count) * 100).toFixed(2),
                hold_count: ((hold_count / total_count) * 100).toFixed(2),
                pending_count: ((pending_count / total_count) * 100).toFixed(2),
            };

            setSeries(Object.values(percentages));
            setPercentages(Object.values(percentagesDisplay))
        }
    }, [data]);

    let options = {}

    if (theme == 'theme1') {
        options = {
            chart: {
                width: 380,
                type: 'donut',
            },
            dataLabels: {
                enabled: false,
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            show: false, // Hide the legend on smaller screens
                        },
                    },
                },
            ],
            legend: {
                show: false, // Hide the legend
            },
            labels: ['Complete', 'Work In Progress', 'On Hold', 'Pending'],
            colors: ['#4ade80', '#60a5fa', '#facc15', '#f87171'],
        };
    } else {
        options = {
            chart: {
                width: 380,
                type: 'donut',
            },
            dataLabels: {
                enabled: false,
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200,
                        },
                        legend: {
                            show: false, // Hide the legend on smaller screens
                        },
                    },
                },
            ],
            legend: {
                show: false, // Hide the legend
            },
            labels: ['Complete', 'Work In Progress', 'On Hold', 'Pending'],
            colors: ['#0ff2c9', '#65e6e6', '#facd48', '#f2260f'],
        };
    }

    return (
        <>
            {(series.length > 0) &&
                <div className='flex flex-col items-center'>
                    <div className="chart-wrap">
                        <div id="chart">
                            <ReactApexChart options={options} series={series} type="donut" width={250} />
                        </div>
                    </div>
                    <p className='text-center font-bold mt-2 mb-2'>Balanced</p>
                    <div className='flex justify-center items-center flex-col gap-4'>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-1 border-r border-solid border-black-500 pr-2 p-2">
                                <p className="font-bold text-l" style={{ color: options.colors[0] }}>{percentages[0]} %</p>
                                <label className='font-bold'>Completed</label>
                            </div>
                            <div className="flex flex-col items-center gap-1 border-r border-solid border-black-500 pr-2 p-2">
                                <p className="text-blue-400 font-bold text-l" style={{ color: options.colors[1] }}>{percentages[1]} %</p>
                                <label className='font-bold'>Progress</label>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center gap-1 border-r border-solid border-black-500 pr-2 p-2">
                                <p className="text-yellow-400 font-bold text-l" style={{ color: options.colors[2] }}>{percentages[2]} %</p>
                                <label className='font-bold'>On Hold</label>
                            </div>
                            <div className="flex flex-col items-center gap-1 p-2">
                                <p className="text-red-400 font-bold text-l" style={{ color: options.colors[3] }}>{percentages[3]} %</p>
                                <label className='font-bold'>Pending</label>
                            </div>
                        </div>
                    </div>

                </div>}
        </>
    );
};

export default ProjectStatusChart;
