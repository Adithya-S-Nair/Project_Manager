import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Button } from '@mui/material';

const CheckboxColumn = ({ column, onCheckboxChange }) => {
  return (
    <div className="ag-cell-checkbox">
      {/* <Checkbox
        checked={column.colDef.checked}
        onChange={() => onCheckboxChange(column)}
        color="primary"
      /> */}
      <Button>Click</Button>
    </div>
  );
};

export default CheckboxColumn;