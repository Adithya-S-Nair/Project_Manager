
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import { ThemeContext } from '../Context/ThemeContext';
import moment from 'moment';

const CreateProjectForm = ({ setDrawerState, handleCreateProjectChange, handleCreate, inputs }) => {
    const { theme } = useContext(ThemeContext)
    return (
        <>
            {theme === 'theme1' ? <>
                <div className='flex justify-between p-5'>
                    <h1 className='font-bold '>Project</h1>
                    <CloseIcon onClick={() => setDrawerState({ anchor: 'right', open: false, })} />
                </div>
                <hr />
                <div className='grid grid-cols-1 gap-y-6 p-5'>
                    <TextField
                        id="outlined-password-input"
                        label="Project Name"
                        name="projectName"
                        type="text"
                        value={inputs.projectName}
                        autoComplete="project-name"
                        onChange={(e) => handleCreateProjectChange(e)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Project Start Date"
                            name="projectStartDate"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateProjectChange({ target: { name: 'projectStartDate', value: formattedDate } });
                            }}

                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Project End Date"
                            name="projectEndDate"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateProjectChange({ target: { name: 'projectEndDate', value: formattedDate } });
                            }}

                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Actual Start Date"
                            name="actualStartDate"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateProjectChange({ target: { name: 'actualStartDate', value: formattedDate } });
                            }}

                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Actual End Date"
                            name="actualEndDate"
                            slots={{ openPickerIcon: DateRangeIcon }}
                            onChange={(date) => {
                                // Format the date and update the state
                                const formattedDate = date ? date.format('YYYY-MM-DD') : '';
                                handleCreateProjectChange({ target: { name: 'actualEndDate', value: formattedDate } });
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        multiline
                        fullWidth
                        rows={3}
                        name='projectDescription'
                        label="Project Description"
                        value={inputs.projectDescription}
                        onChange={(e) => handleCreateProjectChange(e)}
                    />
                </div>
                <div className='flex justify-center space-x-5'>
                    <Button variant="contained" size="medium" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
                        Cancel
                    </Button>
                    <Button variant="contained" size="medium" onClick={handleCreate}>
                        Submit
                    </Button>
                </div>
            </> :
                <>
                    <div className='flex justify-between p-5'>
                        <h1 className='font-bold '>Project</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <hr />

                    <div className='grid grid-cols-1 gap-y-4 p-5'>
                        <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                            <label>Project Name:</label>
                            <input type="text" placeholder="Enter Project Name" className="input input-bordered" name="projectName" value={inputs.projectName} onChange={(e) => handleCreateProjectChange(e)} />

                        </div>
                        <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                            <label>Project Start Date:</label>
                            <input
                                type="date"
                                placeholder=""
                                className="input input-bordered"
                                value={moment(inputs.projectStartDate).format('YYYY-MM-DD')}
                                onChange={(e) => {
                                    const formattedDate = moment(e.target.value, 'YYYY-MM-DD').toDate();
                                    handleCreateProjectChange({ target: { name: 'projectStartDate', value: formattedDate } });
                                }}
                            />
                        </div>
                        <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                            <label>Project End Date:</label>
                            <input
                                type="date"
                                placeholder=""
                                className="input input-bordered"
                                value={moment(inputs.projectEndDate).format('YYYY-MM-DD')}
                                onChange={(e) => {
                                    const formattedDate = moment(e.target.value, 'YYYY-MM-DD').toDate();
                                    handleCreateProjectChange({ target: { name: 'projectEndDate', value: formattedDate } });
                                }}
                            />
                        </div>
                        <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                            <label>Actual Start Date:</label>
                            <input
                                type="date"
                                placeholder=""
                                className="input input-bordered"
                                value={moment(inputs.actualStartDate).format('YYYY-MM-DD')}
                                onChange={(e) => {
                                    const formattedDate = moment(e.target.value, 'YYYY-MM-DD').toDate();
                                    handleCreateProjectChange({ target: { name: 'actualStartDate', value: formattedDate } });
                                }}
                            />
                        </div>
                        <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>
                            <label>Actual End Date:</label>
                            <input
                                type="date"
                                placeholder=""
                                className="input input-bordered"
                                value={moment(inputs.actualEndDate).format('YYYY-MM-DD')}
                                onChange={(e) => {
                                    const formattedDate = moment(e.target.value, 'YYYY-MM-DD').toDate();
                                    handleCreateProjectChange({ target: { name: 'actualEndDate', value: formattedDate } });
                                }}
                            />
                        </div>
                        <div className='container-fluid grid grid-cols-1 gap-y-3 p-2'>

                            <label>Project Description:</label>

                            <textarea className="textarea textarea-bordered" placeholder="Describe About Your Project" name='projectDescription' value={inputs.projectDescription} onChange={(e) => handleCreateProjectChange(e)}
                            ></textarea>
                        </div>
                    </div>

                    <div className='flex justify-center mb-4'>
                        <button className="btn btn-active btn-primary" onClick={() => setDrawerState({ anchor: 'right', open: false, })}>Cancel</button>
                        <button className="btn btn-active btn-primary" onClick={handleCreate}>Submit</button>
                    </div>
                </>
            }
        </>
    )
}

export default CreateProjectForm