
import './App.css';
import AddUser from './component/AddUser';
import AllUsers from './component/AllUsers';
import EditUsers from './component/EditUsers';
import Navbar from './component/Navbar';
import Codeforinterview from './component/codeforinterview';
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Mode from './component/Mode'


function App() {
  return (
    <div className="App">
       
        {/* <BrowserRouter>
        <Navbar/> 
          <Routes>
            <Route path='/' element={ <AllUsers/> }/>
            <Route path='/adduser' element={ <AddUser/>  }/>
            <Route path='/code' element={ <Codeforinterview/>  }/>
            <Route path='/edit/:id' element={<EditUsers/>}/>
          </Routes>
        </BrowserRouter> */}
      <Mode/>
         
                       
    </div>
  );
}

export default App;
