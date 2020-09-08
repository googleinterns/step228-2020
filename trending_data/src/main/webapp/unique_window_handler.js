import {prepareYTPosts} from './handle_youtube.js';
import {prepareTwitterPosts} from './handle_twitter.js';

/**
*  Class to keep only one open info window and
* deal with displaying data. Saves data so that
* it does not need to be re-fetched so long as
* the window is open
*/
export class UniqueWindowHandler {
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
  * Checks if the current window is open
  * @param {Marker} marker
  * @return {boolean}
  */
  isClickOnDifferentWindow(marker) {
    return (!this.isInfoWindowOpen() ||
      marker.countryCode != this.getCountryCode());
  }

  /**
  * Loads the current YouTube data and opens a window
  * which contains it
  * @param {Marker} marker
  * @param {HTMLElement} content
  */
  async openWindow(marker) {
    const YTcontent = await this.loadYTData(marker);
    this.loadTwitterData(marker);
    if (this.isInfoWindowOpen()) {
      this.currentWindow.close();
    }
    this.currentWindow = new google.maps.InfoWindow();
    this.dataWindow.appendChild(YTcontent);
    this.currentWindow.setContent(this.dataWindow);
    this.currentWindow.open(map, marker);
  }

  /**
  * Loads the current Twitter data
  * @param {Marker} marker
  */
  async loadTwitterData(marker) {
    if (this.isClickOnDifferentWindow()) {
      this.twitterDataDiv = await prepareTwitterPosts(marker);
    }
    return this.twitterDataDiv;
  }

  /**
  * Loads the current Youtube data
  * @param {Marker} marker
  */
  async loadYTData(marker) {
    if (this.isClickOnDifferentWindow(marker)) {
      this.update(marker);
      this.ytDataDiv = await prepareYTPosts(marker).then();
    }
    return this.ytDataDiv;
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
