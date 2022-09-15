import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourID) => {
    const stripe = Stripe(
        'pk_test_51LguJoFOslhgrmDurm6sOQIMmsS9vaxImoxGv6NzL8AJ5RccedLgUg4OWNFYLPoP5Jc0PPpwUHZKOWDCBQU9dUUF001yluITx1'
    );
    // Call your backend to create the Checkout Session
    try {
        // 1. Get Checkout session from API
        const session = await axios(
            `http://localhost:3000/api/v1/bookings/checkout-session/${tourID}`
        );

        // 2. Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (error) {
        showAlert('error', error);
    }
};
