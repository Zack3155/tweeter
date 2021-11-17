$(document).ready(function () {

  $('#tweet-text').on("input paste", function () {
    // Related data
    const MAX = 140;
    let curr = $(this).val().length;
    let rem = MAX - curr;
    let counter = $(this).parentsUntil(".new-tweet").find(".tweet-counter");

    // Display remaining number of charrcters can type
    counter.text(rem);
    // If exceed the limit, the number turns to red
    if (rem < 0) counter.addClass('char-exceed');
    else counter.removeClass('char-exceed');
  });

}); // document ready
