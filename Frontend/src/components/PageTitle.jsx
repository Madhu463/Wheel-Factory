import React from "react";


const PageTitle = (props) => {
  return (
    <div className=" h-16 flex justify-between border-b dark:border-b-gray-600 shadow-md shadow-c100 dark:shadow-c700  dark:text-white">
      <div className="text-3xl font-light flex flex-col justify-center p-2">
        {props.title}
      </div>
      
    </div>
  );
};

export default PageTitle;