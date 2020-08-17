
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
      const VidNode = getVideosNode(videos);
      const infoWindow = new google.maps.InfoWindow(); // infoWindow
      infoWindow.setContent(VidNode);
      infoWindow.open(map, marker);
    });
  }); // clickListener
}

/* eslint-enable no-unused-vars */

/**
 * Creates iframe element
 * @param {String} videoId id of video on Youtube
 * @param {number} id id that will have iframe element
 * @param {boolean} hidden flag if iframe will be hidden
 * @return {HTMLElement}
 */
function createIframeById(videoId, id, hidden) {
  const video = document.createElement('iframe');
  video.height = '150';
  video.width = '200';
  video.id = id;
  video.hidden = hidden;
  video.src = 'https://www.youtube.com/embed/' + videoId + '';
  return video;
}

/**
 * Creates DOM node element with videos
 * @param {Array} videos list that was fetched from servlet
 * @return {HTMLElement}
 */
function getVideosNode(videos) {
  const div = document.createElement('div');
  for (let i = 0; i < videos.length; i++) {
    const currentVideo = createIframeById(videos[i]['id'], i, false);
    div.appendChild(currentVideo);
  }
  return div;
}
