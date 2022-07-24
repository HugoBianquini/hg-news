import { render, screen } from '@testing-library/react';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import * as nextAuth from 'next-auth/react';
import * as nextRouter from 'next/router';
import Prismic from '@prismicio/client';


const post = 
    {
        slug: 'my-new-post',
        title: 'My new post',
        content: '<p>Post excerpt</p>',
        updatedAt: 'March, 10',
    };

describe('Posts preview page', () => {
    it('renders correctly', () => {

        jest.spyOn(nextAuth, 'useSession').mockImplementation(() => ({data: null, status: 'unauthenticated'}));

        render(<Post post={post} />);

        expect(screen.getByText('My new post')).toBeInTheDocument();
        expect(screen.getByText('Post excerpt')).toBeInTheDocument();
        expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();


    });

    it('redirects subscribed user to full post', async () => {

        jest.spyOn(nextAuth, 'useSession').mockImplementation(() => (
            {
                data: {
                    activeSubscription: 'fake-active'
                },
            } as any
        ));

        const pushMock = jest.fn();

        jest.spyOn(nextRouter, 'useRouter').mockImplementation(() => ({push: pushMock}) as any);

        render(<Post post={post} />);

        expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');

    });

    it('loads initial data', async () => {
        jest.spyOn(Prismic, 'client').mockReturnValue({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [ {type: 'heading', text: 'My new post'} ],
                    content: [ {type: 'paragraph', text: 'Post Content'} ] 
                },
                last_publication_date: '04-01-2021',
            })
        } as any);

        const response = await getStaticProps({
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