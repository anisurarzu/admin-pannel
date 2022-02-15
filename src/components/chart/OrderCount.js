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

const OrderCount = (data) => {
    const groupChartData = {
        labels: data.data.labels,
        datasets: [
            {
                label: 'Order Count By Month',
                data: data.data.totalOrder,
                backgroundColor: '#23049d',
            }
        ],
    };
    return (
        <div>
            <Bar data={groupChartData} options={options} />
        </div>
    )
}

export default OrderCount;
