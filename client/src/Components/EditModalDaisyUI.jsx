import React, { useRef, useEffect } from 'react'
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const EditModalDaisyUI = ({ open, setOpen, handleClose, projectData, editType }) => {
    const modalRef = useRef(null);

    let modalContent;

    useEffect(() => {
        if (open) {
            modalRef.current.showModal();
        }
    }, [open]);

    const handleEscape = (event) => {
        if (event.key === 'Escape') {
            setOpen(false);
        }
    };

    useEffect(() => {
        modalRef.current.addEventListener('close', handleClose);
        document.addEventListener('keydown', handleEscape);

    }, [handleClose]);

    switch (editType) {
        case "project":
            modalContent = (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Project Details
                        </Typography>
                        <div className="tooltip bg-white" data-tip="close">
                            <IconButton onClick={() => { setOpen(false); modalRef.current.close(); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </IconButton>
                        </div>
                    </div>
                    <hr />
                    <div className='grid grid-cols-1 gap-y-4'>
                        <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                            <label>Project Name:</label>
                            <input
                                type="text"
                                placeholder="Enter Project Name"
                                className="input input-bordered bg-white"
                                name="projectName"
                            //  value={inputs.projectName} 
                            //  onChange={(e) => handleCreateProjectChange(e)} 
                            />

                        </div>
                        <div className="flex items-center justify-between">
                            <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                                <label>Project Start Date:</label>
                                <input
                                    type="date"
                                    placeholder=""
                                    className="input input-bordered bg-white"
                                // value={moment(inputs.projectStartDate).format('YYYY-MM-DD')}
                                // onChange={(e) => {
                                //     const formattedDate = moment(e.target.value, 'YYYY-MM-DD').toDate();
                                //     handleCreateProjectChange({ target: { name: 'projectStartDate', value: formattedDate } });
                                // }}
                                />
                            </div>
                            <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                                <label>Project End Date:</label>
                                <input
                                    type="date"
                                    placeholder=""
                                    className="input input-bordered bg-white"
                                // value={moment(inputs.projectEndDate).format('YYYY-MM-DD')}
                                // onChange={(e) => {
                                //     const formattedDate = moment(e.target.value, 'YYYY-MM-DD').toDate();
                                //     handleCreateProjectChange({ target: { name: 'projectEndDate', value: formattedDate } });
                                // }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                                <label>Actual Start Date:</label>
                                <input
                                    type="date"
                                    placeholder=""
                                    className="input input-bordered bg-white"
                                // value={moment(inputs.actualStartDate).format('YYYY-MM-DD')}
                                // onChange={(e) => {
                                //     const formattedDate = moment(e.target.value, 'YYYY-MM-DD').toDate();
                                //     handleCreateProjectChange({ target: { name: 'actualStartDate', value: formattedDate } });
                                // }}
                                />
                            </div>
                            <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                                <label>Actual End Date:</label>
                                <input
                                    type="date"
                                    placeholder=""
                                    className="input input-bordered bg-white"
                                // value={moment(inputs.actualEndDate).format('YYYY-MM-DD')}
                                // onChange={(e) => {
                                //     const formattedDate = moment(e.target.value, 'YYYY-MM-DD').toDate();
                                //     handleCreateProjectChange({ target: { name: 'actualEndDate', value: formattedDate } });
                                // }}
                                />
                            </div>
                        </div>
                        <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>

                            <label>Project Description:</label>

                            <textarea
                                className="textarea textarea-bordered bg-white"
                                placeholder="Describe About Your Project"
                                name='projectDescription'
                            // value={inputs.projectDescription}
                            // onChange={(e) => handleCreateProjectChange(e)}
                            ></textarea>
                        </div>
                    </div>
                </>
            )
            break;
        case "assignedTask":
            modalContent = (
                <>

                </>
            );
            break;
        default:
            modalContent = (
                <div>
                    <p>Unsupported editType: {editType}</p>
                </div>
            );
    }

    return (
        <>
            <dialog ref={modalRef} id="my_modal_1" className="modal">
                <div className="modal-box bg-white w-90">
                    {modalContent}
                </div>
            </dialog>
        </>
    )
}

export default EditModalDaisyUI