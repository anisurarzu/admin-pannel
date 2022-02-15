import React from "react"
import "./style.scss"

export const ImageCard = (props) => {
    return (
        <div className="image_card"
            style={{
                width: props.width ? props.width : 150,
                height: props.height ? props.height : 70
            }}
        >
            <img
                src={props.imgSrc}
                alt={props.imgAlt}
                className="image"
            />

            {props.actionBtn ?
                <div className="action_btn_container">
                    <button
                        type="button"
                        className={`btn rounded-circle shadow ${props.btnType}`}
                        onClick={props.onClick}
                    >{props.btnIcon}</button>
                </div>
                : null}
        </div>
    )
}