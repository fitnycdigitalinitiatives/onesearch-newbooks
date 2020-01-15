$(document).ready(function() {
  $.getJSON( "new-books.json", function( data ) {
    console.log(data);
  });
});
