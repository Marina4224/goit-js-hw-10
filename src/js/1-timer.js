import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('[data-start]');
const datetimePicker = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];
      if (selectedDate.getTime() <= Date.now()) {
        iziToast.error({
          title: "Error",
          message: "Please choose a date in the future",
          position: "topRight",
        });
        startBtn.disabled = true;
      } else {
        userSelectedDate = selectedDate;
        startBtn.disabled = false;
      }
    },
  };
  
  flatpickr(datetimePicker, options);

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    datetimePicker.disabled = true;
  
    timerId = setInterval(() => {
      const now = new Date();
      const diff = userSelectedDate - now;
  
      if (diff <= 0) {
        clearInterval(timerId);
        updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        datetimePicker.disabled = false;
        return;
      }
        const timeLeft = convertMs(diff);
      updateTimerInterface(timeLeft);
    }, 1000);
  });

  function updateTimerInterface({ days, hours, minutes, seconds }) {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
}
  

  function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}
  

function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }
  
  console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
  console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
  console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}