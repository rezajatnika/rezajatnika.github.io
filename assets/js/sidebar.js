function detectmob() {
  if (window.innerWidth <= 800 && window.innerHeight <= 600) {
    return true;
  } else {
    return false;
  }
}

if (!detectmob()) {
  $(function() {

    var $sidebar = $("#sidebar"),
      $window = $(window),
      offset = $sidebar.offset(),
      topPadding = 15;

    $window.scroll(function() {
      if ($window.scrollTop() > offset.top) {
        $sidebar.stop().animate({
          marginTop: $window.scrollTop() - offset.top + topPadding
        });
      } else {
        $sidebar.stop().animate({
          marginTop: 0
        });
      }
    });

  });
}
