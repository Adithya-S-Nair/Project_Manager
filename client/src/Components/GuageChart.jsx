import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts';

const GuageChart = ({ gaugeData }) => {
  const gaugepercent = gaugeData ? Math.ceil((gaugeData.completed_count / gaugeData.total_count) * 100 ) : 0;

  const [chartData, setChartData] = useState({
    series: [gaugepercent],
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

export default GuageChart;
