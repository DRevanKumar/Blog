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
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleFileChange = (e) => {
    setFiles(e.target.files);
    if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(e.target.files[0]);
    }
};

return (
  <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-lg h-screen">
    <div className="lg:w-1/2 flex flex-col pr-4 h-full">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-800">Edit Post</h1>
      <form onSubmit={updatePost} className="flex flex-col space-y-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 flex-grow overflow-y-auto">
        <div className="relative">
          <input 
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="block w-full py-2 px-3 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 peer"
            placeholder=" "
            required
          />
          <label className="absolute text-md text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-8 scale-75 top-3 left-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8">
            Title
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            className="block w-full py-2 px-3 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 peer"
            placeholder=" "
            required
          />
          <label className="absolute text-md text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-8 scale-75 top-3 left-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8">
            Summary
          </label>
        </div>
        <div className="relative">
          <input 
            type="file"
            onChange={handleFileChange}
            className="block w-full text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {/* <label className="absolute text-md sm:text-xl text-gray-800 dark:text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 left-3 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
           Image
         </label> */}
         {!imagePreview && (
           <p className="text-md text-gray-700 mt-1">{cover}</p>
         )}
        </div>
        <div className="relative overflow-y-auto flex-grow bg-gray-50 p-4 border border-gray-300 rounded-lg shadow-sm">
          <Editor value={content} onChange={setContent} />
        </div>
        <div className="sticky bottom-0 bg-gray-50 pt-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Post
          </button>
        </div>
      </form>
    </div>
    <div className="lg:w-1/2 flex flex-col mt-6 lg:mt-0 h-full">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Live Preview</h2>
      <div className="flex-grow p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mb-10"> 
          <h1 className="text-3xl sm:text-4xl md:text-3xl font-bold mb-4 text-center font-serif">{title}</h1>
          {!imagePreview && (
            <div className="mb-6">
              <img className="w-full h-auto max-h-80 sm:max-h-96 object-cover rounded-lg" src={`http://localhost:3000/uploads/${cover}`} alt={title} />
            </div>
          )}
          {imagePreview && (
            <div className="mb-6">
              <img className="w-full h-auto max-h-80 sm:max-h-96 object-cover rounded-lg" src={imagePreview} alt={title} />
            </div>
          )}
          <div className="prose prose-sm sm:prose-base lg:prose-lg mx-auto">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);
}