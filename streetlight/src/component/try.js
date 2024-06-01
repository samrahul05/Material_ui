import React, { useEffect, useState } from 'react';
import { Stack, Table, TableBody, TableCell, TableHead, TableRow, styled ,Box} from '@mui/material';
import { getUsers, RemoveUser } from '../service/api';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import Img from './images/img.jpg'
import { Button, Menu, MenuItem } from '@mui/material';


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
  const[Mode,setMode] = useState(null)


  const PostAPI = 'https://api.thingspeak.com/update?api_key=U3F0A1SJHPWJX0H6&'
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
        axios.get("https://api.thingspeak.com/channels/2432872/feeds.json?api_key=9PYVA9Q7CVQSDNMM&results"),
      ]);

      setUsers(usersResponse.data);
      setThingspeaks(thingspeaksResponse.data.feeds);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleToggle = async (userId, rowIndex) => {
    setUserStatus(prevStatus => ({
      ...prevStatus,
      [userId]: !prevStatus[userId]
    }));

    try {
      const user = users.find(user => user.DeviceId === userId);
      if (!user) return; // User not found, exit
      
      let fieldToSend;
      if (rowIndex === 0) {
        fieldToSend = 'field5';
      } else if (rowIndex === 1) {
        fieldToSend = 'field6';
      } else if (rowIndex === 2) {
        fieldToSend = 'field7';
      } else {
        console.error('Invalid row index:', rowIndex);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 0));

      const postData =  {
       field7 : userStatus[userId] ? 1 : 0
        // Add more fields as needed
      };
     
 
      const response = await axios.post(PostAPI,postData);
      console.log('Data posted to ThingSpeak:', postData);

    } catch (error) {
      console.error('Error posting data to ThingSpeak:', error);
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
    <Stack>
<div  style={{
        
        backgroundImage: `url(${Img})`,
        width: '100%',
        height: '300px',
        backgroundSize: 'cover', // Fixes the image while maintaining aspect ratio
        backgroundPosition: 'center', // Adjusts the positioning of the image
      }}>
  
 </div>
     <Box>
     <StyledTable>
      <TableHead>
        <Thead>
          <TableCell>Device Id</TableCell>
          
          <TableCell>Solar Status </TableCell>
          <TableCell>Battery Status</TableCell>
          <TableCell>Light intensity</TableCell>
          <TableCell>Mode</TableCell>
          <TableCell>Status</TableCell>
          
          <TableCell>Remove</TableCell>
        </Thead>
      </TableHead>
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
              <TableCell><div className="dropdown">
      <Button variant='contained' className="dropbtn" sx={{width:'150px'}} onClick={handleClick}>
        Select Mode
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        
      >
          <MenuItem onClick={() => handleClose(0)} sx={{fontWeight: 'bold','&:hover':{backgroundColor: 'lightblue'} }}>
          <a href="#" style={{ textDecoration: 'none' }}>Manual</a>
        </MenuItem>
        <MenuItem onClick={() => handleClose(1)} sx={{fontWeight: 'bold','&:hover':{backgroundColor: 'lightblue'} }}>
          <a href="#" style={{ textDecoration: 'none' }}>Time Schedule</a>
        </MenuItem>
        <MenuItem onClick={() => handleClose(2)} sx={{ fontWeight: 'bold','&:hover':{backgroundColor: 'lightblue'} }}>
          <a href="#" style={{ textDecoration: 'none' }}>Automation</a>
        </MenuItem>
      </Menu>
    </div></TableCell>


    {Mode == 0 && (<TableCell> 
                
                <Button
                  variant='contained'
                  onClick={() => handleToggle(user.DeviceId, index)}
                  color={userState ? 'error' : 'success'} // Change color based on user's status
                >
                  {userState ? 'OFF' : 'ON'}
                </Button> 
              
              </TableCell>)}
              {Mode == 1 && (<TableCell> 
                
                 <div>
                 <label htmlFor="">StartTime</label>
                  <input type="time"  placeholder='StartTime'/>
                   <label htmlFor="">StartTime</label>
                  <input type="time"  placeholder='EndTime'/>
                 </div>
              
              </TableCell>)}
              {Mode == 2 && (<TableCell> 
                
                <Button variant='contained' color='success' >
                 Automation
                </Button> 
              
              </TableCell>)}
      
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
    </Stack>
  );
}

export default AllUsers;


