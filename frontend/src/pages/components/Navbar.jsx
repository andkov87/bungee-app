import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../css-files/Navbar.css';
import useUserData from "../hooks/useUserData.js";



const Navbar = () => {
    const [userData] = useUserData();


    const navigate = useNavigate();

    const [menuHolderClassName, setMenuHolderClassName] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const menuHolderRef = useRef(null);

    const menuToggle = () => {
        if (menuHolderClassName === "drawMenu") {
            setMenuHolderClassName("");
        } else {
            setMenuHolderClassName("drawMenu");
        }
    };

    /*const deleteToken = () => {
        const token = localStorage.getItem('jwtToken')
        localStorage.removeItem('jwtToken')
        console.log(token);
    }*/

    const handleLogout = () => {

        const token = localStorage.getItem('jwtToken');

        console.log("token deleting: ", token);
        localStorage.removeItem('jwtToken');
    }

    useEffect(() => {
        const loggedInUser = localStorage.getItem('jwtToken');

        if (loggedInUser) {
            setIsLoggedIn(true);
        }

        document.addEventListener("click", handleDocumentClick);
    }, [])

    const handleDocumentClick = (event) => {
        if (menuHolderRef.current && !menuHolderRef.current.contains(event.target)) {
            setMenuHolderClassName("");
        }
    }

    const handleBookButtonClick = () => {
        navigate('/booking');
    }


    return (
        <div>
            <div className="p-3 bg-warning text-white">
                <div className="flexMain1" id="navTop">
                    <div className="flex1">
                    </div>
                    <div className="flex2 textcenter">
                        <div><strong>HELP US CONTINUE OUR JOURNEY WHILE KICK-STARTING YOUR OWN!</strong></div>
                        <button className="book-now-button" onClick={handleBookButtonClick} >BOOK NOW</button>
                    </div>
                    <div className="flex1">
                    </div>
                </div>
            </div>

            <div id="menuHolder" ref={menuHolderRef} className={menuHolderClassName}>
                <div role="navigation" className="sticky-top border-bottom border-top" id="mainNavigation">
                    <div className="flexMain">
                        <div className="flex2">
                            <button className="whiteLink siteLink" id="menuButton" style={{ borderRight: '1px solid #eaeaea' }} onClick={menuToggle} ><i className="fas fa-bars me-2"></i> MENU</button>
                        </div>
                        <div className="flex3 text-center" id="siteBrand">

                        </div>
                        <div className="flex2 text-end d-block d-md-none">
                            <button className="whiteLink siteLink"><i className="fas fa-search"></i></button>
                        </div>
                        <div className="flex2 text-end d-none d-md-block" id="loginBlock">
                            {!isLoggedIn && (
                                <a href="/auth">
                                    <button className="whiteLink siteLink" id="regButton">REGISTER</button>
                                </a>
                            )}
                            
                                {!isLoggedIn && (
                                    <a href="/login">
                                        <button className="blackLink siteLink" id="logButton">LOGIN</button>
                                    </a>
                                )}
                                {isLoggedIn && userData !== null && (
                                    <span className="username" >Hello, {userData.userName}! </span>
                                )}
                        </div>
                    </div>
                </div>
                <div id="menuDrawer">
                    <div className="p-4 border-bottom">
                        <div className='row'>
                            <div className="col">
                                <select className="noStyle">
                                    <option value="english">English</option>
                                    <option value="german">German</option>
                                </select>
                            </div>
                            <div className="col text-end ">
                                <i className="fas fa-times" style={{ color: 'red'}} role="btn" onClick={menuToggle}></i>
                            </div>
                        </div>
                    </div>
                    <div>
                        <a href="/" className="nav-menu-item"><i className="fas fa-home me-3" style={{ color: 'white' }}></i>Home</a>
                        <a href="/user" className="nav-menu-item" ><i className="fab fa-product-hunt me-3" style={{ color: 'white' }}></i>My Bookings</a>
                        <a href="/booking" className="nav-menu-item"><i className="fas fa-search me-3" style={{ color: 'white' }}></i>Booking</a>
                        <a href="#" className="nav-menu-item"><i className="fas fa-wrench me-3" style={{ color: 'white' }}></i>Services</a>
                        <a href="#" className="nav-menu-item"><i className="fas fa-dollar-sign me-3" style={{ color: 'white' }}></i>Pricing</a>
                        {isLoggedIn && (
                            <a href="/" className="nav-menu-item" onClick={handleLogout}><i className="fas fa-file-alt me-3" style={{ color: 'white' }}></i>Logout</a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};



export default Navbar;