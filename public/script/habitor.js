$( function() {

   $("#create_habit").submit(function(event) {
      /* stop form from submitting normally */
      event.preventDefault();

      /* get some values from elements on the page: */
      var $form = $( this ),
      url = $form.attr('action');

      /* Send the data using post */
      var posting = $.post( url, { goal: $('#goal').val(), action: $('#action').val() } );

      /* Put the results in a div */
      posting.done(function( data ) {
        alert('success');
      });

} );