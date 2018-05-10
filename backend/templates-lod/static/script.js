$(document).ready(function() {
  $('a[href^="http://"]:not([href^="' + window.location.protocol + '//' + window.location.host + '"])').click(function(event) {
    event.preventDefault();
    window.open($(this).attr('href'), '_blank');
    return false;
  })
})
