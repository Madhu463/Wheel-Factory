import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "@/hooks/use-toast";

const ManagerDashboard = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [viewCompletedDetails, setViewCompletedDetails] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("currentOrders");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [damageTypes, setDamageTypes] = useState([
    "Lip Crack",
    "Chipped",
    "Paint Fade",
    "To Be Scrapped",
  ]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [scrappedOrders, setScrappedOrders] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [showSandBlastingImage, setShowSandBlastingImage] = useState(false);
  const [showPaintingImage, setShowPaintingImage] = useState(false);
  const [showPackagingImage, setShowPackagingImage] = useState(false);

  const menuItems = [
    { name: "Current Orders", id: "currentOrders" },
    { name: "Completed Orders", id: "completedOrders" },
    { name: "Add New Order", id: "add" },
    { name: "Scrapped Orders", id: "scrappedOrders" },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const currentOrdersResponse = await axios.get(
          "http://localhost:5041/api/Orders/current",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const completedOrdersResponse = await axios.get(
          "http://localhost:5041/api/Orders/completed",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const scrappedOrdersResponse = await axios.get(
          "http://localhost:5041/api/Orders/scraped",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentOrders(currentOrdersResponse.data);
        setCompletedOrders(completedOrdersResponse.data);
        setScrappedOrders(scrappedOrdersResponse.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error fetching orders",
          description:
            "There was a problem retrieving the orders. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    };

    fetchOrders();
  }, []);
  const formik = useFormik({
    initialValues: {
      clientName: "",
      year: "",
      make: "",
      model: "",
      damageType: "",
      notes: "",
      status: "",
      imageUrl: null,
    },
    validationSchema: Yup.object({
      clientName: Yup.string().required("Client name is required"),
      year: Yup.string().required("Year is required"),
      make: Yup.string().required("Make is required"),
      model: Yup.string().required("Model is required"),
      damageType: Yup.string().required("Damage type is required"),
      notes: Yup.string().required("Notes are required"),
      status: Yup.string().required("Status is required"),
      imageUrl: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("clientName", values.clientName);
      formData.append("year", values.year);
      formData.append("make", values.make);
      formData.append("model", values.model);
      formData.append("damageType", values.damageType);
      formData.append("imageUrl", values.imageUrl);
      formData.append("notes", values.notes);
      formData.append("status", values.status);

      try {
        const token = localStorage.getItem("token");
        await axios.post("http://localhost:5041/api/Orders", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        setShowAddModal(false);
        const currentOrdersResponse = await axios.get(
          "http://localhost:5041/api/Orders/current",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCurrentOrders(currentOrdersResponse.data);
        toast({
          title: "Added order successfully",
          description: "The new order has been added to the system.",
          duration: 5000,
          style: {
            backgroundColor: "#90EE90",
            color: "black",
            fontWeight: "bold",
          },
        });
        resetForm();
      } catch (error) {
        console.error("Error submitting form:", error);
        toast({
          title: "Error adding order",
          description: error.response.data,
          variant: "destructive",
          duration: 5000,
        });
      }
    },
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5041/api/Orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedOrder(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error fetching order details",
        description:
          "There was a problem retrieving the order details. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const fetchScrappedDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5041/api/Orders/scraped/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedOrder(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "Error fetching scrapped order details",
        description:
          "There was a problem retrieving the scrapped order details. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const fetchCompletedDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const FirstEndpoint = `http://localhost:5041/api/Orders/${orderId}`;
      const secondEndpoint = `http://localhost:5041/api/task/soldering/${orderId}`;
      const ThirdEndpoint = `http://localhost:5041/api/task/painting/${orderId}`;
      const FourthEndpoint = `http://localhost:5041/api/Task/packaging/${orderId}`;

      const taskResponse = await axios.get(FirstEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let additionalData = null;
      let additionalsecond = null;
      let additionalthird = null;

      try {
        if (secondEndpoint) {
          const additionalResponse = await axios.get(secondEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          additionalData = additionalResponse.data;
        }
        if (ThirdEndpoint) {
          const SecondResponse = await axios.get(ThirdEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          additionalsecond = SecondResponse.data;
        }
        if (FourthEndpoint) {
          const ThirdResponse = await axios.get(FourthEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
          });
          additionalthird = ThirdResponse.data;
        }
      } catch (error) {
        console.warn(
          "Error fetching additional details, proceeding without additional data"
        );
      }

      setViewCompletedDetails({
        ...taskResponse.data,
        additionalData,
        additionalsecond,
        additionalthird,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching completed order details:", error);
      toast({
        title: "Error fetching completed order details",
        description:
          "There was a problem retrieving the completed order details. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-400">
      <div className="w-64  bg-gray-800 rounded text-white">
        <div className="flex items-center font-bold justify-center h-20 text-white bg-gray-900  rounded border-b border-gray-700">
          
          <span className="text-xl text-white font-bold">ACTIVITY</span>
          
        </div>
        

        <nav className="mt-12">
          
          {menuItems.map((item) => (
            <button
            
              key={item.id}
              className={`w-full mb-2 text-center font-semibold rounded-md text-white px-4 py-2 ml-3 mr-3 transition-colors hover:bg-cyan-400 hover:text-black  ${
                activeMenuItem === item.id
                  ?`border-green-700 bg-gray-900 `
                  : "bg-gray-700"
              } border-2  p-4 `
              
            }
              style={{ width: "230px", height: "40px" }}
              onClick={(e) => {
                e.preventDefault();
                if (item.id === "add") {
                  setShowAddModal(true);
                } else {
                  setActiveMenuItem(item.id);
                }
              }}
            >
              
              {item.name}
              
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-1 overflow-x-hidden overflow-y-auto rounded bg-gray-300">
        <header className="bg-gray-900 shadow-sm justify-center"
        style={{
          backgroundImage: 'url("public/bg-images/bag.jpg")',
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          }}>
          <div className="max-w-7xl   mx-auto py-5 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold rounded  text-white justify-center ">
              MANAGER DASHBOARD
            </h1>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              onClick={handleLogout}
            >
              LOGOUT
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {activeMenuItem === "currentOrders" && (
            <CurrentOrders
              currentOrders={currentOrders}
              viewOrderDetails={fetchOrderDetails}
              setViewOrderDetails={fetchOrderDetails}
            />
          )}

          {activeMenuItem === "completedOrders" && (
            <CompletedOrders
              completedOrders={completedOrders}
              setViewOrderDetails={fetchCompletedDetails}
            />
          )}
          {activeMenuItem === "scrappedOrders" && (
            <ScrappedOrdersTable
              scrappedOrders={scrappedOrders}
              setViewOrderDetails={fetchScrappedDetails}
            />
          )}
          {isModalOpen && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg shadow-xl w-1/2 max-w-2xl relative">
                {/* Close Icon */}
                <button
                  className="absolute top-2 right-2 text-black hover:text-gray-600 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
                <hr />
                <div className="grid grid-cols-1 mt-2 md:grid-cols-2 gap-4 font-serif font-semibold">
                  <div className="font-medium font-serif">
                    <p>
                      <strong>Order ID:</strong>
                    </p>
                    <p>
                      <strong>Client Name:</strong>
                    </p>
                    <p>
                      <strong>Year:</strong>
                    </p>
                    <p>
                      <strong>Make:</strong>
                    </p>
                    <p>
                      <strong>Model:</strong>
                    </p>
                    <p>
                      <strong>Damage Type:</strong>
                    </p>
                    <p>
                      <strong>Status:</strong>
                    </p>
                    <p>
                      <strong>Notes:</strong>
                    </p>
                  </div>
                  <div>
                    <p>{selectedOrder.orderId}</p>
                    <p>{selectedOrder.clientName}</p>
                    <p>{selectedOrder.year}</p>
                    <p>{selectedOrder.make}</p>
                    <p>{selectedOrder.model}</p>
                    <p>{selectedOrder.damageType}</p>
                    <p>{selectedOrder.status}</p>
                    <p>{selectedOrder.notes}</p>
                  </div>
                </div>
                <div className="font-serif font-semibold text-black">
                  Image:
                  {selectedOrder.imageUrl && (
                    <img
                      src={selectedOrder.imageUrl}
                      alt="Order"
                      className="max-w-full h-32 object-contain mt-2"
                    />
                  )}
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {isModalOpen && viewCompletedDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-400 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                {/* Close Icon */}
                <button
                  className="absolute top-2 right-2 text-black hover:text-gray-600 transition-colors"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <h2 className="text-2xl font-bold mb-4 font-sans text-center">
                  Completed Order Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Order Details and Sand Blasting Details */}
                  <div className="mt-2">
                    {/* Order Details Card */}
                    <div className="bg-white p-4 rounded-lg shadow-lg mb-4 transform transition-transform duration-200 hover:shadow-lg hover:scale-105">                      <h3 className="text-xl font-semibold text-center font-sans">
                        Order Details
                      </h3>
                      <hr />
                      <div className="grid grid-cols-1 mt-1 md:grid-cols-2 gap-4">
                        <div className="font-medium font-sans">
                          <p>
                            <strong>Order ID:</strong>
                          </p>
                          <p>
                            <strong>Year:</strong>
                          </p>
                          <p>
                            <strong>Make:</strong>
                          </p>
                          <p>
                            <strong>Model:</strong>
                          </p>
                          <p>
                            <strong>Damage Type:</strong>
                          </p>
                        </div>
                        <div className="font-sans">
                          <p>{viewCompletedDetails.orderId}</p>
                          <p>{viewCompletedDetails.year}</p>
                          <p>{viewCompletedDetails.make}</p>
                          <p>{viewCompletedDetails.model}</p>
                          <p>{viewCompletedDetails.damageType}</p>

                          {/* Image display button for Order Image */}
                          {viewCompletedDetails.imageUrl && (
                            <div className="mt-2">
                              <button
                                className="mt-2 px-2 py-1 bg-red-400 text-black rounded hover:bg-gray-400 transition-colors"
                                onClick={() => setShowImage((prev) => !prev)} // Toggle image visibility
                              >
                                {showImage ? "Hide Image" : "Show Image"}
                              </button>
                              {showImage && (
                                <img
                                  src={viewCompletedDetails.imageUrl}
                                  alt="Order"
                                  className="mt-2 max-w-full h-32 object-contain"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sand Blasting Details Card */}
                    {viewCompletedDetails.additionalData && (
                      <div className="bg-white p-4 rounded-lg shadow-lg mb-4 transform transition-transform duration-200 hover:shadow-lg hover:scale-105">                          <h3 className="text-xl font-semibold text-center font-sans">
                          Sand Blasting Details
                        </h3>
                        <hr />
                        <div className="grid grid-cols-1 mt-1 md:grid-cols-2 gap-4">
                          <div className="font-medium font-sans">
                            <p>
                              <strong>Notes:</strong>
                            </p>
                            <p>
                              <strong>Sand Blasting Level:</strong>
                            </p>
                          </div>
                          <div className="font-sans">
                            <p>
                              {viewCompletedDetails.additionalData[0].notes}
                            </p>
                            <p>
                              {
                                viewCompletedDetails.additionalData[0]
                                  .sandBlastingLevel
                              }
                            </p>
                            <button
                              className="mt-2 px-2 py-1 bg-red-400 text-black rounded hover:bg-gray-400 transition-colors"
                              onClick={() =>
                                setShowSandBlastingImage((prev) => !prev)
                              } // Toggle image visibility
                            >
                              {showSandBlastingImage
                                ? "Hide Image"
                                : "Show Image"}
                            </button>
                            {showSandBlastingImage &&
                              viewCompletedDetails.additionalData[0]
                                .imageUrl && (
                                <img
                                  src={
                                    viewCompletedDetails.additionalData[0]
                                      .imageUrl
                                  }
                                  alt="Sand Blasting"
                                  className="mt-2 max-w-full h-32 object-contain"
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Painting Details Card */}
                    {viewCompletedDetails.additionalsecond && (
                      <div className="bg-white p-4 mt-2 rounded-lg shadow-lg mb-4 transform transition-transform duration-200 hover:shadow-lg hover:scale-105">                          <h3 className="text-xl font-semibold text-center font-sans">
                          Painting Details
                        </h3>
                        <hr />
                        <div className="grid mt-1 grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="font-medium font-sans">
                            <p>
                              <strong>Notes:</strong>
                            </p>
                            <p>
                              <strong>Paint Color:</strong>
                            </p>
                            <p>
                              <strong>Paint Type:</strong>
                            </p>
                          </div>
                          <div className="font-sans">
                            <p>
                              {viewCompletedDetails.additionalsecond[0].notes}
                            </p>
                            <p>
                              {viewCompletedDetails.additionalsecond[0].pColor}
                            </p>
                            <p>
                              {viewCompletedDetails.additionalsecond[0].pType}
                            </p>
                            <button
                              className="mt-2 px-2 py-1 bg-red-400 text-black rounded hover:bg-gray-400 transition-colors"
                              onClick={() =>
                                setShowPaintingImage((prev) => !prev)
                              } // Toggle image visibility
                            >
                              {showPaintingImage ? "Hide Image" : "Show Image"}
                            </button>
                            {showPaintingImage &&
                              viewCompletedDetails.additionalsecond[0]
                                .imageUrl && (
                                <img
                                  src={
                                    viewCompletedDetails.additionalsecond[0]
                                      .imageUrl
                                  }
                                  alt="Painting"
                                  className="mt-2 max-w-full h-32 object-contain"
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Packaging Details Card */}
                    {viewCompletedDetails.additionalthird && (
                      <div className="bg-white  p-4 rounded-lg shadow-lg transform transition-transform duration-200 hover:shadow-lg hover:scale-105">                          <h3 className="text-xl font-semibold text-center font-sans">
                          Packaging Details
                        </h3>
                        <hr />
                        <div className="grid grid-cols-1 mt-2 md:grid-cols-2 gap-4">
                          <div className="font-medium font-sans">
                            <p>
                              <strong>Notes:</strong>
                            </p>
                            <p>
                              <strong>Rating:</strong>
                            </p>
                          </div>
                          <div className="font-sans">
                            <p>
                              {viewCompletedDetails.additionalthird[0].notes}
                            </p>
                            <p>
                              {viewCompletedDetails.additionalthird[0].iRating}
                            </p>
                            <button
                              className="mt-2 px-2 py-1 bg-red-400 text-black rounded hover:bg-gray-400 transition-colors"
                              onClick={() =>
                                setShowPackagingImage((prev) => !prev)
                              } // Toggle image visibility
                            >
                              {showPackagingImage ? "Hide Image" : "Show Image"}
                            </button>
                            {showPackagingImage &&
                              viewCompletedDetails.additionalthird[0]
                                .imageUrl && (
                                <img
                                  src={
                                    viewCompletedDetails.additionalthird[0]
                                      .imageUrl
                                  }
                                  alt="Packaging"
                                  className="mt-2 max-w-full h-32 object-contain"
                                />
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Close button for modal */}
                <div className="mt-6 flex justify-center">
                  <button
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-300 p-6 rounded-lg shadow-xl w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">Add New Order</h2>
                <form
                  onSubmit={formik.handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Left Column */}
                  <div className="flex flex-col">
                    <div>
                      <label
                        htmlFor="clientName"
                        className="block text-m font-medium text-gray-900"
                      >
                        Client Name
                      </label>
                      <input
                        id="clientName"
                        name="clientName"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.clientName}
                        className="mt-1 block w-full h-8 rounded-md border-gray-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-900 focus:ring-opacity-50"
                      />
                      {formik.touched.clientName && formik.errors.clientName ? (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.clientName}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor="year"
                        className="block text-m font-medium text-gray-900 mt-4"
                      >
                        Year
                      </label>
                      <input
                        id="year"
                        name="year"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.year}
                        className="mt-1 block w-full h-8 rounded-md border-gray-950  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      {formik.touched.year && formik.errors.year ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.year}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor="make"
                        className="block text-m font-medium text-gray-900 mt-4"
                      >
                        Make
                      </label>
                      <input
                        id="make"
                        name="make"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.make}
                        className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      {formik.touched.make && formik.errors.make ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.make}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-m font-medium text-gray-900 mt-4"
                      >
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        onChange={formik.handleChange}
                        value={formik.values.notes}
                        placeholder="*Add color preference"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col">
                    <div>
                      <label
                        htmlFor="model"
                        className="block text-m font-medium text-gray-900"
                      >
                        Model
                      </label>
                      <input
                        id="model"
                        name="model"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.model}
                        className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      {formik.touched.model && formik.errors.model ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.model}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor="damageType"
                        className="block text-m font-medium text-gray-900 mt-4"
                      >
                        Damage Type
                      </label>
                      <select
                        id="damageType"
                        name="damageType"
                        onChange={formik.handleChange}
                        value={formik.values.damageType}
                        className="mt-1 block w-full h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >
                        <option value="" label="Select damage type" />
                        {damageTypes.map((type) => (
                          <option key={type} value={type} label={type} />
                        ))}
                      </select>

                      {formik.touched.damageType && formik.errors.damageType ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.damageType}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-m font-medium text-gray-900 mt-4"
                      >
                        Status
                      </label>
                      <input
                        id="status"
                        name="status"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.status}
                        className="mt-1 block w-full h-8  rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      {formik.touched.status && formik.errors.status ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.status}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label
                        htmlFor="imageUrl"
                        className="block text-m font-medium text-gray-900 mt-4"
                      >
                        Image
                      </label>
                      <input
                        id="imageUrl"
                        name="imageUrl"
                        type="file"
                        onChange={(event) => {
                          formik.setFieldValue(
                            "imageUrl",
                            event.currentTarget.files[0]
                          );
                        }}
                        className="mt-1 block h-8 w-full"
                      />
                      {formik.touched.imageUrl && formik.errors.imageUrl ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.imageUrl}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white font-serif font-bold rounded hover:bg-blue-600 transition-colors"
                    >
                      Add Order
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white font-serif font-bold rounded hover:bg-gray-400 transition-colors"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const CurrentOrders = ({
  currentOrders,
  viewOrderDetails,
  setViewOrderDetails,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [damageTypeFilter, setDamageTypeFilter] = useState("");
  const ordersPerPage = 10;

  const filteredOrders = currentOrders.filter(
    (order) => !damageTypeFilter || order.damageType === damageTypeFilter
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrdersPage = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Current Orders</h2>
      <div className="mb-6 flex space-x-4">
        <select
          className="border border-gray-300 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={damageTypeFilter}
          onChange={(e) => setDamageTypeFilter(e.target.value)}
        >
          <option value="">All Damage Types</option>
          <option value="scraped">Scraped</option>
          <option value="lipcrack">Lip Crack</option>
          <option value="chipped">Chipped</option>
          <option value="paintfade">Paint Fade</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200 table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-l font-bold text-black uppercase tracking-wider font-sans">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-l font-bold text-black uppercase tracking-wider font-sans">
              status
            </th>
            <th className="px-6 py-3 text-left text-l font-bold text-black uppercase tracking-wider font-sans">
              Damage Type
            </th>
            <th className="px-6 py-3 text-left text-l font-bold text-black uppercase tracking-wider font-sans">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 font-thin">
          {currentOrdersPage.map((order) => (
            <tr key={order.orderId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-m  text-black font-sans">
                {order.orderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-black font-sans">
                {order.status}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-black font-sans">
                {order.damageType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-black font-sans">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition duration-300 ease-in-out"
                  onClick={() => viewOrderDetails(order.orderId)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between items-center">
        <button
          className="px-4 py-2 bg-red-400 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 "
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-950">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-gray-900 "
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Preview
        </button>
      </div>
    </div>
  );
};

const CompletedOrders = ({
  completedOrders,
  viewCompletedDetails,
  setViewOrderDetails,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOrderId, setSearchOrderId] = useState("");
  const ordersPerPage = 10;

  const filteredOrders = completedOrders.filter(
    (order) =>
      !searchOrderId || order.orderId.toString().includes(searchOrderId)
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrdersPage = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Completed Orders
      </h2>
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Search by Order ID"
          className="border border-gray-300 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200 table-auto w-full text-left border-collapse font-bold">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-l font-medium text-black uppercase tracking-wider font-sans">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-l font-medium text-black uppercase tracking-wider font-sans">
              Completion Date
            </th>
            <th className="px-6 py-3 text-left text-l font-medium text-black uppercase tracking-wider font-sans">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 font-thin">
          {currentOrdersPage.map((order) => (
            <tr key={order.orderId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-m font-medium text-black font-sans">
                {order.orderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-black font-sans">
                {order.createdAt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-black font-sans">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition duration-300 ease-in-out"
                  onClick={() => setViewOrderDetails(order.orderId)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between items-center">
        <button
          className="px-4 py-2 bg-red-400 text-black rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 "
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-950">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-green-500 text-black rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 "
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const ScrappedOrdersTable = ({ scrappedOrders, setViewOrderDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOrderId, setSearchOrderId] = useState("");
  const ordersPerPage = 10;

  const filteredOrders = scrappedOrders.filter(
    (order) =>
      !searchOrderId || order.orderId.toString().includes(searchOrderId)
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrdersPage = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (!scrappedOrders || scrappedOrders.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No scrapped orders available.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-950">Scrapped Orders</h2>
      <div className="mb-6 flex space-x-4">
        <input
          type="text"
          placeholder="Search by Order ID"
          className="border border-gray-300 p-2 rounded-md text-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200 table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-l font-medium text-gray-950 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-l font-medium text-gray-950 uppercase tracking-wider">
              Client Name
            </th>
            <th className="px-6 py-3 text-left text-l font-medium text-gray-950 uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 text-left text-l font-medium text-gray-950 uppercase tracking-wider">
              Make
            </th>
            <th className="px-6 py-3 text-left text-l font-medium text-gray-950 uppercase tracking-wider">
              Model
            </th>
            <th className="px-6 py-3 text-left text-l font-medium text-gray-950 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-l font-mediu  text-gray-950 uppercase tracking-wider">
              Damage Type
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentOrdersPage.map((order) => (
            <tr key={order.orderId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.orderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-gray-900">
                {order.clientName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-gray-900">
                {order.year}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-gray-900">
                {order.make}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-gray-900">
                {order.model}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-gray-900">
                {order.status}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-gray-900">
                {order.damageType}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex justify-between items-center">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-green-500 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManagerDashboard;
