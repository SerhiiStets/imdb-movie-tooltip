$().ready(function() {
  $("a").mouseenter(function() {
    $("#tooltip").empty();

    if ($(this).attr('href').indexOf("/title/") !== -1) {

      var movie_name = $(this).text();
      var url = ($(this).attr('href').indexOf("imdb") !== -1) ? $(this).attr('href') : ("http://www.imdb.com" + $(this).attr('href'));

      $.get(url, function(data) {
        var imdb_score = $('[itemprop=ratingValue]', $(data)).text();
        var meta_score = $('.metacriticScore', $(data)).text();
        if (imdb_score == "") {
          imdb_score = "No score"
        };
        show_movie(movie_name, imdb_score, meta_score);
      });

    };

  });

  $("a").mouseleave(function() {
    $("#tooltip").empty();
  });

});

function show_movie(name, imdb, meta) {
  $('body').append($('<div/>', {
    id: 'tooltip'
  }));

  $('#tooltip').append($('<div>' + name + ' </div>', {
    id: 'movie_name'
  }));

  $('#tooltip').append($('<div>' + imdb + ' </div>', {
    id: 'imdb_score'
  }));

  $('#tooltip').append($('<div>' + meta + ' </div>', {
    id: 'meta_score'
  }));
}
