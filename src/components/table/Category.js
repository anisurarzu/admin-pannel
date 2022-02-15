import React, { useEffect, useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import { Link } from 'react-router-dom'
import { edit2 } from 'react-icons-kit/feather'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { PreLoader } from '../loading/Index'

import Requests from '../../utils/Requests/Index'


const Category = (props) => {
    const [items, setItems] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isActive, setActive] = useState(null)
    const [header] = useState({
        headers: { Authorization: "Bearer " + localStorage.getItem('token') }
    })

    useEffect(() => {
        if (props.items) setItems(props.items)
    }, [props.items])

    // Handle update index
    const handleUpdate = async () => {
        try {
            let updatedItems = []

            if (items && items.length) {
                for (let i = 0; i < items.length; i++) {
                    const element = items[i]
                    updatedItems.push({
                        _id: element._id,
                        indexId: i
                    })
                }
            }

            if (updatedItems && updatedItems.length) {
                setLoading(true)
                const response = await Requests.Category.UpdateIndex(updatedItems, header)
                if (response && response.status === 201) setLoading(false)
            }
        } catch (error) {
            if (error) {
                setLoading(false)
                console.log(error)
            }
        }
    }

    // Handle active
    const handleActive = item => {
        if (isActive && isActive === item) {
            setActive(null)
        } else {
            setActive(item)
        }
    }

    if (isLoading) return <PreLoader />

    return (
        <div className="category-items">
            <div className="parent-container">
                <DragDropContext
                    onDragEnd={(param) => {
                        const srcIndex = param.source.index
                        const desIndex = param.destination?.index

                        if (desIndex) items.splice(desIndex, 0, items.splice(srcIndex, 1)[0])
                        handleUpdate()
                    }}
                >
                    <Droppable droppableId="droppable-1">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {items && items.map((item, i) =>
                                    <Draggable
                                        key={item.indexId}
                                        draggableId={item._id}
                                        index={i}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {/* Parent Content */}
                                                <div
                                                    className="container-item shadow-sm d-flex item"
                                                    onClick={() => handleActive(item.name)}
                                                >
                                                    <div className="image-container pr-3">
                                                        <img src={item.image} className="img-fluid" alt="..." />
                                                    </div>
                                                    <div><p>{item.name}</p></div>
                                                    <div className="ml-auto">
                                                        <Link
                                                            type="button"
                                                            to={`/dashboard/category/Main/${item._id}/edit`}
                                                            className="btn btn-sm shadow-none table-edit-btn"
                                                        >
                                                            <Icon icon={edit2} size={20} />
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Childrens */}

                                                {isActive && isActive === item.name ?
                                                    <div>
                                                        {item.children && item.children.map((firstChild, j) =>
                                                            <div className="children-container" key={j}>
                                                                <div className="container-item shadow-sm d-flex" draggable>
                                                                    <div className="image-container pr-3">
                                                                        <img src={firstChild.image} className="img-fluid" alt="..." />
                                                                    </div>
                                                                    <div><p>{firstChild.name}</p></div>
                                                                    <div className="ml-auto">
                                                                        <Link
                                                                            type="button"
                                                                            to={`/dashboard/category/Sub/${firstChild._id}/edit`}
                                                                            className="btn btn-sm shadow-none table-edit-btn"
                                                                        >
                                                                            <Icon icon={edit2} size={20} />
                                                                        </Link>
                                                                    </div>
                                                                </div>


                                                                {/* Second child */}
                                                                {firstChild.children && firstChild.children.map((secondChild, k) =>
                                                                    <div className="children-container" key={k}>
                                                                        <div className="container-item shadow-sm d-flex" draggable>
                                                                            <div className="image-container pr-3">
                                                                                <img src={secondChild.image} className="img-fluid" alt="..." />
                                                                            </div>
                                                                            <div><p>{secondChild.name}</p></div>
                                                                            <div className="ml-auto">
                                                                                <Link
                                                                                    type="button"
                                                                                    to={`/dashboard/category/Leaf/${secondChild._id}/edit`}
                                                                                    className="btn btn-sm shadow-none table-edit-btn"
                                                                                >
                                                                                    <Icon icon={edit2} size={20} />
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    : null}
                                            </div>
                                        )}
                                    </Draggable>
                                )}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

            </div>
        </div>
    );
};

export default Category;