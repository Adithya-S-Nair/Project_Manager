import React, { useContext, useState } from 'react';
import { CDBInput, CDBCard, CDBCardBody, CDBBtn, CDBContainer } from 'cdbreact';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { makeRequest } from '../../Axios';

const Login = () => {

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    makeRequest.post("/auth/login", inputs)
      .then((res) => {
        // console.log(res.data.user_type);
        if (res.status === 200 && res.data.user_type === "Admin" ) {
          setUser(res.data)
          navigate("/admin/dashboard")
        } else if(res.status === 200 && res.data.user_type === "Users") {
          setUser(res.data)
          navigate("/user/dashboard")
        }else {
          setUser(res.data)
          navigate("/checker")   
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }


  return (
    <CDBContainer>
      <CDBCard style={{ width: '30rem' }}>
        <CDBCardBody className="mx-4">
          <div className="text-center mt-4 mb-4">
            <p className="h4"> Sign in </p>
          </div>
          <label className="text-muted m-0">
            Your email
          </label>
          <CDBInput className="mt-n3" type="email" name="email" onChange={handleChange}/>
          <label className="text-muted m-0">
            Your password
          </label>
          <CDBInput className="mt-n3" type="password" name="password" onChange={handleChange}/>
          <CDBBtn color="primary" style={{ width: '40%' }} className="btn-block mt-5 mx-auto" onClick={handleLogin}>
            Login
          </CDBBtn>
        </CDBCardBody>
      </CDBCard>
    </CDBContainer>
  );
};
export default Login; 