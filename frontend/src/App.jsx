import MainPage from './pages/components/MainPage';


import { Routes, Route, BrowserRouter} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import UserPage from './pages/components/UserPage';
import Login from './pages/components/Login';
import Registration from './pages/components/Registration';
import BookingPage from './pages/components/BookingPage';


function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<MainPage/>} />
      <Route path='/auth' element={<Registration/>} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/user' element={<UserPage/>} />
      <Route path='/booking' element={<BookingPage/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
