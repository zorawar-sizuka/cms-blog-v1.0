// app/post/[slug]/page.js
import { client } from '../../../sanity/client';
import { Inter, Lora } from 'next/font/google';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], weight: '700', variable: '--font-lora' });

// This function fetches the data for a single post
async function getPost(slug) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    publishedAt,
    "authorName": author->name,
    "mainImageUrl": mainImage.asset->url,
    body
  }`;

  const post = await client.fetch(query, { slug });
  return post;
}

// This is the main component for the single post page
export default async function PostPage({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    // Handle the case where the post is not found
    return <div>Post not found</div>;
  }

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 ${inter.variable} ${lora.variable}`}>
      <div className="max-w-3xl mx-auto p-4 sm:p-8">
        <header className="py-8 mb-8">
          <Link href="/" className="text-teal-600 hover:underline font-semibold">&larr; Back to all posts</Link>
          <h1 className="text-4xl md:text-5xl font-lora text-slate-900 mt-4">{post.title}</h1>
          <p className="text-md text-slate-500 mt-3 font-inter">
  By {post.authorName} &bull; Published on {post.publishedAt ? ( // <-- ADD THIS CHECK
    new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  ) : (
    'date not available' // Fallback text
  )}
</p>
        </header>

        {post.mainImageUrl && (
          <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg mb-8">
            <Image 
              src={post.mainImageUrl} 
              alt={post.title} 
              fill 
              className="object-cover"
              priority
            />
          </div>
        )}

        <main className="prose prose-lg prose-slate max-w-none">
          <PortableText value={post.body} />
        </main>
      </div>
    </div>
  );
}

// Optional: Revalidate data to keep it fresh
export const revalidate = 60;