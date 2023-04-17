/*
  Hook this script to index.html
  by adding `<script src="script.js">` just before your closing `</body>` tag
*/

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function injectHTML(list) {
  console.log("fired injectHTML");
  const target = document.querySelector("#restaurant_list");
  target.innerHTML = "";
  list.forEach((item, index) => {
    const str = `<li>${item.name}</li>`;
    target.innerHTML += str;
  });
}

/* A quick filter that will return something based on a matching input */
function filterList(list, query) {
  return list.filter((item) => {
    const lowerCaseName = item.name.toLowerCase();
    const lowerCaseQuery = query.toLowerCase();
    return lowerCaseName.includes(lowerCaseQuery);
  });
}

function initMap() {
  const carto = L.map('map').setView([38.98, -76.93], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(carto);
  return carto;
}

function markerPlace(array, map) {
  console.log('array for markers', array);

  map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
  });
  array.forEach((item) => {
    console.log('markerPlace', item);
    const {coordinates} = item.geocoded_column_1;

    L.marker([coordinates[1], coordinates[0]]).addTo(map);
})
}

function cutRestaurantList(list) {
  console.log("fired cut list");
  const range = [...Array(15).keys()];
  return (newArray = range.map((item) => {
    const index = getRandomIntInclusive(0, list.length - 1);
    return list[index];
  }));
}

async function mainEvent() {
  // the async keyword means we can make API requests
  const mainForm = document.querySelector(".main_form"); // This class name needs to be set on your form before you can listen for an event on it
  const filterButton = document.querySelector("#filter");
  const loadDataButton = document.querySelector("#data_load");
  const generateListButton = document.querySelector("#generate");
  const textField = document.querySelector("#resto");

  const loadAnimation = document.querySelector("#data_load_animation");
  loadAnimation.style.display = "none";
  generateListButton.classList.add("hidden");

  const carto = initMap();

  let storedList = [];
  let currentList = [];

  /* We need to listen to an "event" to have something happen in our page - here we're listening for a "submit" */
  loadDataButton.addEventListener("click", async (submitEvent) => {
    // async has to be declared on every function that needs to "await" something
    console.log("loading data");
    loadAnimation.style.display = "inline-block";

    // Basic GET request - this replaces the form Action
    const results = await fetch(
      "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json"
    );

    // This changes the response from the GET into data we can use - an "object"
    storedList = await results.json();
    if (storedList.length > 0) {
      generateListButton.classList.remove("hidden");
    }

    loadAnimation.style.display = "none";
    console.table(storedList);
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    currentList = cutRestaurantList(parsedData);
    console.log(currentList);
    injectHTML(currentList);
    markerPlace(currentList, carto);
  });

  textField.addEventListener("input", (event) => {
    console.log("input", event.target.value);
    const newList = filterList(currentList, event.target.value);
    console.log(newList);
    injectHTML(newList);
    markerPlace(newList, carto);
  });

  filterButton.addEventListener("click", (event) => {
    console.log("clicked FilterButton");

    const formData = new FormData(mainForm);
    const formProps = Object.fromEntries(formData);

    console.log(formProps);
    const newList = filterList(storedList, formProps.resto);

    console.log(newList);
    injectHTML(newList);
  });

  generateListButton.addEventListener("click", (event) => {
    console.log("generate new list");
    currentList = cutRestaurantList(storedList);
    console.log(currentList);
    injectHTML(currentList);
  });

  textField.addEventListener('input', (event) => {
    console.log(event.target.value);
    const filteredList = filterList(storedList, event.target.value);
    console.log(filteredList)
    injectHTML(filteredList);
  })
}

document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests