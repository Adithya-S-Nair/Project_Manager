import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const RadarChart = ({ data }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext('2d');

        if (!chartInstance.current) {
            // Create the Chart instance only once
            chartInstance.current = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: [
                        'Requirement Gathering',
                        'Designing',
                        'Development',
                        'Testing',
                        'Deployment',
                    ],
                    datasets: [
                        {
                            label: 'Project Progress',
                            data: data,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            pointRadius: 5,
                        },
                    ],
                },
                options: {
                    scales: {
                        r: {
                            suggestedMin: 0,
                            suggestedMax: 100,
                            stepSize: 20,
                            ticks: {
                                stepSize: 20,
                                beginAtZero: true,
                                max: 100,
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                },
            });
        } else {
            // Update chart data
            chartInstance.current.data.datasets[0].data = data;
            chartInstance.current.update();
        }

        return () => {
            // Cleanup (if needed)
        };
    }, [data]);

    return <canvas className='radar' ref={chartRef} />;
};

export default RadarChart;
