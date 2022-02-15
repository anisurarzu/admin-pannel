import React from 'react'
import './style.scss'

const CouponShow = ({ assign, items }) => {
    return (
        <div className="content-table-container pb-4">
            {items && items.length ?
                <table className="table table-hover table-responsive-sm table-borderless">
                    <thead>
                        <tr className="border-bottom">
                            <td className="text-center sl-td" style={{ width: 120 }}>SL</td>
                            <td className="text-td">Name</td>
                            {assign === ('Vendor' || 'Customer') ? <td className="text-td">E-mail</td> : null}
                            {assign === ('Vendor' || 'Customer') ? <td className="text-td">Phone</td> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {items && items.map((item, i) =>
                            <tr className="border-bottom" key={i}>
                                <td className="text-center sl-td" style={{ width: 120 }}>{i + 1}</td>
                                <td className="text-td">{item.name}</td>
                                {assign === ('Vendor' || 'Customer') ? <td className="text-td">{item.email}</td> : null}
                                {assign === ('Vendor' || 'Customer') ? <td className="text-td">{item.phone}</td> : null}
                            </tr>
                        )}
                    </tbody>
                </table>
                : null}
        </div>
    );
};

export default CouponShow;