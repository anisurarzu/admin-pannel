import React from 'react'
import { Bar } from 'react-chartjs-2'

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

const OrderByDay = (data) => {
    const groupChartData = {
        labels: data.data.labels,
        datasets: [
            {
                label: 'Sat',
                data: data.data.days[6],
                backgroundColor: '#ff821c',
            },
            {
                label: 'Sun',
                data: data.data.days[0],
                backgroundColor: '#7267f0',
            },
            {
                label: 'Mon',
                data: data.data.days[1],
                backgroundColor: '#2962ff',
            },
            {
                label: 'Tue',
                data: data.data.days[2],
                backgroundColor: '#28c76f',
            },
            {
                label: 'Wed',
                data: data.data.days[3],
                backgroundColor: '#ea5454',
            },
            {
                label: 'Thu',
                data: data.data.days[4],
                backgroundColor: '#23049d',
            },
            {
                label: 'Fri',
                data: data.data.days[5],
                backgroundColor: '#aa2ee6',
            },
        ],
    };
    return (
        <div>
            <Bar data={groupChartData} options={options} />
        </div>
    )
}

export default OrderByDay;
