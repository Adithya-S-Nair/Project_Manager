import React, { useEffect, useState, useContext } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { makeRequest } from '../Axios'
import { ThemeContext } from '../Context/ThemeContext';

const DatagridComponent = ({ data, columnDefs, gridApi, setGridApi, setColumnDefs, handleSelectedTask, type, handleCellValueChanged }) => {


    // const handleCellValueChanged = (event) => {
    //     const { data } = event.node;
    //     if (!data.subtask_id) {
    //         makeRequest.patch(`/task/updatetask/${data.task_id}`, data)
    //     } else {
    //         makeRequest.patch(`/subtask/updatesubtaskbyid/${data.subtask_id}`, data)
    //     }
    // }

    const { theme } = useContext(ThemeContext)
    const onGridReady = (params) => {
        setGridApi(params.api);
        console.log('Grid API initialized:', params.api);
    };

    function handleSelectionChanged(event) {
        const selectedNodes = event.columnApi.api.getSelectedRows();
        const titleName = selectedNodes[0] ? Object.keys(selectedNodes[0]) : null;
        if (titleName && titleName.length > 0) {
            // console.log(selectedNodes);
            // console.log(titleName[0]);
            if (titleName[0] === "task_id") {
                const selectedData = selectedNodes.map(node => node.task_id);
                handleSelectedTask(selectedData, selectedNodes);
            } else if (titleName[0] === "subtask_id") {
                const selectedData = selectedNodes.map(node => node.subtask_id);
                handleSelectedTask(selectedData, selectedNodes);
            }
        } else {
            // const selectedNodes = event.columnApi.api.deselectAll();
            handleSelectedTask([], []);
        }
    }

    const defaultColDef = {
        sortable: true,
        filter: true,
        editable: theme === 'theme2'
    };


    const gridOptions = {
        pagination: true,
        paginationPageSize: 10,
        suppressAutoSize: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        onSelectionChanged: handleSelectionChanged,
        onCellValueChanged: handleCellValueChanged,
    }

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
                rowData={data}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                gridOptions={gridOptions}
                onGridReady={onGridReady}
            />
        </div>
    );
};

export default DatagridComponent;
