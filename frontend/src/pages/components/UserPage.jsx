import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../AxiosConfig.js";
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBCard,
    MDBCardText,
    MDBCardBody,
    MDBCardImage,
} from 'mdb-react-ui-kit';
import '../css-files/ProfilePage.css';
import ChangeUserNamePopUp from "./ChangeUserNamePopUp";
import ChangeEmailPopUp from "./ChangeEmailPopUp";
import profilepic_sample2 from '../profile_pics/profile_sample2.webp';
import useUserData from "../hooks/useUserData.js";


const UserPage = () => {

    const navigate = useNavigate();
    const [showUserNameModal, setShowUserNameModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [isUserNameTaken, setIsUserNameTaken] = useState(false);
    const [isEmailTaken, setIsEmailTaken] = useState(false);

    const [userData, refetchUserData] = useUserData();

    const [image, setImage] = useState();
    const [preview, setPreview] = useState();

    const [showButton, setShowButton] = useState(false);


    const fileInputRef = useRef();

    useEffect(() => {
        if (image) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setPreview(reader.result);
            };

            reader.readAsDataURL(image);
        } else {
            setPreview(null);
        }
    }, [preview, image])


    const handleDeleteProfile = async () => {
        try {
            await axiosInstance.delete('/user/profile');
            localStorage.removeItem('jwtToken');
            navigate('/');
            console.log('Account deleted!')
        } catch (error) {
            console.error('Error deleting profile', error)
        }
    }

    const handleSaveNewUserName = async (newUserName) => {
        try {
            await axiosInstance.put(`/user/profile/username?newUserName=${newUserName}`);

            refetchUserData();
            setShowUserNameModal(false);

        } catch (error) {
            if (error.response && error.response.status === 400) {
                const responseData = error.response.data;

                if (responseData.error === "Username is already taken!") {
                    console.log("Username is already taken!")
                }
                console.error("Error updating username: ", error.response);
                setShowUserNameModal(true);
                setIsUserNameTaken(true);
            }
        }
    };


    const handleSaveNewEmail = async (newEmail) => {
        try {

            await axiosInstance.put(`/user/profile/email?newEmail=${newEmail}`);

            refetchUserData();
            setShowEmailModal(false);

        } catch (error) {
            if (error.response && error.response.status === 400) {
                const responseData = error.response.data;

                if (responseData.error === "Email is already taken!") {
                    console.log("Email is already taken!")
                }
            }
            console.error("Error updating email: ", error.response);
            setShowEmailModal(true);
            setIsEmailTaken(true);
        }
    };

    const handleSaveNewProfilePic = async (preview) => {
        try {
            await axiosInstance.put(`/user/profile/profile_pic`, { profile_pic: preview });
            refetchUserData();


            // console.log(userData.profile_pic);
            setPreview(userData.profile_pic);
            setShowButton(false);

        } catch (error) {
            console.error("Error updating profile_pic: ", error.response);
        }
    };

    useEffect(() => {
        const loggedInUser = localStorage.getItem('jwtToken');

        if (!loggedInUser) {
            console.log("login first!");
            navigate('/login');
        }
    }, [navigate])

    const handleReturnButtonClick = () => {
        navigate('/');
    };
    if (userData === null) {
        return null;
    }

    return (
        <div>
            <section className="profile-section" >
                <MDBContainer className="py-5">
                    <div className='arrow-container2'>
                        <div className='arrow-circle2' style={{backgroundColor: 'rgb(37, 150, 190)'}} onClick={handleReturnButtonClick}>
                            <i className="fas fa-chevron-left left-arrow2" style={{color: 'white'}}></i>
                        </div>
                    </div>
                    <MDBRow>
                        <MDBCol>

                        </MDBCol>
                    </MDBRow>

                    <MDBRow>
                        <MDBCol lg="4">
                            <MDBCard className="mb-4 card-container">
                                <MDBCardBody className="text-center">
                                    {preview ? (
                                        <MDBCardImage
                                            src={preview}
                                            alt="avatar"
                                            className="rounded-circle"
                                            style={{ width: '190px', height: '190px', objectFit: 'cover' }}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                fileInputRef.current.click();
                                            }}
                                            fluid />
                                    ) : (
                                        <MDBCardImage
                                            src={userData.profile_pic ? userData.profile_pic : profilepic_sample2}
                                            alt="avatar"
                                            className="rounded-circle"
                                            style={{ width: '190px', height: '190px' }}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                fileInputRef.current.click();
                                            }}
                                            fluid />
                                    )}
                                </MDBCardBody>
                                <form>
                                    <input type="file"
                                        style={{ display: 'none' }}
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={(event) => {
                                            const file = event.target.files[0];
                                            if (file && file.type.substring(0, 5) === "image") {
                                                setImage(file);
                                                setShowButton(true);
                                            } else {
                                                setImage(null);
                                            }
                                        }} />
                                </form>
                                {showButton && (
                                    <button className="profile_pic_button"
                                        onClick={() => handleSaveNewProfilePic(preview)}
                                    >SAVE PROFILE PICTURE</button>
                                )}
                            </MDBCard>
                        </MDBCol>
                        <MDBCol lg="8">
                            <MDBCard className="mb-4">
                                <MDBCardBody >
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>Name</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9">
                                            <MDBCardText className="text-muted">{userData.firstName} {userData.lastName}</MDBCardText>

                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>Email</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9" className="email-container">

                                            <MDBCardText className="text-muted">{userData.email}</MDBCardText>
                                            <button className="change-email-button" onClick={() => setShowEmailModal(true)}>CHANGE EMAIL</button>
                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow>
                                        <MDBCol sm="3">
                                            <MDBCardText>Username</MDBCardText>
                                        </MDBCol>
                                        <MDBCol sm="9" className="username-container">
                                            <MDBCardText className="text-muted">{userData.userName}</MDBCardText>
                                            <button className="change-username-button" onClick={() => setShowUserNameModal(true)}>CHANGE USERNAME</button>

                                        </MDBCol>
                                    </MDBRow>
                                    <hr />
                                    <MDBRow >
                                        <MDBCol sm="3" >
                                        </MDBCol>
                                        <MDBCol sm="6" className="button-row">
                                            <button className="delete-account-button" onClick={handleDeleteProfile}>DELETE ACCOUNT</button>
                                        </MDBCol>
                                    </MDBRow>
                                </MDBCardBody>
                            </MDBCard>

                            <h2 className='reservation-headbox'>RESERVATIONS</h2>

                            <MDBRow>
                                <MDBCol md="6">
                                    <MDBCard className="mb-4 mb-md-0">
                                        <MDBCardBody>
                                            <MDBCardText className="mb-4" style={{ fontSize: '1.3rem', textAlign: 'center', color: 'rgb(37, 150, 190)', textDecoration: 'underline', textDecorationThickness: '2px' }}> RESERVATION 1</MDBCardText>
                                            <MDBCardText className="mb-1" style={{ fontSize: '1.07rem', color: 'rgb(37, 150, 190)' }}>LOCATION:{' '}
                                            {userData.bookings.length > 0 && (
                                            <span style={{color: 'rgba(33, 37, 41, 0.75)'}}>{userData.bookings[0].location}</span>)}
                                            </MDBCardText>

                                            <MDBCardText className="mt-4 mb-1" style={{ fontSize: '1.07rem', color: 'rgb(37, 150, 190)' }}>ACTIVITY:{' '} 
                                            {userData.bookings.length > 0 && (
                                            <span style={{color: 'rgba(33, 37, 41, 0.75)'}}>{userData.bookings[0].activity}</span>)}
                                            </MDBCardText>

                                            <MDBCardText className="mt-4 mb-1" style={{ fontSize: '1.07rem', color: 'rgb(37, 150, 190)' }}>DATE:{' '} 
                                            {userData.bookings.length > 0 && (
                                            <span style={{color: 'rgba(33, 37, 41, 0.75)'}}>{userData.bookings[0].bookedDate}</span>)}
                                            </MDBCardText>

                                            <MDBCardText className="mt-4 mb-1" style={{ fontSize: '1.07rem', color: 'rgb(37, 150, 190)' }}>TIME:{' '} 
                                            {userData.bookings.length > 0 && (
                                            <span style={{color: 'rgba(33, 37, 41, 0.75)'}}>{userData.bookings[0].bookedTime}</span>)}
                                            </MDBCardText>

                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>

                                <MDBCol md="6">
                                    <MDBCard className="mb-4 mb-md-0">
                                        <MDBCardBody>
                                            <MDBCardText className="mb-4" style={{ fontSize: '1.3rem', textAlign: 'center', color: 'rgb(37, 150, 190)', textDecoration: 'underline', textDecorationThickness: '2px' }}> RESERVATION 2</MDBCardText>
                                            
                                            <MDBCardText className="mb-1" style={{ fontSize: '1.07rem', color: 'rgb(37, 150, 190)' }}>LOCATION:{' '}
                                            {userData.bookings.length > 1 && (
                                            <span style={{color: 'rgba(33, 37, 41, 0.75)'}}>{userData.bookings[1].location}</span>)}
                                             </MDBCardText>

                                            <MDBCardText className="mt-4 mb-1" style={{ fontSize: '1.07rem', color: 'rgb(37, 150, 190)' }}>ACTIVITY:{' '}
                                            {userData.bookings.length > 1 && (
                                            <span style={{color: 'rgba(33, 37, 41, 0.75)'}}>{userData.bookings[1].activity}</span>)}
                                             </MDBCardText>

                                            <MDBCardText className="mt-4 mb-1" style={{ fontSize: '1.07rem', color: 'rgb(37, 150, 190)' }}>DATE:{' '}
                                            {userData.bookings.length > 1 && (
                                            <span style={{color: 'rgba(33, 37, 41, 0.75)'}}>{userData.bookings[1].bookedDate}</span>)}
                                             </MDBCardText>

                                            <MDBCardText className="mt-4 mb-1" style={{ fontSize: '1.07rem', color: 'rgb(37, 150, 190)' }}>TIME:{' '}
                                            {userData.bookings.length > 1 && (
                                            <span style={{color: 'rgba(33, 37, 41, 0.75)'}}>{userData.bookings[1].bookedTime}</span>)}
                                             </MDBCardText>
                             
                                        </MDBCardBody>
                                                   {showUserNameModal && (
                                                <ChangeUserNamePopUp
                                                    isOpen={showUserNameModal}
                                                    onClose={() => setShowUserNameModal(false)}
                                                    onSave={(newUserName) => handleSaveNewUserName(newUserName)}
                                                    currentUserName={userData.userName}
                                                    isUserNameTaken={isUserNameTaken}
                                                    setIsUserNameTaken={setIsUserNameTaken}
                                                />
                                            )}
                                            {showEmailModal && (
                                                <ChangeEmailPopUp
                                                    isOpen={showEmailModal}
                                                    onClose={() => setShowEmailModal(false)}
                                                    onSave={(newEmail) => handleSaveNewEmail(newEmail)}
                                                    currentEmail={userData.email}
                                                    isEmailTaken={isEmailTaken}
                                                    setIsEmailTaken={setIsEmailTaken}
                                                />
                                            )}
                                    </MDBCard>
                                </MDBCol>
                            </MDBRow>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </section>
        </div>
    );
};

export default UserPage;