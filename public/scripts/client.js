/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {

  // Validate tweet content
  const validate = function (data, element) {
    $("#error").remove();
    const $error = $(`<p id="error"><i class="fa fa-warning"></i></p>`);
    if (!data || !data.length) {
      const msg = `Content Must Not be Cleared<i class="fa fa-warning"></i>`;
      $error.append(msg);
      element.prepend($error).hide().slideDown(800);
      return false;
    } else if (data.length > 140) {
      const msg = 'Exceed Max Length. Please Edit Again<i class="fa fa-warning"></i>';
      $error.append(msg);
      element.prepend($error).hide().slideDown(800);
      return false;
    }
    return true;
  };


  //  Tweet components to be created dynamically
  const createTweetElement = function (tweetData) {
    const name = escape(tweetData.user.name);
    const handle = escape(tweetData.user.handle);
    const avatars = escape(tweetData.user.avatars);
    const content = escape(tweetData.content.text);
    const date = timeago.format(tweetData.created_at);

    let $tweet = //template strings for a tweet
      `<section class="tweet">
      <form method="POST" action="/tweets/">
        <header>
          <img src="${avatars}">
          <span class="name">${name}</span>
          <span class="handle">${handle}</span>
        </header>
        <article>
          <p class="content">${content}</p>
        </article>
        <footer>
          <p>${date}</p>
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


  // Taking in an array of tweet objects and then
  // appending each one to the #tweets - container
  const renderTweets = function (tweets) {
    const tweetContainer = $('#tweets-container');
    tweetContainer.empty(); // Clear out tweet container

    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      tweetContainer.prepend($tweet); // list tweets by reverse-chronological order
    }
  };


  // Load existing tweets into main pages
  const loadTweets = function () {
    $.ajax(
      {
        url: '/tweets',
        method: 'GET',
        dataType: 'json',
        success: (tweets) => {
          renderTweets(tweets);
        },
        error: (err) => {
          alert(`there was an error: ${err}`);
        }
      }
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////

  // Initilization
  loadTweets();


  // Make the posting new tweet form slide up or down
  // when the double arrow button pressed
  $("#toggole-compose").click(function () {
    const $newTweet = $(".new-tweet");
    if ($newTweet.is(":visible")) {
      $newTweet.slideUp();
    } else {
      $newTweet.slideDown();
      // Force focus on text input
      $('#tweet-text').focus();
    }
  });


  // Make the page scroll to the top
  // Button fades in when at top of the page
  $(window).bind("scroll", function () {
    if ($(this).scrollTop() > 50) {
      $("#scrollToTop").fadeIn(400);
    } else {
      $('#scrollToTop').fadeOut(400);
    }
  });
  $("#scrollToTop").click(function () {
    $('html, body').animate({ scrollTop: '0px' }, 500);
  });


  // New Tweet Submission using AJAX with jQuery
  const $form = $("#new-tweet-form");
  $form.submit(function (event) {
    event.preventDefault();

    // Call for validation
    const text = $('#tweet-text').val();
    if (validate(text, $('.tweet-text'))) {
      // Call for serializing data
      const serializedData = $(this).serialize();
      // Clear out Tweet textarea and Reset Character Counter
      $('#tweet-text').val('');
      $('#text-counter').text(140);
      // Call for reload tweets data
      $.post('/tweets', serializedData, () => {
        loadTweets();
      });
    }
  });

}); // document ready ends here
///////////////////////////////////////////////////////////////////////////////////

// Helper Function
// XSS Escaping
const escape = function (str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};