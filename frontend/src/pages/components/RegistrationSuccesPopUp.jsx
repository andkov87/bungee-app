import Modal from 'react-modal';
import '../css-files/RegistrationSuccesPopUp.css';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';


const RegistrationSuccesPopUp = ({isOpen, onClose}) => {

const navigate = useNavigate();


const handleCloseRegistrationModal = () => {

    localStorage.removeItem('jwtToken');
    navigate('/login');
}

  return (
    <Modal className={'modal-class'} isOpen={isOpen} onClose={onClose}>
      <div className='modal-panel-reg'>
        <h2>Registration successful</h2>
        <h3>Please Sign in!</h3>


        <div className='modal-button-container'>
          <button onClick={handleCloseRegistrationModal}>OK</button>
        </div>
      </div>
    </Modal>
  )
};

RegistrationSuccesPopUp.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

export default RegistrationSuccesPopUp
