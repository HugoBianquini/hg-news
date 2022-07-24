import { render, screen } from '@testing-library/react';
import Posts, { getStaticProps } from '../../pages/posts';
import Prismic from '@prismicio/client';

const posts = [
    {
        slug: 'my-new-post',
        title: 'My new post',
        excerpt: 'Post excerpt',
        updatedAt: 'March, 10',
    }
];

describe('Posts page', () => {
    it('renders correctly', () => {
        render(<Posts posts={posts} />);

        expect(screen.getByText(posts[0].title)).toBeInTheDocument();
    });

    it('loads initial data', async () => {
        jest.spyOn(Prismic, 'client').mockReturnValue({
            query: jest.fn().mockResolvedValueOnce({
                results: [{
                    uid: 'my-new-post',
                    data: {
                        title: [ {type: 'heading', text: 'My new post'} ],
                        content: [ {type: 'paragraph', text: 'Post Excerpt'} ]
                    },
                    last_publication_date: '04-01-2021'
                }]} as any)
        } as any);
            

        const response = await getStaticProps({});
        expect(response).toMatchObject({
            props: {
                posts: [{
                    slug: 'my-new-post',
                    title: 'My new post',
                    excerpt: 'Post Excerpt',
                    updatedAt: new Date('04-01-2021').toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })
                }]
            },
        })
    });
});