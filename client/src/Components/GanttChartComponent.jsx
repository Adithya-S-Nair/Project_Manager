import React, { useState, useEffect, useContext } from 'react'
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import { ThemeContext } from '../Context/ThemeContext';

const GanttChartComponent = ({ selectedData, initialData }) => {

    const { theme } = useContext(ThemeContext)

    const [series, setSeries] = useState(theme === 'theme1' ? [
        {

            data: [
                {
                    x: initialData ? initialData.name : '',
                    y: [
                        new Date(initialData.start_date).getTime(),
                        new Date(initialData.end_date).getTime()
                    ],
                    fillColor: '#008FFB'
                },
            ]
        }
    ] :
        [
            {

                data: [
                    {
                        x: initialData ? initialData.name : '',
                        y: [
                            new Date(initialData.start_date).getTime(),
                            new Date(initialData.end_date).getTime()
                        ],
                        fillColor: '#5cd4d0'
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
                                x: initialData ? initialData.name : '',
                                y: [
                                    new Date(selectedData.start_date).getTime(),
                                    new Date(selectedData.end_date).getTime()
                                ],
                                fillColor: theme === 'theme1' ? '#008FFB' : '#5cd4d0'
                            },
                        ]
                    }
                ]);
            } else {
                setSeries([
                    {
                        data: [
                            {
                                x: initialData ? initialData.name : '',
                                y: [
                                    new Date(initialData.start_date).getTime(),
                                    new Date(initialData.end_date).getTime()
                                ],
                                fillColor: theme === 'theme1' ? '#008FFB' : '#5cd4d0'
                            },
                        ]
                    }
                ]);
            }
        }, [theme, selectedData]);


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
                    vertical: true,
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
