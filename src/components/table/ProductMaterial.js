import React from 'react'

const ProductMaterial = ({ data }) => {
    return (
        <div className="custom-material-data-table">
            <div className="d-flex border-bottom head">
                <div className="item"><p>Title</p></div>
                <div className="item"><p>Properties</p></div>
                <div className="item text-right"><p>Adjustment on Selling Price</p></div>
            </div>

            {data.map((item, i) =>
                <div className="d-flex border-bottom body" key={i}>
                    <div className="item item-1"><p>{item.title}</p></div>
                    <div className="item item-2">
                        {item.properties && item.properties.length ?
                            item.properties.map((property, j) =>
                                <div className="d-flex" key={j}>
                                    {property.values && property.values.length ?
                                        property.values.map((value, k) =>
                                            <div className="item-value" key={k}>
                                                <p>{value}</p>
                                            </div>
                                        ) : null}
                                    <div className="ml-auto"><p>{property.adjustmentPrice ? property.adjustmentPrice + ' tk' : null}</p></div>
                                </div>
                            ) : null}
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default ProductMaterial;
