import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const refs = {
    startBtn: document.querySelector('[data-start]'),
    picker: document.querySelector('input#datetime-picker'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]')
};

let userSelectedDate = null;
refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    userSelectedDate = selectedDates[0];

    if (userSelectedDate > Date.now()) {
      refs.startBtn.disabled = false; 
    } else {
      iziToast.error({
            message: "Please choose a date in the future",
            position: 'topRight'});
      userSelectedDate = null;
      refs.startBtn.disabled = true;
    }
  }
};

flatpickr(refs.picker, options);

const timer = {
    intervalId: null,
    start() {
        if (!userSelectedDate) return;
        refs.picker.disabled = true;
        refs.startBtn.disabled = true;
        this.intervalId = setInterval(() => {
            this.tick();
        }, 1000);
    },
    tick() {
        const currentTime = Date.now();
        const ms = userSelectedDate - currentTime;
        if (ms <= 0) {
            clearInterval(this.intervalId);
            refs.picker.disabled = false;
            return;
        }
        const time = convertMs(ms);
        updateDisplay(time);
    }
}

refs.startBtn.addEventListener('click', () => { timer.start() });

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

function updateDisplay({ days, hours, minutes, seconds }) {
    refs.days.textContent = days.toString().padStart(2, '0');
    refs.hours.textContent = hours.toString().padStart(2, '0');
    refs.minutes.textContent = minutes.toString().padStart(2, '0');
    refs.seconds.textContent = seconds.toString().padStart(2, '0');
}