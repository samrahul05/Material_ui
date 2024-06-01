import React, { useState,useEffect } from 'react';
import TextField from '@mui/material/TextField';
// import dayjs from 'dayjs';
import { Axios } from 'axios';
function Timer() {
  // State to store start and end times
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  

  const onStart = async () => {
    try {
      let response = await Axios.post('https://api.thingspeak.com/update?api_key=0FVSQGTZSAG4C3LQ', {
        field6: 1
      });
      // You can handle the response if needed
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  

  const onEnd = async () => {
    try {
      let response = await Axios.post('https://api.thingspeak.com/update?api_key=0FVSQGTZSAG4C3LQ', {
        field6: 0
      });
      // You can handle the response if needed
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  const date = new Date();
  const Hr = date.getHours().toString().padStart(2, '0');
  const Min = date.getMinutes().toString().padStart(2, '0');
  
  const currentTime = `${Hr}:${Min}`;
  // const start= "14:48"
  // const end= "14:49"
  if (currentTime === startTime) {
    onStart();
  }
  if (currentTime === endTime) {
    onEnd();
  }
 

 
  return (
    <>
      <TextField
        type="time"
        id="Start_Time"
        label="Start-Time"
        InputLabelProps={{ shrink: true }}
        variant="outlined"
        // sx={{ width: '130px', borderColor: 'black' }}
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        format="L HH:mm"
      />
      
      
        <TextField
          type="time"
          label="End_Time"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          // sx={{ width: '150px' }}
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          format="L HH:mm"
        />
      
    </>
  );
}

export default Timer;