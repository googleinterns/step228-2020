/** Array of country codes supported by YouTube API */
let windowsHandler;
let map;
let countriesWithSomeData;

import {UniqueWindowHandler} from './unique_window_handler.js';
import {getSupportedCountries} from './get_supported_countries.js';

/* eslint-disable no-unused-vars */
/**
 * Initialise map
 */
export async function initMap() {
  const initPos = new google.maps.LatLng(0, 0);
  map = new google.maps.Map(document.getElementById('map'), {
    center: initPos,
    zoom: 3,
    minZoom: 2,
  });

  countriesWithSomeData = await getSupportedCountries();
  windowsHandler = new UniqueWindowHandler(map);

  // Add a marker clusterer to manage the markers.
  const markerCluster = new MarkerClusterer(map, [],
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  addAllMarkers(markerCluster);
  google.maps.event.addListener(map, 'click', function() {
    windowsHandler.currentWindow.close();
  });
} /* eslint-enable no-unused-vars */

/**
 * Adds one marker for each country to the markerCluster
 * See CountryCodeServlet.java for more details
 * @param {Object} markerCluster
 */
function addAllMarkers(markerCluster) {
  fetch('/countries').then((response) => response.json())
      .then((countries) => {
        for (const country of countries) {
          if (countriesWithSomeData.includes(country.alpha2Code)) {
            addMarkerToMapGivenCountry(country, markerCluster);
          }
        }
      });
}

/**
 * Adds one marker for the given country
 * See CountryCodeServlet.java for more details
 * @param {Object} country A JSON object {name: String,
 * alpha2Code: String, lng: number, lat: number}
 * @param {Object} markerCluster
 */
function addMarkerToMapGivenCountry(country, markerCluster) {
  addMarkerToMapGivenInfo(country.name, country.alpha2Code,
      country.woeid, country.lat, country.lng, markerCluster);
}

/**
 * Adds one marker given country name, code, average longitude and latitude
 * @param {string} countryName
 * @param {string} countryCode  (ISO 3166-1) Alpha-2 code
  * @param {string} woeidCode  WOEID code
 * @param {number} lat Latitude (average)
 * @param {number} lng Longitude (average)
 * @param {Object} markerCluster
 */
function addMarkerToMapGivenInfo(countryName, countryCode, woeidCode, lat, lng,
    markerCluster) {
  const marker = new google.maps.Marker({
    position: {lat, lng},
    map: map,
    title: countryName,
  });
  marker.countryCode = countryCode;
  marker.woeidCode = woeidCode;
  marker.countryName = countryName;
  markerCluster.addMarker(marker);

  /* For each new marker, listen for a click event; If marker is clicked and
  data is available for this country => fetch posts for the country
  corresponding to that marker and display them. */
  marker.addListener('click', () => {
    /** initialize the section where data will be displayed */
    windowsHandler.initDataWindow();

    /** initialize YouTube and Twitter divs
      (the data will be cached in these divs)*/
    windowsHandler.initDataDivs();

    windowsHandler.openWindow(marker);
  });
}


