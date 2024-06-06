import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchImages from './random_Img.js';
import fetchRandomQuote from './random_Quote.js';
import renderOneDayWeather from './date_time.js';
import fetchMoreInfo from './more-info.js';
import renderCurrentWeather from './today.js';
import test from './five_Days.js';

function seachCityApi(e) {
  // console.dir(e.target);
  if (e.target.nodeName === 'A') {
    console.dir(e.target.innerText);
    let city = e.target.innerText;
    fetchWeather(city);
  }
}

const formRefSearch = document.querySelector('.search-city');
const inputRefSearch = document.querySelector('.search-form');
const geoBtn = document.querySelector('.geo-btn');

formRefSearch.addEventListener('submit', onSearch);
geoBtn.addEventListener('click', getLocationByIP);
// button.addEventListener('click', onClickAddFavor)
navigator.geolocation.getCurrentPosition(success, onError);

function onSearch(event) {
  event.preventDefault();
  fetchWeather(inputRefSearch.value);
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  fetchWeatherByCoords(lat, lon);
}

function onError() {
  const query = 'Manila';
  fetchWeather(query);
}

async function getLocationByIP() {
  const response = await axios.get(`https://ipapi.co/json/`);
  const { city } = await response.data;
  inputRefSearch.value = city;

  fetchWeather(city);
}

//fetching weather data from the OpenWeatherMap API*
async function fetchWeather(query) {
  let response;

  try {
    response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=metric&lang=en&appid=c32df37628577b1447329bd64ef99bea`
    );

    const weather = response.data;
    renderCurrentWeather(weather);
    fetchImages(weather);
    renderOneDayWeather(weather);
    fetchMoreInfo(weather);
    fetchRandomQuote();
    test(weather);
  } catch (error) {
    Notify.failure(`Sorry! This city doesn't exist. Enter valid city name`);
  }
}

//fetching weather data from the OpenWeatherMap API based on  latitude and longitude coordinates.*
async function fetchWeatherByCoords(lat, lon) {
  // const output = document.querySelector('.output');***
  const response = await axios.get(
    `https://api.openweathermap.org/data/2./forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&appid=c32df37628577b1447329bd64ef99bea`
  );

  const weather = await response.data;
  renderCurrentWeather(weather);

  renderOneDayWeather(weather);
  fetchMoreInfo(weather);
  fetchImages(weather);
  fetchRandomQuote();
  test(weather);
}

const seachInput = document.querySelector('.search-form');
const seachFavoriteList = document.querySelector('.seach-favorite-list');
const favoriteBtn = document.querySelector('.search-city__form-btn');
favoriteBtn.addEventListener('click', addToFav);
const seachBackBtn = document.querySelector('.back-btn');
seachBackBtn.addEventListener('click', prevSeachElem);
const seachFrwBtn = document.querySelector('.frw-btn');
seachFrwBtn.addEventListener('click', nextSeachElem);

//Add city in favorite list

let favoritItems = JSON.parse(localStorage.getItem('favor')) || [];

function addToFav() {
  const inputValue = seachInput.value.trim();

  if (inputValue.length === 0) return;

  if (favoritItems.includes(inputValue)) {
    alert('The city is already in your favorites list');
  } else {
    favoritItems.push(inputValue);
    localStorage.setItem('favor', JSON.stringify(favoritItems));
  }

  countFav();
}

// Display the favorite list
async function renderFavList(render) {
  let renderFavItem = render
    .map(
      item => `<li id="${item}" class="seach-favorite-item">
        <a class="seach-favorite-link" href="#">${item}</a>
        <div class="close-btn"></div>

      </li>`
    )
    .join('');

  seachFavoriteList.innerHTML = await renderFavItem;
  if (JSON.parse(localStorage.getItem('favor')).length) {
    renderFwdBackBtn();
  }
}

// Forward button for favorite list
function renderFwdBackBtn() {
  const favoritItems = JSON.parse(localStorage.getItem('favor'));
  const lastItemId = seachFavoriteList.lastChild.id;
  const firstItemId = seachFavoriteList.firstChild.id;

  if (favoritItems.indexOf(lastItemId) === favoritItems.length - 1) {
    seachFrwBtn.classList.add('visually-hidden');
  } else {
    seachFrwBtn.classList.remove('visually-hidden');
  }

  if (favoritItems.indexOf(firstItemId) === 0) {
    seachBackBtn.classList.add('visually-hidden');
  } else {
    seachBackBtn.classList.remove('visually-hidden');
  }

  seachFavoriteList.style.marginLeft = !seachBackBtn.classList.contains(
    'visually-hidden'
  )
    ? '10px'
    : '51px';
}

// Managing favorite items or fetching weather information
function action(e) {
  const targetNodeName = e.target.nodeName;
  const favoritItems = JSON.parse(localStorage.getItem('favor'));

  if (targetNodeName === 'DIV') {
    const currentId = e.currentTarget.id;
    const idxOfDelElem = favoritItems.indexOf(currentId);

    favoritItems.splice(idxOfDelElem, 1);
    localStorage.setItem('favor', JSON.stringify(favoritItems));
    countFav();
  } else {
    fetchWeather(e.currentTarget.id);
  }
}

//Updating the count of favorite items and rendering the list of favorites accordingly.
async function countFav() {
  const favoritItems = JSON.parse(localStorage.getItem('favor')) || [];

  const maxItems = window.outerWidth <= 767 ? 2 : 4;
  favoritItems.splice(maxItems);

  await renderFavList(favoritItems);

  document
    .querySelectorAll('.seach-favorite-item')
    .forEach(x => x.addEventListener('click', action));
}

async function prevSeachElem() {
  let favoritItems = JSON.parse(localStorage.getItem('favor'));

  if (window.outerWidth <= 767) {
    favoritItems = favoritItems.splice(
      favoritItems.indexOf(seachFavoriteList.firstChild.id) - 1,
      2
    );
  } else if (window.outerWidth > 767) {
    favoritItems = favoritItems.splice(
      favoritItems.indexOf(seachFavoriteList.firstChild.id) - 1,
      4
    );
  }

  await renderFavList(favoritItems);
  const FavElem = document.querySelectorAll('.seach-favorite-item');

  FavElem.forEach(x => x.addEventListener('click', action));
}

// Handle navigation to the next set of favorite items in the list.
async function nextSeachElem() {
  let favoritItems = JSON.parse(localStorage.getItem('favor'));

  if (
    favoritItems.indexOf(seachFavoriteList.lastChild.id) !==
    favoritItems.length - 1
  ) {
    if (window.outerWidth <= 767) {
      favoritItems = favoritItems.splice(
        favoritItems.indexOf(seachFavoriteList.lastChild.id),
        2
      );
    } else if (window.outerWidth > 767) {
      favoritItems = favoritItems.splice(
        favoritItems.indexOf(seachFavoriteList.lastChild.id) - 2,
        4
      );
    }
  } else {
    console.log('test1');
  }
  await renderFavList(favoritItems);
  const FavElem = document.querySelectorAll('.seach-favorite-item');

  FavElem.forEach(x => x.addEventListener('click', action));
}

countFav();
