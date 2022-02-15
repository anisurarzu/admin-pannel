import React, { useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import Requests from '../../utils/Requests/Index'
import DeleteComponent from '../modal/delete/Index'
import { dateFormate } from '../../utils/Helpers'
import { edit2, trash, eye, eyeOff } from 'react-icons-kit/feather'

const Campaign = ({ items, refetch }) => {
    const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    const handleDelete = async id => {
        setDelete({ ...isDelete, loading: true })
        await Requests.Campaign.Delete(id, header)
        refetch()
        setDelete({ value: null, status: null, loading: null })
    }

    return (
        <div className="content-image-table-container pb-4">
            <table className="table table-hover table-responsive-sm table-borderless">
                <thead>
                    <tr className="border-bottom">
                        <td className="text-center sl-td">SL</td>
                        <td></td>
                        <td className="text-td">Title</td>
                        <td className="text-td">Type</td>
                        <td className="text-td">Amount</td>
                        <td className="text-td">Assign To</td>
                        <td className="text-td">Start Date</td>
                        <td className="text-td">End Date</td>
                        <td className="text-td text-center">Published</td>
                        <td className="text-td text-center">Action</td>
                    </tr>
                </thead>
                <tbody>
                    {items && items.map((item, i) =>
                        <tr className="border-bottom" key={i}>
                            <td className="text-center sl-td pt-4">{i + 1}</td>
                            <td>
                                {item.image ? <img src={item.image} className="img-fluid" alt="..." /> : null}
                            </td>
                            <td className="text-td pt-4">{item.title}</td>
                            <td className="text-td pt-4">{item.type}</td>
                            <td className="text-td pt-4">
                                {item.amount}
                                {item.type === 'Flat' ? ' Tk' :
                                    item.type === 'Percentage' ? ' %' : null}
                            </td>
                            <td className="text-td pt-4">{item.assignTo}</td>
                            <td className="text-td pt-4">{dateFormate(item.startDate)}</td>
                            <td className="text-td pt-4">{dateFormate(item.endDate)}</td>
                            <td className="text-td pt-4 text-center">
                                {item.published ?
                                    <Icon icon={eye} size={18} style={{ color: '#28c76f' }} /> :
                                    <Icon icon={eyeOff} size={18} style={{ color: '#ea5455' }} />
                                }
                            </td>
                            <td className="button-td text-center">
                                <Link
                                    type="button"
                                    to={`/dashboard/campaign/${item._id}/show`}
                                    className="btn btn-sm shadow-none table-show-btn"
                                >
                                    <Icon icon={eye} size={20} />
                                </Link>
                                <Link
                                    type="button"
                                    to={`/dashboard/campaign/${item._id}/edit`}
                                    className="btn btn-sm shadow-none table-edit-btn"
                                >
                                    <Icon icon={edit2} size={20} />
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-sm shadow-none table-trash-btn"
                                    onClick={() => setDelete({ value: item, show: true, loading: false })}
                                >
                                    <Icon icon={trash} size={20} />
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Delete modal */}
            {isDelete.value && isDelete.show ?
                <DeleteComponent
                    title={'campaign'}
                    image={isDelete.value.image}
                    data={isDelete.value._id}
                    show={isDelete.show}
                    loading={isDelete.loading}
                    delete={handleDelete}
                    onHide={() => setDelete({ ...isDelete, value: null, status: false })}
                />
                : null}
        </div>
    );
};

export default Campaign;