// app/page.js
import { client } from '../sanity/client';
import Link from 'next/link';
import { Inter, Lora } from 'next/font/google';

// Professional font pairing for better readability and style
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const lora = Lora({ subsets: ['latin'], weight: '700', variable: '--font-lora' });

// This function fetches our data from Sanity
async function getPosts() {
  // We add an ordering to make sure the newest posts appear first
  const query = `*[_type == "post"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    "authorName": author->name,
    "mainImageUrl": mainImage.asset->url
  }`;
  
  const posts = await client.fetch(query);
  return posts;
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 ${inter.variable} ${lora.variable}`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <header className="py-12 text-center border-b border-slate-200">
          <h1 className="text-5xl md:text-6xl font-lora text-slate-900">The Sonu's Blog</h1>
          <p className="text-lg text-slate-500 mt-4 font-inter">
            Exploring modern web technologies and ideas.
          </p>
        </header>
        
        <main className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              // We will create the individual post page with this slug later
              <Link key={post.slug} href={`/post/${post.slug}`} className="group block">
                <div className="overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out h-full flex flex-col">
                  {/* Post Image */}
                  <div className="relative w-full h-48">
                    {post.mainImageUrl ? (
                      <img 
                        src={post.mainImageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300"></div>
                    )}
                  </div>
                  
                  {/* Post Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-2xl font-lora text-slate-800 group-hover:text-teal-600 transition-colors duration-300">
                      {post.title}
                    </h2>
                    <p className="text-sm text-slate-500 mt-3 font-inter flex-grow">
                      By {post.authorName}
                    </p>
                    <p className="text-xs text-slate-400 mt-4 font-inter">
  {post.publishedAt ? ( // <-- ADD THIS CHECK
    new Date(post.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  ) : (
    'No date' // Fallback text if date is missing
  )}
</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <footer className="text-center py-8 mt-12 border-t border-slate-200">
        <p className="text-slate-500 font-inter">© {new Date().getFullYear()} My Awesome Blog. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Optional: Add a loading state for a better user experience
export const revalidate = 60; // Re-fetch data every 60 seconds