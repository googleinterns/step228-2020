
let map;

/* eslint-disable no-unused-vars */
/**

 * Initialise map
 */
function initMap() {
  const initPos = new google.maps.LatLng(-34.397, 150.644);
  map = new google.maps.Map(document.getElementById('map'), {
    center: initPos,
    zoom: 8,
  });

  const infoString =
    '<h2>This is a hardcoded tweet</h2>' +
    '<p>@twitter_person says: Super popular #tweet :o</p>';

  const infoWindow = new google.maps.InfoWindow({
    content: infoString,
    maxWidth: 200,
  });

  // TODO: remove this marker after we're done
  const marker = new google.maps.Marker({
    position: initPos,
    map,
    title: 'Trending Tweet',
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
  addAllMarkers(map);
}
/**
 * Adds one marker for each country to the map
 * See CountryCodeServlet.java for more details
 * @param {Object} map
 */
function addAllMarkers(map) {
  fetch('/countries').then((response) => response.json())
      .then((countries) => {
        for (const country of countries) {
          addMarkerToMapGivenCountry(country, map);
        }
      });
}
/**
 * Adds one marker for the given country
 * See CountryCodeServlet.java for more details
 * @param {Object} country A JSON object {name: String,
 * alpha2Code: String, lng: number, lat: number}
 * @param {Object} map
 */
function addMarkerToMapGivenCountry(country, map) {
  addMarkerToMapGivenInfo(country.name, country.alpha2Code,
      country.lat, country.lng, map);
}
/**
 * Adds one marker given country name, code, average longitude and latitude
 * @param {string} countryName
 * @param {string} countryCode  (ISO 3166-1) Alpha-2 code
 * @param {number} lat Latitude (average)
 * @param {number} lng Longitude (average)
 * @param {Object} map
 */
function addMarkerToMapGivenInfo(countryName, countryCode, lat, lng, map) {
  const marker = new google.maps.Marker({
    position: {lat, lng},
    map: map,
    title: countryName,
  });
  marker.countryCode = countryCode;

  marker.addListener('click', () => {
    fetch('/ListYTLinks?country-code=' + marker.countryCode).then((response) =>
      response.json()).then((videos) => {
        const ytLinks = jsonToHtml(videos);

        const infoWindow = new google.maps.InfoWindow({
          content: ytLinks,
          maxWidth: 200,
        }); // infoWindow
      infoWindow.open(map, marker);
    });
  }); // clickListener
}

function jsonToHtml(videos) {
  var listHTML = '<ul>';
  videos.forEach((video) => {
    listHTML += '<li>';
    listHTML += '<a href=\"'
    listHTML += video.link;
    listHTML += '\">Link</a>';
    listHTML += '</li>';
  });
  listHTML += '</ul>';
  console.log(listHTML);
  return listHTML;
}
/* eslint-enable no-unused-vars */


