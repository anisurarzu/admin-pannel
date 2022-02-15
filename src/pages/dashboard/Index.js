import React, { useState, useEffect } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import commaNumber from 'comma-number'
import { gift, shoppingCart, users, user } from 'react-icons-kit/feather'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { PreLoader } from '../../components/loading/Index'

import Requests from '../../utils/Requests/Index'
import ChartComponent from '../../components/chart/Index'
import GroupedChart from '../../components/chart/Grouped'
import LineChart from "../../components/chart/BusketSize";
import OrderCount from "../../components/chart/OrderCount";
import OrderByDay from "../../components/chart/OrderByDay";

const Index = () => {
    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState({})
    // const [report, setReport] = useState(null)
    const [chartData, setChartData] = useState({ groupChartData: null, lineChartData: null, orderChartData: null, orderByDayChartData: null })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    useEffect(() => {
        const getData = async () => {
            const response = await Requests.Dashboard.Index(header)
            // const reportResponse = await Requests.Dashboard.StoreCredit(header)
            const chartResponse = await Requests.Dashboard.ChartData(header)
            setChartData(chartResponse)
            setData(response)
            // setReport(reportResponse)
            setLoading(false)
        }
        getData()
    }, [header])

    if (isLoading) return <PreLoader />

    return (
        <div className="dashboard-container">
            {data ?

                <Container.Fluid>

                    {/* statistics container */}
                    <Container.Row className="statistics-container">
                        <Container.Column className="col-padding">
                            <Card.Simple className="border-0">
                                <Card.Header className="bg-white border-0 px-4 pt-3 pb-0">
                                    <h6 className="text-dark font-15"><b>Statistics</b></h6>
                                </Card.Header>
                                <Card.Body className="p-4">
                                    <Container.Row>

                                        {/* Products */}
                                        <Container.Column className="col-6 col-lg-3 mb-5 mb-xl-0">
                                            <div className="d-flex items">
                                                <div><Icon icon={gift} size={20} className="icon-1" /></div>
                                                <div className="pl-3">
                                                    <h6 className="font-17 text-dark font-weight-bolder mb-0">{commaNumber(data.totalProduct)}</h6>
                                                    <p className="text-muted mb-0 font-14">Products</p>
                                                </div>
                                            </div>
                                        </Container.Column>

                                        {/* Orders */}
                                        <Container.Column className="col-6 col-lg-3 mb-5 mb-xl-0">
                                            <div className="d-flex items">
                                                <div><Icon icon={shoppingCart} size={20} className="icon-2" /></div>
                                                <div className="pl-3">
                                                    <h6 className="font-17 text-dark font-weight-bolder mb-0">{commaNumber(data.totalOrder)}</h6>
                                                    <p className="text-muted mb-0 font-14">Orders</p>
                                                </div>
                                            </div>
                                        </Container.Column>

                                        {/* Customers */}
                                        <Container.Column className="col-6 col-lg-3 mb-5 mb-xl-0">
                                            <div className="d-flex items">
                                                <div><Icon icon={users} size={20} className="icon-3" /></div>
                                                <div className="pl-3">
                                                    <h6 className="font-17 text-dark font-weight-bolder mb-0">{commaNumber(data.totalCustomer)}</h6>
                                                    <p className="text-muted mb-0 font-14">Customers</p>
                                                </div>
                                            </div>
                                        </Container.Column>

                                        {/* Admin */}
                                        <Container.Column className="col-6 col-lg-3 mb-5 mb-xl-0">
                                            <div className="d-flex items">
                                                <div><Icon icon={user} size={20} className="icon-4" /></div>
                                                <div className="pl-3">
                                                    <h6 className="font-17 text-dark font-weight-bolder mb-0">{commaNumber(data.totalAdmin)}</h6>
                                                    <p className="text-muted mb-0 font-14">Admin</p>
                                                </div>
                                            </div>
                                        </Container.Column>
                                    </Container.Row>
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>
                    </Container.Row>

                    {/* item total card */}
                    <Container.Row>
                        <Container.Column className="col-padding busket-card-container">

                            <Card.Simple className="border-0">
                                <Card.Body className="flex-center flex-column text-center shadow-sm">
                                    <h6 className="mb-0 text-dark font-weight-bolder font-18">{data.totalSale ? commaNumber(data.totalSale) : 0} <small>tk</small></h6>
                                    <p className="text-muted font-14 mb-0">Total Sale</p>
                                </Card.Body>
                            </Card.Simple>
                            <Card.Simple className="border-0">
                                <Card.Body className="flex-center flex-column text-center shadow-sm">
                                    <h6 className="mb-0 text-dark font-weight-bolder font-18">{data.totalPurchase ? commaNumber(data.totalPurchase) : 0} <small>tk</small></h6>
                                    <p className="text-muted font-14 mb-0">Total Purchase</p>
                                </Card.Body>
                            </Card.Simple>
                            <Card.Simple className="border-0">
                                <Card.Body className="flex-center flex-column text-center shadow-sm">
                                    <h6 className="mb-0 text-dark font-weight-bolder font-18">{data.totalDiscount ? commaNumber(data.totalDiscount) : 0} <small>tk</small></h6>
                                    <p className="text-muted font-14 mb-0">Total Discount</p>
                                </Card.Body>
                            </Card.Simple>
                            <Card.Simple className="border-0">
                                <Card.Body className="flex-center flex-column text-center shadow-sm">
                                    <h6 className="mb-0 text-dark font-weight-bolder font-18">0 <small>tk</small></h6>
                                    <p className="text-muted font-14 mb-0">Total Profit</p>
                                </Card.Body>
                            </Card.Simple>
                            <Card.Simple className="border-0">
                                <Card.Body className="flex-center flex-column text-center shadow-sm">
                                    <h6 className="mb-0 text-dark font-weight-bolder font-18">0 <small>tk</small></h6>
                                    <p className="text-muted font-14 mb-0">Busket Size</p>
                                </Card.Body>
                            </Card.Simple>

                        </Container.Column>
                    </Container.Row>


                    {/* Chart container */}
                    <Container.Row>

                        {/* Sales volume */}
                        <Container.Column className="col-xl-6 col-padding pr-xl-2">
                            <Card.Simple className="border-0">
                                <Card.Header className="bg-white rounded border-0">
                                    <h6 className="mb-0">Sales volume</h6>
                                    <p className="text-muted font-14">Overview of sales volume</p>
                                </Card.Header>
                                <Card.Body>
                                    <GroupedChart data={chartData.groupChartData} />
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        {/* Average busket size */}
                        <Container.Column className="col-xl-6 col-padding pl-xl-2">
                            <Card.Simple className="border-0">
                                <Card.Header className="bg-white rounded border-0">
                                    <h6 className="mb-0">Average busket size</h6>
                                    <p className="text-muted font-14">Overview of busket size</p>
                                </Card.Header>
                                <Card.Body>
                                    <LineChart data={chartData.lineChartData} />
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        {/* Order status by month */}
                        <Container.Column className="col-xl-6 col-padding pr-xl-2">
                            <Card.Simple className="border-0">
                                <Card.Header className="bg-white rounded border-0">
                                    <h6 className="mb-0">Order status by month</h6>
                                </Card.Header>
                                <Card.Body>
                                    <OrderCount data={chartData.orderChartData} />
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        {/* Order status by day in year */}
                        <Container.Column className="col-xl-6 col-padding pl-xl-2">
                            <Card.Simple className="border-0">
                                <Card.Header className="bg-white rounded border-0">
                                    <h6 className="mb-0">Order status by day in year</h6>
                                </Card.Header>
                                <Card.Body>
                                    <OrderByDay data={chartData.orderByDayChartData} />
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                        {/* Order status chart */}
                        <Container.Column className="col-padding">
                            <Card.Simple className="border-0">
                                <Card.Header className="bg-white rounded border-0">
                                    <h6 className="mb-0">Order status</h6>
                                </Card.Header>
                                <Card.Body>
                                    <ChartComponent data={data.orders} />
                                </Card.Body>
                            </Card.Simple>
                        </Container.Column>

                    </Container.Row>
                </Container.Fluid>
                : null}
        </div >
    );
}

export default Index;






                //    <div className="chart-container row products-orders-status-container">
                //         chartData.groupChartData ?
                //             <div className="col-12 col-xl-6 col-padding">
                //                 <div className="card border-0 shadow-sm">
                //                     <div className="card-header">
                //                         <h6>Sales volume</h6>
                //                         <p className="text-muted">Overview of sales volume</p>
                //                     </div>
                //                     <div className="card-body p-4">
                //                         <GroupedChart data={chartData.groupChartData} />
                //                     </div>
                //                 </div>
                //             </div>
                //             : null

                //         chartData.lineChartData ?
                //             <div className="col-12 col-xl-6 col-padding pl-xl-0">
                //                 <div className="card border-0 shadow-sm">
                //                     <div className="card-header">
                //                         <h6>Average busket size</h6>
                //                         <p className="text-muted">Overview of busket size</p>
                //                     </div>
                //                     <div className="card-body p-4">
                //                         <LineChart data={chartData.lineChartData} />
                //                     </div>
                //                 </div>
                //             </div>
                //             : null

                //         chartData.orderChartData ?
                //             <div className="col-12 col-xl-6 col-padding">
                //                 <div className="card border-0 shadow-sm">
                //                     <div className="card-header">
                //                         <h6>Order Status By Month</h6>
                //                     </div>
                //                     <div className="card-body p-4">
                //                         <OrderCount data={chartData.orderChartData} />
                //                     </div>
                //                 </div>
                //             </div>
                //             : null}
                //         {chartData.orderByDayChartData ?
                //             <div className="col-12 col-xl-6 col-padding pl-xl-0">
                //                 <div className="card border-0 shadow-sm">
                //                     <div className="card-header">
                //                         <h6>Order Status By Day In Year</h6>
                //                     </div>
                //                     <div className="card-body p-4">
                //                         <OrderByDay data={chartData.orderByDayChartData} />
                //                     </div>
                //                 </div>
                //             </div>
                //             : null}
                //         <div className="col-12 col-xl-6 col-padding">
                //             <div className="card border-0 shadow-sm">
                //                 <div className="card-header">
                //                     <h6>Order status</h6>
                //                     <p className="text-muted">Overview of orders</p>
                //                 </div>
                //                 <div className="card-body p-3">
                //                     {data.orders ? <ChartComponent data={data.orders} /> : null}
                //                 </div>
                //             </div>
                //         </div>
                //     </div> 