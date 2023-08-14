import Modal from 'react-modal';
import PropTypes from "prop-types";
import { useEffect, useState } from 'react';
import '../css-files/ChangeUserNamePopUp.css';

const ChangeUserNamePopUp = ({ isOpen, onClose, onSave, isUserNameTaken, setIsUserNameTaken }) => {
  const [newUserName, setNewUserName] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showEmptyFieldError, setShowEmptyFieldError] = useState(false);

  useEffect(() => {
    if(isUserNameTaken) {
      setShowErrorMessage(true);

      //set a timeout to hide the error message after 3 seconds
      const timeout = setTimeout(() => {
        setShowErrorMessage(false);
        setIsUserNameTaken(false);
      }, 3000);

      //clear the timeout when the component unmounts or when isUserNameTaken changes
      return () => clearTimeout(timeout);
    }
  }, [isUserNameTaken, setIsUserNameTaken]);

  const handleSave = () => {

    if(newUserName.trim() === '') {
      setShowEmptyFieldError(true);

      const timeout = setTimeout(() => {
        setShowEmptyFieldError(false);
      }, 3000);

      return () => clearTimeout(timeout);
    }

    onSave(newUserName);
    setNewUserName("");
  };

  const handleChangeInput = (e) => {
    setNewUserName(e.target.value)
  };

  return (
    <Modal className={'modal-class'} isOpen={isOpen} onClose={onClose}>
      <div className='modal-panel'>
        {showErrorMessage && <div className={`username-taken ${showErrorMessage ? 'show' : ''}`}>Username is already taken!</div>}
        <h3>Change username</h3>
        {showEmptyFieldError && <div className={`empty-field ${showEmptyFieldError ? 'show' : ''}`}>Username field must not be empty!</div>}
        <input
          style={{ borderRadius: '8px' }}
          type="text"
          value={newUserName}
          onChange={handleChangeInput}
          placeholder='Enter new username'
        />

        <div className='modal-button-container'>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

ChangeUserNamePopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isUserNameTaken: PropTypes.bool.isRequired,
  setIsUserNameTaken: PropTypes.bool.isRequired,
};

export default ChangeUserNamePopUp;
