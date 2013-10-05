
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

   var postToFB = function(caption, message, callback){
      FB.ui({
             method: 'feed',
             name: 'Habitized announcement',
             link: 'http://www.habitized.com',
             picture: 'http://fbrell.com/f8.jpg',
             caption: caption,
             description: message
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
      url = '/habit/create';

      var posting = $.post(url, { 
                                  trigger: $('#trigger').val(), 
                                  goal: $('#goal').val(), 
                                  action: $('#action').val(),
                                  category: $('#category').val(),
                                  comment: $('#comment').val(),
                                  startDate: $('#startDate').val(),
                                  timeZone: new Date().getTimezoneOffset() } );

      posting.done(function( data ) {
        location.href='/myhabit';
      });
   };

   var progressHabit = function() {
     url = '/habit/update';
     var date = new Date();
     var posting = $.post(url, {lastUpdateDate: date.toUTCString(), timeZone: date.getTimezoneOffset()});

     posting.done(function( data ) {
        location.href='/myhabit';;
      });

     posting.fail(function(xhr){
      alert(xhr.responseText);
     })
   };

   //create habit form behavior
   $("#submitButton").click(function(event){
      event.preventDefault();
      if(!validateHabitData()) return;
      var caption = 'I am trying to make a habit'
      var message = $('#trigger').val() + ', ' + $('#action').val() + ', ' + $('#goal').val();
      postToFB(caption, message, createHabit);
   });

   //today done button clicked
   $("#today_done").click(function(event){
      event.preventDefault();
      var caption = 'Habit making in progress'
      var message = $('#msg').text();
      postToFB(caption, message, progressHabit);
   });

   validateHabitData = function(){
      var passed = true;
      var requiredError = false;
      var startDateError = false;
      $('#error-msg').addClass('invisible');
      $('#error-msg').empty();
      if(isBlank($('#trigger').val())){
          $('#trigger').parent().parent().addClass('has-error');
          requiredError = true;
          passed = false;
      }
      if(isBlank($('#action').val())){
          $('#action').parent().parent().addClass('has-error');
          requiredError = true;
          passed = false;
      }
      if(isBlank($('#goal').val())){
          $('#goal').parent().parent().addClass('has-error');
          requiredError = true;
          passed = false;
      }
      if(!isAfterToday($('#startDate').val())){
          $('#startDate').parent().parent().addClass('has-error');
          startDateError = true;
          passed = false;
      }
      if(requiredError){
        $('#error-msg').removeClass('invisible');
        $('#error-msg').append("<p>required field not filled");
      }
      if(startDateError){
        $('#error-msg').removeClass('invisible');
        $('#error-msg').append("<p>start date must be from or after today's date");
      }
      return passed;
   }

   function isAfterToday(str){
      var value = Date.parse(str);
      if(isNaN(value)) return false;

      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
      return value >= today;
   }

   function isBlank(str) {
    return (!str || /^\s*$/.test(str));}

    function setActiveNav(){
      //remove the current one
      $('ul.nav li[class="active"').removeClass('active');

      var url = window.location;
      // Will only work if string in href matches with location
      $('ul.nav a[href="'+ url +'"]').parent().addClass('active');

      // Will also work for relative and absolute hrefs
      $('ul.nav a').filter(function() {
          return this.href == url;
      }).parent().addClass('active');

    }

    //set the default date as today's date in the new habit form
    var currentDate = new Date();
    var localDate = new Date(currentDate.getYear() + 1900, currentDate.getMonth(), currentDate.getDay());
    $('#startDate').val(localDate.toJSON().slice(0,10));

    $( "#more_info_toggle" ).click(function() {
      $( "#habit_more_info" ).slideToggle( "slow" );
    });

    setActiveNav();
  
});