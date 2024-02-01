import React, { useState } from 'react';
import { CDBInput, CDBCard, CDBCardBody, CDBBtn, CDBContainer } from 'cdbreact';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import { makeRequest } from '../../Axios';

const SelectLabels = () => {

  const [userType, setUserType] = React.useState('');
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    usertype: ''
  })

  const navigate = useNavigate();

  const handleChanges = (event) => {
    setInput((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleChange = (event) => {
    setUserType(event.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
        await makeRequest.post("/auth/register", input);
        console.log("successfully registered");
        // setInput({
        //     username: '',
        //     password: '',
        //     userType: '',
        // });
       
        setTimeout(() => {
            navigate("/login");
        }, 2000); 

    } catch (err) {
        console.log(err);
    }
};


  return (
    <CDBContainer>
      <CDBCard style={{ width: '30rem' }}>
        <CDBCardBody className="mx-4">
          <div className="text-center mt-4 mb-2">
            <p className="h4"> Sign up </p>
          </div>
          <label className="text-muted m-0">
            Your UserName:
          </label>
          <CDBInput className="mt-n3" type="text" name="username" value={input.username} onChange={handleChanges} />
          <label className="text-muted m-0">
            Your Email:
          </label>
          <CDBInput className="mt-n3" type="email" name="email" value={input.email} onChange={handleChanges} />
          <label className="text-muted m-0">
            Password:
          </label>
          <CDBInput className="mt-n3" type="password" name="password" value={input.password} onChange={handleChanges} />
          <label className="text-muted m-0">
            First Name:
          </label>
          <CDBInput className="mt-n3" type="text" name="firstname" value={input.firstname} onChange={handleChanges} />
          <label className="text-muted m-0">
            Last Name:
          </label>
          <CDBInput className="mt-n3" type="text" name="lastname" value={input.lastname} onChange={handleChanges} />
          <InputLabel id="demo-simple-select-helper-label">UserType</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            value={input.usertype}
            label="UserType"
            onChange={(event) => {
              handleChanges(event);
              handleChange(event);
            }}
            name="usertype"
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Users">Users</MenuItem>
            <MenuItem value="Checker">Checker</MenuItem>
          </Select>
          <CDBBtn color="danger" style={{ width: '40%' }} className="btn-block mt-5 mx-auto"onClick={handleClick}>
            Register
          </CDBBtn>
        </CDBCardBody>
      </CDBCard>
    </CDBContainer>
  );
};
export default SelectLabels;