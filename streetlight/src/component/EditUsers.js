import React, { useState, useEffect } from 'react';
import { FormControl, FormGroup, InputLabel, Input, Typography, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser } from '../service/api';

const Container = styled(FormGroup)`
  width: 50%;
  margin: 5% auto 0 auto;
  & > div {
    margin-top: 20px;
  }
`;

const initialValues = {
  name: '',
  username: '',
  email: '',
  phonenumber: '',
};

function EditUsers() {
  const [user, setUser] = useState(initialValues);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getUserData();
  }, []);


  const getUserData = async () => {
    let response = await getUser(id);
    setUser(response.data);
  };



  function onchangevalue(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
 
  }

  return (
    <Container>
      <Typography variant="h4">Edit User</Typography>
      <FormControl>
        <InputLabel>Name</InputLabel>
        <Input onChange={(e) => onchangevalue(e)} name="name" value={user.name}></Input>
      </FormControl>
      <FormControl>
        <InputLabel>UserName</InputLabel>
        <Input onChange={(e) => onchangevalue(e)} name="username" value={user.username}></Input>
      </FormControl>
      <FormControl>
        <InputLabel>Email</InputLabel>
        <Input onChange={(e) => onchangevalue(e)} name="email" value={user.email}></Input>
      </FormControl>
      <FormControl>
        <InputLabel>PhoneNumber</InputLabel>
        <Input onChange={(e) => onchangevalue(e)} name="phonenumber" value={user.phonenumber}></Input>
      </FormControl>
      <FormControl>
       
      </FormControl>
    </Container>
  );
}

export default EditUsers;
