import { render, screen, fireEvent } from '@testing-library/react';
import { SubscribeButton } from '.';

import * as nextAuthReact from 'next-auth/react';
import * as nextRouter from 'next/router';


describe('SubscribeButton', () => {
    it('renders correctly when user is not logged', () => {
        jest.spyOn(nextAuthReact, 'useSession').mockImplementation(() => ({data: null, status: 'unauthenticated'}));
        render(<SubscribeButton />);

        expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
    });

    it('redirects user to sign in when not logged', () => {
        const signInMock = jest.spyOn(nextAuthReact, 'signIn').mockImplementation(jest.fn());
        render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe Now');
        fireEvent.click(subscribeButton);

        expect(signInMock).toHaveBeenCalled();
    });

    it('redirects to post when user has a subscription', () => {
        jest.spyOn(nextAuthReact, 'useSession').mockReturnValue({
            data: {
            user: { name: 'John Doe', email: 'john.doe@ex.com' },
            activeSubscription: true,
            expires: ''},
            status: 'authenticated'
        });
        const pushMock = jest.spyOn(nextRouter, 'useRouter').mockReturnValue({push: jest.fn()} as any);


        render(<SubscribeButton />);

        const subscribeButton = screen.getByText('Subscribe Now');
        fireEvent.click(subscribeButton);

        expect(pushMock).toHaveBeenCalled();
    });
});