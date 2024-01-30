import React from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const MenuComponent = ({ anchorEl, open, handleClose }) => {
    return (
        <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            sx={{ marginTop: '2em' }}
        >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem>Logout</MenuItem>
        </Menu>
    )
}

export default MenuComponent