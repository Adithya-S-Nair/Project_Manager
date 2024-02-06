import React, { useContext } from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { makeRequest } from '../Axios';
import { AuthContext } from '../Context/AuthContext';

const MenuComponent = ({ anchorEl, open, handleClose }) => {
    const { user, setUser } = useContext(AuthContext);

    const handleLogout = () => {
        makeRequest.get('/auth/logout')
            .then(() => {
                setUser(null)
            })
    }

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
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    )
}

export default MenuComponent