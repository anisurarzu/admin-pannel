import React from 'react'
import './style.scss'
import { dateFormate } from '../../utils/Helpers'

const Buyer = ({ items }) => {
    return (
        <div className="content-table-container pb-4">
            <table className="table table-responsive-lg table-borderless">
                <thead>
                    <tr className="border-bottom">
                        <td className="text-center sl-td">SL</td>
                        <td className="text-td">Name</td>
                        <td className="text-td">E-mail</td>
                        <td className="text-td">Phone</td>
                        <td className="text-td">Created At</td>
                    </tr>
                </thead>
                <tbody>
                    {items && items.map((item, i) =>
                        <tr className="border-bottom" key={i}>
                            <td className="text-center" style={{ width: 60 }}>{i + 1}</td>
                            <td className="text-capitalize" style={{ minWidth: 120 }}>
                                {item.name}
                            </td>
                            <td style={{ minWidth: 120 }}>
                                {item.email ?
                                    <span className="text-lowercase">{item.email}</span> :
                                    <span className="text-muted">N/A</span>
                                }
                            </td>
                            <td className="text-lowercase" style={{ minWidth: 120 }}>
                                {item.phone ? item.phone : 'N/A'}
                            </td>
                            <td className="text-capitalize" style={{ minWidth: 135 }}>
                                {dateFormate(item.createdAt)}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Buyer;