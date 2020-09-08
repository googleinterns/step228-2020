let ytSupportedCountries;
let twitterSupportedCountries;
let countriesWithSomeData;

let windowsHandler;
let map;
let markerCluster;

/* eslint-disable no-unused-vars */
/**
 * Initialise map
 */
async function initMap() {
  /** Fetch countries supported by YouTube and Twitter API */
  twitterSupportedCountries = await
  getSupportedCountries('/twitter-supported-countries');
  ytSupportedCountries = await getSupportedCountries('/yt-supported-countries');

  /** Find which countries are supported by at least one platform */
  countriesWithSomeData = union(ytSupportedCountries,
      twitterSupportedCountries);

  const initPos = new google.maps.LatLng(0, 0);
  map = new google.maps.Map(document.getElementById('map'), {
    center: initPos,
    zoom: 3,
    minZoom: 2,
  });

  windowsHandler = new UniqueWindowHandler(map);

  // Add a marker clusterer to manage the markers.
  markerCluster = new MarkerClusterer(map, [],
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

  /** If used clicks on map, close current window */
  google.maps.event.addListener(map, 'click', function() {
    windowsHandler.currentWindow.close();
  });

  addAllMarkers(markerCluster);
} /* eslint-enable no-unused-vars */

/**
 * Computes the union of two arrays that are
 * passed by refference.
 * @param {Array} arr1Ref
 * @param {Array} arr2Ref
 * @return {Array} result of union
 */
function union(arr1Ref, arr2Ref) {
  /** Arrays are passed by reference so
  copy them to new variables so as not to
  change the initial arrays */
  const arr1 = arr1Ref.slice();
  const arr2 = arr2Ref.slice();

  const res=[]; /** will contain the union */

  for (let i = 0; i < arr1.length; i++) {
    res.push(arr1[i]);
    if (arr2.includes(arr1[i])) {
      /** Remove duplicates - items that are both in
      arr1 and arr2*/
      arr2.splice(arr2.indexOf(arr1[i]), 1);
    }
  }
  /** Add whatever is left in second array */
  return res.concat(arr2);
}

/**
 * Fetches supported countries from specified servlet.
 * @param {String} url url of servlet to fetch from
 * @return {Array} the countries supported by one of the platforms
 */
async function getSupportedCountries(url) {
  const response = await fetch(url);
  const supported = await response.json();
  return supported;
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
  if (!windowsHandler.isInfoWindowOpen() ||
    marker.countryCode != windowsHandler.getCountryCode()) {
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
 * Creates iframe element
 * @param {object} video id of video on Youtube
 * @param {number} id id that will have iframe element
 * @return {HTMLElement}
 */
function createIframeById(video, id) {
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
  const videoList = document.createElement('div');
  videoList.className = 'video-list';

  /** Add title to list of videos to make it clear
    what data is being displayed */
  const ytTitle = document.createElement('h2');
  ytTitle.innerText = 'YouTube videos trending in ' +
    windowsHandler.getCountryName();
  videoList.appendChild(ytTitle);

  for (let i = 0; i < videos.length; i++) {
    videoList.appendChild(createVideoContainer(videos[i], i));
  }
  return videoList;
}

/**
* Creates video container for one video.
* Contains the video (iframe) and a
* metadta section
* @param {object} video id of video on Youtube
* @param {number} id id that will have iframe element
* @return {HTMLElement}
*/
function createVideoContainer(video, id) {
  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-container';

  const iframe = createIframeById(video, id);
  const metadata = createMetadataContainer(video);

  videoContainer.appendChild(iframe);
  videoContainer.appendChild(metadata);
  return videoContainer;
}

/**
* Creates the video metadata section with
* channel name, view and like count
* @param {object} video id of video on Youtube
* @return {HTMLElement}
*/
function createMetadataContainer(video) {
  const metadata = document.createElement('div');
  metadata.className = 'yt-metadata';

  const channelNameDiv = createMetadataField('Channel', video.channelName);
  const viewCountDiv = createMetadataField('Views',
      numberWithCommas(video.viewCount));
  const likeCountDiv = createMetadataField('Likes',
      numberWithCommas(video.likeCount));

  metadata.appendChild(channelNameDiv);
  metadata.appendChild(viewCountDiv); ;
  metadata.appendChild(likeCountDiv);

  return metadata;
}

/**
* Creates a piece of metadata: comprised of a tag
* and the corresponding value
* e.g. channel (tag): good music (value)
* @param {String} tag what metadata is displayed
* @param {object} value value of data displayed
* @return {HTMLElement}
*/
function createMetadataField(tag, value) {
  const metadataField = document.createElement('div');
  metadataField.className = 'yt-metadata-field';

  const tagDiv = document.createElement('p');
  tagDiv.className = 'yt-metadata-tag';
  tagDiv.innerText = tag;

  /** Wrap tag element in another div so that
  if the value takes more rows, the tag itself is not
  enlarged to fill the metadataField container */
  const tagWrap = document.createElement('div');
  tagWrap.className = 'yt-metadata-tag-wrap';
  tagWrap.appendChild(tagDiv);

  const valueDiv = document.createElement('p');
  valueDiv.className = 'yt-metadata-value';
  valueDiv.innerText = value;

  metadataField.appendChild(tagWrap);
  metadataField.appendChild(valueDiv);
  return metadataField;
}

/**
 * Fetches twitter data from TwitterServlet.
 * Caches fetched twitter data for being re-displayed in
 * the current window.
 * @param {Marker} marker
 */
function prepareTwitterPosts(marker) {
  fetch('/twitter?woeid=' + marker.woeidCode).
      then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return 'error';
        }
      }).then((trends) => {
        let content;

        if (trends == 'error') {
          content = document.createElement('h2');
          content.innerText = 'No Twitter data available for this country';
        } else {
          content = getTrends(trends);
        }
        windowsHandler.loadTwitterData(content);
      });
}

/**
  * Creates list of Twitter trends
  * @param {Array} trends list of Twitter trends
  * @return {HTMLElement}
  */
function getTrends(trends) {
  const hashtagContainer = document.createElement('div');
  hashtagContainer.className = 'hashtag-container';
  for (let i = 0; i < trends.length; i++) {
    const currentTrend = createTrendElement(trends[i]);
    hashtagContainer.appendChild(currentTrend);
  }
  return hashtagContainer;
}

/**
* Creates li element with link based on trend
* @param {object} trend Twitter trend
* @return {HTMLElement}
*/
function createTrendElement(trend) {
  const trendName = document.createElement('p');
  trendName.innerText = trend.name;
  trendName.className = 'hashtag';

  const tweetVolume = document.createElement('p');
  tweetVolume.className = 'tweet-volume';
  tweetVolume.innerText = 'Tweets: ' + numberWithCommas(trend.tweetVolume);

  const trendEl = document.createElement('a');
  trendEl.href = trend.url;
  trendEl.target = '_blank'; /** open link in new tab */
  trendEl.className = 'trend-element';
  trendEl.appendChild(trendName);
  if (trend.tweetVolume != -1) {
    /** diplay tweet volume if available */
    trendEl.appendChild(tweetVolume);
  }
  trendEl.addEventListener('click', () => {
    if (windowsHandler.isInfoWindowOpen()) {
      showTweets(trend.query);
    }
  });
  return trendEl;
}
/**
 * @param {string} query
 * Clears the tweets container then
 * Adds the top tweets returned by the query to the tweets container.
 */
function showTweets(query) {
  const tweetContainer = document.getElementById('tweets-container');
  tweetContainer.innerHTML = '';
  fetch('/get-tweets?query='+query).then((response) => response.json())
      .then((tweetIDs) => {
        for (const id of tweetIDs) {
          twttr.widgets.createTweet(id, tweetContainer);
        }
      } );
};

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
    bttnDiv.className = 'toggle-btns';

    /** YouTube button */
    const ytBttn = document.createElement('button');
    ytBttn.textContent = 'YouTube';
    ytBttn.className = 'btn btn-danger';
    bttnDiv.appendChild(ytBttn);

    /** Twitter button */
    const twitterBttn = document.createElement('button');
    twitterBttn.textContent = 'Twitter';
    twitterBttn.className = 'btn btn-info';
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

/**
* Formats numbers with commas
* @param {Number} x
* @return {String} formatted number
*/
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
