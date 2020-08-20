
let map;
let windowsHandler;

/* eslint-disable no-unused-vars */
/**
 * Initialise map
 */
function initMap() {
  const initPos = new google.maps.LatLng(0, 0);
  map = new google.maps.Map(document.getElementById('map'), {
    center: initPos,
    zoom: 3,
    minZoom: 2,
  });
  windowsHandler = new UniqueWindowHandler(map);
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

  /* For each new marker, listen for a click event; If marker is clicked =>
  fetch posts for the country corresponding to that marker and display them */
  marker.addListener('click', () => {
    displayPosts(marker);
  });
}
/* eslint-enable no-unused-vars */

/**
 * Displays in a popup trending posts based on the country code of marker.
 * Sends country code to servlet which then sends back trending
 * data based on that country code.
 * @param {Marker} marker
 */
function displayPosts(marker) {
  fetch('/GetTrendingYTVideos?country-code=' + marker.countryCode)
      .then((response) =>
        response.json()).then((videos) => {
        const vidNode = getVideosNode(videos);
        windowsHandler.openwindow(marker, vidNode);
      });
}

/**
 * Creates iframe element
 * @param {String} videoId id of video on Youtube
 * @param {number} id id that will have iframe element
 * @return {HTMLElement}
 */
function createIframeById(videoId, id) {
  const video = document.createElement('iframe');
  video.height = '150';
  video.width = '200';
  video.id = id;
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
    const currentVideo = createIframeById(videos[i]['id'], i);
    div.appendChild(currentVideo);
  }
  return div;
}

/**
*  Class to keep only one open info window
*/
class UniqueWindowHandler {
  /**
  * @param {Map} map
  */
  contructor(map) {
    this.currentWindow = null;
    this.map = map;
  }

  /**
  * Checks if the current window is open
  * @return {boolean}
  */
  isInfoWindowOpen() {
    if (this.currentWindow == null) {
      return false;
    } else {
      const map = this.currentWindow.getMap();
      return (map !== null && typeof map !== 'undefined');
    }
  }

  /**
  * Creates a new current window
  * @param {Marker} marker
  * @param {HTMLElement} content
  */
  openwindow(marker, content) {
    if (this.isInfoWindowOpen()) {
      this.currentWindow.close();
    }
    this.currentWindow = new google.maps.InfoWindow();
    this.currentWindow.setContent(content);
    this.currentWindow.open(map, marker);
  }
}
