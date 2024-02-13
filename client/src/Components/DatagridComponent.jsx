import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const DatagridComponent = ({ data, columnDefs, gridApi, setGridApi, setColumnDefs, handleSelectedTask, taskId }) => {

    const onGridReady = (params) => {
        setGridApi(params.api);
        console.log('Grid API initialized:', params.api);
    };

    function handleSelectionChanged(event) {
        const selectedNodes = event.columnApi.api.getSelectedRows();
        const titleName = selectedNodes[0] ? Object.keys(selectedNodes[0]) : null;
        if (titleName && titleName.length > 0) {
            console.log(selectedNodes);
            console.log(titleName[0]);
            if (titleName[0] === "task_id") {
                const selectedData = selectedNodes.map(node => node.task_id);
                handleSelectedTask(selectedData, selectedNodes);
            } else if (titleName[0] === "subtask_id") {
                const selectedData = selectedNodes.map(node => node.subtask_id);
                handleSelectedTask(selectedData, selectedNodes);
            }
        } else {
            // Reset selectedNodes to an empty array
            const selectedNodes = event.columnApi.api.deselectAll();
            // const selectedData = selectedNodes;
            handleSelectedTask([], []);
        }
    }
    

    const defaultColDef = {
        sortable: true,
        filter: true,
    };

    const gridOptions = {
        pagination: true,
        paginationPageSize: 10, // Adjust the number of rows per page as needed
        suppressAutoSize: true,
        rowSelection: 'multiple',
        suppressRowClickSelection: true,
        onSelectionChanged: handleSelectionChanged
    };

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
