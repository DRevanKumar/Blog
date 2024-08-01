import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import Editor from "../Editorial";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(null);

    function Post(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('file', files[0]);
        data.set('content', content);
        
        axios.post("http://localhost:3000/createPost", data, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        .then(response => {
            const id = response.data._id;
            if(response.status === 200){
                navigate(`/post/${id}`);
            }
        })
        .catch(error => {
            console.error("There was an error!", error);
        });
    }

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-800">Create a New Post</h1>
            <form onSubmit={Post} className="space-y-6">
                <div className="relative">
                    <input 
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="block w-full py-2 px-3 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Title"
                        required
                    />
                </div>
                <div className="relative">
                    <input 
                        type="text"
                        value={summary}
                        onChange={e => setSummary(e.target.value)}
                        className="block w-full py-2 px-3 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Summary"
                        required
                    />
                </div>
                <div className="relative">
                    <input 
                        type="file"
                        onChange={e => setFiles(e.target.files)}
                        className="block w-full text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div className="relative">
                    <Editor value={content} onChange={setContent} />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Submit Post
                </button>
            </form>
        </div>
    );
}
