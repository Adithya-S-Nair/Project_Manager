import React, { useState, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

const GanttChartComponent = ({ selectedData, initialData }) => {

    console.log(selectedData);
    console.log(initialData);
    const [series, setSeries] = useState([
        {

            data: [
                {
                    x: initialData ? initialData.name : '',
                    y: [
                        new Date('2019-02-27').getTime(),
                        new Date('2019-03-04').getTime()
                    ],
                    fillColor: '#008FFB'
                },
            ]
        }
    ]);


    useEffect(
        () => {
            if (selectedData.name) {
                setSeries([
                    {
                        data: [
                            {
                                x: selectedData ? selectedData.name : '',
                                y: [
                                    new Date('2019-02-27').getTime(),
                                    new Date('2019-03-04').getTime()
                                ],
                                fillColor: '#008FFB'
                            },
                        ]
                    }
                ]);
            }
        }, [selectedData]);


    const [options, setOptions] = useState({});
    useEffect(() => {
        setOptions({
            chart: {
                height: '250px',
                type: 'rangeBar'
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    distributed: true,
                    dataLabels: {
                        hideOverflowingLabels: false
                    },
                    barHeight: '50px'
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val, opts) {
                    var label = opts.w.globals.labels[opts.dataPointIndex];
                    if (!label) return '';
                    var a = moment(val[0]);
                    var b = moment(val[1]);
                    var diff = b.diff(a, 'days');
                    return label + ': ' + diff + (diff > 1 ? ' days' : ' day');
                },
                style: {
                    colors: ['#f3f4f5', '#fff']
                }
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                show: false
            },
            grid: {
                row: {
                    colors: ['#f3f4f5', '#fff'],
                    opacity: 1
                }
            }
        })
    }, [initialData])


    return (
        <div>
            <div id="chart">
                {selectedData && <ReactApexChart options={options} series={series} type="rangeBar" height={350} />}
            </div>
            <div id="html-dist"></div>
        </div>)
}

export default GanttChartComponent 
