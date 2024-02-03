import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SparklineChart = ({ data, color }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (!chartRef.current || !data) return;

        const ctx = chartRef.current.getContext('2d');

        if (!chartInstance.current) {
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [
                        {
                            data: data.datasets[0].data,
                            borderColor: color,
                            borderWidth: 2,
                            pointRadius: 0,
                            fill: false,
                        },
                    ],
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        x: {
                            display: false,
                        },
                        y: {
                            display: false,
                        },
                    },
                },
            });
        } else {
            // Update chart data
            chartInstance.current.data.labels = data.labels;
            chartInstance.current.data.datasets[0].data = data.datasets[0].data;
            chartInstance.current.update();
        }
    }, [data, color]);

    return <canvas className='line' ref={chartRef} width={100} height={50} />;
};

export default SparklineChart;
