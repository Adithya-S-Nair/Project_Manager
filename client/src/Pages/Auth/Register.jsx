import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { makeRequest } from '../../Axios';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Federal Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ['Admin', 'Users', 'Checker'];

const getStyles = (name, personName, theme) => ({
  fontWeight: personName === name ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular,
});

const theme = createTheme();

const Register = () => {

  //   const [userType, setUserType] = React.useState('');
  //   const [input, setInput] = useState({
  //     username: '',
  //     email: '',
  //     password: '',
  //     firstname: '',
  //     lastname: '',
  //     usertype: ''
  //   })

  //   const navigate = useNavigate();

  //   const handleChanges = (event) => {
  //     setInput((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  //   };

  //   const handleChange = (event) => {
  //     setUserType(event.target.value);
  //   };

  //   const handleClick = async (e) => {
  //     e.preventDefault();
  //     try {
  //         await makeRequest.post("/auth/register", input);
  //         console.log("successfully registered");
  //         // setInput({
  //         //     username: '',
  //         //     password: '',
  //         //     userType: '',
  //         // });

  //         setTimeout(() => {
  //             navigate("/login");
  //         }, 2000); 

  //     } catch (err) {
  //         console.log(err);
  //     }
  // };


  const [personName, setPersonName] = React.useState('');
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    usertype: ''
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleChanges = (event) => {
    setInput((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await makeRequest.post("/auth/register", input);
      console.log("successfully registered");
      setInput({
        username: '',
        email: '',
        password: '',
        firstname: '',
        lastname: '',
        usertype: ''
      });
      setIsRegistered(true); // Set state to true after successful registration
      setTimeout(() => {
        setIsRegistered(false); // Reset state after a certain delay (you can adjust the delay as needed)
        navigate("/login");
      }, 2000); // Delay for 3 seconds (adjust as needed)

    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
      usertype: personName,
    });
  };

  const Register = () => {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Box
            sx={{
              paddingTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 3,
              borderRadius: 2,
              px: 4,
              py: 6,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="UserName"
                    name="username"
                    autoComplete="username"
                    value={input.username}
                    onChange={handleChanges}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={input.email}
                    onChange={handleChanges}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={input.password}
                    onChange={handleChanges}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="firstname"
                    label="First Name"
                    name="firstname"
                    autoComplete="firstname"
                    value={input.firstname}
                    onChange={handleChanges}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="lastname"
                    label="Last Name"
                    name="lastname"
                    autoComplete="lastname"
                    value={input.lastname}
                    onChange={handleChanges}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ width: 500 }}>
                    <InputLabel id="demo-multiple-name-label">User Type</InputLabel>
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      value={input.usertype}
                      onChange={(event) => {
                        handleChanges(event);
                        handleChange(event);
                      }}
                      input={<OutlinedInput label="User Type" />}
                      MenuProps={MenuProps}
                      name="usertype"
                    >
                      {names.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, personName, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleClick}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
              {/* Conditionally render the Alert component
                      {isRegistered && (
                           <Stack sx={{ width: '22%', position: 'fixed', top: '9%', right: '0',left: '40%'}} spacing={2}>
                           <Alert
                               icon={<CheckIcon fontSize="inherit" />}
                               variant="filled"
                               severity="success"
                               anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                               transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                           >
                               User Registered Successfully
                           </Alert>
                       </Stack>
                      )} */}
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    );
  };
}
export default Register;
