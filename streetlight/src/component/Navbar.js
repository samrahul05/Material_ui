import React from 'react'
import { AppBar,Toolbar,styled,Box} from '@mui/material'
import { NavLink } from 'react-router-dom'

const Header = styled(AppBar)
`background:black;`

const Tabs = styled(NavLink)
`font-size:20px;
margin-right:20px;
text-decoration: none;
color: white;
`

function Navbar() {
  return (
   <Header position='static'>
    <Toolbar >
       
        <Tabs to='/'>All Users</Tabs>
        <Tabs to='/adduser'>Add User</Tabs>
        <Box sx={{position:'relative', left:'450px'}}>
        <Tabs sx={{color:'yellow', fontSize:'25px'}}></Tabs>
        </Box>
       
    </Toolbar>
   </Header>
  )
}

export default Navbar