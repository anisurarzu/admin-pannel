import React, { useEffect, useState, useCallback } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import jwt_decode from 'jwt-decode'
import { ic_place, ic_pin_drop } from 'react-icons-kit/md'
import { phone, mail, edit2, settings } from 'react-icons-kit/feather'
import { Images } from '../../utils/Images'
import { PreLoader } from '../../components/loading/Index'

import Requests from '../../utils/Requests/Index'
import ProfileEditModal from '../../components/modal/profile/Index'
import ChangePasswordModal from '../../components/modal/profile/ChangePassword'

const Index = () => {
    const [user, setUser] = useState(null)
    const [show, setShow] = useState(false)
    const [isUpdate, setUpdate] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [profile, setProfile] = useState({})
    const [password, setPassword] = useState({ show: false, loading: false })
    const token = localStorage.getItem('token')
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    // Fetch data
    const fetchData = useCallback(async () => {
        const data = await Requests.Profile.Me(header)
        if (data) setProfile(data)
        setLoading(false)
    }, [header])

    useEffect(() => {
        if (token) {
            const decodeUser = jwt_decode(token)
            setUser(decodeUser)
        }
        fetchData()
    }, [token, header, fetchData])

    // Handle edit
    const handleEdit = () => {
        setShow(true)
    }

    // Handle update basic info
    const handleUpdate = async data => {
        setUpdate(true)
        await Requests.Profile.Update(data, header)
        fetchData()
        setUpdate(false)
        setShow(false)
    }

    // Handle update password
    const handleUpdatePassword = async data => {
        setPassword({ ...password, loading: true })
        await Requests.Profile.UpdatePassword(data, header)

        setPassword({ show: false, loading: false })
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="profile-index">
            {profile ?
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-padding">
                            <div className="card profile-card border-0 shadow-sm">
                                <div className="card-header bg-white">
                                    <div className="flex-center flex-column">
                                        <div className="profile-image-container rounded-circle">
                                            <img src={Images.Avatar} className="img-fluid" alt="..." />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body p-4">
                                    <h5>{profile.name}</h5> {/* Name */}
                                    <table className="table table-sm table-borderless">
                                        <tbody>
                                            <tr>
                                                <td style={{ width: 20 }}><Icon icon={phone} size={18} /></td>
                                                <td style={{ width: 140 }}><p>Phone</p></td>
                                                <td><p>: {profile.phone}</p></td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: 20 }}><Icon icon={mail} size={18} /></td>
                                                <td style={{ width: 140 }}><p>E-mail</p></td>
                                                <td><p>: {profile.email}</p></td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: 20 }}><Icon icon={settings} size={18} /></td>
                                                <td style={{ width: 140 }}><p>Role</p></td>
                                                <td><p>: {profile.role ? profile.role.role : "N/A"}</p></td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: 20 }}><Icon icon={ic_place} size={22} /></td>
                                                <td style={{ width: 140 }}><p>Present Address</p></td>
                                                <td><p>: {profile.address ? profile.address.presentAddress : null}</p></td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: 20 }}><Icon icon={ic_pin_drop} size={24} /></td>
                                                <td style={{ width: 140 }}><p>Permanent Address</p></td>
                                                <td><p>: {profile.address ? profile.address.permanentAddress : null}</p></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {user ?
                                        <button type="button" className="btn icon-btn shadow rounded-circle" onClick={handleEdit}>
                                            <Icon icon={edit2} size={20} />
                                        </button>
                                        : null}

                                    <div className="text-right">
                                        <button
                                            type="button"
                                            className="btn shadow-none px-4 py-2 btn-primary text-white"
                                            onClick={() => setPassword({ ...password, show: true })}
                                        >Change Password</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : null}


            {/* Edit basic info */}
            <ProfileEditModal
                show={show}
                data={profile}
                loading={isUpdate}
                update={handleUpdate}
                onHide={() => setShow(false)}
            />

            {/* Change password */}
            <ChangePasswordModal
                show={password.show}
                loading={password.loading}
                update={handleUpdatePassword}
                onHide={() => setPassword({ show: false, loading: false })}
            />
        </div>
    );
}

export default Index;