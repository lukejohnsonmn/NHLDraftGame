var captainIsSelected = false;
var scorerIsSelected = false;
var playmakerIsSelected = false;
var shooterIsSelected = false;
var blockerIsSelected = false;
var enforcerIsSelected = false;
var centerIsSelected = false;

$(function() {
  $('#captainButton').hover(function() {
    if (!captainIsSelected) {
      if (!scorerIsSelected) {
        $('.goals-td').css('background-color', 'rgba(255, 204, 51, .2)');
        $('#headGoals').css('background-color', 'rgba(255, 204, 51, .2)');
        $('#statGoals').css('background-color', 'rgba(255, 204, 51, .2)');
        $('#statGoals').html('+30 per');
      }
      if (!playmakerIsSelected) {
        $('.assists-td').css('background-color', 'rgba(255, 204, 51, .2)');
        $('#headAssists').css('background-color', 'rgba(255, 204, 51, .2)');
        $('#statAssists').css('background-color', 'rgba(255, 204, 51, .2)');
        $('#statAssists').html('+20 per');
      }

    }
  }, function() {
    if (!captainIsSelected) {
      // on mouseout, reset the background colour
      if (!scorerIsSelected) {
        $('.goals-td').css('background-color', '');
        $('#headGoals').css('background-color', '');
        $('#statGoals').css('background-color', '');
        $('#statGoals').html('+15 per');
      }
      if (!playmakerIsSelected) {
        $('.assists-td').css('background-color', '');
        $('#headAssists').css('background-color', '');
        $('#statAssists').css('background-color', '');
        $('#statAssists').html('+10 per');
      }
    }
  });
});

$(function() {
  $('#scorerButton').hover(function() {
    if (!scorerIsSelected && !captainIsSelected) {
      $('.goals-td').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#headGoals').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statGoals').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statGoals').html('+30 per');
    }
  }, function() {
    if (!scorerIsSelected && !captainIsSelected) {
      // on mouseout, reset the background colour
      $('.goals-td').css('background-color', '');
      $('#headGoals').css('background-color', '');
      $('#statGoals').css('background-color', '');
      $('#statGoals').html('+15 per');
    }
  });
});

$(function() {
  $('#playmakerButton').hover(function() {
    if (!playmakerIsSelected && !captainIsSelected) {
      $('.assists-td').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#headAssists').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statAssists').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statAssists').html('+20 per');
    }
  }, function() {
    if (!playmakerIsSelected && !captainIsSelected) {
      // on mouseout, reset the background colour
      $('.assists-td').css('background-color', '');
      $('#headAssists').css('background-color', '');
      $('#statAssists').css('background-color', '');
      $('#statAssists').html('+10 per');
    }
  });
});

$(function() {
  $('#shooterButton').hover(function() {
    if (!shooterIsSelected) {
      $('.shots-td').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#headShots').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statShots').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statShots').html('+3 per');
    }
  }, function() {
    if (!shooterIsSelected) {
      // on mouseout, reset the background colour
      $('.shots-td').css('background-color', '');
      $('#headShots').css('background-color', '');
      $('#statShots').css('background-color', '');
      $('#statShots').html('+1 per');
    }
  });
});

$(function() {
  $('#blockerButton').hover(function() {
    if (!blockerIsSelected) {
      $('.blocked-td').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#headBlocked').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statBlocked').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statBlocked').html('+4 per');
    }
  }, function() {
    if (!blockerIsSelected) {
      // on mouseout, reset the background colour
      $('.blocked-td').css('background-color', '');
      $('#headBlocked').css('background-color', '');
      $('#statBlocked').css('background-color', '');
      $('#statBlocked').html('+1 per');
    }
  });
});

$(function() {
  $('#enforcerButton').hover(function() {
    if (!enforcerIsSelected) {
      $('.hits-td').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#headHits').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statHits').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statHits').html('+3 per');
    }
  }, function() {
    if (!enforcerIsSelected) {
      // on mouseout, reset the background colour
      $('.hits-td').css('background-color', '');
      $('#headHits').css('background-color', '');
      $('#statHits').css('background-color', '');
      $('#statHits').html('+1 per');
    }
  });
});


$(function() {
  $('#centerButton').hover(function() {
    if (!centerIsSelected) {
      $('.faceOffPct-td').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#headFaceOffs').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statFaceOffs').css('background-color', 'rgba(255, 204, 51, .2)');
      $('#statFaceOffs').html('+2 per win<br>-1 per loss');
    }
  }, function() {
    if (!centerIsSelected) {
      // on mouseout, reset the background colour
      $('.faceOffPct-td').css('background-color', '');
      $('#headFaceOffs').css('background-color', '');
      $('#statFaceOffs').css('background-color', '');
      $('#statFaceOffs').html('+1 per win<br>-1 per loss');
    }
  });
});













$(function() {
  $('#captainButton').click(function() {
    resetAllSelectedRoles();
    captainIsSelected = true;
    $('.goals-td').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#headGoals').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statGoals').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statGoals').html('+30 per');
    $('.assists-td').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#headAssists').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statAssists').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statAssists').html('+20 per');
  });
});

$(function() {
  $('#scorerButton').click(function() {
    resetAllSelectedRoles();
    scorerIsSelected = true;
    $('.goals-td').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#headGoals').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statGoals').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statGoals').html('+30 per');
  });
});

$(function() {
  $('#playmakerButton').click(function() {
    resetAllSelectedRoles();
    playmakerIsSelected = true;
    $('.assists-td').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#headAssists').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statAssists').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statAssists').html('+20 per');
  });
});

$(function() {
  $('#shooterButton').click(function() {
    resetAllSelectedRoles();
    shooterIsSelected = true;
    $('.shots-td').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#headShots').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statShots').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statShots').html('+3 per');
  });
});

$(function() {
  $('#blockerButton').click(function() {
    resetAllSelectedRoles();
    blockerIsSelected = true;
    $('.blocked-td').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#headBlocked').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statBlocked').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statBlocked').html('+4 per');
  });
});

$(function() {
  $('#enforcerButton').click(function() {
    resetAllSelectedRoles();
    enforcerIsSelected = true;
    $('.hits-td').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#headHits').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statHits').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statHits').html('+3 per');
  });
});



$(function() {
  $('#centerButton').click(function() {
    resetAllSelectedRoles();
    centerIsSelected = true;
    $('.faceOffPct-td').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#headFaceOffs').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statFaceOffs').css('background-color', 'rgba(255, 204, 51, .4)');
    $('#statFaceOffs').html('+2 per win<br>-1 per loss');
  });
});


function resetAllSelectedRoles() {
  captainIsSelected = false;
  scorerIsSelected = false;
  playmakerIsSelected = false;
  shooterIsSelected = false;
  blockerIsSelected = false;
  enforcerIsSelected = false;
  centerIsSelected = false;
  $('.goals-td').css('background-color', '');
  $('#headGoals').css('background-color', '');
  $('#statGoals').css('background-color', '');
  $('#statGoals').html('+15 per');
  $('.assists-td').css('background-color', '');
  $('#headAssists').css('background-color', '');
  $('#statAssists').css('background-color', '');
  $('#statAssists').html('+10 per');
  $('.shots-td').css('background-color', '');
  $('#headShots').css('background-color', '');
  $('#statShots').css('background-color', '');
  $('#statShots').html('+1 per');
  $('.blocked-td').css('background-color', '');
  $('#headBlocked').css('background-color', '');
  $('#statBlocked').css('background-color', '');
  $('#statBlocked').html('+1 per');
  $('.hits-td').css('background-color', '');
  $('#headHits').css('background-color', '');
  $('#statHits').css('background-color', '');
  $('#statHits').html('+1 per');
  $('.faceOffPct-td').css('background-color', '');
  $('#headFaceOffs').css('background-color', '');
  $('#statFaceOffs').css('background-color', '');
  $('#statFaceOffs').html('+1 per win<br>-1 per loss');
}




$(function() {
  $('#p0').hover(function() {
    $('#p0').css('background-color', 'rgba(255, 204, 51, .2)');
  }, function() {
    $('#p0').css('background-color', '');
  });
});



/*
var p0IsSelected = false;
$(function() {
  $('#p0').hover(function() {
    console.log('Yo');
    if (!p0IsSelected) {
      $('#p0').css('background-color', 'rgba(255, 204, 51, .2)');
    }
  }, function() {
    if (!p0IsSelected) {
      $('#p0').css('background-color', '');
    }
  });
});

$(function() {
  $('#p0').click(function() {
    console.log('Yo');
    resetAllSelectedPlayers();
    p0IsSelected = true;
    $('#p0').css('background-color', 'rgba(255, 204, 51, .4)');
  });
});


function resetAllSelectedPlayers() {
  p0IsSelected = false;
  $('#p0').css('background-color', '');
}
*/
