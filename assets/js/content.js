$().ready(function() {
  'use strict';
  getPluginValue(function(value) {
    if (value.plugin == true) {
      addDivs();
      var timeoutId;
      $("a").mouseenter(function() {
        hide();
        if ($(this).attr('href').indexOf("/title/") !== -1) {
          if (!timeoutId) {
            var hov = $(':hover').last();
            timeoutId = window.setTimeout(function() {
              timeoutId = null;
              if (!$(':hover').last().is(hov)) {
                return;
              }
              var movie_name = hov.text();
              var url = (hov.attr('href').indexOf("imdb") !== -1) ? hov.attr('href') : ("http://www.imdb.com" + hov.attr('href'));
              getData(url, movie_name);
            }, 700);
          }
        }
      }).mouseout(function() {
        hide();
      });
    }
  });
});

function getPluginValue(callback) {
  chrome.storage.sync.get("plugin", callback);
}

function getTooltipValue(callback) {
  chrome.storage.sync.get("large_tooltip", callback);
}

function getData(link, name) {
  $.get(link, function(data) {
    var imdb_score = $('[itemprop=ratingValue]', $(data)).text();
    var meta_score = $('.metacriticScore', $(data)).text();
    var year = $('#titleYear', $(data)).text();
    var image_url = "";
    var director_name = $('[itemprop=director]', $(data)).text();
    var actors_names = [];

    $("[itemprop=actors] > [itemprop=url]", $(data)).each(function() {
      actors_names.push($(this).text());
    });

    $('.poster img', $(data)).each(function() {
      image_url = $(this).attr('src');
    });

    if (imdb_score == "") {
      imdb_score = "??";
    }

    if (meta_score == "") {
      meta_score = "??";
    }
    hide();
    showMovie(name, imdb_score, meta_score, year, image_url, director_name, actors_names);
  });
}

function showMovie(name, imdb, meta, year, poster, director, actors) {
  var color = metascoreColor(meta);

  $("#tooltip").css('display', 'block');

  addDivs();

  $('#tooltip').append($('<img/>', {
    id: 'poster',
    src: poster
  }));

  $("#movie_name").append('<p>' + checkMovieName(name) + year + '</p>');

  $('#imdb_score').append(imdb);

  $('#meta_score').append(meta);

  $("#meta_score").css("color", color);
  $("#tooltip").css("border-top-color", color);

  $('#director').append(director);

  $('#actors').append(actorsList(actors));

  getTooltipValue(function(value) {
    if (value.large_tooltip == true) {
      showLargeTooltip();
    } else {
      showSmallTooltip();
    }
  });
}

function showLargeTooltip() {
  var change_val = 300 / 70;
  var height = 400 / change_val;

  // tooltip
  $("#tooltip").css('width', 400);
  $("#tooltip").css('height', height);
  $("#tooltip").css("font-size", 11 + change_val);

  // poster
  $("#poster").css('height', height);

  // movie name
  $("#movie_name").css("left", 80);
  $("#movie_name").css("bottom", 75);
  $("#movie_name").css("width", 208 * change_val);
  $('#movie_name > p:eq(0)').css('font-size', 12 + change_val);

  // director
  $("#director").css("bottom", 65);
  $("#director").css("left", 82);

  // actors
  $("#actors").css("left", 80);

  // line
  $("#line-separator").css("left", 73);
  $("#line-separator").css("width", 337);
  $("#line-separator").css("bottom", 53);

  // imdb score
  $("#imdb_score").css("left", 380);
  $("#imdb_score").css("bottom", 90);

  // meta score
  $("#meta_score").css("left", 382);
  $("#meta_score").css("bottom", 70);

}


function showSmallTooltip() {
  // tooltip
  $("#tooltip").css('width', 300);
  $("#tooltip").css('height', 70);
  $("#tooltip").css("font-size", 11);

  // poster
  $("#poster").css('height', 70);

  // movie name
  $("#movie_name").css("left", 66);
  $("#movie_name").css("bottom", 63);
  $("#movie_name").css("width", 208);
  $('#movie_name > p:eq(0)').css('font-size', 12);

  // director
  $("#director").css("bottom", 56);
  $("#director").css("left", 68);

  // actors
  $("#actors").css("left", 67);

  // line
  $("#line-separator").css("left", 57);
  $("#line-separator").css("width", 253);
  $("#line-separator").css("bottom", 48);

  // imdb score
  $("#imdb_score").css("left", 288);
  $("#imdb_score").css("bottom", 73);

  // meta score
  $("#meta_score").css("left", 290);
  $("#meta_score").css("bottom", 57);
}

function addDivs() {
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
}

function actorsList(names) {
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
    list += "...";
  }
  return list;
}

function checkMovieName(movie) {
  if (movie.indexOf("(20") !== -1 || movie.indexOf("(19") !== -1) {
    movie = movie.substring(0, movie.length - 7);
  }
  if (movie.length > 33) {
    var value = movie.length - 30;
    movie = movie.substring(0, movie.length - value);
    movie += "...";
  }
  return movie;
}

function metascoreColor(score) {
  if (score == "??") {
    return "grey";
  } else if (score < 40) {
    return 'red';
  } else if (score < 61) {
    return 'orange';
  } else {
    return '#007A15';
  }
}

function hide() {
  $('#tooltip').each(function() {
    $('[id="' + this.id + '"]:gt(0)').remove();
  });
  $("#tooltip").empty();
  $("#tooltip").css('display', 'none');
}
