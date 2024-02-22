import React, { useContext, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { makeRequest } from '../Axios';
import { AuthContext } from '../Context/AuthContext';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ThemeContext } from '../Context/ThemeContext';

const MenuComponent = ({ anchorEl, open, handleClose, isForwardIcon, setIsForwardIcon, firstThemeClick, openSubMenu, setOpenSubMenu }) => {
    const { user, setUser } = useContext(AuthContext);
    const { theme, setTheme } = useContext(ThemeContext);
    // State to track first theme click

    const handleLogout = () => {
        makeRequest.get('/auth/logout')
            .then(() => {
                setUser(null);
            });
    };

    const handleThemeClick = (themes) => {
        setTheme(themes)
        handleClose();
    };


    const handleThemeMenuClick = (event) => {
        setSubMenuAnchor(event.currentTarget);
        if (firstThemeClick) {
            setOpenSubMenu(!openSubMenu);
            console.log(openSubMenu);
        }
        setIsForwardIcon(!isForwardIcon);
    };

    const [subMenuAnchor, setSubMenuAnchor] = useState(null);

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
        // onClick={handleThemeSetting}
        >
            <MenuItem>
                <AccountCircleIcon className='me-2' />
                Profile
                </MenuItem>
            <MenuItem onClick={handleThemeMenuClick}>
                {isForwardIcon ? <KeyboardArrowLeftIcon className='me-1' /> : <KeyboardArrowRightIcon className='me-1' />}
                Theme Settings</MenuItem>
            <div style={{ marginRight: '4em' }}>
                <Menu
                    style={{ transform: 'translate(-175px, 0)' }}
                    id="sub-menu"
                    anchorEl={subMenuAnchor}
                    open={openSubMenu}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    sx={{ marginTop: '1em' }}
                >
                    <MenuItem onClick={() => handleThemeClick('theme1')}>Theme 1</MenuItem>
                    <MenuItem onClick={() => handleThemeClick('theme2')}>Theme 2</MenuItem>
                </Menu>
            </div>
            <MenuItem onClick={handleLogout}>
                <LogoutIcon className='me-2' />
                Logout</MenuItem>
        </Menu>
    );
};

export default MenuComponent;
