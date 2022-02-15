import React from 'react'
import { Line } from 'react-chartjs-2'

const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
};

const  LineChart = (data) => {
    const chartData = {
        labels: data.data.labels,
        datasets: [
            {
                label: 'AVG Busket Size',
                data: data.data.busketSize,
                fill: false,
                backgroundColor: '#00adb5',
                borderColor: 'rgba(170, 46, 230, 0.4)',
            },
        ],
    };
    return (
        <div>
            <Line data={chartData} options={options} />
        </div>
    )
};

export default  LineChart;
