import React, { useRef, useState } from 'react'
import IdleTimer from 'react-idle-timer'
import { Modal } from 'react-bootstrap'
import { CustomButton } from '../button'

export const IdleTimerContainer = (props) => {
    const idleTimerRef = useRef(null)
    const sessionTimeoutRef = useRef(null)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [isLogOut, setLogOut] = useState(false)

    // handle idle
    const onIdle = () => {
        const token = localStorage.getItem("token")
        if (token) {
            setModalIsOpen(true)
            sessionTimeoutRef.current = setTimeout(logOut, 10000)
        }
    }

    // handle logout
    const logOut = () => {
        setLogOut(true)

        setTimeout(() => {
            clearTimeout(sessionTimeoutRef.current)
            setLogOut(false)
            localStorage.clear()
            window.location.reload()
        }, 1000)
    }

    // handle signed in
    const keepSignedIn = () => {
        setModalIsOpen(false)
        clearTimeout(sessionTimeoutRef.current)
    }

    return (
        <div>
            <Modal
                show={modalIsOpen}
                size="md"
                centered
                backdrop="static"
                keyboard={false}
                className="custom-modal"
            >
                <Modal.Body className="text-center px-4 py-5">
                    <h4 className="fw-bolder mb-0">You will be logged out after 10s!!!</h4>

                    <div className="pt-4">
                        <CustomButton
                            disabled={isLogOut}
                            className="btn-danger border-0 mr-2"
                            style={{ padding: "7px 20px", fontSize: 14 }}
                            onClick={logOut}
                        >{isLogOut ? "Logging out ..." : "Log me out"}
                        </CustomButton>

                        <CustomButton
                            className="btn-success border-0 mr-2"
                            style={{ padding: "7px 20px", fontSize: 14 }}
                            onClick={keepSignedIn}
                        >Kep me signed in</CustomButton>
                    </div>
                </Modal.Body>
            </Modal>

            <IdleTimer
                ref={idleTimerRef}
                timeout={3600000000000}
                onIdle={onIdle}
            >
                {props.children}
            </IdleTimer>
        </div>
    )
}