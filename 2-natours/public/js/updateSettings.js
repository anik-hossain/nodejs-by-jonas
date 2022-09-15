import axios from 'axios';
import { hideAlert, showAlert } from './alerts';

export const updateSettings = async (data, type) => {
    hideAlert();
    const api = type === 'password' ? 'update-password' : 'update-profile';

    try {
        const res = await axios({
            method: 'PATCH',
            url: `/api/v1/users/${api}`,
            data,
        });
        if (res.data.status === 200 || res.data.status === 201) {
            showAlert('success', `${type.toUpperCase()} updated successfully`);
            if (res.data.isUploaded) location.reload(true);
        }
        return res.data.status;
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};
