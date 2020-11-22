function register() {
    let username = $('#email').val()
    let password = $('#password').val()

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    var urlencoded = new URLSearchParams();
    urlencoded.append('access_token', 'IK67Dp33tF06lr76PKJNpWT3fUHrEwQY');
    urlencoded.append('email', username);
    urlencoded.append('password', password);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch('http://localhost:9000/users', requestOptions)
        .then(response => response.text())
        .then(result => {
            let resultJSON = JSON.parse(result)
            // console.log(resultJSON)
            if (resultJSON.token) {
                // location.href = '../login/'
                $('#alert').empty()
                $('#alert').append(`<div class='alert alert-success' role='alert'>
                                   Usuário cadastrado com sucesso
                                </div>`)
            } else {
                onError()
            }
        })
        .catch(error => onError);

    function onError() {
        $('#alert').empty();
        $('#alert').append(`<div class='alert alert-danger' role='alert'>
                                    Erro ao tentar cadastrar usuário. 
                                    <br> Por favor, tente novamente.
                                    <br> Se o erro peresistir, contate o administrador.
                                </div>`);
    }
}