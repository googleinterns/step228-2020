let showTweets;
window.addEventListener('load', function() {
  const tweetContainer = document.getElementById('tweets-container');
  function addTweet(id) {
    twttr.widgets.createTweet(id, tweetContainer,{conversation : 'none'});
  }

  showTweets = function(query) {
    fetch('/get-tweets?query='+query).then((response) => response.json())
        .then((tweetIDs) => {
          for (const id of tweetIDs) {
            addTweet(id);
          }
        } );
  };
});

