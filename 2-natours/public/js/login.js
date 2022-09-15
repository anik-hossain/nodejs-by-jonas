import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    try {
        const result = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password,
            },
        });
        if (result.status === 200) {
            showAlert('success', 'Logged In Successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};

export const logout = async () => {
    try {
        const result = await axios({
            method: 'GET',
            url: '/api/v1/users/logout',
        });
        if (result.status === 200) {
            showAlert('success', 'Logged Out Successfully');
            location.reload(true);
        }
    } catch (error) {
        showAlert('error', 'Error logging out! Try Again');
    }
};
