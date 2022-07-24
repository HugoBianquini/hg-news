import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { Header } from '.';

jest.mock('next/router', () => {
    return {
        useRouter() {
            return {
                asPath: '/'
            } 
        }
    }
});

jest.mock('next-auth/react', () => {
    return {
        useSession() {
            return [null, false];
        }
    }
})

describe('ActiveLink', () => {

    it('renders correctly', () => {
        render(
            <Header />
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Posts')).toBeInTheDocument();
    });
});