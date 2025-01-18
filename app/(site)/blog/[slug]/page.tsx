import React from "react";
import Markdoc from "@markdoc/markdoc";
import { reader } from "../../../reader";
import { markdocConfig } from "../../../../keystatic.config";
import Link from "next/link";
import { DocumentRenderer } from "@keystatic/core/renderer";

export default async function Post({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const post = await reader.collections.posts.read(slug, { resolveLinkedFiles: true });
  console.log("post",post);

  if (!post) return <div>Post not found!</div>;

  const { node } = post.content;
  const mansur = post.content;

  // const authors = await reader.collections.authors.read(post.authors[0]);

  const authors = await Promise.all(
    post.authors.map(async (author) => ({
      ...(await reader.collections.authors.read(author)),
      slug: author,
    }))
  );

  const errors = Markdoc.validate(node, markdocConfig);
  if (errors.length) {
    console.error(errors);
    throw new Error("Invalid content");
  }

  const renderable = Markdoc.transform(node, markdocConfig);

  return (
    <div>
      <h1>{post.title}</h1>
      {authors.map((author) => (
        <div key={author.slug}>
          <Link key={author.slug} href={`/authors/${author.slug}`}>
            <h2>{author.name}</h2>
          </Link>
          <p>{author.email}</p>
        </div>
      ))}
      {Markdoc.renderers.react(renderable, React)}
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await reader.collections.posts.list();

  return slugs.map((slug) => ({
    slug,
  }));
}
