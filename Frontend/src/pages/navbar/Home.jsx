import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
const Home = () => {
  const navigate = useNavigate();
  const loginHandler = () => {
    navigate('/login');
  };
  return (
    <>
      {/* <header className="bg-white bg-opacity-10 backdrop-blur-lg flex items-center justify-between text-white p-4 fixed w-full z-10">
        <h3 className="border-2 border-teal-500 text-black font-bold px-4 py-2 rounded hover:cursor-pointer hover:border-black hover:text-black transition ease-in-out duration-300">THE WHEEL FACTORY</h3>
        
        <button
          className="border-2 border-teal-500 text-white font-bold px-4 py-2 rounded hover:bg-teal-500 hover:text-black transition ease-in-out duration-300"
          onClick={loginHandler}
        >
          LOGIN
        </button>
      </header> */}

<header className="bg-white bg-opacity-10 backdrop-blur-lg flex items-center justify-between text-white p-4 fixed w-full z-10"

>
    <div className="animate-pulse flex items-center">
        <img src="src\assets\file.png" alt="Logo" className="h-10 w-10 mr-4" />
    </div>
    <h3 className="text-center flex-grow text-2xl font-bold text-white px-4 py-2 rounded transition ease-in-out duration-300 animate-pulse">
        THE WHEEL FACTORY
    </h3>
    <button
        className="border-2 border-teal-500 text-white font-bold px-4 py-2 rounded hover:bg-teal-500 hover:text-black transition ease-in-out duration-300"
        onClick={loginHandler}
    >
        LOGIN
    </button>
</header>

    <div className="relative bg-gray-800 flex justify-center items-center">
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={2000}
          showStatus={false}
          emulateTouch
          transitionTime={800}
          className="w-screen "
        >
          <div>
            <img src="public/bg-images/mansory1.png" alt="Wheel Image 1" className="w-full h-full object-cover" />
          </div>
          <div>
            <img src="public/bg-images/man.png" alt="Wheel Image 2" className="w-full h-full object-cover" />
          </div>
          <div>
            <img src="public/bg-images/ghost.png" alt="Wheel Image 3" className="w-full h-full object-cover" />
          </div>
        </Carousel>
      </div>


      <div className="flex justify-center  bg-blue-950 "></div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8 bg-gray-800">
        {[
          { title: "INVENTORY MANAGEMENT", image: "public/bg-images/inventory1.png" },
          { title: "SOLDERING AND SANDBLASTING", image: "public/bg-images/car2.jpg" },
          { title: "PACKAGING AND DELIVERY", image: "public/bg-images/remanu.png" },

        ].map((item, index) => (
          <>

            <div key={index} className="group relative w-full h-full">
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-75 transition-all duration-500 ease-in-out rounded-lg"></div>

              <img
                src={item.image}
                alt={item.title}
                className="rounded-lg w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:rotate-y-180"
              />
              <div className="absolute inset-0 flex justify-center items-center text-white font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {item.title}
              </div>
            </div>
          </>
        ))}
      </div>
      <footer className="w-full border-t-4 border-teal-400 pt-8 pb-12 bg-gray-800">
        <div className="container max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="text-center sm:text-left">
            <h4 className="text-xl font-bold text-teal-400 ">Wheel Factory</h4>
            <p className="text-white text-lg">
              Remanufacturing quality products since 1985.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div>
              <h5 className="text-xl font-bold text-teal-400 mb-2">Partners</h5>
              <ul className="space-y-1 text-s text-white">
                <li>KIA</li>
                <li>HONDA</li>
                <li>TATA</li>
                <li>BMW</li>
                <li>MERCEDES</li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold text-teal-400 mb-2">
                Contact Us
              </h5>
              <ul className="space-y-1 text-lg text-white font-sans">
                <li>Email: contact@wheelfactory.com</li>
                <li>Phone: +1 (123) 456-7890</li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold text-teal-400 mb-2">
                Head Office
              </h5>
              <p className="space-y-1 text-lg text-white">
                123 Main Street
                <br />
                Anytown, USA 12345
                <br />
                Open: Mon-Fri, 9 AM - 5 PM
              </p>
            </div>
          </div>
        </div>
      </footer>
      <div
        className="bg-gray-900 text-white p-4 flex justify-center font-bold"

      >
        <p>&copy; 2023 The Wheel Factory. All rights reserved.</p>
      </div>
    </>
  );
};

export default Home;
