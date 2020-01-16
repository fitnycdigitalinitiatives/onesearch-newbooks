$(document).ready(function() {
  $.getJSON( "new-books.json", function(data) {
    var slides = [];
    $.each(data, function(i, book) {
      if (book["cover-url"] != "") {
        var slide = `
        <div class="card">
          <img src="` + book["cover-url"] + `" alt="` + book["title"] + `">
        </div>
        `
      }
      slides.push(slide);
    });
    $(".owl-carousel").append(slides);
    var owl = $('.owl-carousel');
    owl.owlCarousel({
      margin:30,
      loop:true,
      autoWidth:true,
      items:10
    });
  });
});
