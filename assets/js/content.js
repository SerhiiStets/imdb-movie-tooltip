$().ready(function() {

  add_divs();
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
        var director_name = $('[itemprop=director]', $(data)).text();
        var actors_names = [];

        $("[itemprop=actors] > [itemprop=url]", $(data)).each(function() {
          actors_names.push($(this).text());
        });

        $('.poster img', $(data)).each(function() {
          image_url = $(this).attr('src')
        });

        if (imdb_score == "") {
          imdb_score = "??"
        };

        if (meta_score == "") {
          meta_score = "??"
        }
        hide();
        show_movie(movie_name, imdb_score, meta_score, year, image_url, director_name, actors_names);
      });
    };
  }).mouseout(function() {
    hide();
  });

});

function show_movie(name, imdb, meta, year, poster, director, actors) {
  $("#tooltip").css('display', 'block');

  add_divs();

  $('#tooltip').append($('<img/>', {
    id: 'poster',
    src: poster
  }));

  $("#movie_name").append('<p>' + name + year + '</p>')

  $('#imdb_score').append(imdb);

  $('#meta_score').append(meta);

  $("#meta_score").css("color", metascore_color(meta));

  $('#director').append(director);

  $('#actors').append(actors_list(actors))

};

function add_divs() {
  $('body').append($('<div/>', {
    id: 'tooltip'
  }));

  $('#tooltip').append($('<div/>', {
    id: 'line-separator'
  }));


  $('#tooltip').append($('<div/>', {
    id: 'movie_name'
  }));

  $('#tooltip').append($('<div/>', {
    id: 'imdb_score'
  }));

  $('#tooltip').append($('<div/>', {
    id: 'meta_score'
  }));

  $('#tooltip').append($('<div/>', {
    id: 'director'
  }));

  $('#tooltip').append($('<div/>', {
    id: 'actors'
  }));
};

function actors_list(names) {
  var list = "";
  names.forEach(function(name, i, array) {
    if (i !== array.length - 1) {
      list += (name + ", ");
    } else {
      list += (name);
    }
  });

  if (list.length > 43) {
    var value = list.length - 42;
    list = list.substring(0, list.length - value);
    list += "..."
  }
  return list;

};

function metascore_color(score) {
  if (score == "??") {
    return "grey"
  } else if (score < 40) {
    return 'red'
  } else if (score < 61) {
    return 'orange'
  } else {
    return 'green'
  };
};

function hide() {
  $('#tooltip').each(function() {
    $('[id="' + this.id + '"]:gt(0)').remove();
  });
  $("#tooltip").empty();
  $("#tooltip").css('display', 'none');

};
