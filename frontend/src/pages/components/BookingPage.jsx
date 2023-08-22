import { useEffect, useState } from 'react';
import '../css-files/BookingPage.css'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css-files/DatePicker.css';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../AxiosConfig';
import useBookingData from '../hooks/useBookingData';



const BookingPage = () => {

  const navigate = useNavigate();

  const [selectedSiteText, setSelectedSiteText] = useState("");
  const [selectedActivityText, setSelectedActivityText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [showSiteChoose1, setShowSiteChoose1] = useState(true);
  const [showSiteChoose2, setShowSiteChoose2] = useState(true);

  const [showActivity, setShowActivity] = useState(false);
  const [showActivityChoose2, setShowActivityChoose2] = useState(true);

  const [showCalendarChoose1, setShowCalendarChoose1] = useState(false);
  const [showCalendarChoose2, setShowCalendarChoose2] = useState(true);

  const [showTimeChoose1, setShowTimeChoose1] = useState(false);
  const [showTimeChoose2, setShowTimeChoose2] = useState(true);

  const [changeSiteBackground, setChangeSiteBackground] = useState(false);
  const [changeActivityBackground, setChangeActivityBackground] = useState(false);
  const [changeCalendarBackground, setChangeCalendarBackground] = useState(false);
  const [changeTimeBackground, setChangeTimeBackground] = useState(false);

  const [siteTextColor1, setSiteTextColor1] = useState(false);
  const [siteTextColor2, setSiteTextColor2] = useState(false);
  const [siteTextColor3, setSiteTextColor3] = useState(false);

  const [activityTextColor1, setActivityTextColor1] = useState(false);
  const [activityTextColor2, setActivityTextColor2] = useState(false);

  const [showSummaryPanel, setShowSummaryPanel] = useState(false);

  const [isReserved, setIsReserved] = useState(false);

  const [bookingData, refetchBookingData] = useBookingData();


  useEffect(() => {
    const loggedInUser = localStorage.getItem('jwtToken');

    if (!loggedInUser) {
      console.log("login first!");
      navigate('/login');
    }
  }, [navigate])


  const generateTimeSlots = () => {

    const startTime = new Date();
    startTime.setHours(9, 45, 0); // set start time to 9:45


    const endTime = new Date();
    endTime.setHours(14, 45, 0); //set end time to 13:45;

    const timeSlots = [];
    const increment = 60 * 60 * 1000; //60 mins in milliseconds;
    const currentTime = new Date().getTime();

    let currentTimeSlot = startTime.getTime();
    while (currentTimeSlot <= endTime.getTime()) {
      const timeSlot = new Date(currentTimeSlot);

      //check if the current time slot is in the future
      const isFuture = (format(selectedDate, 'dd/MM/yyyy') !== format(new Date(), 'dd/MM/yyyy') || currentTime <= currentTimeSlot);

      // check if the time slot is inactive due to existing booking
      const isInactive = bookingData.some(booking =>
        booking.location === selectedSiteText &&
        booking.activity === selectedActivityText &&
        booking.bookedDate === format(selectedDate, 'dd/MM/yyyy') &&
        booking.bookedTime === format(timeSlot, 'HH:mm'));

      // if it's not in the past and not already booked, it's active
      const isActive = isFuture && !isInactive;

      timeSlots.push({ timeSlot, isActive });
      currentTimeSlot += increment;
    }

    return timeSlots;
  };

  const generatePrice = (numSlots) => {
    const price = Array(numSlots).fill('$50.00');

    return price;
  }

  const handleDateChange = (date) => {
    refetchBookingData();
    setSelectedDate(date);
    setShowCalendarChoose2(false);
    setShowTimeChoose1(true);
    setShowTimeChoose2(true);
    setChangeCalendarBackground(true);
  }

  useEffect(() => {
    const currentDate = new Date();
    setSelectedDate(currentDate);
  }, []);


  const handleChooseSite1Click = () => {
    if (showActivity) {
      setShowSiteChoose2(true); //show site-choose2 again
      setShowActivityChoose2(true);
      setShowTimeChoose2(false);
      setSelectedActivityText("");

    } else {
      setShowActivity(false);
      setShowSiteChoose2(!showSiteChoose2); //toggle the value of showSiteChoose2
      setShowCalendarChoose2(false);
    }
  }


  const handleChooseSite2Click = (text) => {
    setSelectedSiteText(text);
    setShowActivity(true);
    setShowSiteChoose2(false);
    setChangeSiteBackground(true);
    setSiteTextColor1(false);
    setSiteTextColor2(false);
    setSiteTextColor3(false);
  }

  const handleChooseActivity2Click = (text) => {
    setSelectedActivityText("");
    if (text === selectedActivityText) {
      setShowActivityChoose2(true);
      setShowSiteChoose2(false);
      setShowCalendarChoose2(true);
      setShowTimeChoose2(false);
      setActivityTextColor1(false);
      setActivityTextColor2(false);
    } else {
      setSelectedActivityText(text);
      setShowActivityChoose2(false);
      setShowCalendarChoose1(true);
      setShowCalendarChoose2(true);
      setChangeActivityBackground(true);
      setActivityTextColor2(false);
    }
  }

  const handleChooseCalendar1Click = () => {
    setShowActivityChoose2(false);
    setShowSiteChoose2(false);
    setShowCalendarChoose2(true);
    setShowTimeChoose2(false);
  }

  const handleChooseTime1Click = () => {
    if (!showTimeChoose2) {
      setShowTimeChoose2(true);
      setShowSiteChoose2(false);
      setShowActivityChoose2(false);
      setShowCalendarChoose2(false);
    }
  }

  const handleChooseTime2Click = (timeSlot) => {
    const formattedTime = timeSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    setSelectedTime(formattedTime);
    setShowTimeChoose2(false);
    setChangeTimeBackground(true);
    setShowSummaryPanel(true);
  }

  const handleHomeButtonClick = () => {
    navigate('/');
  }

  const handleReturnButtonClick = () => {
    navigate('/');
  }

  const handleCreateBooking = async () => {
    const formattedDate = selectedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });


    const bookingData = {
      location: selectedSiteText,
      activity: selectedActivityText,
      bookedDate: formattedDate,
      bookedTime: selectedTime
    };

    setIsReserved(true);
    setShowSiteChoose1(false);
    setShowSiteChoose2(false);
    setShowActivity(false);
    setShowCalendarChoose1(false);
    setShowTimeChoose1(false);

    try {
      await axiosInstance.post("/booking/new_booking", bookingData);
      console.log("reservation complete");

    } catch (error) {
      console.log("error saving new reservation:", error)
    }
  }

  return (
    <div className='booking-page'>
      <div className='booking-panel-container' style={{ alignItems: isReserved ? 'center' : 'none' }}>
        <div className='arrow-container'>
          <div className='arrow-circle' onClick={handleReturnButtonClick}>
            <i className="fas fa-chevron-left left-arrow"></i>
          </div>
        </div>
        {showSiteChoose1 && (
          <div className='site'>
            <div className={`site-choose1 ${changeSiteBackground ? 'bg-change1' : ''}`}>
              <div className='site-text-container'>
                <div className='site-text1'>SITE</div>
                <div className='site-text2' onClick={handleChooseSite1Click}>{selectedSiteText || 'CHOOSE SITE'}</div>
              </div>
            </div>

            {showSiteChoose2 && (
              <div className='site-choose2'>
                <div className='site-variations-text-container'>
                  <div className='site-text3'>VIENNA</div>
                  <div className={`site-text4 ${siteTextColor1 ? 'hover-effect1' : ''}`}
                    onClick={() => handleChooseSite2Click('VIENNA CENTRE')}
                    onMouseEnter={() => setSiteTextColor1(true)}
                    onMouseLeave={() => setSiteTextColor1(false)}>VIENNA CENTRE</div>

                  <div className='site-text3'>GRAZ</div>
                  <div className={`site-text5 ${siteTextColor2 ? 'hover-effect1' : ''}`}
                    onClick={() => handleChooseSite2Click('GRAZ CENTRE')}
                    onMouseEnter={() => setSiteTextColor2(true)}
                    onMouseLeave={() => setSiteTextColor2(false)}>GRAZ CENTRE</div>

                  <div className='site-text3'>LINZ</div>
                  <div className={`site-text6 ${siteTextColor3 ? 'hover-effect1' : ''}`}
                    onClick={() => handleChooseSite2Click('LINZ CENTRE')}
                    onMouseEnter={() => setSiteTextColor3(true)}
                    onMouseLeave={() => setSiteTextColor3(false)}>LINZ CENTRE</div>
                </div>
              </div>
            )}
          </div>
        )}

        {showActivity ? (
          <div className='activity'>
            <div className={`activity-choose1 ${changeActivityBackground ? 'bg-change2' : ''}`}>
              <div className='activity-text-container'>
                <div className='activity-text1'>ACTIVITY</div>
                <div className='activity-text2' onClick={() => handleChooseActivity2Click(selectedActivityText)}>{selectedActivityText || 'CHOOSE ACTIVITY'}</div>
              </div>
            </div>
            {!showSiteChoose2 && showActivityChoose2 && (//only render activity-choose2 when showSiteChoose2 is false
              <div className='activity-choose2'>
                <div className='activity-text-container2'>
                  <div className={`activity-text3 ${activityTextColor1 ? 'hover-effect1' : ''}`}
                    onClick={() => handleChooseActivity2Click('BUNGY JUMPING')}
                    onMouseEnter={() => setActivityTextColor1(true)}
                    onMouseLeave={() => setActivityTextColor1(false)}>BUNGY JUMPING</div>

                  <div className={`activity-text3 ${activityTextColor2 ? 'hover-effect1' : ''}`}
                    onClick={() => handleChooseActivity2Click('LONG - ZIPRIDE')}
                    onMouseEnter={() => setActivityTextColor2(true)}
                    onMouseLeave={() => setActivityTextColor2(false)}>LONG - ZIPRIDE</div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {showCalendarChoose1 && (
          <div className='calendar'>
            <div className={`calendar-choose1 ${changeCalendarBackground ? 'bg-change3' : ''}`}>
              <div className='calendar-date-container'>
                <div className='calendar-text1'>DATE</div>
                <div className='calendar-text2' onClick={handleChooseCalendar1Click}>
                  {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'CHOOSE DATE'}</div>
              </div>
            </div>
            {showCalendarChoose2 && !showActivityChoose2 && (
              <div className='calendar-choose2'>
                <DatePicker
                  minDate={new Date()}
                  inline
                  calendarStartDay={1}
                  selected={selectedDate}
                  onChange={handleDateChange}
                />
              </div>
            )}
          </div>
        )}

        {showTimeChoose1 && (
          <div className='timepicker'>
            <div className={`timepicker-choose1 ${changeTimeBackground ? 'bg-change4' : ''}`}>
              <div className='timepicker-container1'>
                <div className='timepicker-text1'>TIME</div>
                <div className='timepicker-text2' onClick={handleChooseTime1Click}>{selectedTime || 'CHOOSE TIME'}</div>
              </div>
            </div>
            {showTimeChoose2 && (
              <div className='timepicker-choose2'>
                <div className='timepicker-container'>
                  <h3>CHOOSE TIME</h3>
                  <div className='timepicker-heading'>
                    <div className='timepicker-column-header'>TIME</div>
                    <div className='timepicker-column-header'>PRICE</div>
                  </div>
                  <div className='time-price-slot-container'>
                    {generateTimeSlots().map((timeSlotObj, index) => (
                      <div key={index}
                        className={'time-slot-row'}
                        onClick={timeSlotObj.isActive ? () => handleChooseTime2Click(timeSlotObj.timeSlot) : null}>

                        <div className={`time-picker-timecolumn ${timeSlotObj.isActive ? 'active-time-slot' : 'inactive-time-slot'}`}>
                          <div className='timecolumn-num'>
                            {timeSlotObj.timeSlot.getHours().toString().padStart(2, '0')}:
                            {timeSlotObj.timeSlot.getMinutes().toString().padStart(2, '0')}
                          </div>
                        </div>
                        <div className={`time-picker-pricecolumn ${timeSlotObj.isActive ? 'active-time-slot' : 'inactive-time-slot'}`}>
                          {generatePrice(generateTimeSlots().length)[index]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {showSummaryPanel && (
          <div className='summary-container' style={{
            transform: isReserved ? 'none' : 'translate(45%, 26%)',
            borderTopRightRadius: isReserved ? '60px' : '0',
            borderBottomRightRadius: isReserved ? '60px' : '0'
          }}>
            <div className='summary-text-container'>
              <h3 className='summary-header'>SUMMARY</h3>
              <div className='summary-details-text'>
                <h4 className='details-text'>
                  Location: <span className='location-text'>{selectedSiteText}</span></h4>
                <h4 className='details-text'>
                  Activity: <span className='activity-text'>{selectedActivityText}</span></h4>
                <h4 className='details-text'>
                  Date: <span className='date-text'>{selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}</span></h4>
                <h4 className='details-text'>
                  Time: <span className='time-text'>{selectedTime}</span></h4>
              </div>
              <div className='underline last-heading'></div>
              <div className='total-details-text'>
                <h4 className='details-text'>Total: </h4>
                <h4 className='total-text'>{generatePrice()}</h4>
              </div>
              {isReserved ? (
                <div className='succesfull-message-container'>
                  <h4 className='succesfull-message'>Your reservation is succesful</h4>
                  <button className='back-to-home-button' onClick={handleHomeButtonClick}>Back to Home</button>
                </div>
              ) : (
                <div className='book-button-container'>
                  <button className='book-button' onClick={handleCreateBooking}>RESERVE</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingPage;
