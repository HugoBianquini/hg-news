import Head from 'next/head';
import styles from './styles.module.scss';

export default function Posts() {
    return (
        <>
            <Head>
                <title>Posts | HGnews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    <a>
                        <time>12 de Dezembro de 2001</time>
                        <strong>Creating a React Application with FaunaDB</strong>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas</p>
                    </a>
                    <a>
                        <time>12 de Dezembro de 2001</time>
                        <strong>Creating a React Application with FaunaDB</strong>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas</p>
                    </a>
                    <a>
                        <time>12 de Dezembro de 2001</time>
                        <strong>Creating a React Application with FaunaDB</strong>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas</p>
                    </a>
                </div>
            </main>
        </>
    );
}