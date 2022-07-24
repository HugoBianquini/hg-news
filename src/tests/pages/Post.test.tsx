import { render, screen } from '@testing-library/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import * as nextAuth from 'next-auth/react';
import Prismic from '@prismicio/client';


const post = 
    {
        slug: 'my-new-post',
        title: 'My new post',
        content: '<p>Post excerpt</p>',
        updatedAt: 'March, 10',
    };

describe('Posts page', () => {
    it('renders correctly', () => {
        render(<Post post={post} />);

        expect(screen.getByText('My new post')).toBeInTheDocument();
        expect(screen.getByText('Post excerpt')).toBeInTheDocument();

    });

    it('redirects unsubscribed user', async () => {

        jest.spyOn(nextAuth, 'getSession').mockResolvedValueOnce(null);
            
        const response = await getServerSideProps({
            params: {slug: 'my-new-post'}
        } as any);

        expect(response).toMatchObject({
            redirect: {
                destination: '/',
                permanent: false,
            }
        });
    });

    it('loads initial data', async () => {

        jest.spyOn(nextAuth, 'getSession').mockResolvedValueOnce({
            activeSubscription: 'fake-subscription',
        } as any);

        jest.spyOn(Prismic, 'client').mockReturnValue({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [ {type: 'heading', text: 'My new post'} ],
                    content: [ {type: 'paragraph', text: 'Post Content'} ] 
                },
                last_publication_date: '04-01-2021',
            })
        } as any);

        const response = await getServerSideProps({
            params: {slug: 'my-new-post'}
        } as any);

        expect(response).toMatchObject({
            props: {
                post: {
                    slug: 'my-new-post',
                    title: 'My new post',
                    content: '<p>Post Content</p>',
                    updatedAt: new Date('04-01-2021').toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })
                },
            },
        });

    })
});