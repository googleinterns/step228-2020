import {prepareYTPosts} from './handle_youtube.js';
import {getYTCategories} from './handle_youtube.js';
import {prepareTwitterPosts} from './handle_twitter.js';
import {standard, darkerStandard} from './map_styles.js';
import {isCountrySupportedbyYT} from './handle_youtube.js';
import {isCountrySupportedbyTwitter} from './handle_twitter.js';

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
  constructor(map) {
    this.currentWindow = null;
    this.map = map;
    this.lastCode = 'null';
  }

  /**
  * Adds the buttons to switch between platforms
  * to the popup
  * @param {Marker} marker
  */
  initPopup(marker) {
    this.marker = marker;
    this.showing = 'yt';
    this.defaultYTCategory = '0';
    this.initBtnDiv();
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
    this.dataWindow.appendChild(this.btnDiv);
  }

  /**
  * Called when YouTube button is clicked. Clears
  * current content of window and shows the most recently
  * cached YouTube data
  */
  showYTData() {
    this.showing = 'yt';
    this.initDataWindow(); // clear current content
    this.dataWindow.appendChild(this.dropdownDiv);
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
  */
  initBtnDiv() {
    this.btnDiv = document.createElement('div');
    this.btnDiv.className = 'toggle-btns';

    this.ytBtn = document.createElement('button');
    this.ytBtn.textContent = 'YouTube';

    this.twitterBtn = document.createElement('button');
    this.twitterBtn.textContent = 'Twitter';

    if (isCountrySupportedbyYT(this.marker.countryCode) &&
      isCountrySupportedbyTwitter(this.marker.countryCode)) {
      this.ytBtn.className = 'btn btn-default yt yt-selected';
      this.twitterBtn.className = 'btn btn-default twitter';
    } else if (!isCountrySupportedbyYT(this.marker.countryCode)) {
      this.ytBtn.className = 'btn btn-default disabled';
      this.ytBtn.title = 'Country not supported by YouTube';
      this.twitterBtn.className = 'btn btn-default twitter twitter-selected';
    } else if (!isCountrySupportedbyTwitter(this.marker.countryCode)) {
      this.twitterBtn.className = 'btn btn-default disabled';
      this.twitterBtn.title = 'Country not supported by Twitter';
      this.ytBtn.className = 'btn btn-default yt yt-selected';
    }

    this.btnDiv.appendChild(this.ytBtn);
    this.btnDiv.appendChild(this.twitterBtn);

    this.addClickListeners();
  }

  /**
  * If a buttons is clicked, the corresponding data is shown.
  * The clicked button is selected and the other one is unselected
  */
  addClickListeners() {
    if (isCountrySupportedbyYT(this.marker.countryCode)) {
      this.ytBtn.addEventListener('click', () => {
        if (this.showing == 'yt') {
          return;
        }
        this.ytBtn.className = 'btn btn-default yt yt-selected';
        this.twitterBtn.className = 'btn btn-default twitter';
        this.showYTData();
      });
    }

    if (isCountrySupportedbyTwitter(this.marker.countryCode)) {
      this.twitterBtn.addEventListener('click', () => {
        if (this.showing == 'twitter') {
          return;
        }
        this.twitterBtn.className = 'btn btn-default twitter twitter-selected';
        this.ytBtn.className = 'btn btn-default yt';
        this.showTwitterData();
      });
    }
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
    if (this.clickOnSameMarker()) {
      return;
    }
    this.lastCode = this.marker.countryCode;
    this.initDataWindow();
    // execute data fetches in parallel
    await Promise.all([this.loadYTCategories(),
      this.loadYTData(this.defaultYTCategory),
      this.loadTwitterData()]);
    if (this.isInfoWindowOpen()) {
      this.currentWindow.close();
    }
    this.currentWindow = new google.maps.InfoWindow();
    if (isCountrySupportedbyYT(this.marker.countryCode)) {
      this.dataWindow.appendChild(this.dropdownDiv);
      this.dataWindow.appendChild(this.ytDataDiv);
    } else {
      this.dataWindow.appendChild(this.twitterDataDiv);
    }
    this.currentWindow.setContent(this.dataWindow);
    this.currentWindow.open(map, marker);
    this.makeMapDarker();
    this.currentWindow.addListener('closeclick',
        this.makeMapLighter.bind(this));
  }

  /**
  * Makes map lighter
  */
  makeMapLighter() {
    this.map.setOptions({styles: standard});
    if (this.map.freeze_when_popup_is_open) {
      this.map.set('zoomControl', true);
      this.map.set('gestureHandling', 'auto');
    }
  }

  /**
  * Makes map darker
  */
  makeMapDarker() {
    this.map.setOptions({styles: darkerStandard});
    if (this.map.freeze_when_popup_is_open) {
      this.map.set('zoomControl', false);
      this.map.set('gestureHandling', 'none');
    }
  }


  /**
  * Calls method that fetches YouTube categories
  * according to the country code and populates the
  * category dropdown. If user selects a category
  * the videos for that category are fetched.
  */
  async loadYTCategories() {
    this.dropdownDiv = await getYTCategories(this.marker);
    this.dropdownDiv.onchange = this.fetchYTForCategory.bind(this);
  }

  /**
  * Calls method that fetches YouTube categories
  * using the category id selected by the user
  * in the dropdown
  */
  async fetchYTForCategory() {
    await this.loadYTData(this.dropdownDiv.value);
    this.showYTData();
  }

  /**
  * Loads the current Twitter data
  */
  async loadTwitterData() {
    this.twitterDataDiv = await prepareTwitterPosts(this.marker);
  }

  /**
  * Loads the current Youtube data for given category id
  * @param {string} categoryId
  */
  async loadYTData(categoryId) {
    this.ytDataDiv = await prepareYTPosts(this.marker, categoryId);
  }
}
