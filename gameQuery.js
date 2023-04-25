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
        $('#captainButton').addClass("lightFire");
        $('.goals-td').addClass("lightFire");
        $('#headGoals').addClass("lightFire");
        $('#statGoals').addClass("lightFire");
        $('#statGoals').html('+30 per');
      }
      if (!playmakerIsSelected) {
        $('#captainButton').addClass("lightFire");
        $('.assists-td').addClass("lightFire");
        $('#headAssists').addClass("lightFire");
        $('#statAssists').addClass("lightFire");
        $('#statAssists').html('+20 per');
      }
    }
  }, function() {
    if (!captainIsSelected) {
      if (!scorerIsSelected) {
        $('#captainButton').removeClass("lightFire");
        $('.goals-td').removeClass("lightFire");
        $('#headGoals').removeClass("lightFire");
        $('#statGoals').removeClass("lightFire");
        $('#statGoals').html('+15 per');
      }
      if (!playmakerIsSelected) {
        $('#captainButton').removeClass("lightFire");
        $('.assists-td').removeClass("lightFire");
        $('#headAssists').removeClass("lightFire");
        $('#statAssists').removeClass("lightFire");
        $('#statAssists').html('+10 per');
      }
    }
  });
});
$(function() {
  $('#captainButton').click(function() {

    if (captainIsSelected) {
      captainIsSelected = false;
      $('#captainButton').removeClass("fire");
      $('.goals-td').removeClass("fire");
      $('#headGoals').removeClass("fire");
      $('#statGoals').removeClass("fire");
      $('#captainButton').addClass("lightFire");
      $('.goals-td').addClass("lightFire");
      $('#headGoals').addClass("lightFire");
      $('#statGoals').addClass("lightFire");
      $('#statGoals').html('+30 per');
      $('.assists-td').removeClass("fire");
      $('#headAssists').removeClass("fire");
      $('#statAssists').removeClass("fire");
      $('.assists-td').addClass("lightFire");
      $('#headAssists').addClass("lightFire");
      $('#statAssists').addClass("lightFire");
      $('#statAssists').html('+20 per');
    } else {
      resetAllSelectedRoles();
      captainIsSelected = true;
      $('#captainButton').addClass("fire");
      $('.goals-td').addClass("fire");
      $('#headGoals').addClass("fire");
      $('#statGoals').addClass("fire");
      $('#statGoals').html('+30 per');
      $('.assists-td').addClass("fire");
      $('#headAssists').addClass("fire");
      $('#statAssists').addClass("fire");
      $('#statAssists').html('+20 per');
    }
  });
});




$(function() {
  $('#scorerButton').hover(function() {
    if (!scorerIsSelected) {
      $('#scorerButton').addClass("lightFire");
      if (!captainIsSelected) {
        $('.goals-td').addClass("lightFire");
        $('#headGoals').addClass("lightFire");
        $('#statGoals').addClass("lightFire");
        $('#statGoals').html('+30 per');
      }
    }
  }, function() {
    if (!scorerIsSelected) {
      $('#scorerButton').removeClass("lightFire");
      if (!captainIsSelected) {
        $('.goals-td').removeClass("lightFire");
        $('#headGoals').removeClass("lightFire");
        $('#statGoals').removeClass("lightFire");
        $('#statGoals').html('+15 per');
      }
    }
  });
});
$(function() {
  $('#scorerButton').click(function() {

    if (scorerIsSelected) {
      scorerIsSelected = false;
      $('#scorerButton').removeClass("fire");
      $('.goals-td').removeClass("fire");
      $('#headGoals').removeClass("fire");
      $('#statGoals').removeClass("fire");
      $('#scorerButton').addClass("lightFire");
      $('.goals-td').addClass("lightFire");
      $('#headGoals').addClass("lightFire");
      $('#statGoals').addClass("lightFire");
      $('#statGoals').html('+30 per');
    } else {
      resetAllSelectedRoles();
      scorerIsSelected = true;
      $('#scorerButton').addClass("fire");
      $('.goals-td').addClass("fire");
      $('#headGoals').addClass("fire");
      $('#statGoals').addClass("fire");
      $('#statGoals').html('+30 per');
    }
  });
});



$(function() {
  $('#playmakerButton').hover(function() {
    if (!playmakerIsSelected) {
      $('#playmakerButton').addClass("lightFire");
      if (!captainIsSelected) {
        $('.assists-td').addClass("lightFire");
        $('#headAssists').addClass("lightFire");
        $('#statAssists').addClass("lightFire");
        $('#statAssists').html('+20 per');
      }
    }
  }, function() {
    if (!playmakerIsSelected) {
      $('#playmakerButton').removeClass("lightFire");
      if (!captainIsSelected) {
        $('.assists-td').removeClass("lightFire");
        $('#headAssists').removeClass("lightFire");
        $('#statAssists').removeClass("lightFire");
        $('#statAssists').html('+10 per');
      }
    }
  });
});
$(function() {
  $('#playmakerButton').click(function() {
    if (playmakerIsSelected) {
      playmakerIsSelected = false;
      $('#playmakerButton').removeClass("fire");
      $('.assists-td').removeClass("fire");
      $('#headAssists').removeClass("fire");
      $('#statAssists').removeClass("fire");
      $('#playmakerButton').addClass("lightFire");
      $('.assists-td').addClass("lightFire");
      $('#headAssists').addClass("lightFire");
      $('#statAssists').addClass("lightFire");
      $('#statAssists').html('+20 per');
    } else {
      resetAllSelectedRoles();
      playmakerIsSelected = true;
      $('#playmakerButton').addClass("fire");
      $('.assists-td').addClass("fire");
      $('#headAssists').addClass("fire");
      $('#statAssists').addClass("fire");
      $('#statAssists').html('+20 per');
    }
  });
});




$(function() {
  $('#shooterButton').hover(function() {
    if (!shooterIsSelected) {
      $('#shooterButton').addClass("lightFire");
      $('.shots-td').addClass("lightFire");
      $('#headShots').addClass("lightFire");
      $('#statShots').addClass("lightFire");
      $('#statShots').html('+3 per');
    }
  }, function() {
    if (!shooterIsSelected) {
      $('#shooterButton').removeClass("lightFire");
      $('.shots-td').removeClass("lightFire");
      $('#headShots').removeClass("lightFire");
      $('#statShots').removeClass("lightFire");
      $('#statShots').html('+1 per');
    }
  });
});
$(function() {
  $('#shooterButton').click(function() {
    if (shooterIsSelected) {
      shooterIsSelected = false;
      $('#shooterButton').removeClass("fire");
      $('.shots-td').removeClass("fire");
      $('#headShots').removeClass("fire");
      $('#statBlocked').removeClass("fire");
      $('#shooterButton').addClass("lightFire");
      $('.shots-td').addClass("lightFire");
      $('#headShots').addClass("lightFire");
      $('#statShots').addClass("lightFire");
      $('#statShots').html('+3 per');
    } else {
      resetAllSelectedRoles();
      shooterIsSelected = true;
      $('#shooterButton').addClass("fire");
      $('.shots-td').addClass("fire");
      $('#headShots').addClass("fire");
      $('#statShots').addClass("fire");
      $('#statShots').html('+3 per');
    }
  });
});




$(function() {
  $('#blockerButton').hover(function() {
    if (!blockerIsSelected) {
      $('#blockerButton').addClass("lightFire");
      $('.blocked-td').addClass("lightFire");
      $('#headBlocked').addClass("lightFire");
      $('#statBlocked').addClass("lightFire");
      $('#statBlocked').html('+4 per');
    }
  }, function() {
    if (!blockerIsSelected) {
      $('#blockerButton').removeClass("lightFire");
      $('.blocked-td').removeClass("lightFire");
      $('#headBlocked').removeClass("lightFire");
      $('#statBlocked').removeClass("lightFire");
      $('#statBlocked').html('+1 per');
    }
  });
});
$(function() {
  $('#blockerButton').click(function() {
    if (blockerIsSelected) {
      blockerIsSelected = false;
      $('#blockerButton').removeClass("fire");
      $('.blocked-td').removeClass("fire");
      $('#headBlocked').removeClass("fire");
      $('#statBlocked').removeClass("fire");
      $('#blockerButton').addClass("lightFire");
      $('.blocked-td').addClass("lightFire");
      $('#headBlocked').addClass("lightFire");
      $('#statBlocked').addClass("lightFire");
      $('#statBlocked').html('+4 per');
    } else {
      resetAllSelectedRoles();
      blockerIsSelected = true;
      $('#blockerButton').addClass("fire");
      $('.blocked-td').addClass("fire");
      $('#headBlocked').addClass("fire");
      $('#statBlocked').addClass("fire");
      $('#statBlocked').html('+4 per');
    }
  });
});




$(function() {
  $('#enforcerButton').hover(function() {
    if (!enforcerIsSelected) {
      $('#enforcerButton').addClass("lightFire");
      $('.hits-td').addClass("lightFire");
      $('#headHits').addClass("lightFire");
      $('#statHits').addClass("lightFire");
      $('#statHits').html('+3 per');
    }
  }, function() {
    if (!enforcerIsSelected) {
      $('#enforcerButton').removeClass("lightFire");
      $('.hits-td').removeClass("lightFire");
      $('#headHits').removeClass("lightFire");
      $('#statHits').removeClass("lightFire");
      $('#statHits').html('+1 per');
    }
  });
});
$(function() {
  $('#enforcerButton').click(function() {
    if (enforcerIsSelected) {
      enforcerIsSelected = false;
      $('#enforcerButton').removeClass("fire");
      $('.hits-td').removeClass("fire");
      $('#headHits').removeClass("fire");
      $('#statHits').removeClass("fire");
      $('#enforcerButton').addClass("lightFire");
      $('.hits-td').addClass("lightFire");
      $('#headHits').addClass("lightFire");
      $('#statHits').addClass("lightFire");
      $('#statHits').html('+3 per');
    } else {
      resetAllSelectedRoles();
      enforcerIsSelected = true;
      $('#enforcerButton').addClass("fire");
      $('.hits-td').addClass("fire");
      $('#headHits').addClass("fire");
      $('#statHits').addClass("fire");
      $('#statHits').html('+3 per');
    }
  });
});




$(function() {
  $('#centerButton').hover(function() {
    if (!centerIsSelected) {
      $('#centerButton').addClass("lightFire");
      $('.faceOffPct-td').addClass("lightFire");
      $('#headFaceOffs').addClass("lightFire");
      $('#statFaceOffs').addClass("lightFire");
      $('#statFaceOffs').html('+2 per win<br>-1 per loss');
    }
  }, function() {
    if (!centerIsSelected) {
      $('#centerButton').removeClass("lightFire");
      $('.faceOffPct-td').removeClass("lightFire");
      $('#headFaceOffs').removeClass("lightFire");
      $('#statFaceOffs').removeClass("lightFire");
      $('#statFaceOffs').html('+1 per win<br>-1 per loss');
    }
  });
});
$(function() {
  $('#centerButton').click(function() {
    if (centerIsSelected) {
      centerIsSelected = false;
      $('#centerButton').removeClass("fire");
      $('.faceOffPct-td').removeClass("fire");
      $('#headFaceOffs').removeClass("fire");
      $('#statFaceOffs').removeClass("fire");
      $('#centerButton').addClass("lightFire");
      $('.faceOffPct-td').addClass("lightFire");
      $('#headFaceOffs').addClass("lightFire");
      $('#statFaceOffs').addClass("lightFire");
      $('#statFaceOffs').html('+2 per win<br>-1 per loss');
    } else {
      resetAllSelectedRoles();
      centerIsSelected = true;
      $('#centerButton').addClass("fire");
      $('.faceOffPct-td').addClass("fire");
      $('#headFaceOffs').addClass("fire");
      $('#statFaceOffs').addClass("fire");
      $('#statFaceOffs').html('+2 per win<br>-1 per loss');
    }
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
  $('#captainButton').removeClass("lightFire");
  $('#scorerButton').removeClass("lightFire");
  $('#playmakerButton').removeClass("lightFire");
  $('#shooterButton').removeClass("lightFire");
  $('#blockerButton').removeClass("lightFire");
  $('#enforcerButton').removeClass("lightFire");
  $('#centerButton').removeClass("lightFire");

  $('#captainButton').removeClass("fire");
  $('#scorerButton').removeClass("fire");
  $('#playmakerButton').removeClass("fire");
  $('#shooterButton').removeClass("fire");
  $('#blockerButton').removeClass("fire");
  $('#enforcerButton').removeClass("fire");
  $('#centerButton').removeClass("fire");

  $('.goals-td').removeClass("lightFire");
  $('#headGoals').removeClass("lightFire");
  $('#statGoals').removeClass("lightFire");
  $('.assists-td').removeClass("lightFire");
  $('#headAssists').removeClass("lightFire");
  $('#statAssists').removeClass("lightFire");
  $('.shots-td').removeClass("lightFire");
  $('#headShots').removeClass("lightFire");
  $('#statShots').removeClass("lightFire");
  $('.blocked-td').removeClass("lightFire");
  $('#headBlocked').removeClass("lightFire");
  $('#statBlocked').removeClass("lightFire");
  $('.hits-td').removeClass("lightFire");
  $('#headHits').removeClass("lightFire");
  $('#statHits').removeClass("lightFire");
  $('.faceOffPct-td').removeClass("lightFire");
  $('#headFaceOffs').removeClass("lightFire");
  $('#statFaceOffs').removeClass("lightFire");
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

  $('#statGoals').html('+15 per');
  $('#statAssists').html('+10 per');
  $('#statShots').html('+1 per');
  $('#statBlocked').html('+1 per');
  $('#statHits').html('+1 per');
  $('#statFaceOffs').html('+1 per win<br>-1 per loss');
}
