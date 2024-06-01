import React, { useState } from 'react';
import { FormControl, FormGroup, InputLabel, Input, Typography, Button, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../service/api';

const Container = styled(FormGroup)`
  width: 50%;
  margin: 5% auto 0 auto;
  & > div {
    margin-top: 20px;
  }
`;

const initialValues = {
  DeviceId:'',
  AccountNO: '',
  UserName: '',
 

};

function AddUser() {
  const [user, setUser] = useState(initialValues);
  const navigate = useNavigate();

  function onchangevalue(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
    
  }

  const addUserDetails = async () => {
    await addUser(user);
    
    navigate('/');
  };

  return (
    <Container>
      <Typography variant="h4">Add User</Typography>
      <FormControl>
        <InputLabel>DeviceId</InputLabel>
        <Input onChange={(e) => onchangevalue(e)} name="DeviceId" />
      </FormControl>
    
      <FormControl>
        <InputLabel>AccountNO</InputLabel>
        <Input onChange={(e) => onchangevalue(e)} name="AccountNO" />
      </FormControl>
      <FormControl>
        <InputLabel>UserName</InputLabel>
        <Input onChange={(e) => onchangevalue(e)} name="UserName" />
      </FormControl>
     
      <FormControl>
        <Button variant="contained" onClick={() => addUserDetails()}>
          Add User
        </Button>
      </FormControl>
    </Container>
  );
}

export default AddUser;
