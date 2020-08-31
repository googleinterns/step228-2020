/** Array of country codes supported by YouTube API */
let ytSupportedCountries;
let windowsHandler;

let map;

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

  getYTSupportedCountries();
  windowsHandler = new UniqueWindowHandler(map);

  // Add a marker clusterer to manage the markers.
  const markerCluster = new MarkerClusterer(map, [],
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  addAllMarkers(markerCluster);
} /* eslint-enable no-unused-vars */

/**
 * Fetch country codes that are supported by the
 * YouTube API and store them in the global array:
 * ytSupportedCountries
 */
function getYTSupportedCountries() {
  fetch('yt-supported-countries').then((response) =>
    response.json()).then((supported) => {
    ytSupportedCountries = supported;
  });
}

/**
 * Adds one marker for each country to the markerCluster
 * See CountryCodeServlet.java for more details
 * @param {Object} markerCluster
 */
function addAllMarkers(markerCluster) {
  fetch('/countries').then((response) => response.json())
      .then((countries) => {
        for (const country of countries) {
          addMarkerToMapGivenCountry(country, markerCluster);
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
      country.lat, country.lng, markerCluster);
}

/**
 * Adds one marker given country name, code, average longitude and latitude
 * @param {string} countryName
 * @param {string} countryCode  (ISO 3166-1) Alpha-2 code
 * @param {number} lat Latitude (average)
 * @param {number} lng Longitude (average)
 * @param {Object} markerCluster
 */
function addMarkerToMapGivenInfo(countryName, countryCode, lat, lng,
    markerCluster) {
  const marker = new google.maps.Marker({
    position: {lat, lng},
    map: map,
    title: countryName,
  });
  marker.countryCode = countryCode;
  marker.countryName = countryName;
  markerCluster.addMarker(marker);

  /* For each new marker, listen for a click event; If marker is clicked and
  data is available for this country => fetch posts for the country
  corresponding to that marker and display them. */
  marker.addListener('click', () => {
    displayPosts(marker);
  });
}

/**
 * Returns true if the country code belongs to a country that
 * is supported by the YouTube API.
 * @param {String} countryCode alpha-2 code
 * @return {Boolean} true if countryCode is amongst supported countries
 * false otherwise
 */
function isCountrySupportedbyYT(countryCode) {
  return ytSupportedCountries.includes(countryCode);
}

/**
 * Displays in a popup trending posts based on the country code of marker.
 * Sends country code to servlet which then sends back trending
 * data based on that country code.
 * @param {Marker} marker
 */
function displayPosts(marker) {
  if (marker.countryCode != windowsHandler.getCountryCode()) {
    windowsHandler.update(marker);

    if (!isCountrySupportedbyYT(marker.countryCode)) {
      const ytErr = document.createElement('h2');
      ytErr.innerText = marker.countryName + ' is not supported by YouTube';

      windowsHandler.openwindow(marker, ytErr);
    } else { // if country is supported, fetch data
      fetch('/GetTrendingYTVideos?country-code=' + marker.countryCode).
          then((response) => response.json()).then((videos) => {
            let vidNode;
            const ytErr = document.createElement('h2');

            if (videos.length == 0) {
              ytErr.innerText = 'No YouTube videos available for ' +
                marker.countryName;
              windowsHandler.openwindow(marker, ytErr);
            } else {
              vidNode = getVideosNode(videos);
              windowsHandler.openwindow(marker, vidNode);
            }
          });
    }
  }
}

/**
 * Creates iframe element
 * @param {object} video id of video on Youtube
 * @param {number} id id that will have iframe element
 * @return {HTMLElement}
 */
function createIframeById(video, id) {
  console.log(typeof(video));
  const videoEl = document.createElement('iframe');
  videoEl.id = id;
  videoEl.src = video.embeddedLink;
  return videoEl;
}

/**
 * Creates DOM node element with videos
 * @param {Array} videos list that was fetched from servlet
 * @return {HTMLElement}
 */
function getVideosNode(videos) {
  const div = document.createElement('div');
  div.className = 'video-list';

  /** Add title to list of videos to make it clear
    what data is being displayed */
  const ytTitle = document.createElement('h2');
  ytTitle.innerText = 'YouTube videos trending in ' +
    windowsHandler.getCountryName();
  div.appendChild(ytTitle);

  for (let i = 0; i < videos.length; i++) {
    const currentVideo = createIframeById(videos[i], i);
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
    this.countryCode = null;
    this.countryName = null;
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

  /**
  * Update the country code and name
  * that correspond to the currently open window
  * @param {Marker} marker
  */
  update(marker) {
    this.countryCode = marker.countryCode;
    this.countryName = marker.countryName;
  }

  /**
  * Returns current country code
  * @return {String}
  */
  getCountryCode() {
    return this.countryCode;
  }

  /**
  * Returns current country name
  * @return {String}
  */
  getCountryName() {
    return this.countryName;
  }
}
