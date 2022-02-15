import React, { useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { NavLink } from 'react-router-dom'
import { chevronRight } from 'react-icons-kit/feather'
import Navbar from '../navbar/Index'

const MenuItems = (props) => {
    const [isMenu, setMenu] = useState(false)

    // Toggle menu
    const toggleMenu = event => {
        if (isMenu === event) {
            setMenu(false)
        } else {
            setMenu(false)
            setMenu(event)
        }
    }

    return (
        <div>
            <ul>
                {props.path ?
                    <li>
                        <NavLink
                            to={props.path}
                            exact={props.exact}
                            activeClassName="isActive"
                            type="button"
                            className="btn shadow-none"
                        >
                            {props.icon}
                            {props.title}
                        </NavLink>
                    </li>
                    :
                    <li>
                        <div className="sidebar-dropdown-container">
                            <button
                                type="button"
                                className="btn shadow-none"
                                onClick={() => toggleMenu(props.name)}
                            >
                                {props.icon}
                                {props.title}
                                {props.child ? <Icon icon={chevronRight} size={18} className={isMenu === props.name ? "arrow down" : "arrow"} /> : null}
                            </button>

                            <div className={isMenu === props.name ? "sidebar-dropdown-menu" : "sidebar-dropdown-menu menu-hide"}>
                                {props.child && props.child.map((item, i) =>
                                    item.inDrawer ?
                                        <MenuItems
                                            key={i}
                                            icon={item.icon}
                                            path={item.path}
                                            name={item.name}
                                            title={item.title}
                                            exact={item.exact ? item.exact : false}
                                            child={item.child}
                                        />
                                        : null
                                )}
                            </div>
                        </div>
                    </li>
                }
            </ul>
        </div>
    )
}

const Layout = (props) => {
    const [show, setShow] = useState(false)

    return (
        <div className="layout">

            {/* Navbar */}
            <div className="navbar-container shadow-sm print-hidden">
                <Navbar toggle={() => setShow(!show)} />
            </div>

            {/* Sidebar */}
            <div className="sidebar-container print-hidden">

                {/* Backdrop */}
                <div className={show ? "backdrop d-lg-none open-backdrop" : "backdrop d-lg-none"} onClick={() => setShow(false)} />

                <div className={show ? "sidebar shadow open-sidebar" : "sidebar shadow"}>

                    {props.routes && props.routes.length ?
                        props.routes.map((item, i) => {
                            if (item.name && item.inDrawer) {
                                return (
                                    <MenuItems
                                        key={i}
                                        icon={item.icon}
                                        path={item.path}
                                        name={item.name}
                                        title={item.title}
                                        exact={item.exact ? item.exact : false}
                                        child={item.child}
                                    />
                                )
                            } else {
                                return null
                            }
                        }) : null
                    }

                </div>
            </div>
        </div>
    );
}

export default Layout;
