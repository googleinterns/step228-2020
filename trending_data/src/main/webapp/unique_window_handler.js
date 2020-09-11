import {prepareYTPosts} from './handle_youtube.js';
import {getYTCategories} from './handle_youtube.js';
import {prepareTwitterPosts} from './handle_twitter.js';
import {windowsHandler} from './init_map.js';

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
  * Adds the buttons to switch between platforms
  * to the popup
  */
  initPopup() {
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
    this.dataWindow.appendChild(this.categoryDropdown);
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

    /** YouTube button */
    this.ytBtn = document.createElement('button');
    this.ytBtn.textContent = 'YouTube';
    this.ytBtn.className = 'btn btn-default yt yt-selected';
    this.btnDiv.appendChild(this.ytBtn);

    /** Twitter button */
    this.twitterBtn = document.createElement('button');
    this.twitterBtn.textContent = 'Twitter';
    this.twitterBtn.className = 'btn btn-default twitter';
    this.btnDiv.appendChild(this.twitterBtn);

    this.addClickListeners();
  }

  /**
  * If a buttons is clicked, the corresponding data is shown.
  * The clicked button is selected and the other one is unselected
  */
  addClickListeners() {
    this.ytBtn.addEventListener('click', () => {
      if (this.showing == 'yt') {
        return;
      }
      this.ytBtn.className = 'btn btn-default yt yt-selected';
      this.twitterBtn.className = 'btn btn-default twitter';
      this.showYTData();
    });

    this.twitterBtn.addEventListener('click', () => {
      if (this.showing == 'twitter') {
        return;
      }
      this.twitterBtn.className = 'btn btn-default twitter twitter-selected';
      this.ytBtn.className = 'btn btn-default yt';
      this.showTwitterData();
    });
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
    this.initDataWindow();
    await this.loadYTData(this.defaultYTCategory);
    await this.loadYTCategories();
    this.loadTwitterData();
    if (this.isInfoWindowOpen()) {
      this.currentWindow.close();
    }
    this.currentWindow = new google.maps.InfoWindow();
    this.dataWindow.appendChild(this.categoryDropdown);
    this.dataWindow.appendChild(this.ytDataDiv);
    this.currentWindow.setContent(this.dataWindow);
    this.currentWindow.open(map, marker);
  }

  async loadYTCategories() {
    this.categoryDropdown = await getYTCategories(this.marker);
    this.categoryDropdown.onchange = function() {
        windowsHandler.fetchYTForCategory();
    };
  }

  async fetchYTForCategory() {
    await this.loadYTData(this.categoryDropdown.value);
    this.showYTData();
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
  async loadYTData(categoryId) {
    this.ytDataDiv = await prepareYTPosts(this.marker, categoryId);
  }
}
