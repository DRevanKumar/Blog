import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import Editor from "../Editorial";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState("");
    const [files, setFiles] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    function Post(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        if (files) {
            data.set('file', files[0]);
        }
        data.set('content', content);
        
        axios.post("http://localhost:3000/createPost", data, {
            headers: {
                Authorization: localStorage.getItem('token')
            }
        })
        .then(response => {
            const id = response.data._id;
            if (response.status === 200) {
                navigate(`/post/${id}`);
            }
        })
        .catch(error => {
            console.error("There was an error!", error);
        });
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
                <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-800">Create a New Post</h1>
                <form onSubmit={Post} className="flex flex-col space-y-6 p-4 border border-gray-300 rounded-lg shadow-sm bg-gray-50 flex-grow overflow-y-auto">
                    <div className="relative">
                        <input 
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="block w-full py-2 px-3 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Title"
                            required
                        />
                        <label className="absolute text-md text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-8 scale-75 top-3 left-1 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8">
                            Title
                        </label>
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
                    <label className="absolute text-md text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-8 scale-75 top-3 left-1 z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8">
                        Summary
                    </label>
                </div>
                    <div className="relative">
                        <input 
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
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

export default CreatePost;