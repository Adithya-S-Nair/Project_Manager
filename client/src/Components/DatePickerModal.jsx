import React from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range'; // Import DateRangePicker
import { IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

const style = {
    position: 'absolute',
    maxHeight: '30em',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    borderRadius: '1em',
    boxShadow: 24,
    pt: 4,
    pb: 4,
    pl: 3,
    pr: 3,
};



const DatePickerModal = ({ dateModalOpen, setDateModalOpen, taskData, subtaskData, filteredTaskData, setFilteredTaskData, filteredSubtaskData, setFilteredSubtaskData, setCalendarStartDate, setCalendarEndDate, personalTaskData, filteredPersonalTaskData, setFilteredPersonalTaskData, personalSubtaskData, setFilteredPersonalSubtaskData }) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
    }
    console.log(taskData);
    console.log(subtaskData);

    const handleSelect = (selectedDate) => {
        if (taskData) {
            const dateFilter = taskData;
            const filteredDate = dateFilter.filter((consentDate) => {
                console.log(selectedDate.selection.endDate);
                setCalendarStartDate(selectedDate.selection.startDate)
                setCalendarEndDate(selectedDate.selection.endDate)
                const projectDate = new Date(task.planned_start_date);
                return (
                    projectDate >= selectedDate.selection.startDate &&
                    projectDate <= selectedDate.selection.endDate
                );
            });
            setFilteredTaskData(filteredDate);
        }
        if (subtaskData) {
            const dateFilter = subtaskData;
            const filteredDate = dateFilter.filter((subtask) => {
                console.log(selectedDate.selection.endDate);
                setCalendarStartDate(selectedDate.selection.startDate)
                setCalendarEndDate(selectedDate.selection.endDate)
                const projectDate = new Date(subtask.planned_start_date);
                return (
                    projectDate >= selectedDate.selection.startDate &&
                    projectDate <= selectedDate.selection.endDate
                );
            });
            setFilteredSubtaskData(filteredDate);
        }

        if (personalTaskData) {
            const dateFilter = personalTaskData;
            const filteredDate = dateFilter.filter((personalTask) => {
                console.log(selectedDate.selection.endDate);
                setCalendarStartDate(selectedDate.selection.startDate)
                setCalendarEndDate(selectedDate.selection.endDate)
                const projectDate = new Date(personalTask.planned_start_date);
                return (
                    projectDate >= selectedDate.selection.startDate &&
                    projectDate <= selectedDate.selection.endDate
                );
            });
            setFilteredPersonalTaskData(filteredDate);
        }

        if (personalSubtaskData) {
            const dateFilter = personalSubtaskData;
            const filteredDate = dateFilter.filter((personalSubtask) => {
                console.log(selectedDate.selection.endDate);
                setCalendarStartDate(selectedDate.selection.startDate)
                setCalendarEndDate(selectedDate.selection.endDate)
                const projectDate = new Date(personalSubtask.planned_start_date);
                return (
                    projectDate >= selectedDate.selection.startDate &&
                    projectDate <= selectedDate.selection.endDate
                );
            });
            setFilteredPersonalSubtaskData(filteredDate);
        }

        setStartDate(selectedDate.selection.startDate);
        setEndDate(selectedDate.selection.endDate);
        // console.log(date);
    };

    let modalContent = (
        <>
            <div className="flex items-center justify-between mb-2">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Search By Date
                </Typography>
                <Tooltip title="Close">
                    <IconButton onClick={() => { setDateModalOpen(!dateModalOpen) }}>
                        <CloseIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <hr />
            <DateRangePicker
                className='mt-3'
                ranges={[selectionRange]}
                onChange={handleSelect}
            />
        </>
    )
    return (
        <div>

            <Modal
                open={dateModalOpen}
                // onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {modalContent}
                </Box>
            </Modal>

        </div>
    )
}

export default DatePickerModal