/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
///////////////////////////////////////////////////////////////////////////////////
// Helper Function
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

///////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
  // Load existing tweets into main pages
  const loadTweets = function () {
    $.ajax(
      {
        url: '/tweets',
        method: 'GET',
        dataType: 'json',
        success: (tweets) => {
          renderTweets(tweets)
        },
        error: (err) => { alert(`there was an error: ${err}`) }
      }
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////

  // New Tweet Submission using AJAX with jQuery
  const $form = $("#new-tweet-form");
  $form.submit(function (event) {
    event.preventDefault();
    const serializedData = $(this).serialize();
    console.log(serializedData);
    // Validation before sending the form data to the server
    if (serializedData.length <= 5) alert('Content Should Not Be Cleared.');
    else if (serializedData.length > 145) alert('Exceed Max Length. Please Edit Again.');
    else {
      $.post('/tweets', serializedData, (response) => {
        loadTweets();
      });
    }
  });
  ///////////////////////////////////////////////////////////////////////////////////

  //  Tweet components to be created dynamically
  const createTweetElement = function (tweetData) {
    let $tweet = //template strings for a tweet
      `<section class="tweet">
      <form method="POST" action="/tweets/">
        <header>
          <i class="icon fas fa-user"></i>
          <span class="username">${escape(tweetData.user.name)}</span>
          <span class="email">${escape(tweetData.user.handle)}</span>
        </header>
        <article>
          <p class="content">${escape(tweetData.content.text)}</p>
        </article>
        <footer>
          <p>${timeago.format(tweetData.created_at)}</p>
          <div class="icons">
            <i class="fas fa-flag fa-xs"></i>
            <i class="fas fa-retweet fa-xs"></i>
            <i class="fas fa-heart fa-xs"></i>
          </div>
        </footer>
      </form>
    </section>`;
    return $tweet;
  };

  ///////////////////////////////////////////////////////////////////////////////////

  // Taking in an array of tweet objects and then 
  // appending each one to the #tweets - container
  const renderTweets = function (tweets) {
    // Clear out tweet container
    const tweetContainer = $('#tweets-container');
    tweetContainer.empty();

    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      tweetContainer.prepend($tweet);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////

}); // document ready ends here