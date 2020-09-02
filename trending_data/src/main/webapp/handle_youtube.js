
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
