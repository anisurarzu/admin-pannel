import React, { useEffect, useState } from 'react'
import './style.scss'
import Icon from 'react-icons-kit'
import Modal from 'react-bootstrap/Modal'
import { plus, x } from 'react-icons-kit/feather'
import { ic_cloud_upload } from 'react-icons-kit/md'

// Single file uploader
export const SingleFileUploader = (props) => {
    const [selectedFile, setSelectedFile] = useState(props.deafult ? props.deafult : null)

    // Handle image
    const handleImage = event => {
        const file = event.target.files[0]
        if (file) {
            const size = parseInt(file.size) / 1024

            if (size > props.limit) {
                props.dataHandeller({ error: `Select less than ${props.limit}KB file.` })
                return
            }

            props.dataHandeller({ image: file })
            setSelectedFile(URL.createObjectURL(file))
        }
    }

    return (
        <div className="img-select-container">
            <div className="form-group mb-4">
                {props.error ? <small className="text-danger">{props.error}</small> : <small>{props.title}</small>}

                <div className="d-flex">

                    {/* Selected / Default file preview */}
                    {selectedFile || props.default ?
                        <div className="preview-container text-center mr-2">
                            <div
                                className="image border"
                                style={{ width: props.width ? props.width : 80, height: props.height ? props.height : 80 }}
                            >
                                <img src={selectedFile || props.default} className="img-fluid" style={{ width: "100%", height: "100%" }} alt="..." />
                                {props.loading ?
                                    <div className="thumbnail-overlay flex-center flex-column">
                                        <div className="loader"></div>
                                    </div>
                                    : null}
                            </div>
                        </div>
                        : null}

                    {/* Loading overlay */}
                    {props.loading &&
                        <div className="thumbnail-overlay flex-center flex-column">
                            <div className="loader"></div>
                        </div>
                    }

                    {/* New file add container */}
                    {!props.loading &&
                        <div className="add-container text-center">
                            <div
                                className="image-plus border"
                                style={{ width: props.width ? props.width : 80, height: props.height ? props.height : 80 }}
                            >
                                <input
                                    type="file"
                                    accept=".jpg, .png, .jpeg"
                                    className="upload"
                                    onChange={handleImage}
                                />
                                <div className="flex-center flex-column">
                                    <Icon icon={plus} className="icon" size={20} />
                                </div>
                            </div>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}

// Multiple file uploader
export const MultiFileUploader = (props) => {
    const [error, setError] = useState(null)
    const [selectedFiles, setSelectedFiles] = useState({
        values: null,
        previews: props.deafult && props.deafult.length ? [...props.deafult] : []
    })

    useEffect(() => {
        if (props.error) setError(props.error)
    }, [props.error])

    // Handle image
    const handleImages = event => {
        let size = 0
        let fileArray = []
        const files = event.target.files

        for (let i = 0; i < files.length; i++) {
            fileArray.push(URL.createObjectURL(files[i]))
            size += files[i].size
        }

        if (fileArray.length < 2) {
            return setError('Select more than 2 files.')
        } else if (parseInt(size / 1000) > props.limit) {
            return setError('Total size limit is 8MB')
        }
        setSelectedFiles({ values: files, previews: fileArray })
        props.dataHandeller({ images: files })
    }

    return (
        <div className="img-select-container">
            <div className="form-group mb-4">
                {error ? <small className="text-danger">{error}</small> : <small>{props.title}</small>}

                <div className="d-flex">

                    {/* Files preview */}
                    {selectedFiles.previews && selectedFiles.previews.length ?
                        selectedFiles.previews.map((file, i) =>
                            <div className="preview-container text-center mr-1" key={i}>
                                <div className="image border" style={{ width: props.width ? props.width : 80, height: props.height ? props.height : 80 }}>
                                    <img src={file} className="img-fluid" alt="..." />
                                    {props.loading ?
                                        <div className="thumbnail-overlay flex-center flex-column">
                                            <div className="loader"></div>
                                        </div>
                                        : null}
                                </div>
                            </div>
                        ) : null}

                    {/* Loading overlay */}
                    {props.loading &&
                        <div className="thumbnail-overlay flex-center flex-column">
                            <div className="loader"></div>
                        </div>
                    }

                    {/* Files select  */}
                    {!props.loading &&
                        <div className="add-container text-center">
                            <div
                                className="image-plus border"
                                style={{ width: props.width ? props.width : 80, height: props.height ? props.height : 80 }}
                            >
                                <input
                                    type="file"
                                    className="upload"
                                    multiple
                                    accept=".jpg, .png, .jpeg"
                                    onChange={handleImages} />
                                <div className="flex-center flex-column">
                                    <Icon icon={plus} size={22} />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

// Upload with modal
export const FileUploaderModal = (props) => {
    const [image, setImage] = useState({ value: null, preview: null })

    // Handle image
    const handleImage = event => {
        const file = event.target.files[0]
        if (file) setImage({ value: file, preview: URL.createObjectURL(file) })
    }

    return (
        <div>
            <Modal
                show={props.show}
                onHide={props.onHide}
                backdrop="static"
                keyboard={false}
                dialogClassName="custom-file-upload-modal"
            >
                <Modal.Header className="border-0">
                    <h6 className="font-weight-bold mb-0">{props.title}</h6>
                </Modal.Header>
                <Modal.Body className="p-3">
                    {image.value && image.preview ?

                        // File preview container
                        <div className="file-preview-container">
                            <div className="file-preview">
                                <img src={image.preview} className="img-fluid m-auto" alt="..." />
                                <button
                                    type="button"
                                    className="btn shadow rounded-circle btn__close"
                                    disabled={props.loading}
                                    onClick={() => setImage({ value: null, preview: null })}
                                ><Icon icon={x} size={20} /></button>
                            </div>
                            <div className="text-right pt-3">
                                <button
                                    type="button"
                                    className="btn shadow-none btn__upload"
                                    disabled={props.loading}
                                    onClick={() => props.upload(image.value)}
                                >{props.loading ? "Uploading ..." : "Upload"}</button>

                                <button
                                    type="button"
                                    className="btn shadow-none btn__cancel ml-2"
                                    disabled={props.loading}
                                    onClick={() => {
                                        setImage({ value: null, preview: null })
                                        props.onHide()
                                    }}
                                >Cancel</button>
                            </div>
                        </div>
                        :

                        // File select container
                        <div className="file-selector-container text-center">
                            <div>
                                <input
                                    type="file"
                                    accept=".jpg, .png, .jpeg"
                                    className="upload"
                                    onChange={handleImage}
                                />
                                <div className="icon-container text-center border rounded p-4 w-50 m-auto">
                                    <Icon icon={ic_cloud_upload} style={{ color: "#eeeeee" }} size={40} />
                                </div>
                                <div className="my-3">
                                    <p className="text-muted">Select .jpg, .png, .jpeg type file.</p>
                                    <p className="text-muted">To use your image.</p>
                                </div>
                            </div>
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}