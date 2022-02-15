import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Icon } from 'react-icons-kit'
import { x } from 'react-icons-kit/feather'
import { CustomButton } from '../button'

import Requests from '../../utils/Requests/Index'


export const CommentsModal = (props) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch data
    const fetchData = useCallback(async () => {
        const response = await Requests.Order.GetCommentsByOrderId(props.orderId, props.header)
        if (response.status) {
            setData(response.data)
        }
        setLoading(false)
    }, [props])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            centered
            className="custom-modal"
        >
            <Modal.Header>
                <div className="d-flex w-100">
                    <div><h6 className="mt-2 mb-0">Comments</h6></div>
                    <div className="ml-auto">
                        <CustomButton
                            onClick={props.onHide}
                            className="btn-danger rounded-circle border-0"
                            style={{ padding: "7px 10px" }}
                        ><Icon icon={x} size={18} />
                        </CustomButton>
                    </div>
                </div>
            </Modal.Header>
            <Modal.Body>
                {loading ?
                    <div className="text-center">
                        <h5 className="fw-bolder">Loading ...</h5>
                    </div>
                    :

                    data && data.length ? data.map((item, i) =>
                        <div className="comment-container border-bottom px-2 py-3" key={i}>
                            <div className="d-flex">
                                <div className="pr-2"><p className="mb-0" style={{ fontSize: 14 }}>{i + 1}.</p></div>
                                <div className="flex-fill">
                                    <p className="text-capitalize mb-0" style={{ lineHeight: "10px", fontSize: 14 }}><strong>{item.createdBy ? item.createdBy.name : "N/A"}</strong> - {item.createdBy ? item.createdBy.role : null}</p>
                                    <small style={{ fontSize: 11 }}>{item.createdAt}</small>
                                </div>
                            </div>
                            <div className="pl-3">
                                <p className="mb-0 mt-1" style={{ fontSize: 14 }}>{item.comment}</p>
                            </div>
                        </div>

                    ) : 
                    <div className="text-center">
                        <p className="mt-3">No comments available.</p>
                    </div>
                }
            </Modal.Body>
        </Modal>
    );
}
