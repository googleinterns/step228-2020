export let windowsHandler;
let map;
let countriesWithSomeData;

import {UniqueWindowHandler} from './unique_window_handler.js';
import {getSupportedCountries} from './get_supported_countries.js';
import {standard, darkerStandard} from './map_styles.js';

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
    styles: standard,
  });

  // will map be frozen when popup is open
  map.freeze_when_popup_is_open = false;

  countriesWithSomeData = await getSupportedCountries();
  windowsHandler = new UniqueWindowHandler(map);

  // Add a marker clusterer to manage the markers.
  const markerCluster = new MarkerClusterer(map, [],
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  addAllMarkers(markerCluster);
  google.maps.event.addListener(map, 'click', function() {
    windowsHandler.currentWindow.close();});
    /*map.setOptions({styles: standard});
    if (map.freeze_when_popup_is_open) {
      map.set('zoomControl', true);
      map.set('gestureHandling', 'auto');
    }
  });*/
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

  marker.addListener('click', () => {
    map.setCenter({lat: lat, lng: lng});
    /*map.setOptions({styles: darkerStandard});
    if (map.freeze_when_popup_is_open) {
      map.set('zoomControl', false);
      map.set('gestureHandling', 'none');
    }*/

    windowsHandler.initPopup();
    windowsHandler.openWindow(marker);
  });
}
