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
        $('#captainButton').addClass("fire");
        $('.goals-td').addClass("fire");
        $('#headGoals').addClass("fire");
        $('#statGoals').addClass("fire");
        $('#statGoals').html('+30 per');
      }
      if (!playmakerIsSelected) {
        $('#captainButton').addClass("fire");
        $('.assists-td').addClass("fire");
        $('#headAssists').addClass("fire");
        $('#statAssists').addClass("fire");
        $('#statAssists').html('+20 per');
      }
    }
  }, function() {
    if (!captainIsSelected) {
      if (!scorerIsSelected) {
        $('#captainButton').removeClass("fire");
        $('.goals-td').removeClass("fire");
        $('#headGoals').removeClass("fire");
        $('#statGoals').removeClass("fire");
        $('#statGoals').html('+15 per');
      }
      if (!playmakerIsSelected) {
        $('#captainButton').removeClass("fire");
        $('.assists-td').removeClass("fire");
        $('#headAssists').removeClass("fire");
        $('#statAssists').removeClass("fire");
        $('#statAssists').html('+10 per');
      }
    }
  });
});
$(function() {
  $('#captainButton').click(function() {
    resetAllSelectedRoles();
    captainIsSelected = true;
    $('#captainButton').addClass("darkFire");
    $('.goals-td').addClass("darkFire");
    $('#headGoals').addClass("darkFire");
    $('#statGoals').addClass("darkFire");
    $('#statGoals').html('+30 per');
    $('.assists-td').addClass("darkFire");
    $('#headAssists').addClass("darkFire");
    $('#statAssists').addClass("darkFire");
    $('#statAssists').html('+20 per');
  });
});




$(function() {
  $('#scorerButton').hover(function() {
    if (!scorerIsSelected) {
      $('#scorerButton').addClass("fire");
      if (!captainIsSelected) {
        $('.goals-td').addClass("fire");
        $('#headGoals').addClass("fire");
        $('#statGoals').addClass("fire");
        $('#statGoals').html('+30 per');
      }
    }
  }, function() {
    if (!scorerIsSelected) {
      $('#scorerButton').removeClass("fire");
      if (!captainIsSelected) {
        $('.goals-td').removeClass("fire");
        $('#headGoals').removeClass("fire");
        $('#statGoals').removeClass("fire");
        $('#statGoals').html('+15 per');
      }
    }
  });
});
$(function() {
  $('#scorerButton').click(function() {
    resetAllSelectedRoles();
    scorerIsSelected = true;
    $('#scorerButton').addClass("darkFire");
    $('.goals-td').addClass("darkFire");
    $('#headGoals').addClass("darkFire");
    $('#statGoals').addClass("darkFire");
    $('#statGoals').html('+30 per');
  });
});



$(function() {
  $('#playmakerButton').hover(function() {
    if (!playmakerIsSelected) {
      $('#playmakerButton').addClass("fire");
      if (!captainIsSelected) {
        $('.assists-td').addClass("fire");
        $('#headAssists').addClass("fire");
        $('#statAssists').addClass("fire");
        $('#statAssists').html('+20 per');
      }
    }
  }, function() {
    if (!playmakerIsSelected) {
      $('#playmakerButton').removeClass("fire");
      if (!captainIsSelected) {
        $('.assists-td').removeClass("fire");
        $('#headAssists').removeClass("fire");
        $('#statAssists').removeClass("fire");
        $('#statAssists').html('+10 per');
      }
    }
  });
});
$(function() {
  $('#playmakerButton').click(function() {
    resetAllSelectedRoles();
    playmakerIsSelected = true;
    $('#playmakerButton').addClass("darkFire");
    $('.assists-td').addClass("darkFire");
    $('#headAssists').addClass("darkFire");
    $('#statAssists').addClass("darkFire");
    $('#statAssists').html('+20 per');
  });
});




$(function() {
  $('#shooterButton').hover(function() {
    $('#shooterButton').addClass("fire");
    if (!shooterIsSelected) {
      $('.shots-td').addClass("fire");
      $('#headShots').addClass("fire");
      $('#statShots').addClass("fire");
      $('#statShots').html('+3 per');
    }
  }, function() {
    if (!shooterIsSelected) {
      $('#shooterButton').removeClass("fire");
      $('.shots-td').removeClass("fire");
      $('#headShots').removeClass("fire");
      $('#statShots').removeClass("fire");
      $('#statShots').html('+1 per');
    }
  });
});
$(function() {
  $('#shooterButton').click(function() {
    resetAllSelectedRoles();
    shooterIsSelected = true;
    $('#shooterButton').addClass("darkFire");
    $('.shots-td').addClass("darkFire");
    $('#headShots').addClass("darkFire");
    $('#statShots').addClass("darkFire");
    $('#statShots').html('+3 per');
  });
});




$(function() {
  $('#blockerButton').hover(function() {
    if (!blockerIsSelected) {
      $('#blockerButton').addClass("fire");
      $('.blocked-td').addClass("fire");
      $('#headBlocked').addClass("fire");
      $('#statBlocked').addClass("fire");
      $('#statBlocked').html('+4 per');
    }
  }, function() {
    if (!blockerIsSelected) {
      $('#blockerButton').removeClass("fire");
      $('.blocked-td').removeClass("fire");
      $('#headBlocked').removeClass("fire");
      $('#statBlocked').removeClass("fire");
      $('#statBlocked').html('+1 per');
    }
  });
});
$(function() {
  $('#blockerButton').click(function() {
    resetAllSelectedRoles();
    blockerIsSelected = true;
    $('#blockerButton').addClass("darkFire");
    $('.blocked-td').addClass("darkFire");
    $('#headBlocked').addClass("darkFire");
    $('#statBlocked').addClass("darkFire");
    $('#statBlocked').html('+4 per');
  });
});




$(function() {
  $('#enforcerButton').hover(function() {
    if (!enforcerIsSelected) {
      $('#enforcerButton').addClass("fire");
      $('.hits-td').addClass("fire");
      $('#headHits').addClass("fire");
      $('#statHits').addClass("fire");
      $('#statHits').html('+3 per');
    }
  }, function() {
    if (!enforcerIsSelected) {
      $('#enforcerButton').removeClass("fire");
      $('.hits-td').removeClass("fire");
      $('#headHits').removeClass("fire");
      $('#statHits').removeClass("fire");
      $('#statHits').html('+1 per');
    }
  });
});
$(function() {
  $('#enforcerButton').click(function() {
    resetAllSelectedRoles();
    enforcerIsSelected = true;
    $('#enforcerButton').addClass("darkFire");
    $('.hits-td').addClass("darkFire");
    $('#headHits').addClass("darkFire");
    $('#statHits').addClass("darkFire");
    $('#statHits').html('+3 per');
  });
});




$(function() {
  $('#centerButton').hover(function() {
    if (!centerIsSelected) {
      $('#centerButton').addClass("fire");
      $('.faceOffPct-td').addClass("fire");
      $('#headFaceOffs').addClass("fire");
      $('#statFaceOffs').addClass("fire");
      $('#statFaceOffs').html('+2 per win<br>-1 per loss');
    }
  }, function() {
    if (!centerIsSelected) {
      $('#centerButton').removeClass("fire");
      $('.faceOffPct-td').removeClass("fire");
      $('#headFaceOffs').removeClass("fire");
      $('#statFaceOffs').removeClass("fire");
      $('#statFaceOffs').html('+1 per win<br>-1 per loss');
    }
  });
});
$(function() {
  $('#centerButton').click(function() {
    resetAllSelectedRoles();
    centerIsSelected = true;
    $('#centerButton').addClass("darkFire");
    $('.faceOffPct-td').addClass("darkFire");
    $('#headFaceOffs').addClass("darkFire");
    $('#statFaceOffs').addClass("darkFire");
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
  $('#captainButton').removeClass("fire");
  $('#scorerButton').removeClass("fire");
  $('#playmakerButton').removeClass("fire");
  $('#shooterButton').removeClass("fire");
  $('#blockerButton').removeClass("fire");
  $('#enforcerButton').removeClass("fire");
  $('#centerButton').removeClass("fire");

  $('#captainButton').removeClass("darkFire");
  $('#scorerButton').removeClass("darkFire");
  $('#playmakerButton').removeClass("darkFire");
  $('#shooterButton').removeClass("darkFire");
  $('#blockerButton').removeClass("darkFire");
  $('#enforcerButton').removeClass("darkFire");
  $('#centerButton').removeClass("darkFire");

  $('.goals-td').removeClass("fire");
  $('#headGoals').removeClass("fire");
  $('#statGoals').removeClass("fire");
  $('.assists-td').removeClass("fire");
  $('#headAssists').removeClass("fire");
  $('#statAssists').removeClass("fire");
  $('.shots-td').removeClass("fire");
  $('#headShots').removeClass("fire");
  $('#statShots').removeClass("fire");
  $('.blocked-td').removeClass("fire");
  $('#headBlocked').removeClass("fire");
  $('#statBlocked').removeClass("fire");
  $('.hits-td').removeClass("fire");
  $('#headHits').removeClass("fire");
  $('#statHits').removeClass("fire");
  $('.faceOffPct-td').removeClass("fire");
  $('#headFaceOffs').removeClass("fire");
  $('#statFaceOffs').removeClass("fire");
  $('.goals-td').removeClass("darkFire");
  $('#headGoals').removeClass("darkFire");
  $('#statGoals').removeClass("darkFire");
  $('.assists-td').removeClass("darkFire");
  $('#headAssists').removeClass("darkFire");
  $('#statAssists').removeClass("darkFire");
  $('.shots-td').removeClass("darkFire");
  $('#headShots').removeClass("darkFire");
  $('#statShots').removeClass("darkFire");
  $('.blocked-td').removeClass("darkFire");
  $('#headBlocked').removeClass("darkFire");
  $('#statBlocked').removeClass("darkFire");
  $('.hits-td').removeClass("darkFire");
  $('#headHits').removeClass("darkFire");
  $('#statHits').removeClass("darkFire");
  $('.faceOffPct-td').removeClass("darkFire");
  $('#headFaceOffs').removeClass("darkFire");
  $('#statFaceOffs').removeClass("darkFire");

  $('#statGoals').html('+15 per');
  $('#statAssists').html('+10 per');
  $('#statShots').html('+1 per');
  $('#statBlocked').html('+1 per');
  $('#statHits').html('+1 per');
  $('#statFaceOffs').html('+1 per win<br>-1 per loss');
}
