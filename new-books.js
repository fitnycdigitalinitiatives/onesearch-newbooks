$(document).ready(function() {
  $.getJSON( "new-books.json", function(data) {
    var slides = [];
    $.each(data, function(i, book) {
      if (book["cover-url"] != "") {
        var slide = `
        <a class="card" href="` + book["onesearch-url"] + `">
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
      margin:30,
      loop:true,
      autoWidth:true,
      items:10,
      nav: false,
      dots: false
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
