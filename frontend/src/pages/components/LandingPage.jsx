import { useState } from 'react'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import bungee_vid from '../background video/bungeevid4.mp4'
import bungee_pic from '../bungee pics/bungee17.png'
import bungee_pic2 from '../bungee pics/bungee18.jpg'
import bungeeCollage from '../bungee pics/bungeeCollage.png'
import '../css-files/LandingPage.css'


library.add(faVolumeUp, faVolumeMute);

const LandingPage = () => {

  const navigate = useNavigate();

    const [play, setPlay] = useState(false);
    const [volume, setVolume] = useState(0.5);

    
    const handleVolumeClick = () => {
        setVolume(volume > 0 ? 0 : 0.5);
      };

      const handlePlayButtonClick = () => {
        setPlay(true);

        const button = document.querySelector('.play-button-overlay');
        button.classList.add('clicked');
        setTimeout(() => {
          button.classList.remove('clicked');
        }, 400)
      };

   
      const handlePauseButtonClick = () => {
        setPlay(false);
    
        const button = document.querySelector('.pause-button-overlay');
        button.classList.add('clicked');
        setTimeout(() => {
          button.classList.remove('clicked');
        }, 400);
      };

      const handleBookNowButton = () => {
        navigate('/booking')
      }


  return (
    <div className='mainPage'>
    <div className='video-container'>    
        <ReactPlayer
        className='video-player'
        width={'100%'}
        height={'100%'}
        playing={play}        
        loop={true}
        pip={false}
        volume={volume}
        controls={false}
        config={{file: { attributes: {controlsList: 'nodownload', disablePictureInPicture: true}}}}
        url={bungee_vid}        
        />     
        {!play ? (
          <div className='firstDiv'>
            <div className='textDiv'>
              <h1>WHAT ARE YOU WAITING FOR?</h1>
              </div>
          <div className='play-button-overlay' onClick={handlePlayButtonClick}>
            <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24'>
              <path d='M8 5v14l11-7z'/>
            </svg>
            </div>
            </div>
        ) : ( <div className='pause-button-overlay'
          onClick={handlePauseButtonClick}>
          <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 24 24'>
            <path d='M6 4h4v16H6zM14 4h4v16h-4z'/>
          </svg>
        </div>
        )}
        {play && (
        <div className='volume-button' onClick={handleVolumeClick}>
        <FontAwesomeIcon
        icon={volume > 0 ? faVolumeMute : faVolumeUp}
        style={{fontSize: '40px'}}
        />
      </div> 
        )}
    </div>
  
    <div className="reservation-container">
    <div className="reservation">
      <img className='aboutus_pic' src={bungee_pic} alt=''></img>
      <div className='reservation-textcontainer'>
        <h2 className='reservation-head'>RESERVATION</h2>
          <h1 className='reservation-header'>THICK ONE OFF<br></br> THE BUCKET LIST...</h1>
          <button className='reservation-button' onClick={handleBookNowButton}>BOOK NOW</button>
      </div>
    </div>    
  </div>
  <div className="socialmedia-container">
    <div className="socialmedia">
      <img className='socialmedia_pic' src={bungeeCollage} alt=''></img>
      <h1 className='socialmedia-text'>#LIVEMORE FEARLESS</h1>
    </div>
  </div>
  <div className="aboutus-container">
    <div className="aboutus">
      <img className='reservation_pic' src={bungee_pic2} alt=''></img>
      <div className='aboutus-textcontainer'>
        <h2 className='aboutus-header'>EXPLORE OUR WORLD</h2>
      <ol className='aboutus-text'>
        <li className='list-firstelement'>Thrilling Bungy Experience</li>
        <li className='list-secondelement'>SPOTLESS SAFETY RECORD</li>
        <li className='list-thirdelement'>ADRENALIN-FUELED ADVENTURE</li>
      </ol>
      </div>
    </div>
  </div>
  </div>
  )
}

export default LandingPage;
