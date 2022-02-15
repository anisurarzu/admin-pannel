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

const GroupedBar = (data) => {
    const groupChartData = {
        labels: data.data.labels,
        datasets: [
            {
                label: 'Sales',
                data: data.data.totalSell,
                backgroundColor: '#aa2ee6',
            },
            {
                label: 'Purchase',
                data: data.data.purchasePrice,
                backgroundColor: 'rgb(54, 162, 235)',
            },
            {
                label: 'Discount',
                data: data.data.monthlyDiscount,
                backgroundColor: '#23049d',
            },
            {
                label: 'Profit',
                data: data.data.profit,
                backgroundColor: '#28c76f',
            },
        ],
    };
    return (
        <div>
            <Bar data={groupChartData} options={options} />
        </div>
    )
}

export default GroupedBar;
