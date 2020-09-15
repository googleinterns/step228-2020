import {ytSupportedCountries} from './get_supported_countries.js';

/**
 * Displays in a popup trending posts based on the country code of marker
 * and a category id. Sends country code to servlet which then sends
 * back trending data based on that country code.
 * Caches the data for being re-displayed in the current window.
 * @param {Marker} marker
 * @param {string} categoryId
 */
export async function prepareYTPosts(marker, categoryId) {
  if (!isCountrySupportedbyYT(marker.countryCode)) {
    const ytErr = document.createElement('h2');
    ytErr.innerText = 'Region not supported by YouTube';
    return ytErr;
  } else { // if country is supported, fetch data
    const videos = await fetch('/GetTrendingYTVideos?country-code=' +
                          marker.countryCode + '&category-id=' + categoryId).
        then((response) => response.json());
    if (videos.length == 0) {
      const ytErr = document.createElement('h2');
      ytErr.innerText = 'No videos available for selected category';
      return ytErr;
    } else {
      return getVideosNode(videos, marker.countryName);
    }
  }
}

/**
 * Fetches YouTube categories based on country code and
 * puts them in dropdown. If country is not supported
 * by YouTube then returns an empty div.
 * @param {Marker} marker
 * @return {HTMLElement}
 */
export async function getYTCategories(marker) {
  if (!isCountrySupportedbyYT(marker.countryCode)) {
    return document.createElement('div'); // empty div
  } else {
    const categories = await fetch('/yt-categories?country-code=' +
                        marker.countryCode).
        then((response) => response.json());
    return createDropdown(categories);
  }
}

/**
 * Creates dropdown of YouTube categories
 * @param {array} categories
 * @return {HTMLElement} categoryDropdown
 */
function createDropdown(categories) {
  const dropdownMenu = document.createElement('select');
  dropdownMenu.className = 'form-control';

  for (let i = 0; i < categories.length; i++) {
    const option = document.createElement('option');
    option.value = categories[i].id;
    option.innerText = categories[i].name;
    dropdownMenu.appendChild(option);
  }
  return dropdownMenu;
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
    const currentContainer = createVideoContainer(videos[i], i);
    div.appendChild(currentContainer);
  }
  return div;
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
* Formats numbers with commas
* @param {Number} x
* @return {String} formatted number
*/
function numberWithCommas(x) {
  if (typeof x == 'number') {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return '';
  }
}
