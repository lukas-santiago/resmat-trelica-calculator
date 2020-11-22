let api
fetch('../../assets/urls.json').then(response => response.text()).then(result => api = JSON.parse(result).api)

function auth() {
    let username = $('#email').val()
    let password = $('#password').val()
    let basic = btoa(username + ':' + password)

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${basic}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("access_token", "IK67Dp33tF06lr76PKJNpWT3fUHrEwQY");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch(api + 'auth', requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            try {
                let resultJSON = JSON.parse(result)
                if (typeof resultJSON.token != 'undefined') {
                    $('#alert').empty()
                    location.href = '../editor/'
                } else {
                    onError()
                }
            }
            catch (error) {
                onError()
            }
        })
        .catch(error => {
            onError()
        });

    function onError() {
        $('#alert').empty();
        $('#alert').append(`<div class='alert alert-danger' role='alert'>
                                    Usuário e senha inválidos. 
                                    <br> Por favor, tente novamente.
                                    <br> Se o erro peresistir, contate o administrador.
                                </div>`);
    }
}

// $('#github-button').on('click', function () {
//     // Initialize with your OAuth.io app public key
//     let client_id = 'a9d69eae9d80473d29ce';
//     let redirect_uri = window.location.toString()

//     let url = 'https://github.com/login/oauth/authorize'
//     url += '?client_id=' + client_id
//     url += '&redirect_uri=' + redirect_uri

//     window.location.href = url
// })

// $(function () {
//     let code = new URLSearchParams(location.search).get("code")
//     if (code && code.length > 0) {
//         $.ajax({
//             type: "POST",
//             url: "http://localhost:9000/auth/github",
//             dataType: 'json',
//             data: { access_token: code },
//             success: function (response) {
//                 location.href = '../editor/'
//             },
//             error: function (response) {
//                 console.log(response);
//             }
//         })
//     }
// })
