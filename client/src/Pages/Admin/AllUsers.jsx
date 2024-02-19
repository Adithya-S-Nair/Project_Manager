import React, { useState } from 'react'
import TableComponent from '../../Components/TableComponent'
import { useQuery } from 'react-query';
import { makeRequest } from '../../Axios';
import EnhancedTable from '../../Components/EnhancedTable';
import ToastComponent from '../../Components/ToastComponent'
import PageTitle from '../../Components/PageTitle';

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

    const titleIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 font-bold"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
            />
        </svg>
    );

    return (
        <div>
            <PageTitle titleText={'All Users'} titleIcon={titleIcon} />
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