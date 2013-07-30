
window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : '144772812392904',                        // App ID from the app dashboard
      channelUrl : '//localhost:3000/channel.html', // Channel file for x-domain comms
      status     : true,                                 // Check Facebook Login status
      xfbml      : true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here
   };

  // Load the SDK asynchronously
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


$(function(){

   var postToFB = function(callback){
      FB.ui({
             method: 'feed',
             name: 'Habitor announcement',
             link: 'http://www.habitor.com',
             picture: 'http://fbrell.com/f8.jpg',
             caption: 'I am announcing',
             description: 'to be fit, i will run 3 kms every day for 21 days'
            },
            function(response) {
               if (response && response.post_id) {
                  callback();
               } else {
                  alert('Sorry, you have to make your habit public visible');
               }
            });
     };

   var createHabit = function(){
      url = $('#create_habit').attr('action');

      var posting = $.post( url, { goal: $('#goal').val(), action: $('#action').val() } );

      posting.done(function( data ) {
        alert(data);
      });
   };

   //create habit form behavior
   $("#submitButton").click(function(event){
      event.preventDefault();
      //alert('start');
      postToFB(createHabit);
   })
});