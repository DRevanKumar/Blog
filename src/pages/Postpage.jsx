import { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from "date-fns";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function PostPage() {
    const { userinfo } = useContext(UserContext);
    const { id } = useParams();
    const [post, setPost] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await axios.get(`http://localhost:3000/createPost/${id}`);
                setPost(response.data);
               
            } catch (error) {
                console.error('Error fetching the post:', error);
            }
        }

        fetchPost();
    }, [id]);

    async function DeletePost(){
        try{
            const response = await axios.delete(`http://localhost:3000/post/${id}`)
            if(response.status===200){
                alert("post deleted")
                navigate('/')
            }
        }catch(err){
            alert(err);
        }
    }
    
    



    if (!post) return <p className="text-center text-gray-700">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center font-serif">{post.title}</h1>
            <div className="text-gray-600 mb-4 text-center">
                <time className="block text-sm">{format(new Date(post.updatedAt), 'MMM d, yyyy HH:mm')}</time>
                <span className="block text-sm">By <span className="font-semibold">{post.author.username}</span></span>
            </div>
            
            {userinfo && userinfo.id === post.author._id && (
                <div className="mb-6 text-center">
                    <Link className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium" to={`/edit/${post._id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Edit this post
                    </Link>
                    <Link className="inline-flex items-center ml-5 text-blue-600 hover:text-blue-800 font-medium" to={''} onClick={DeletePost}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        Delete this post
                    </Link>
                </div>
            )}

            <div className="mb-6">
                <img className="w-full h-auto max-h-80 sm:max-h-96 object-cover rounded-lg" src={`http://localhost:3000/${post.cover}`} alt={post.title} />
            </div>

            <div className="prose prose-sm sm:prose-base lg:prose-lg mx-auto">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
        </div>
    );
}
