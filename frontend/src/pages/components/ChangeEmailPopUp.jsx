import Modal from 'react-modal';
import PropTypes from "prop-types";
import { useEffect, useState } from 'react';
import '../css-files/ChangeEmailPopUp.css'

const ChangeEmailPopUp = ({ isOpen, onClose, onSave, isEmailTaken, setIsEmailTaken }) => {
  const [newEmail, setNewEmail] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showEmptyFieldError, setShowEmptyFieldError] = useState(false);


  useEffect(() => {
    if (isEmailTaken) {
      setShowErrorMessage(true);

      //set a timeout to hide the error message after 3 seconds
      const timeout = setTimeout(() => {
        setShowErrorMessage(false);
        setIsEmailTaken(false);
        console.log("hello")
      }, 3000);

      //clear the timeout when the component unmounts or when isUserNameTaken changes
      return () => clearTimeout(timeout);
    }
  }, [isEmailTaken, setIsEmailTaken]);


  const handleSave = () => {

    if(newEmail.trim() === '') {
      setShowEmptyFieldError(true);

      const timeout = setTimeout(() => {
        setShowEmptyFieldError(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }

    onSave(newEmail);
    setNewEmail("");
  };

  const handleChangeInput = (e) => {
    setNewEmail(e.target.value)
  };


  return (
    <Modal className={'modal-class'} isOpen={isOpen} onClose={onClose}>
      <div className='modal-panel'>
      {showErrorMessage && <div className={`username-taken ${showErrorMessage ? 'show' : ''}`}>Email is already taken!</div>}
        <h3>Change email</h3>
        {showEmptyFieldError && <div className={`empty-field ${showEmptyFieldError ? 'show' : ''}`}>Email field must not be empty!</div>}
        <input
          style={{ borderRadius: '8px' }}
          type="email"
          value={newEmail}
          onChange={handleChangeInput}
          placeholder='Enter new email'
        />
        <div className='modal-button-container'>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

ChangeEmailPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isEmailTaken: PropTypes.bool.isRequired,
  setIsEmailTaken: PropTypes.bool.isRequired,
};

export default ChangeEmailPopUp;
