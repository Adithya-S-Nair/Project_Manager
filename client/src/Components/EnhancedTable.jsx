import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { visuallyHidden } from '@mui/utils';
import { useQuery } from 'react-query';
import { makeRequest } from '../Axios';
import { ThemeContext } from '../Context/ThemeContext';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import EditModalMUI from './EditModalMUI';
import { useState } from 'react';
import EditModal from './EditModalMUI';
import { useEffect } from 'react';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
    const { theme } = React.useContext(ThemeContext)
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headerData } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    {theme === 'theme1' ?
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts',
                            }}
                        /> :
                        <input
                            type="checkbox"
                            className="checkbox ms-2"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    }
                </TableCell>
                {headerData.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell align="right">Actions</TableCell>
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    headerData: PropTypes.array.isRequired,
};

function EnhancedTableToolbar(props) {
    const { theme } = React.useContext(ThemeContext)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [editType, setEditType] = useState('');
    const [open, setOpen] = React.useState(false);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSearchInput = (event) => {
        const searchKey = event.target.value;

        const filteredData = props.rowData.filter((item) => {
            return Object.values(item).some(
                (field) =>
                    field &&
                    field.toString().toLowerCase().includes(searchKey.toLocaleLowerCase())
            );
        })

        props.setFilteredData(filteredData)
    };

    const { numSelected, selected } = props;
    const handleMenuAction = (action) => {
        if (action === 'appointEmployee') {
            selected && selected.map((userId) => {
                makeRequest.post(`/employee/appointemployee/${userId}`)
                    .then(() => {
                        props.setToastOpen({
                            open: true,
                            msg: 'Employee appointed successfully'
                        })
                    })
            })
        }
        handleMenuClose();
    };


    const handleOpen = () => {
        setOpen(true);
        setEditType('createUser')
    }
    const handleClose = () => setOpen(false);


    return (
        <>
            <Toolbar
                className='flex justify-between'
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme === 'theme1' ? '#e2edf9' : '#5cd4d0', theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} selected
                    </Typography>
                ) : (
                    <input type="text"
                        onChange={handleSearchInput}
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs bg-white h-10" />
                )}

                {numSelected > 0 ? (
                    <Tooltip title="More options">
                        <IconButton onClick={handleMenuOpen}>
                            <MoreVertIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <div>
                        <Tooltip title='Create User'>
                            <ControlPointIcon sx={{ color: '#757575', width: '0.88em' }} className='me-2 cursor-pointer' onClick={handleOpen} />
                        </Tooltip>
                        <Tooltip title="Filter list">
                            <IconButton>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}
            </Toolbar>
            <Menu
                id="actions-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleMenuAction('appointEmployee')}>
                    Appoint as Employee
                </MenuItem>
                <MenuItem onClick={() => handleMenuAction('appointChecker')}>
                    Appoint as Checker
                </MenuItem>
                <MenuItem onClick={() => handleMenuAction('delete')}>
                    Delete
                </MenuItem>
            </Menu>
            {
                <EditModalMUI
                    open={open}
                    setOpen={setOpen}
                    handleClose={handleClose}
                    editType={editType}
                />
            }
        </>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

function EnhancedTable({ headerData, rowData, setRowData, setToastOpen }) {
    const { theme } = React.useContext(ThemeContext)
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [filteredData, setFilteredData] = React.useState([]);
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState({});

    useEffect(() => {
        setFilteredData(rowData)
    }, [rowData])

    const handleEditModalClose = () => setEditModalOpen(false);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rowData.map((n) => n.user_id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const handleEditUser = (userId) => {
        const selectedUser = rowData.find((item) => item.user_id === userId);
        setSelectedUser(selectedUser);
        setEditModalOpen(true)
    }

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(filteredData, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage, filteredData],
    );

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <EnhancedTableToolbar selected={selected} numSelected={selected.length} setToastOpen={setToastOpen} setFilteredData={setFilteredData} rowData={rowData} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                        >
                            <EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={filteredData.length}
                                headerData={headerData}
                            />
                            <TableBody>
                                {visibleRows.map((row, index) => {
                                    const isItemSelected = isSelected(row.user_id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.user_id)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.user_id}
                                            selected={isItemSelected}
                                            sx={{
                                                cursor: 'pointer',
                                                '&.Mui-selected': {
                                                    backgroundColor: '#ebfafa',
                                                },
                                                '&:hover': {
                                                    backgroundColor: '#ebfafa'
                                                },
                                            }}
                                        >
                                            <TableCell padding="checkbox">
                                                {theme === 'theme1' ?
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    /> :
                                                    <input type="checkbox" className="checkbox ms-2 text-indigo-500" checked={isItemSelected} />
                                                }
                                            </TableCell>
                                            {headerData.map((headCell) => (
                                                <TableCell
                                                    key={headCell.id}
                                                    align={headCell.numeric ? 'right' : 'left'}
                                                >
                                                    {row[headCell.id]}
                                                </TableCell>
                                            ))}
                                            <TableCell align={'right'}>
                                                <button onClick={() => {
                                                    handleEditUser(row.user_id)
                                                }}
                                                    className='bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow'>Edit</button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={headerData.length + 2} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
            <EditModal
                open={editModalOpen}
                editType="edituser"
                setOpen={setEditModalOpen}
                handleClose={handleEditModalClose}
                selectedUser={selectedUser}
                setRowData={setRowData}
            />
        </>
    );
}

EnhancedTable.propTypes = {
    headerData: PropTypes.array.isRequired,
    rowData: PropTypes.array.isRequired,
};

export default EnhancedTable;
