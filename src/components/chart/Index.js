import React, { useState } from 'react'
import { Pie } from 'react-chartjs-2'

const Index = ({ data }) => {
    const [state] = useState({
        labels: ['Created', 'Pending', 'Confirmed', 'Picked', 'Received in Warehouse', 'Packed', 'Handed Over to Courier', 'Delivered', 'Canceled', 'Ready to Refund', 'Refunded'],
        datasets: [
            {
                label: 'Rainfall',
                backgroundColor: [
                    '#ff821caf',
                    '#7267f0a1',
                    '#2962ffb0',
                    '#28c76fb2',
                    '#ea5454a9',
                    '#23049d',
                    '#aa2ee6',
                    '#ff79cd',
                    '#ffdf6b',
                    '#7b6079',
                    '#00adb5'
                ],
                hoverBackgroundColor: [
                    '#ff821caf',
                    '#7267f0a1',
                    '#2962ffb0',
                    '#28c76fb2',
                    '#ea5454a9',
                    '#23049d',
                    '#aa2ee6',
                    '#ff79cd',
                    '#ffdf6b',
                    '#7b6079',
                    '#00adb5'
                ],
                data: [data.created, data.pending, data.confirmed, data.picked, data.received, data.packed, data.ready_to_delivered, data.delivered, data.canceled, data.ready_to_refund, data.refunded]
            }
        ]
    })


    return (
        <div>
            <Pie
                data={state}
                width={300}
                height={300}
                options={{
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    maintainAspectRatio: false
                }}
            />
        </div>
    );
}

export default Index;
