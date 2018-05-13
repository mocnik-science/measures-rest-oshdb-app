$(document).ready(function() {
  $('a[href^="http://"]:not([href^="' + window.location.protocol + '//' + window.location.host + '"])').click(function(event) {
    event.preventDefault();
    window.open($(this).attr('href'), '_blank');
    return false;
  })
  
  // LOD prefixes
  let prefixes = {
    dcterms: 'http://purl.org/dc/terms/',
    foaf: 'http://xmlns.com/foaf/0.1/',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    dq: 'http://purl.org/data-quality#',
    osmdq: 'http://purl.org/osm-data-quality#',
    osmmr: 'https://osm-measure.geog.uni-heidelberg.de/',
  };
  
  // set query
  let query = $.map(prefixes, function(value, key) {
    return 'PREFIX ' + key + ': <' + value + '>';
  }).join('\n');
  query += '\n\nSELECT ?name ?measure WHERE {\n    ?measure rdf:type dq:measure .\n    ?measure dcterms:title ?name\n} LIMIT 20\n';
  $('#sparql-query').val(query);
  
  // perform query
  $('#sparql-form').submit(function(event) {
    event.preventDefault();
    $('#sparql-result').removeClass('hidden');
    $.ajax({
      type: 'POST',
      url: $('#sparql-form').data('endpoint'),
      data: {
        query: $('#sparql-query').val(),
      },
      dataType: 'json',
    }, 'json').fail(function(data) {
      $('.sparql-warning').removeClass('hidden');
      $('.sparql-table').addClass('hidden');
      $('.sparql-warning-content').text(data.responseText);
    }).done(function(data) {
      $('.sparql-warning').addClass('hidden');
      $('.sparql-table').removeClass('hidden');
      // produce table head
      let thead = $('#sparql-table thead').empty();
      $(thead).append($('<th scope="col">#</th>'))
      $.each(data.head.vars, function(index, value) {
        $(thead).append($('<th scope="col">' + value + '</th>'));
      });
      // produce table body
      let tbody = $('#sparql-table tbody').empty();
      $.each(data.results.bindings, function(index, value) {
        let tr = '<tr><th scope="row">' + index + '</th>'
        $.each(data.head.vars, function(index2, value2) {
          let v = v2 = value[value2].value;
          if (value[value2].type === 'uri') {
            $.each(prefixes, function(keyPrefix, valuePrefix) {
              if (v.startsWith(valuePrefix)) v2 = keyPrefix + ':' + v.slice(valuePrefix.length);
            });
            v = '<a href="' + v + '" target="_blank">' + v2 + '</a>'
          }
          tr += '<td>' + v + '</td>';
        });
        tr += '</tr>';
        $(tbody).append(tr);
      });
    });
    return false;
  })
})
