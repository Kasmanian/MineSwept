
const $form = $('#login-form');
const $message = $('#message');

document.getElementById('1').onclick = function(e) {
    e.preventDefault();
    $message.html('');
    const dat = $form.serializeArray().reduce((o, x) => {
        o[x.name] = x.value;
        return o;
    }, {});
    login(dat);
}

document.getElementById('2').onclick = function(e) {
    e.preventDefault();
    $message.html('');
    const dat = $form.serializeArray().reduce((o, x) => {
        o[x.name] = x.value;
        return o;
    }, {});
    add(dat.user, dat.password);
}

document.getElementById('3').onclick = function(e) {
    e.preventDefault();
    $message.html(''); 
    const dat = $form.serializeArray().reduce((o, x) => {
        o[x.name] = x.value;
        return o;
    }, {});
    destroy(dat.user, dat.password);
}

async function add(name, password) {
    await axios({
        method: 'post',
        url: 'signup',
        data: {
            name: name,
            pass: password,
        }
    }).then(() => {
        $message.html('<span class="has-text-success">Success! Account created.</span>');
        let text = name.split('#');
        let user = text[0];
        login({ user: user, password: password });
    }).catch((err) => {
        $message.html(`<span class="has-text-danger">${err.response.data}</span>`);
    });
}

async function login(data) {
    await axios({
        method: 'post',
        url: '/login',
        data: {
            name: data.user,
            pass: data.password,
        }
    }).then(() => {
            $message.html('<span class="has-text-success">Success! You are now logged in.</span>');
            window.location.pathname = './client/index.html'
            window.localStorage.user = data.user;
        }).catch((err) => {
            $message.html(`<span class="has-text-danger">${err.response.data}</span>`);
    });
}

async function destroy(name, password) {
    await axios({
        method: 'delete',
        url:  'destroy',
        data: {
            name: name,
            pass: password,
        }

    }).then(() => {
        $message.html('<span class="has-text-success">Success! Account deleted.</span>');
    }).catch((err) => {
        $message.html(`<span class="has-text-danger">${err.response.data}</span>`);
    });
}