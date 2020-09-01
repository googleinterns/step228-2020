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
  windowsHandler.initDataWindow();

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

    /** cache YouTube posts and open popup which contains them */
    prepareYTPosts(marker);

    /** cache Twitter posts (they will be displayed when
      Twitter button is pressed) */
    prepareTwitterPosts(marker);
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
 * Caches the data for being re-displayed in the current window.
 * @param {Marker} marker
 */
function prepareYTPosts(marker) {
  if (!windowsHandler.isInfoWindowOpen() || marker.countryCode != windowsHandler.getCountryCode()) {
    windowsHandler.update(marker);
    
    if (!isCountrySupportedbyYT(marker.countryCode)) {
      const ytErr = document.createElement('h2');
      ytErr.innerText = 'Region not supported by YouTube';

      windowsHandler.loadYTDataAndOpenWindow(marker, ytErr);
    } else { // if country is supported, fetch data
      fetch('/GetTrendingYTVideos?country-code=' + marker.countryCode).
          then((response) => response.json()).then((videos) => {
            let vidNode;
            const ytErr = document.createElement('h2');

            if (videos.length == 0) {
              ytErr.innerText = 'No YouTube videos available for this country';
              windowsHandler.loadYTDataAndOpenWindow(marker, ytErr);
            } else {
              vidNode = getVideosNode(videos);
              windowsHandler.loadYTDataAndOpenWindow(marker, vidNode);
            }
          });
    }
  }
}

/**
 * Fetches twitter data from TwitterServlet.
 * Caches fetched twitter data for being re-displayed in
 * the current window.
 * @param {Marker} marker
 */
function prepareTwitterPosts(marker) {
  /** Fetch data from servlet here */
    woeidCode = marker.woeidCode;
    console.log(woeidCode);
    fetch('/twitter?woeid=' + woeidCode).
      then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return 'error';
          }
      }).then((topics) => {
        var content;
        
        if (topics == 'error') {
          content = document.createElement('h2');
          content.innerText = "No Twitter data available for this country";
        } else {
          content = getTopics(topics);
        }
        windowsHandler.loadTwitterData(content);
      });
}

  /**
  * Creates DOM node element with videos
  * @param {Array} videos list that was fetched from servlet
  * @return {HTMLElement}
  */
  function getTopics(topics) {
    const ul = document.createElement('ul');
    for (let i = 0; i < topics.length; i++) {
        const currentTopic = createTrendElement(topics[i]);
        ul.appendChild(currentTopic);
    }
    return ul;
  }

  function createTrendElement(topic) {
      const topicEl = document.createElement('li');
      const link =document.createElement('a');
      link.href = topic.url;
      link.innerText = topic.name;
      link.target='_blank';
      topicEl.appendChild(link);
      return topicEl;
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
*  Class to keep only one open info window and
* deal with displaying data. Saves data so that
* it does not need to be re-fetched so long as
* the window is open
*/
class UniqueWindowHandler {
  /**
  * @param {Map} map
  */
  contructor(map) {
    this.currentWindow = null;
    this.map = map;
    this.marker = marker;
    this.countryCode = null;
    this.countryName = null;
  }

  /**
  * Initializes the divs where YouTube and Twitter data
  * will be cached.
  */
  initDataDivs() {
    this.ytDataDiv = document.createElement('div');
    this.twitterDataDiv = document.createElement('div');
  }

  /**
  * DataWindow contains a button container with the 2
  * buttons (YouTube, Twitter) and the content corresponding
  * to each platform. This method initializes the DataWindow
  * with the button container.
  */
  initDataWindow() {
    this.dataWindow = document.createElement('div');
    this.dataWindow.className = 'popup';
    this.dataWindow.appendChild(this.createBttnDiv());
  }

  /**
  * Called when Twitter button is clicked. Clears
  * current content of window and shows the most recently
  * cached Twitter data
  */
  showYTData() {
    this.initDataWindow(); // clear current content and re-add buttons
    this.dataWindow.appendChild(this.ytDataDiv);
    this.currentWindow.setContent(this.dataWindow);
  }

  /**
  * Called when YouTube button is clicked. Clears
  * current content of window and shows the most recently
  * cached YouTube data
  */
  showTwitterData() {
    this.initDataWindow();
    this.dataWindow.appendChild(this.twitterDataDiv);
    this.currentWindow.setContent(this.dataWindow);
  }

  /**
  * Creates a container with 2 buttons, one for Twitter
  * and one for YouTube and adds them to the top of the
  * window where data will be displayed
  * @return {HTMLElement} bttnDiv
  */
  createBttnDiv() {
    const bttnDiv = document.createElement('div');

    /** YouTube button */
    const ytBttn = document.createElement('button');
    ytBttn.textContent = 'YouTube';
    bttnDiv.appendChild(ytBttn);

    /** Twitter button */
    const twitterBttn = document.createElement('button');
    twitterBttn.textContent = 'Twitter';
    bttnDiv.appendChild(twitterBttn);

    /** Toggle platforms. If YouTube button is clicked ->
      show YouTube data. If Twitter button is clicked ->
      show Twitter data */
    ytBttn.addEventListener('click', () => {
      this.showYTData();
    });

    twitterBttn.addEventListener('click', () => {
      this.showTwitterData();
    });

    return bttnDiv;
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
  * Loads the current YouTube data and opens a window
  * which contains it
  * @param {Marker} marker
  * @param {HTMLElement} content
  */
  loadYTDataAndOpenWindow(marker, content) {
    this.ytDataDiv = content; /** save the current yt data */
    if (this.isInfoWindowOpen()) {
      this.currentWindow.close();
    }
    this.currentWindow = new google.maps.InfoWindow();
    this.dataWindow.appendChild(content);
    this.currentWindow.setContent(this.dataWindow);
    this.currentWindow.open(map, marker);
  }

  /**
  * Loads the current Twitter data
  * @param {HTMLElement} content
  */
  loadTwitterData(content) {
    this.twitterDataDiv = content;
  }

  /**
  * Update the country code and name
  * that correspond to the currently open window
  * @param {Marker} marker
  */
  update(marker) {
    this.marker = marker;
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
