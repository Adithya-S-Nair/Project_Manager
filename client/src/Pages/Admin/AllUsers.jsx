import React, { useState } from 'react'
import TableComponent from '../../Components/TableComponent'
import { useQuery } from 'react-query';
import { makeRequest } from '../../Axios';
import EnhancedTable from '../../Components/EnhancedTable';
import ToastComponent from '../../Components/ToastComponent'

const AllUsers = () => {
    const [gridApi, setGridApi] = useState(null);
    const [toastOpen, setToastOpen] = useState({
        open: false,
        msg: ''
    });
    // const [userColumn, setUserColumn] = useState([
    //     { colId: '0_1', field: 'first_name', headerName: 'First Name', hide: false },
    //     { colId: '1_1', field: 'last_name', headerName: 'Last Name', hide: false },
    //     { colId: '2_1', field: 'user_name', headerName: 'User Name', hide: false },
    //     { colId: '3_1', field: 'registration_time', headerName: 'Joined On', hide: false },
    // ])

    const [userColumn, setUserColumn] = useState([
        { id: 'first_name', numeric: false, disablePadding: true, label: 'First Name' },
        { id: 'last_name', numeric: false, disablePadding: true, label: 'Last Name' },
        { id: 'user_name', numeric: false, disablePadding: true, label: 'User Name' },
        { id: 'registration_time', numeric: false, disablePadding: true, label: 'Joined On' },
    ])


    const { data: usersData, error: usersDataError, isLoading: usersDataLoading } = useQuery(
        ['usersData'],
        async () => {
            const response = await makeRequest.get('/user/getallusers');
            return response.data;
        }
    );

    if (usersDataError) {
        return <div>Error fetching data</div>;
    }

    if (usersDataLoading) {
        return <div>Loading data</div>;
    }

    return (
        <div>
            {/* <input type="text" /> */}
            <EnhancedTable
                headerData={userColumn}
                rowData={usersData}
                setToastOpen={setToastOpen}
            />
            {toastOpen.open && <ToastComponent toastOpen={toastOpen} />}
        </div>
    )
}

export default AllUsers