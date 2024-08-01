import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({_id, title, summary, cover, updatedAt, author}) {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden mb-10 transition-transform transform hover:scale-105 hover:bg-gradient-to-r hover:from-zinc-200 hover:to-blue-50 hover:text-inherit p-3">
      <Link to={`/post/${_id}`} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="w-full h-48 md:h-64 overflow-hidden col-span-1">
          <img
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            src={`http://localhost:3000/${cover}`}
            alt={title}
          />
        </div>
        <div className="p-4 col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-bold mb-4">{title}</h3>
            <p className="text-gray-700 mb-4">
              <span className="font-semibold">{author.username}</span> | 
              <time className="text-gray-500">{format(new Date(updatedAt), 'MMM d, yyyy HH:mm')}</time>
            </p>
          </div>
          <p className="text-xl text-gray-800">{summary}</p>
        </div>
      </Link>
    </div>
  );
}
