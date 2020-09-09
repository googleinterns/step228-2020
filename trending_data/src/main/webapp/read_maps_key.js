import {initMap} from './init_map.js';
window.initMap = initMap;
const file = new XMLHttpRequest();
file.open('GET', 'key.txt', false);

file.onreadystatechange = function() {
  if (file.readyState === 4) {
    if (file.status === 200 || file.status == 0) {
      const $key = file.responseText;

      const mapsAPIScript = 'https://maps.googleapis.com/maps/api/js?key=' + $key + '&callback=window.initMap&libraries=&v=weekly';

      const mapScriptTag = document.createElement('script');
      mapScriptTag.src = mapsAPIScript;
      mapScriptTag.type = 'text/javascript';

      document.head.appendChild(mapScriptTag);
    }
  }
};
file.send(null);
