import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SparklineChart = ({ data, color }) => {
    const chartRef = useRef(null);
    console.log(data.color);
    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        const sparklineChart = new Chart(ctx, {
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

        return () => {
            sparklineChart.destroy();
        };
    }, [data]);

    return <canvas className='line' ref={chartRef} width={100} height={50} />;
};

export default SparklineChart;
