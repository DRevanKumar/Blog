import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../Editorial";
import axios from 'axios';

export default function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [cover, setCover] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await axios.get(`http://localhost:3000/createPost/${id}`);
        
        setTitle(response.data.title);
        setSummary(response.data.summary);
        setContent(response.data.content);
        const trimmedCover = response.data.cover.replace(/^uploads\\/, '');
        setCover(trimmedCover);
      } catch (error) {
        console.error('Error fetching the post:', error);
      }
    }
    fetchPost();
  }, [id]);

  async function updatePost(e) {
    e.preventDefault();
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files && files[0]) {
      data.set('file', files[0]);
    }

    try {
      const response = await axios.put('http://localhost:3000/createPost', data, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      if (response.status === 200) {
        navigate(`/post/${id}`);
      }
    } catch (error) {
      console.error('Error updating the post:', error);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <form onSubmit={updatePost} className="space-y-6">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label className="peer-focus:font-medium absolute text-md sm:text-xl text-gray-800 dark:text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Title
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label className="peer-focus:font-medium absolute text-md sm:text-xl text-gray-800 dark:text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Summary
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="file"
            onChange={e => setFiles(e.target.files)}
            className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label className="peer-focus:font-medium absolute text-md sm:text-xl text-gray-900 dark:text-gray-900 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Image
          </label>
          {cover && (
            <p className="text-md text-gray-700 mt-1">{cover}</p>
          )}
        </div>
        <Editor value={content} onChange={setContent} />
        <button
          type="submit"
          className="w-full sm:w-auto py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
}
