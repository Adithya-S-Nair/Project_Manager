import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const DatagridComponent = ({ data, columnDefs, gridApi, setGridApi, setColumnDefs }) => {

    const onGridReady = (params) => {
        setGridApi(params.api);
    };
    
    const defaultColDef = {
        sortable: true,
        filter: true,
    };

    const gridOptions = {
        pagination: true,
        paginationPageSize: 10, // Adjust the number of rows per page as needed
        suppressAutoSize: true,
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
