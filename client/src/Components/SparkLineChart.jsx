import React, { useState, useEffect, useRef, useContext } from 'react';
import Chart from 'chart.js/auto';
import ReactApexChart from 'react-apexcharts';
import { ThemeContext } from '../Context/ThemeContext';

const SparklineChart = ({ data, type }) => {
    console.log(data);
    const [series, setSeries] = useState(data);
    const [percentages, setPercentages] = useState([]);
    const [colorsArray, setColorsArray] = useState([]);
    const { theme } = useContext(ThemeContext);

    const getGraphColor = (type) => {
        switch (type) {
            case 'Low':
                return ['#439c63', '#4ade80'];
            case 'Medium':
                return ['#d1a521', '#facd48'];
            case 'High':
                return ['#a72727', '#ef7070'];
            default:
                return ['#1e40af', '#2196f3'];
        }
    };


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
            labels: ['Pending', 'Completed'],
            colors: getGraphColor(type),
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
            labels: ['Pending', 'Completed'],
            colors: getGraphColor(type),
        };
    }

    return (
        <div id="chart">
            {data && <ReactApexChart options={options} series={data} type="donut" width={120} />}
        </div>
    );
};

export default SparklineChart;
