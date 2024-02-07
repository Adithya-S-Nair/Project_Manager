import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Button from '@mui/material/Button';

const CreateProjectForm = ({ setDrawerState, handleCreateProjectChange, handleCreate, inputs }) => {
    return (
        <>
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
        </>
    )
}

export default CreateProjectForm