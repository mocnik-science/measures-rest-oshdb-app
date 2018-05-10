$(document).ready(function() {
    $('a[href^="http://"]:not([href^="http://purl.org/osm-data-quality"])').click(function(event) {
        event.preventDefault();
        window.open($(this).attr('href'), '_blank');
        return false;
    })
})
