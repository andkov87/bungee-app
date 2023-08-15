import '../css-files/Login.css';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
}
  from 'mdb-react-ui-kit';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../AxiosConfig';


const Login = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/auth/authenticate', formData);
      const token = response.data.token;
      localStorage.setItem('jwtToken', token);

      console.log('Token stored: ', token);
      navigate('/');
    } catch (error) {
      console.error("Login error: ", error);
      setError("Invalid username or password")
    }
  };

  const handleReturnButtonClick = () => {
    navigate('/');
  }

  return (
    <div
      className='login-page'>
                 <div className='arrow-container'>
          <div className='arrow-circle' onClick={handleReturnButtonClick}>
            <i className="fas fa-chevron-left left-arrow"></i>
          </div>
        </div>
      <form className='auth-form ' onSubmit={handleSubmit}>
        <MDBContainer fluid>

          <MDBRow className='d-flex justify-content-center align-items-center h-100'>
            <MDBCol col='12'>

              <MDBCard className='bg-dark text-white my-5 mx-auto'
                style={{ borderRadius: '1rem', maxWidth: '400px' }}>
                <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-white-50 mb-5">Please enter your login and password!</p>

                  <MDBInput wrapperClass='mb-4 mx-5 w-100'
                    labelClass='text-white'
                    label='Username'
                    id='userName'
                    type='text'
                    size="lg"
                    name='userName'
                    value={formData.userName}
                    onChange={handleInputChange} />

                  <MDBInput wrapperClass='mb-4 mx-5 w-100'
                    labelClass='text-white'
                    label='Password'
                    id='password'
                    type='password'
                    size="lg"
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange} />

                  <button className='login-button'>LOGIN</button>
                  {error && <div className="mt-3 text-danger">{error}</div>}

                  <p className="small mb-3 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>

                  <div>
                    <p className="mb-0">Don&rsquo;t have an account? <a href="/auth" className="text-white-50 fw-bold">Sign Up</a></p>
                  </div>
                </MDBCardBody>
              </MDBCard>

            </MDBCol>
          </MDBRow>

        </MDBContainer>
      </form>
    </div>
  );
}

export default Login;