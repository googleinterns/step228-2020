/**
 * Displays in a popup trending posts based on the country code of marker.
 * Sends country code to servlet which then sends back trending
 * data based on that country code.
 * Caches the data for being re-displayed in the current window.
 * @param {Marker} marker
 */
export async function prepareYTPosts(marker) {
  if (!isCountrySupportedbyYT(marker.countryCode)) {
    const ytErr = document.createElement('h2');
    ytErr.innerText = 'Region not supported by YouTube';

    return ytErr;
  } else { // if country is supported, fetch data
    const videos = await fetch('/GetTrendingYTVideos?country-code=' +
                          marker.countryCode).
        then((response) => response.json());
    console.log('HERE: ' + videos);
    const ytErr = document.createElement('h2');
    if (videos.length == 0) {
      ytErr.innerText = 'No YouTube videos available for this country';
      return ytErr;
    } else {
      const content = getVideosNode(videos, marker.countryName);
      return content;
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
 * @param {String} countryName
 * @return {HTMLElement}
 */
function getVideosNode(videos, countryName) {
  const div = document.createElement('div');
  div.className = 'video-list';

  /** Add title to list of videos to make it clear
    what data is being displayed */
  const ytTitle = document.createElement('h2');
  ytTitle.innerText = 'YouTube videos trending in ' +
    countryName;
  div.appendChild(ytTitle);

  for (let i = 0; i < videos.length; i++) {
    const currentVideo = createIframeById(videos[i], i);
    div.appendChild(currentVideo);
  }
  return div;
}

let ytSupportedCountries;
getYTSupportedCountries();

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
 * Returns true if the country code belongs to a country that
 * is supported by the YouTube API.
 * @param {String} countryCode alpha-2 code
 * @return {Boolean} true if countryCode is amongst supported countries
 * false otherwise
 */
function isCountrySupportedbyYT(countryCode) {
  return ytSupportedCountries.includes(countryCode);
}
