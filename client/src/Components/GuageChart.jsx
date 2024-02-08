import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const GaugeChart = ({ gaugeData }) => {
  const gaugePercent = gaugeData ? Math.ceil((gaugeData.completed_count / gaugeData.total_count) * 100) : 0;

  const [chartData, setChartData] = useState({
    series: [gaugePercent],
    options: {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
          },
          track: {
            background: '#E0E0E0', // Track color
          },
          dataLabels: {
            showOn: 'always',
            name: {
              offsetY: -10,
              show: true,
              color: '#3d9bf7',
              fontSize: '17px',
            },
            value: {
              color: '#111',
              fontSize: '36px',
              show: true,
            },
          },
          fill: {
            colors: ['#4CAF50'], // Green fill color
          },
        },
      },
      labels: ['Complete'],
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={chartData.options} series={chartData.series} type="radialBar" height={250} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default GaugeChart;
