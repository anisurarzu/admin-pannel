import React, { useEffect, useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import jwt_decode from 'jwt-decode'
import { Images } from '../../utils/Images'
import { menu } from 'react-icons-kit/feather'
import { Link, useHistory } from 'react-router-dom'
import { user, logOut } from 'react-icons-kit/feather'
import { DropdownButton, Dropdown } from 'react-bootstrap'

const Index = ({ toggle }) => {
    const history = useHistory()
    const [loggedUser, setLoggedUser] = useState(null)
    const [token] = useState(localStorage.getItem('token'))

    useEffect(() => {
        if (token) {
            const logged = jwt_decode(token)
            setLoggedUser(logged)
        }
    }, [token])

    // Logout
    const doLogout = () => {
        localStorage.clear()
        history.push('/')
    }

    return (
        <div className="custom-navbar">
            <div className="d-flex">
                <div>
                    <ul>
                        <li className="d-lg-none">
                            <button type="button" className="btn btn-sm shadow-none" onClick={toggle}>
                                <Icon icon={menu} size={20} />
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="ml-auto">
                    <ul>
                        <li><p className="mb-0 text-capitalize">{loggedUser ? loggedUser.name : null}</p></li>
                        <li>
                            <DropdownButton
                                title={<img src={Images.Avatar} className="img-fluid rounded-circle" alt="..." />}>
                                <Dropdown.Item as={Link} to="/dashboard/profile">
                                    <Icon icon={user} size={18} className="icon" />
                                    <span>Profile</span>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={doLogout}>
                                    <Icon icon={logOut} size={18} className="icon" />
                                    <span>Logout</span>
                                </Dropdown.Item>
                            </DropdownButton>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Index;
