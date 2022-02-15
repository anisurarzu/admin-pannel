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

const OrderStatus = (data) => {
    const groupChartData = {
        labels: data.data.labels,
        datasets: [
            {
                label: 'Created',
                data: data.data.days[6],
                backgroundColor: '#ff821c',
            },
            {
                label: 'Pending',
                data: data.data.days[0],
                backgroundColor: '#7267f0',
            },
            {
                label: 'Confirmed',
                data: data.data.days[1],
                backgroundColor: '#2962ff',
            },
            {
                label: 'Picked',
                data: data.data.days[2],
                backgroundColor: '#28c76f',
            },
            {
                label: 'Received in Warehouse',
                data: data.data.days[3],
                backgroundColor: '#ea5454',
            },
            {
                label: 'Packed',
                data: data.data.days[4],
                backgroundColor: '#23049d',
            },
            {
                label: 'Handed Over to Courier',
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

export default OrderStatus;
