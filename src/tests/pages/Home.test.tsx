import { render, screen } from '@testing-library/react';
import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages';

jest.mock('next/router');
jest.mock('next-auth/react', () => {
    return {
        useSession() {
            return [null, false]
        }
    }
});

const prices = stripe.prices;

describe('Home page', () => {
    it('renders correctly', () => {
        render(<Home product={{priceId: 'fake-id', amount: 'R$10,00'}} />);

        expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
    });

    it('loads initial data', async () => {
        jest.spyOn(prices, 'retrieve').mockResolvedValueOnce({
            id: 'fake-price-id',
            unit_amount: 1000,
        } as any);

        const response = await getStaticProps({});
        expect(response).toMatchObject({
            props: {
                product: {
                    priceId: 'fake-price-id',
                    amount: '$10.00'
                }
            },
            revalidate: 86400
        })
    });
})