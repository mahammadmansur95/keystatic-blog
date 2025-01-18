import { ReactElement } from 'react';
import { reader } from '../../../reader';

export default async function AuthorPage({ params }: { params: { slug: string } }): Promise<ReactElement> {
    const { slug } = params;
    if(!slug) return <div>Author not found!</div>;

    const author = await reader.collections.authors.read(slug);
    console.log(author);

    const allPosts = await reader.collections.posts.all();

    const authorPosts = allPosts.filter(post => post.entry.authors.includes(slug));

    // console.log(authorPosts);

  return <div>
    <h1>Author Page</h1>
    <p>Author: {author?.name}</p>
    <p>Email: {author?.email}</p>

    {
      authorPosts?.length && <>
      <h2>Blog Posts :</h2>
      {
        authorPosts.map(post => (
          <div key={post.slug}>
            <h2>{post.entry.title}</h2>
          </div>
        ))
      }
      </>
    }
  </div>;
}

export async function generateStaticParams() {
  const authorSlugs = await reader.collections.authors.list();

  return authorSlugs.map((slug) => ({
    slug,
  }));
}
