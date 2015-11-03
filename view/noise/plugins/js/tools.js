// create layer selector
function createSelector(layer) {
  var sql = new cartodb.SQL({ user: 'junipertcy' });
  var $options = $('#layer_selector li');
  $options.click(function(e) {
    // get the count of the selected layer
    var $li = $(e.target);
    var count = $li.attr('data');
    // deselect all and select the clicked one
    $options.removeClass('selected');
    $li.addClass('selected');
    // create query based on data from the layer
    var query = 'select * from test_3';
    if(count !== 'all') {
      query = 'select * from test_3 where count > ' + count;
    }
    // change the query in the layer to update the map
    layer.setSQL(query);
  });
}