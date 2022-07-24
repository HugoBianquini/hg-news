import { render, screen } from '@testing-library/react';
import { SignInButton } from '.';

import * as nextAuthReact from 'next-auth/react';


describe('SignInButton', () => {
    it('renders correctly when user is not logged', () => {
        jest.spyOn(nextAuthReact, 'useSession').mockImplementation(() => ({data: null, status: 'unauthenticated'}));
        render(<SignInButton />);

        expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
    });

    it('renders correctly when user is not logged', () => {
        jest.spyOn(nextAuthReact, 'useSession').mockImplementation(() => (
            {
                data: {
                user: { name: 'John Doe', email: 'john.doe@ex.com' },
                expires: ''},
                status: 'authenticated'
            })
        );
    
        render(<SignInButton />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
});