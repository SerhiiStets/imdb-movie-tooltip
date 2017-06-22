$().ready(function() {

  $('body').append($('<div/>', {
    id: 'tooltip'
  }));

  $("a").mouseenter(function() {
    hide();

    if ($(this).attr('href').indexOf("/title/") !== -1) {

      var movie_name = $(this).text();
      var url = ($(this).attr('href').indexOf("imdb") !== -1) ? $(this).attr('href') : ("http://www.imdb.com" + $(this).attr('href'));

      $.get(url, function(data) {
        var imdb_score = $('[itemprop=ratingValue]', $(data)).text();
        var meta_score = $('.metacriticScore', $(data)).text();
        var year = $('#titleYear', $(data)).text();
        var image_url = ""
        $('.poster img', $(data)).each(function() {
          image_url = $(this).attr('src')
        });
        if (imdb_score == "") {
          imdb_score = "??"
        };
        if (meta_score == "") {
          meta_score = "??"
        }
        show_movie(movie_name, imdb_score, meta_score, year, image_url);
      });
    };
  });

  $("a").mouseleave(function() {
    hide();
  });

});


function show_movie(name, imdb, meta, year, poster) {
  $("#tooltip").css('display', 'block');

  $('#tooltip').append($('<img/>', {
    id: 'poster',
    src: poster
  }));

  $('#tooltip').append($('<div/>', {
    id: 'movie_name'
  }));

  $("#movie_name").append('<p>' + name + year + '</p>')

  $('#tooltip').append($('<div/>', {
    id: 'imdb_score'
  }));

  $('#imdb_score').append(imdb);

  $('#tooltip').append($('<div/>', {
    id: 'meta_score'
  }));

  $('#meta_score').append(meta);

}

function hide() {
  $("#tooltip").empty();
  $("#tooltip").css('display', 'none');
}
