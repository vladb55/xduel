$(document).ready(function() {
    $('#submit').on('click', function(event) {
        event.preventDefault();
        $.ajax({
           type: "POST",
           url: '/api/users',
           data: JSON.stringify({
             login: $('[name=login]').val(), 
             password: $('[name=password]').val(),
             email: $('[name=email]').val(),
             rating: 100,
             singlerating: 100
             }),
            contentType: 'application/json',
            success: function() {console.log('Успешно зарегестрирован');},
            dataType: 'json'
        });
    });

    $('#enter').on('click', function(event) {
        event.preventDefault();
        $.ajax({
           type: "POST",
           url: '/api/users/login',
           data: JSON.stringify({
             login: $('[name=log]').val(), 
             password: $('[name=pass]').val()
             }),
            contentType: 'application/json',
            success: function(user) {
                window.localStorage.setItem('user', JSON.stringify(user[0]));
                document.location.href = '/profile';
            },
            dataType: 'json'
        });
    });

});
    