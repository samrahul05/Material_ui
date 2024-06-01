import React, { useEffect, useState } from 'react';
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, styled ,Box, Container} from '@mui/material';
import { getUsers, RemoveUser } from '../service/api';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import Img from './images/img.jpg'
import { Button, Menu, MenuItem } from '@mui/material';
import Timer from './Timer'

import './Mode.css'
const StyledTable = styled(Table)`
  width: 100%;
  margin: 1% auto 0 auto;
`;

const Thead = styled(TableRow)`
  background:#312418;

  & > th {
    color: white;
    font-size: 20px;
  }
`;

const TBody = styled(TableRow)`
  & > td {
    color:#075654  ;
    font-size: 20px;
  }
`;

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [thingspeaks, setThingspeaks] = useState([]);
  const [userStatus, setUserStatus] = useState({}); // State to keep track of each user's status
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [toggle,settoggle]=useState(false)
  const[Mode,setMode] = useState(null)
  const [isChecked, setIsChecked] = useState(false);

  const PostAPI = 'https://api.thingspeak.com/update?api_key=3621UNUJTW5U1HNA&'
  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      const [usersResponse, thingspeaksResponse] = await Promise.all([
        getUsers(),
        axios.get("https://api.thingspeak.com/channels/2438202/feeds.json?api_key=F2EQP8ASH8L4BDDR&results"),
      ]);

      setUsers(usersResponse.data);
      setThingspeaks(thingspeaksResponse.data.feeds);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleToggle = async (userId, rowIndex) => {
  //   setUserStatus(prevStatus => ({
  //     ...prevStatus,
  //     [userId]: !prevStatus[userId]
  //   }));

  //   try {
  //     const user = users.find(user => user.DeviceId === userId);
  //     if (!user) return; // User not found, exit
      
  //     let fieldToSend;
  //     if (rowIndex === 0) {
  //       fieldToSend = 'field5';
  //     } else if (rowIndex === 1) {
  //       fieldToSend = 'field6';
  //     } else if (rowIndex === 2) {
  //       fieldToSend = 'field7';
  //     } else {
  //       console.error('Invalid row index:', rowIndex);
  //       return;
  //     }

  //     await new Promise(resolve => setTimeout(resolve, 0));

  //     const postData =  {
  //      field7 : userStatus[userId] ? 1 : 0
        
  //     };
     
 
  //     const response = await axios.post(PostAPI,postData);
  //     console.log('Data posted to ThingSpeak:', postData);

  //   } catch (error) {
  //     console.error('Error posting data to ThingSpeak:', error);
  //   }
  // };

 async function handleon (){
    try{
       const response = await axios.post(PostAPI,{
        field7:0
       });
      //  console.log(response);
       console.log("Switch is ON")
 
     } catch (error) {
       console.error('Error posting data to ThingSpeak:', error);
     }
    settoggle(false)
  }
  async function handleoff (){
    try{
       const response = await axios.post(PostAPI,{
        field7:1
       });
      //  console.log(response);
       console.log("Switch is OFF")
 
     } catch (error) {
       console.error('Error posting data to ThingSpeak:', error);
     }
    settoggle(true)
  }
  
  //  function handleOnOff() {
  //   {
  //     handleon(); // Call handleon function when the checkbox is checked
  // } 
  //  {
  //     handleoff(); // Call handleoff function when the checkbox is unchecked
  // }
  // }
  const handleToggle = () => {
    setIsChecked((prevChecked) => !prevChecked);
    if (!isChecked) {
      handleon(); // Call your handleon function when the checkbox is checked
    } else {
      handleoff(); // Call your handleoff function when the checkbox is unchecked
    }
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = async (value) => {
    setAnchorEl(null);
    setMode(value)
   const  postData= {
      field5:value
    }
    
    const response = await axios.post(PostAPI,postData);
    console.log("ModValue",postData);
  };

  console.log(Mode);

  return (
    <Stack direction={'column'} spacing={6}>

     <Box>
     <StyledTable>
      {/* <TableHead>
        <Thead>
          <TableCell>Device Id</TableCell>
          
          <TableCell>Solar Status </TableCell>
          <TableCell>Battery Status</TableCell>
          <TableCell>Light intensity</TableCell>
          <TableCell>Mode</TableCell>
          <TableCell>Status</TableCell>
          
          <TableCell>Remove</TableCell>
        </Thead>
      </TableHead> */}
      <TableBody>
        {users.map((user, index) => {
          const latestFeedMap = new Map();
          thingspeaks.forEach((item) => {
            if (item.field1 === user.DeviceId) {
              latestFeedMap.set(user.DeviceId, {
                id: user.DeviceId,
                current: item.field2,
                voltage: item.field3,
                power: item.field4
              });
            }
          });

          const filteredData = Array.from(latestFeedMap.values());
          const userState = userStatus[user.DeviceId] || false; // Get user's current status

          return (
            <TBody key={index}>
              <TableCell>{user.DeviceId}</TableCell>
            
              <TableCell>{filteredData.length > 0 ? filteredData[0].current : 'N/A'}</TableCell>
              <TableCell>{filteredData.length > 0 ? filteredData[0].voltage : 'N/A'}</TableCell>
              <TableCell>{filteredData.length > 0 ? filteredData[0].power : 'N/A'}</TableCell>
              

              <TableCell>
                <IconButton aria-label="delete" color="error" onClick={() => RemoveUser(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TBody>
          );
        })}
      </TableBody>
    </StyledTable>
     </Box>
     <Container style={{padding:'10px',display:'flex' ,justifyContent:'space-around',alignItems:'center'}} >
     <Box sx={{
        //  border:'solid 1px black',
        borderRadius:'10px',
         padding:'10px',
         backgroundColor:'whitesmoke'
     }}>
     <div class="main">
      <div class="up">
        <button className="card1"  onClick={() => handleClose(0)} sx={{fontWeight: 'bold','&:hover':{backgroundColor: 'lightblue'} }}>
        <a href="#"  style={{ textDecoration: 'none',fontFamily:'roboto',fontWeight:'900',color:'black',fontSize:'15px'}}>Manual</a>
        </button>
        <button className="card2" onClick={() => handleClose(1)} sx={{fontWeight: 'bold','&:hover':{backgroundColor: 'lightblue'} }}>
        <a href="#"  style={{ textDecoration: 'none',fontFamily:'roboto',fontWeight:'900',color:'black',fontSize:'15px'}}>Time Schedule</a>
        </button>
      </div>
      <div class="down">
        <button className="card3"  onClick={() => handleClose(2)} sx={{ fontWeight: 'bold','&:hover':{backgroundColor: 'lightblue'} }}>
        <a href="#"  style={{ textDecoration: 'none',fontFamily:'roboto',fontWeight:'900',color:'black',fontSize:'15px'}}>Automation</a>
        
        </button>
       
      </div>
    </div>
     </Box>
     <Box  sx={{
       
         width:'200px',
         alignItems:'center',
        
     }}>
     
            

            {Mode === 0 && (
          <TableCell>
              
              {
          <div>
                  <div>
                      <h3>{isChecked ? 'ON' : 'OFF'}</h3>
                  </div>
                  
                    <label class="theme-switch" >
                    <input type="checkbox" class="theme-switch__checkbox" checked={isChecked} onChange={handleToggle}/>
                      <div class="theme-switch__container">
                     <div class="theme-switch__clouds" ></div>
                     <div class="theme-switch__stars-container"   >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                       <path fill-rule="evenodd" clip-rule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor"></path>
                     </svg>
                       </div>
                      <div class="theme-switch__circle-container" >
                        <div class="theme-switch__sun-moon-container" >
                         <div class="theme-switch__moon"   >
                          <div class="theme-switch__spot"></div>
                           <div class="theme-switch__spot"></div>
                         <div class="theme-switch__spot"></div>
                      </div>
                      </div>
                     </div>
                     </div>
              </label>
               
          </div>
                
              }
          </TableCell>
      )}
      
         {Mode == 1 && (
                      
                       <Timer/>
                    
                    )}
   {Mode == 2 && (
                      
                      <div class="gearbox">
  <div class="overlay"></div>
    <div class="gear one">
      <div class="gear-inner">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
    <div class="gear two">
      <div class="gear-inner">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
    <div class="gear three">
      <div class="gear-inner">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
    <div class="gear four large">
      <div class="gear-inner">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
      </div>
    </div>
  </div>
           
                    )}
     </Box>
     </Container>
     
    </Stack>
  );
}

export default AllUsers;


