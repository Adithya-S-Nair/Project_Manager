import React, { useEffect, useState } from 'react'
import TableComponent from '../../Components/TableComponent'
import { useQuery } from 'react-query';
import { makeRequest } from '../../Axios';
import EnhancedTable from '../../Components/EnhancedTable';
import ToastComponent from '../../Components/ToastComponent'
import PageTitle from '../../Components/PageTitle';

// let count = 0;
const AllUsers = () => {
    var count = 0;
    const [rowData, setRowData] = useState([])
    const [gridApi, setGridApi] = useState(null);
    const [toastOpen, setToastOpen] = useState({
        open: false,
        msg: ''
    });

    const [userColumn, setUserColumn] = useState([
        { id: 'first_name', numeric: false, disablePadding: true, label: 'First Name' },
        { id: 'last_name', numeric: false, disablePadding: true, label: 'Last Name' },
        { id: 'user_name', numeric: false, disablePadding: true, label: 'User Name' },
        { id: 'registration_time', numeric: false, disablePadding: true, label: 'Joined On' },
    ])


    const { data: usersData, error: usersDataError, isLoading: usersDataLoading } = useQuery(
        ["UserData"],
        () => {
            return makeRequest.get('/user/getallusers')
                .then((response) => {
                    console.log(response.data);
                    count++;
                    return response.data;
                });
            },
            {
            staleTime: Infinity,
            cacheTime: 0,
            onSuccess: () => {
                // This callback will be called when the query is successfully refetched
                // You can add any logic here that you want to execute after a successful refetch
                console.log('Query refetched successfully');

                // Trigger a re-render of the component (you can use state or forceUpdate if needed)
                // For example, you can use React.useState and set a state variable to trigger a re-render
                // const [, setForceRender] = React.useState();
                // setForceRender(prev => !prev);
            },
        }
    );

    // useEffect(() => {
    //     makeRequest.get('/user/getallusers')
    //         .then((res) => {
    //             setRowData(res)
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // }, [rowData])
    console.log(usersData);

    const titleIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.6}
            stroke="currentColor"
            className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
        </svg>

    );

    return (
        <div>
            <PageTitle titleText={'All Users'} titleIcon={titleIcon} />
            {usersData &&
                <EnhancedTable
                    key={count}
                    headerData={userColumn}
                    rowData={usersData}
                    // setRowData={setRowData}
                    setToastOpen={setToastOpen}
                />}
            {toastOpen.open && <ToastComponent toastOpen={toastOpen} />}
        </div>
    )
}

export default AllUsers