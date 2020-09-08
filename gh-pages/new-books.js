$(document).ready(function() {
  $.getJSON("new-books.json", function(data) {
    var slides = [];
    $.each(data, function(i, book) {
      if (book["cover-url"] != "") {
        var slide = `
        <a class="card" target="_top" href="` + book["onesearch-url"] + `" title="` + book["title"] + `">
          <img src="` + book["cover-url"] + `" alt="` + book["title"] + `" class="card-img">
        </a>
        `
      }
      /*
      else {
        var slide = `
        <a class="card" href="` + book["onesearch-url"] + `">
        <div class="card-body text-center p-3">
          <h1 class="card-title text-dark">
            ` + book["title"] + `
          </h1>
          <h2 class="card-subtitle text-muted">
            ` + book["author"]  + `
          </h2>
        </div>
        </a>
        `
      }
      */
      slides.push(slide);
    });
    $(".owl-carousel").append(slides);
    var owl = $('.owl-carousel');
    owl.owlCarousel({
      margin: 30,
      loop: false,
      autoWidth: true,
      items: 10,
      nav: false,
      dots: false,
      responsive: {
        0: {
          slideBy: 1
        },
        420: {
          slideBy: 2
        },
        570: {
          slideBy: 3
        },
        725: {
          slideBy: 4
        },
        880: {
          slideBy: 5
        },
        1035: {
          slideBy: 6
        },
        1190: {
          slideBy: 7
        },
        1345: {
          slideBy: 8
        },
        1500: {
          slideBy: 9
        },
      }
    });
    owl.on('changed.owl.carousel', function(event) {
      var minimum = event.relatedTarget.minimum(),
        maximum = event.relatedTarget.maximum(),
        current = event.relatedTarget.current();
      if (current <= minimum) {
        $('#previous').prop('disabled', true);
      } else {
        $('#previous').prop('disabled', false);
      }
      if (current >= maximum) {
        $('#next').prop('disabled', true);
      } else {
        $('#next').prop('disabled', false);
      }
    });
    // Go to the next item
    $('#next').click(function() {
      owl.trigger('next.owl.carousel');
    });
    // Go to the previous item
    $('#previous').click(function() {
      // With optional speed parameter
      // Parameters has to be in square bracket '[]'
      owl.trigger('prev.owl.carousel');
    });
  });
});