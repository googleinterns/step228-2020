/**
 * Fetches twitter data from TwitterServlet.
 * Caches fetched twitter data for being re-displayed in
 * the current window.
 * @param {Marker} marker
 */
export async function prepareTwitterPosts(marker) {
  const trends = await fetch('/twitter?woeid=' + marker.woeidCode).
      then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return 'error';
        }
      });
  let content;
  if (trends == 'error') {
    content = document.createElement('h2');
    content.innerText = 'No Twitter data available for this country';
  } else {
    content = getTrends(trends);
  }
  return content;
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
  tweetVolume.innerText = 'Tweets: ' + trend.tweetVolume;

  const trendEl = document.createElement('p');
  trendEl.className = 'trend-element';
  trendEl.appendChild(trendName);

  if (trend.tweetVolume != -1) {
    // diplay tweet volume if available
    trendEl.appendChild(tweetVolume);
  }
  trendEl.addEventListener('click', () => {
    showTweets(trend.query, trend.url);
  });
  return trendEl;
}

/**
 * Clears the tweets container then
 * Adds the top tweets returned by the query to the tweets container.
 * @param {string} query
 * @param {string} url The url that searches the query in twitter.
 */
function showTweets(query, url) {
  const tweetContainer = document.getElementById('tweets-container');
  const closeButton = createTwitterCloseButton();
  const openInTwitterLink = createOpenInTwitterLink(url);
  tweetContainer.innerHTML = '';
  tweetContainer.style.width = '500px';
  tweetContainer.appendChild(closeButton);
  tweetContainer.append(openInTwitterLink);

  // fetch the IDs of the top tweets then put them in the tweetContainer
  fetch('/get-tweets?query='+query).then((response) => response.json())
      .then((tweetIDs) => {
        for (const id of tweetIDs) {
          twttr.widgets.createTweet(id, tweetContainer);
        }
      } );
};

/**
 * returns a button that closes the tweets container
 * @return {HTMLButtonElement}
 */
function createTwitterCloseButton() {
  const closeButton = document.createElement('button');
  closeButton.className = 'btn btn-default';
  closeButton.textContent = 'Close';
  closeButton.addEventListener('click', () => {
    const tweetContainer = document.getElementById('tweets-container');
    tweetContainer.innerHTML = '';
    tweetContainer.style.width = '0px';
  });
  return closeButton;
}
/**
 * returns a button that redirects the user to the url in a new tab
 * @param {string} url The url that searches the hashtag/topic
 * @return {HTMLElement}
 */
function createOpenInTwitterLink(url) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';// open link in new tab
  link.id = 'open-in-twitter';
  link.innerText = 'Open in twitter';
  return link;
}
