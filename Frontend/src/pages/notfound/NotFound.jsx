import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const mode = localStorage.getItem("mode") || "dark";

  return (
    <>
    {/* <img src="src\assets\Media.jpg" alt="404" className="w-2/3 h-screen" /> */}
    <div
      className= "h-screen bg-cyan-200 font-mono font-extrabold w-full flex flex-col justify-center items-center gap-1 bg-c100" >
      404 Page Not Found
      <Link to={"/"} className="text-c500 underline">
        go to homepage
      </Link>
    </div>
    </>
  );
};

export default NotFound;