import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ProjectStatusChart = () => {
    const [series, setSeries] = useState([60, 30, 10]); // Adjust these values as needed

    const options = {
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
        labels: ['Complete', 'Running', 'Pending'],
        colors: ['rgb(0, 227, 150)', 'rgb(254, 176, 25)', 'rgb(255, 69, 96)'],
    };

    return (
        <div className='flex flex-col items-center'>
            <div className="chart-wrap">
                <div id="chart">
                    <ReactApexChart options={options} series={series} type="donut" width={250} />
                </div>
            </div>
            <p className='text-center font-bold mt-2 mb-2'>Balanced</p>
            <div className='flex gap-4'>
                <div className="flex flex-col items-center gap-1 border-r border-solid border-black-500 pr-2 p-2">
                    <p className="text-green-400 font-bold text-2xl">{series[0]} %</p>
                    <label className='font-bold'>Completed</label>
                </div>
                <div className="flex flex-col items-center gap-1 border-r border-solid border-black-500 pr-2 p-2">
                    <p className="text-yellow-400 font-bold text-2xl">{series[1]} %</p>
                    <label className='font-bold'>Running</label>
                </div>
                <div className="flex flex-col items-center gap-1 p-2">
                    <p className="text-red-400 font-bold text-2xl">{series[2]} %</p>
                    <label className='font-bold'>Pending</label>
                </div>
            </div>
        </div>
    );
};

export default ProjectStatusChart;
