import React,{useState} from 'react'
import ReactApexChart from 'react-apexcharts';

const GuageChart = ({project}) => {

    const [chartData, setChartData] = useState({
        series: [70],
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
                <ReactApexChart options={chartData.options} series={chartData.series} type="radialBar" height={350} />
            </div>
            <div id="html-dist"></div>
        </div>
    );
};

export default GuageChart