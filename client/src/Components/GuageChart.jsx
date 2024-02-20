import React from 'react';
import { useContext } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ThemeContext } from '../Context/ThemeContext';

const GaugeChart = ({ gaugeData }) => {

  const { theme } = useContext(ThemeContext);
  const gaugePercent = gaugeData ? Math.ceil((gaugeData.completed_count / gaugeData.total_count) * 100) : 0;

  const option = {
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
            color: '#1976d2',
            fontSize: '17px',
          },
          value: {
            color: '#111',
            fontSize: '20px',
            show: true,
          },
        },
      },
    },
    labels: ['Complete'],
    fill: {
      colors: ['#1976d2'], // Green fill color
    },
  };

  const options = {
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
            color: '#5cd4d0',
            fontSize: '17px',
          },
          value: {
            color: '#111',
            fontSize: '20px',
            show: true,
          },
        },
      },
    },
    labels: ['Complete'],
    fill: {
      colors: ['#5cd4d0'], // Green fill color
    },
  };

  const series = [gaugePercent];

  return (
    <div>
      {theme === 'theme1'
        ?
        <div id="chart">
          <ReactApexChart options={option} series={series} type="radialBar" height={250} />
        </div>
        :
        <div id="chart">
          <ReactApexChart options={options} series={series} type="radialBar" height={250} />
        </div>
      }
      <div id="html-dist"></div>
    </div>
  );
};

export default GaugeChart;
