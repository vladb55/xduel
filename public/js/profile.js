$(document).ready(function() {
    $('#startbtn').on('click', function(event) {
        event.preventDefault();
        $.ajax({
           type: "POST",
           url: '/api/status',
           data: JSON.stringify({
             login: (JSON.parse(window.localStorage.getItem('user'))).login,
             status: 1
             }),
            contentType: 'application/json',
            success: function(user) {
                console.log(user.login + " ready to play!");
            },
            dataType: 'json'
        });
    });
});

var user = JSON.parse(window.localStorage.getItem('user'));

$('#greet').html('GREETINGS, ' + (user.login).toString().toUpperCase());

// $('#rating').html('Your rating: ' + user.rating);

$('#singlerating').html('YOUR RATING: ' + user.singlerating);

$('#startsinglebtn').on('click', function(event) {
    event.preventDefault();
    document.location.href = '/singlegame';
});

$('#snowmodebtn').on('click', function(event) {
    event.preventDefault();
    document.location.href = '/snowmode';
});

$('#recordsbtn').on('click', function(event) {
    event.preventDefault();
    document.location.href = '/records';
});
    