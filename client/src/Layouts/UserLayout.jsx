import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import UploadIcon from '@mui/icons-material/Upload';
import Collapse from '@mui/material/Collapse';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AppsIcon from '@mui/icons-material/Apps';
import ListSubheader from '@mui/material/ListSubheader';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import MenuComponent from '../Components/MenuComponent';
import { makeRequest } from '../Axios';
import { AuthContext } from '../Context/AuthContext';
import { ThemeContext } from '../Context/ThemeContext';
import { useContext } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsertChartIcon from '@mui/icons-material/InsertChart';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const UserLayout = () => {
    const { user } = useContext(AuthContext)
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isSmallScreen = useMediaQuery('(max-width: 820px)');
    const [open, setOpen] = React.useState(true);
    const [listOpen, setListOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isForwardIcon, setIsForwardIcon] = React.useState(false);
    const [openSubMenu, setOpenSubMenu] = React.useState(false);
    const [firstThemeClick, setFirstThemeClick] = React.useState(true);
    const { theme: colorTheme } = useContext(ThemeContext)

    const menuOpen = Boolean(anchorEl);
    console.log(user);
    // const { setUser } = React.useContext(AuthContext)
    const handleClicked = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        // setFirstThemeClick(true)
        setIsForwardIcon(false)
        setOpenSubMenu(false)
        console.log(openSubMenu);
    };

    React.useEffect(() => {
        setOpen(!isSmallScreen);
    }, [isSmallScreen]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleClick = () => {
        setListOpen(!listOpen);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // const handleLogout = () => {
    //     makeRequest.get('/auth/logout')
    //         .then((res) => {
    //             if (res.status === 200) {
    //                 // window.location.reload()
    //                 setUser(null)
    //                 return <Navigate to='/login' />
    //             }
    //         })
    // }

    const projectDashboard = () => {
        navigate('/user/dashboard');
    };

    const ganttChart = () => {
        navigate('/user/ganttchart');
    };

    return (
        <div>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                {colorTheme === "theme1"
                    ?
                    <>
                        <AppBar position="fixed" open={open} sx={{ backgroundColor: 'white' }}>
                            <div className='flex justify-between items-center'>
                                <Toolbar>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={handleDrawerOpen}
                                        edge="start"
                                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                                    >
                                        <MenuIcon className='text-black' />
                                    </IconButton>
                                    <Typography variant="h6" noWrap component="div" className='font-bold text-black'>
                                        {user.user_name}
                                    </Typography>
                                </Toolbar>
                                <Button
                                    id="demo-positioned-button"
                                    aria-controls={menuOpen ? 'demo-positioned-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpen ? 'true' : undefined}
                                    onClick={handleClicked}
                                    className='text-white'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-black">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>


                                </Button>
                                <MenuComponent
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    isForwardIcon={isForwardIcon}
                                    setIsForwardIcon={setIsForwardIcon}
                                    firstThemeClick={firstThemeClick}
                                    setFirstThemeClick={setFirstThemeClick}
                                    openSubMenu={openSubMenu}
                                    setOpenSubMenu={setOpenSubMenu}
                                    handleClose={handleClose}
                                />
                            </div>


                        </AppBar>
                        <Drawer
                            sx={{
                                width: drawerWidth,
                                flexShrink: 0,

                                '& .MuiDrawer-paper': {
                                    width: drawerWidth,
                                    boxSizing: 'border-box',
                                    background: 'linear-gradient(110deg, rgba(62,83,122,1) 0%, rgba(38,45,63,1) 58%)'
                                },
                            }}
                            variant="persistent"
                            anchor="left"
                            open={open}
                        >
                            <div className='flex justify-between items-center p-3'>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                                    </svg>
                                    <p className='font-bold text-white'>Project Manager</p>
                                </div>
                                <IconButton className='text-white' onClick={handleDrawerClose}>
                                    {theme.direction === 'ltr' ? <ChevronLeftIcon className='text-white' /> : <ChevronRightIcon className='text-white' />}
                                </IconButton>
                            </div>
                            <Divider />
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={location.pathname === '/user/dashboard'}
                                        onClick={projectDashboard}
                                        sx={{
                                            "&:hover": { backgroundColor: "#596876", color: "#161245" },
                                            "&.Mui-selected": { backgroundColor: "#596876", color: "#161245" }
                                        }}>
                                        <ListItemIcon>
                                            <DashboardIcon className='text-white' />
                                        </ListItemIcon>
                                        <ListItemText className='text-white' primary='Project Dashboard' />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={location.pathname === '/admin/ganttchart'}
                                        onClick={ganttChart}
                                        sx={{
                                            "&:hover": { backgroundColor: "#596876", color: "#161245" },
                                            "&.Mui-selected": { backgroundColor: "#0057c9", color: "#161245" }
                                        }}>
                                        <ListItemIcon>
                                            <InsertChartIcon className='text-white' />
                                        </ListItemIcon>
                                        <ListItemText className='text-white' primary='Gantt Chart' />
                                    </ListItemButton>
                                </ListItem>
                                {/* <ListItem disablePadding>
                            <ListItemButton
                                selected={location.pathname === '/upload'}
                                onClick={uploadNavigate}
                                sx={{
                                    "&:hover": { backgroundColor: "#596876", color: "#161245" },
                                    "&.Mui-selected": { backgroundColor: "#0057c9", color: "#161245" }
                                }}>
                                <ListItemIcon>
                                    <UploadIcon className='text-white' />
                                </ListItemIcon>
                                <ListItemText className='text-white' primary='Upload' />
                            </ListItemButton>
                        </ListItem> */}
                            </List>
                            {/* <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'transparent' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >

                        <ListItemButton onClick={handleClick} sx={{ "&:hover": { backgroundColor: "#596876", color: "#161245" } }}>
                            <ListItemIcon>
                                <InboxIcon className='text-white' />
                            </ListItemIcon>
                            <ListItemText className='text-white' primary="Reports" />
                            {listOpen ? <ExpandLess className='text-white' /> : <ExpandMore className='text-white' />}
                        </ListItemButton>
                        <Collapse in={listOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton
                                    onClick={() => navigate('/listva')}
                                    selected={location.pathname === '/listva'}
                                    sx={{
                                        "&:hover": { backgroundColor: "#596876", color: "#161245" },
                                        "&.Mui-selected": { backgroundColor: "#0057c9", color: "#161245" },
                                        pl: 4
                                    }}>
                                    <ListItemIcon>
                                        <RecentActorsIcon className='text-white' />
                                    </ListItemIcon>
                                    <ListItemText className='text-white' primary="List VA" />
                                </ListItemButton>
                                <ListItemButton sx={{ "&:hover": { backgroundColor: "#596876", color: "#161245" }, pl: 4 }}>
                                    <ListItemIcon>
                                        <ReceiptIcon className='text-white' />
                                    </ListItemIcon>
                                    <ListItemText className='text-white' primary="List Invoice" />
                                </ListItemButton>
                                <ListItemButton sx={{ "&:hover": { backgroundColor: "#596876", color: "#161245" }, pl: 4 }}>
                                    <ListItemIcon>
                                        <AppsIcon className='text-white' />
                                    </ListItemIcon>
                                    <ListItemText className='text-white' primary="Collection" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </List> */}
                        </Drawer>
                        <Main open={open} style={{ minHeight: '100vh' }}>
                            <DrawerHeader />
                            <Outlet />
                        </Main>
                    </> :
                    <>
                        <AppBar position="fixed" open={open} sx={{ backgroundColor: 'white' }}>
                            <div className='flex justify-between items-center'>
                                <Toolbar>
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={handleDrawerOpen}
                                        edge="start"
                                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                                    >
                                        <MenuIcon className='text-black' />
                                    </IconButton>
                                    <Typography variant="h6" noWrap component="div" className='font-bold text-black'>
                                        {user.user_name}
                                    </Typography>
                                </Toolbar>
                                <Button
                                    id="demo-positioned-button"
                                    aria-controls={menuOpen ? 'demo-positioned-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpen ? 'true' : undefined}
                                    onClick={handleClicked}
                                    className='text-white'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-black">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>


                                </Button>
                                <MenuComponent
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    isForwardIcon={isForwardIcon}
                                    setIsForwardIcon={setIsForwardIcon}
                                    firstThemeClick={firstThemeClick}
                                    setFirstThemeClick={setFirstThemeClick}
                                    openSubMenu={openSubMenu}
                                    setOpenSubMenu={setOpenSubMenu}
                                    handleClose={handleClose}
                                />
                            </div>


                        </AppBar>
                        <Drawer
                            sx={{
                                width: drawerWidth,
                                flexShrink: 0,

                                '& .MuiDrawer-paper': {
                                    width: drawerWidth,
                                    boxSizing: 'border-box',
                                    background: '#5cd4d0'
                                },
                            }}
                            variant="persistent"
                            anchor="left"
                            open={open}
                        >
                            <div className='flex justify-between items-center p-3'>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122" />
                                    </svg>
                                    <p className='font-bold text-white'>Project Manager</p>
                                </div>
                                <IconButton className='text-white' onClick={handleDrawerClose}>
                                    {theme.direction === 'ltr' ? <ChevronLeftIcon className='text-white' /> : <ChevronRightIcon className='text-white' />}
                                </IconButton>
                            </div>
                            <Divider />
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={location.pathname === '/user/dashboard'}
                                        onClick={projectDashboard}
                                        sx={{
                                            "&:hover": { backgroundColor: "#519d9a", color: "white" },
                                            "&.Mui-selected": { backgroundColor: "#519d9a", color: "white" }
                                        }}>
                                        <ListItemIcon>
                                            <PersonAddAltIcon className='text-white' />
                                        </ListItemIcon>
                                        <ListItemText className='text-white' primary='Project Dashboard' />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={location.pathname === '/admin/ganttchart'}
                                        onClick={ganttChart}
                                        sx={{
                                            "&:hover": { backgroundColor: "#519d9a", color: "white" },
                                            "&.Mui-selected": { backgroundColor: "#519d9a", color: "white" }
                                        }}>
                                        <ListItemIcon>
                                            <InsertChartIcon className='text-white' />
                                        </ListItemIcon>
                                        <ListItemText className='text-white' primary='Gantt Chart' />
                                    </ListItemButton>
                                </ListItem>
                                {/* <ListItem disablePadding>
                            <ListItemButton
                                selected={location.pathname === '/upload'}
                                onClick={uploadNavigate}
                                sx={{
                                    "&:hover": { backgroundColor: "#596876", color: "#161245" },
                                    "&.Mui-selected": { backgroundColor: "#0057c9", color: "#161245" }
                                }}>
                                <ListItemIcon>
                                    <UploadIcon className='text-white' />
                                </ListItemIcon>
                                <ListItemText className='text-white' primary='Upload' />
                            </ListItemButton>
                        </ListItem> */}
                            </List>
                            {/* <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'transparent' }}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >

                        <ListItemButton onClick={handleClick} sx={{ "&:hover": { backgroundColor: "#596876", color: "#161245" } }}>
                            <ListItemIcon>
                                <InboxIcon className='text-white' />
                            </ListItemIcon>
                            <ListItemText className='text-white' primary="Reports" />
                            {listOpen ? <ExpandLess className='text-white' /> : <ExpandMore className='text-white' />}
                        </ListItemButton>
                        <Collapse in={listOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <ListItemButton
                                    onClick={() => navigate('/listva')}
                                    selected={location.pathname === '/listva'}
                                    sx={{
                                        "&:hover": { backgroundColor: "#596876", color: "#161245" },
                                        "&.Mui-selected": { backgroundColor: "#0057c9", color: "#161245" },
                                        pl: 4
                                    }}>
                                    <ListItemIcon>
                                        <RecentActorsIcon className='text-white' />
                                    </ListItemIcon>
                                    <ListItemText className='text-white' primary="List VA" />
                                </ListItemButton>
                                <ListItemButton sx={{ "&:hover": { backgroundColor: "#596876", color: "#161245" }, pl: 4 }}>
                                    <ListItemIcon>
                                        <ReceiptIcon className='text-white' />
                                    </ListItemIcon>
                                    <ListItemText className='text-white' primary="List Invoice" />
                                </ListItemButton>
                                <ListItemButton sx={{ "&:hover": { backgroundColor: "#596876", color: "#161245" }, pl: 4 }}>
                                    <ListItemIcon>
                                        <AppsIcon className='text-white' />
                                    </ListItemIcon>
                                    <ListItemText className='text-white' primary="Collection" />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </List> */}
                        </Drawer>
                        <Main open={open} style={{ minHeight: '100vh' }}>
                            <DrawerHeader />
                            <Outlet />
                        </Main>
                    </>
                }
            </Box>
        </div>
    );
};

export default UserLayout
