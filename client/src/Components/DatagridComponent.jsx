import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const DatagridComponent = ({ data, columnDefs, gridApi, setGridApi, setColumnDefs, handleSelectedTask }) => {

    const onGridReady = (params) => {
        setGridApi(params.api);
        console.log('Grid API initialized:', params.api);
    };
    function handleSelectionChanged(event) {
        console.log(event);
        const selectedNodes = event.columnApi.api.getSelectedRows();
        const selectedData = selectedNodes.map(node => node.task_id);
        handleSelectedTask(selectedData);
    };

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
