import {
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBRow,
    MDBCol
}
    from 'mdb-react-ui-kit';
import '../css-files/Registration.css';
import reg_pic from '../bungee pics/bungee22.jpg';
import { useState } from 'react';
import axiosInstance from '../AxiosConfig';
import { useNavigate } from 'react-router-dom';
import RegistrationSuccesPopUp from './RegistrationSuccesPopUp';



const Registration = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [showRegModal, setShowRegModal] = useState(false);


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.firstName) {
            errors.firstName = 'First name is required!';
        }
        if (!formData.lastName) {
            errors.lastName = 'Last name is required!';
        }
        if (!formData.userName) {
            errors.userName = 'User name is required!';
        }
        if (!formData.email) {
            errors.email = 'Email is required!';
        }
        if (!formData.password) {
            errors.password = 'Password is required!';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();

        if (Object.keys(errors).length == 0) {
            try {
                const response = await axiosInstance.post('/auth/register', formData);
                console.log("User registrated successfully:", response.data);
                setFormData({
                    firstName: '',
                    lastName: '',
                    userName: '',
                    email: '',
                    password: ''
                });
                setFormErrors({});
                setShowRegModal(true);

            } catch (error) {
                if (error.response && error.response.status === 400) {
                    const responseData = error.response.data;

                    console.log("responseData:", responseData);

                    const updatedErrors = { ...errors };

                    if (responseData.errorMessage === "Username is already taken!") {
                        updatedErrors.userName = 'User name is already taken';
                    }
                    if (responseData.errorMessage === "Email is already taken!") {
                        updatedErrors.email = 'Email is already taken';
                    }
                    if (responseData.errorMessage === "Username and Email are already taken!") {
                        updatedErrors.userName = 'User name is already registered';
                        updatedErrors.email = 'Email is already registered';
                    }

                    console.log("updatedErrors: ", updatedErrors);
                    setFormErrors(updatedErrors);
                } else {
                    console.error('Registration Error: ', error);
                }
            }
        } else {
            setFormErrors(errors);
        }
    };


const handleReturnButtonClick = () => {
    navigate('/');
  }

    return (
        <div className='registration-page-container'>
             <div className='arrow-container'>
          <div className='arrow-circle' onClick={handleReturnButtonClick}>
            <i className="fas fa-chevron-left left-arrow"></i>
          </div>
        </div>
            <form className='auth-form' onSubmit={handleSubmit}>
                <MDBContainer fluid className='my-5 d-flex justify-content-center align-items-center' style={{ height: '100%' }}>
                    <MDBRow className='g-0 align-items-center' >
                        <MDBCol col='6' style={{ maxWidth: '400px' }}>
                            <MDBCard className='my-5 cascading-right' style={{ background: 'hsla(0, 0%, 100%, 0.55)', backdropFilter: 'blur(30px)' }}>
                                <MDBCardBody className='p-5 shadow-5 text-center'>                   
                                    <h2 className="fw-bold mb-5">Sign up now</h2>
                                    <MDBRow>
                                        <MDBCol col='6' >
                                            {formErrors.firstName && (
                                                <span className='error'>{formErrors.firstName}</span>)}
                                            <MDBInput wrapperClass='mb-4'
                                                label='First name'
                                                id='form1'
                                                type='text'
                                                name='firstName'
                                                value={formData.firstName}
                                                onChange={handleInputChange} />
                                        </MDBCol>

                                        <MDBCol col='6'>
                                            {formErrors.lastName && (
                                                <span className='error'>{formErrors.lastName}</span>)}
                                            <MDBInput wrapperClass='mb-4'
                                                label='Last name'
                                                id='form2'
                                                type='text'
                                                name='lastName'
                                                value={formData.lastName}
                                                onChange={handleInputChange} />
                                        </MDBCol>
                                    </MDBRow>

                                    {formErrors.userName && (
                                        <span className='error'>{formErrors.userName}</span>)}
                                    <MDBInput wrapperClass='mb-4'
                                        label='Username'
                                        id='form3'
                                        type='text'
                                        name='userName'
                                        value={formData.userName}
                                        onChange={handleInputChange} />

                                    {formErrors.email && (
                                        <span className='error'>{formErrors.email}</span>)}
                                    <MDBInput wrapperClass='mb-4'
                                        label='Email'
                                        id='form3'
                                        type='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleInputChange} />

                                    {formErrors.password && (
                                        <span className='error'>{formErrors.password}</span>)}
                                    <MDBInput wrapperClass='mb-4'
                                        label='Password'
                                        id='form4'
                                        type='password'
                                        name='password'
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <div className='button-message-wrap'>
                                    <button className='signup-button'>REGISTER</button>
                                    {showRegModal && (
                                                   <RegistrationSuccesPopUp
                                                   isOpen={showRegModal}
                                                   onClose={() => setShowRegModal(false)}
                                               />
                                    )}
                                    </div>
                                </MDBCardBody>
                            </MDBCard>
                        </MDBCol>
                        <MDBCol col='6'>
                            <img src={reg_pic} className="w-100 rounded-4 shadow-4"
                                alt="" />
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </form>
        </div>
    );
}

export default Registration;