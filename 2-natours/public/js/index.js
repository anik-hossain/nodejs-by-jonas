import 'babel-polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.getElementById('login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateUserData = document.getElementById('update-user-data');
const updatePassword = document.getElementById('update-password');
const savePass = document.querySelector('.btn-pass-save');
const saveGen = document.querySelector('#save-gen');

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

if (updateUserData) {
    updateUserData.addEventListener('submit', async (e) => {
        e.preventDefault();
        saveGen.textContent = 'Updating...';
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);

        await updateSettings(form, 'data');
        saveGen.textContent = 'Save settings';
    });
}

if (updatePassword) {
    updatePassword.addEventListener('submit', async (e) => {
        e.preventDefault();
        savePass.textContent = 'Updating...';
        const currentPassword =
            document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('password-confirm').value;

        const isSuccess = await updateSettings(
            { currentPassword, password, passwordConfirm },
            'password'
        );
        savePass.textContent = 'save password';
        if (isSuccess === 201) {
            document.getElementById('password-current').value = '';
            document.getElementById('password').value = '';
            document.getElementById('password-confirm').value = '';
        }
    });
}
