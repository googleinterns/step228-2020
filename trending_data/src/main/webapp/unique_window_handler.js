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
    this.lastCode = 'null';
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
  * Called when YouTube button is clicked. Clears
  * current content of window and shows the most recently
  * cached YouTube data
  */
  showYTData() {
    this.showing = 'yt';
    this.initDataWindow(); // clear current content and re-add buttons
    this.dataWindow.appendChild(this.ytDataDiv);
    this.currentWindow.setContent(this.dataWindow);
  }

  /**
  * Called when Twitter button is clicked. Clears
  * current content of window and shows the most recently
  * cached Twitter data
  */
  showTwitterData() {
    this.showing = 'twitter';
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
    /** When open window, youtube data will be shown hence
    youtube button has to be selected */
    ytBttn.className = 'btn btn-default yt yt-selected';
    bttnDiv.appendChild(ytBttn);

    /** Twitter button */
    const twitterBttn = document.createElement('button');
    twitterBttn.textContent = 'Twitter';
    twitterBttn.className = 'btn btn-default twitter';
    bttnDiv.appendChild(twitterBttn);

    if (this.showing == 'twitter') {
      /** if showing Twitter make Twitter
      button selected and unselect YouTube */
      twitterBttn.className += ' twitter-selected';
      ytBttn.className = 'btn btn-default yt';
    }

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
  * Checks if user clicked on the same marker
  * @return {boolean}
  */
  clickOnSameMarker() {
    return this.isInfoWindowOpen() &&
     this.marker.countryCode == this.lastCode;
  }

  /**
  * Loads the current YouTube data and opens a window
  * which contains it
  * @param {Marker} marker
  */
  async openWindow(marker) {
    this.marker = marker;
    if (this.clickOnSameMarker()) {
      return;
    }
    this.lastCode = this.marker.countryCode;
    this.showing = 'yt';
    this.initDataWindow();
    const ytContent = await this.loadYTData();
    this.loadTwitterData();
    if (this.isInfoWindowOpen()) {
      this.currentWindow.close();
    }
    this.currentWindow = new google.maps.InfoWindow();
    this.dataWindow.appendChild(ytContent);
    this.currentWindow.setContent(this.dataWindow);
    this.currentWindow.open(map, marker);
  }

  /**
  * Loads the current Twitter data
  */
  async loadTwitterData() {
    this.twitterDataDiv = await prepareTwitterPosts(this.marker);
  }

  /**
  * Loads the current Youtube data
  */
  async loadYTData() {
    this.ytDataDiv = await prepareYTPosts(this.marker);
    return this.ytDataDiv;
  }
}
