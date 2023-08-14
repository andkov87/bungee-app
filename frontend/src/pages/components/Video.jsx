import { useState } from 'react'
import ReactPlayer from 'react-player';
import '../css-files/Video.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

library.add(faVolumeUp, faVolumeMute);

const Video = () => {
    const [play, setPlay] = useState(true);
    const [volume, setVolume] = useState(0.5);

    const handleVolumeClick = () => {
        setVolume(volume > 0 ? 0 : 0.5);
      };


  return (
    <div className='video-container'>
        <ReactPlayer
        className='video-player'
        width='100%'
        height='100%'
        playing={play}
        loop={true}
        volume={volume}
        pip
        controls={false}
        config={{file: { attributes: {controlsList: 'nodownload'}}}}
        url={videoFile}
        />
            <div className='volume-button' onClick={handleVolumeClick}>
        <FontAwesomeIcon
        icon={volume > 0 ? faVolumeMute : faVolumeUp}
        style={{fontSize: '20px'}}
        />
      </div>
    </div>
  )
}

export default Video;
