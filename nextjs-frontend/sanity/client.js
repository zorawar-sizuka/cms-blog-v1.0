// sanity/client.js
import { createClient } from 'next-sanity';

// Get the project ID from the environment variable
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

export const client = createClient({
  projectId, // Use the variable here
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: true, // Use CDN for production for speed
});