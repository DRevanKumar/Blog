import Post from "../Post";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get("http://localhost:3000/createPost");
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPost();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-r from-slate-50 to-slate-100">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Blog Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="w-full">
              <Post {...post} />
            </div>
          ))
        ) : (
          <p className="text-gray-700 text-center col-span-full">No posts available</p>
        )}
      </div>
    </div>
  );
}
