import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "@/hooks/use-toast";
import jsPDF from 'jspdf'

const ManagerDashboard = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewOrderDetails, setViewOrderDetails] = useState(null);
  const [viewCompletedDetails, setViewCompletedDetails] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("currentOrders");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCModalOpen, setIsCModalOpen] = useState(false);
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
  const [currentTab, setCurrentTab] = useState('orderDetails');

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
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format as HH:MM
    return { formattedDate, formattedTime };
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
      setIsCModalOpen(true);
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
  };// Order Details Tab Component
  const OrderDetails = ({ viewCompletedDetails }) => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-center">Order Details</h3>
      <hr />
      <div className="grid grid-cols-1 mt-1 md:grid-cols-2 gap-4">
        <div className="font-medium">
          <p><strong>Order ID:</strong></p>
          <p><strong>Year:</strong></p>
          <p><strong>Make:</strong></p>
          <p><strong>Model:</strong></p>
          <p><strong>Damage Type:</strong></p>
          <p><strong>Completed:</strong></p>
          <p><strong>Image:</strong></p>
        </div>
        <div>
          <p>{viewCompletedDetails.orderId}</p>
          <p>{viewCompletedDetails.year}</p>
          <p>{viewCompletedDetails.make}</p>
          <p>{viewCompletedDetails.model}</p>
          <p>{viewCompletedDetails.damageType}</p>
          {(() => {
            const { formattedDate, formattedTime } = formatDate(viewCompletedDetails.createdAt);
            return (
              <>
                <p>{formattedDate},{formattedTime}</p>
              </>
            );
          })()}
          <div className="mt-2">
            <img
              src={viewCompletedDetails.imageUrl}
              alt="Order"
              className="mt-2 max-w-full h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Sand Blasting Details Tab Component
  const SandBlastingDetails = ({ additionalData }) => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-center">Sand Blasting Details</h3>
      <hr />
      <div className="grid grid-cols-1 mt-1 md:grid-cols-2 gap-4">
        <div className="font-medium">
          <p><strong>Notes:</strong></p>
          <p><strong>Sand Blasting Level:</strong></p>
          <p><strong>Completed:</strong></p>
          <p><strong>Image:</strong></p>
        </div>
        <div>
          <p>{additionalData[0].notes}</p>
          <p>{additionalData[0].sandBlastingLevel}</p>
          {(() => {
            const { formattedDate, formattedTime } = formatDate(additionalData[0].createdAt);
            return (
              <>
                <p>{formattedDate},{formattedTime}</p>
              </>
            );
          })()}
          <div className="mt-2">
            <img
              src={additionalData[0].imageUrl}
              alt="Order"
              className="mt-2 max-w-full h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const PaintingDetails = ({ additionalsecond }) => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-center">Painting Details</h3>
      <hr />
      <div className="grid grid-cols-1 mt-1 md:grid-cols-2 gap-4">
        <div className="font-medium">
          <p><strong>Painting Notes:</strong></p>
          <p><strong>Paint Color:</strong></p>
          <p><strong>Paint Type:</strong></p>
          <p><strong>Completed:</strong></p>
          <p><strong>Image:</strong></p>
        </div>
        <div>
          <p>{additionalsecond[0].notes}</p>
          <p>{additionalsecond[0].pColor}</p>
          <p>{additionalsecond[0].pType}</p>
          {(() => {
            const { formattedDate, formattedTime } = formatDate(additionalsecond[0].createdAt);
            return (
              <>
                <p>{formattedDate},{formattedTime}</p>
              </>
            );
          })()}
          <div className="mt-2">
            <img
              src={additionalsecond[0].imageUrl}
              alt="Order"
              className="mt-2 max-w-full h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
  const PackagingDetails = ({ additionalthird }) => (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-center">Packaging Details</h3>
      <hr />
      <div className="grid grid-cols-1 mt-1 md:grid-cols-2 gap-4">
        <div className="font-medium">
          <p><strong>Packaging Notes:</strong></p>
          <p><strong>Rating:</strong></p>
          <p><strong>Completed:</strong></p>
          <p><strong>Image:</strong></p>
        </div>
        <div>
          <p>{additionalthird[0].notes}</p>
          <p>{additionalthird[0].iRating}</p>
          {(() => {
            const { formattedDate, formattedTime } = formatDate(additionalthird[0].createdAt);
            return (
              <>
                <p>{formattedDate},{formattedTime}</p>
              </>
            );
          })()}
          <div className="mt-2">
            <img
              src={additionalthird[0].imageUrl}
              alt="Order"
              className="mt-2 max-w-full h-32 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
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
              className={`w-full mb-2 text-center font-semibold rounded-md text-white px-4 py-2 ml-3 mr-3 transition-colors hover:bg-gray-900 hover:text-white  ${activeMenuItem === item.id
                  ? `border-green-300 bg-gray-900 text-white`
                  : "bg-gray-800"
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
        <br/>
        <img className="mt-10 "src="public/bg-images/manager.webp"/>
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
              viewCompletedDetails={fetchCompletedDetails}
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
                <div className="mt-4 flex justify-center">
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
          
          {isCModalOpen && viewCompletedDetails && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-blue-200 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                {/* Close Icon */}
                <button
                  className="absolute top-2 right-2 text-black hover:text-gray-600 transition-colors"
                  onClick={() => setIsCModalOpen(false)}
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
                  Order Details
                </h2>

                <div className="mb-4 flex justify-center space-x-2">
                  <button
                    className={`px-4 py-2 font-semibold ${currentTab === 'orderDetails' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg`}
                    onClick={() => setCurrentTab('orderDetails')}
                  >
                    Order Details
                  </button>
                  <button
                    className={`px-4 py-2 font-semibold ${currentTab === 'sandBlasting' ? 'bg-gray-800 text-white ' : 'bg-white'} rounded-lg`}
                    onClick={() => setCurrentTab('sandBlasting')}
                  >
                    Sand Blasting
                  </button>
                  <button
                    className={`px-4 py-2 font-semibold ${currentTab === 'painting' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg`}
                    onClick={() => setCurrentTab('painting')}
                  >
                    Painting
                  </button>
                  <button
                    className={`px-4 py-2 font-semibold ${currentTab === 'packaging' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg`}
                    onClick={() => setCurrentTab('packaging')}
                  >
                    Packaging
                  </button>
                </div>


                {/* Tab content */}
                {currentTab === 'orderDetails' && (
                  <OrderDetails viewCompletedDetails={viewCompletedDetails} />
                )}
                {currentTab === 'sandBlasting' && viewCompletedDetails.additionalData && (
                  <SandBlastingDetails additionalData={viewCompletedDetails.additionalData} />
                )}
                {currentTab === 'painting' && viewCompletedDetails.additionalsecond && (
                  <PaintingDetails additionalsecond={viewCompletedDetails.additionalsecond} />
                )}
                {currentTab === 'packaging' && viewCompletedDetails.additionalthird && (
                  <PackagingDetails additionalthird={viewCompletedDetails.additionalthird} />
                )}

                {/* Close button for modal */}
                {/* <div className="mt-6 flex justify-center">
            <button
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div> */}
              </div>
            </div>
          )}

          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-blue-200 p-6 rounded-lg shadow-xl w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">Add New Order</h2>
                <form
                  onSubmit={formik.handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
                        className="mt-1 block w-full h-10 rounded-md border-gray-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-900 focus:ring-opacity-50"
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
                        className="mt-1 block w-full h-10 rounded-md border-gray-950  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                        className="mt-1 block w-full h-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                        className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                          formik.setFieldValue("imageUrl", event.currentTarget.files[0]);
                        }}
                        className="mt-1 block h-10 w-full  border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      {formik.touched.imageUrl && formik.errors.imageUrl ? (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.imageUrl}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {/* Buttons between the sections */}
                  <div className="mt-6 col-span-2 flex justify-center space-x-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-500 text-white font-serif font-bold rounded hover:bg-blue-600 transition-colors"
                    >
                      Add Order
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 bg-red-500 text-white font-serif font-bold rounded hover:bg-gray-400 transition-colors"
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

  // Stage-specific filtering
  const solderingOrders = currentOrders.filter(order => order.status === "Soldering");
  const paintingOrders = currentOrders.filter(order => order.status === "Painting");
  const packagingOrders = currentOrders.filter(order => order.status === "Packaging");
  const shippedOrders = currentOrders.filter(order => order.status === "neworder");

  const filteredOrders = currentOrders.filter(
    (order) => !damageTypeFilter || order.damageType === damageTypeFilter
  );

  function formatTimestampToDate(timestamp) {
    let date = new Date(timestamp);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    return `${day}-${month}-${year}`;
  }

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

      {/* Layout for DamageType Filter and Status Cards */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        {/* DamageType Filter */}
        <div className="col-span-1">
          <select
            className="border border-gray-300 p-2 mt-6 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={damageTypeFilter}
            onChange={(e) => setDamageTypeFilter(e.target.value)}
          >
            <option value="">All Damage Types</option>
            <option value="Scraped">Scraped</option>
            <option value="Lip Crack">Lip Crack</option>
            <option value="Chipped">Chipped</option>
            <option value="Paint Fade">Paint Fade</option>
          </select>
        </div>

        {/* Status Cards */}
        <div className="col-span-4 grid grid-cols-4 gap-4">
        <div className="bg-purple-100 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold">Inventory</h3>
            <p className="text-2xl">{shippedOrders.length}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold">Soldering</h3>
            <p className="text-2xl">{solderingOrders.length}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold">Painting</h3>
            <p className="text-2xl">{paintingOrders.length}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold">Packaging</h3>
            <p className="text-2xl">{packagingOrders.length}</p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <table className="min-w-full divide-y divide-gray-200 table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left text-l font-bold text-black   font-serif">Order ID</th>
            <th className="px-6 py-3 text-left text-l font-bold text-black  font-serif">ClientName</th>
            <th className="px-6 py-3 text-left text-l font-bold text-black  font-serif">Status</th>
            <th className="px-6 py-3 text-left text-l font-bold text-black font-serif">DamageType</th>
            <th className="px-6 py-3 text-left text-l font-bold text-black font-serif">CompletedAt</th>
            <th className="px-6 py-3 text-left text-l font-bold text-black  font-serif">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentOrdersPage.map((order) => (
            <tr key={order.orderId} className="hover:bg-gray-50">
              <td className="px-10 py-4 whitespace-nowrap  font-bold text-m  text-gray-900 ">{order.orderId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-m  text-gray-900 ">{order.clientName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-m  text-gray-900 ">{order.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-gray-900 ">{order.damageType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-m  text-gray-900">{formatTimestampToDate(order.createdAt)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-m  font-medium text-black font-sans">
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
          className="px-4 py-2 bg-red-400 text-gray-800 font-bold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 "
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-950">Page {currentPage} of {totalPages}</span>
        <button
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 "
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const CompletedOrders = ({
  completedOrders,
  viewCompletedDetails,
  setViewOrderDetails
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOrderId, setSearchOrderId] = useState("");
  const ordersPerPage = 10;

  function formatTimestampToDate(timestamp) {
    let date = new Date(timestamp);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    return `${day}-${month}-${year}`;
  }

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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 ">
        Completed Orders
      </h2>
      <div className="mb-6 flex space-x-4">
      <div className="rounded-lg  px-6 py-2">
        <input
          type="text"
          placeholder="Search by Order ID"
          className="border border-gray-600 p-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
        />
        </div>
         <div className="bg-blue-100 text-gray-900  font-bold rounded-lg shadow-md px-8 py-5">
          <span className="font-bold">Number Of CompletedOrders:</span> {filteredOrders.length}
        </div>
      </div>
     
      <table className="min-w-full divide-y divide-gray-200 table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left text-l font-semibold text-black  font-serif">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-l font-semibold text-black  font-serif">
              ClientName
            </th>
            <th className="px-6 py-3 text-left text-l font-semibold text-black  font-serif">
              Completion Date
            </th>
            <th className="px-6 py-3 text-left text-l font-semibold text-black   font-serif">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentOrdersPage.map((order) => (
            <tr key={order.orderId} className="hover:bg-gray-50">
              <td className="px-10 py-4 whitespace-nowrap text-m font-bold text-gray-900">
                {order.orderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m  text-gray-900 ">
                {order.clientName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m  text-gray-900">
                {formatTimestampToDate(order.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-m text-black ">
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
          className="px-4 py-2 bg-red-400 text-black font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 "
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-950">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 "
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
  function formatTimestampToDate(timestamp) {
    let date = new Date(timestamp);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    return `${day}-${month}-${year}`;
  }

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
         <div className="bg-blue-100 text-gray-900 font-bold  rounded-lg shadow-md px-8 py-5">
          <span className="font-bold">Number Of ScrappedOrders:</span> {filteredOrders.length}
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200 table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-3 py-3 text-left text-l font-mediu text-gray-950 font-serif">
              OrderID
            </th>
            <th className="px-3 py-3 text-left text-l font-mediu text-gray-950 font-serif">
              ClientName
            </th>
            <th className="px-3 py-3 text-left text-l font-mediu text-gray-950  font-serif">
              Year
            </th>
            <th className="px-3 py-3 text-left text-l font-mediu text-gray-950 font-serif">
              Make
            </th>
            <th className="px-3 py-3 text-left text-l font-mediu text-gray-950 font-serif ">
              Model
            </th>
            <th className="px-3 py-3 text-left text-l font-mediu text-gray-950  font-serif">
              Status
            </th>
            <th className="px-3 py-3 text-left text-l font-mediu  text-gray-950  font-serif">
              DamageType
            </th>
            <th className="px-3 py-3 text-left text-l font-mediu  text-gray-950  font-serif">
              ScrappedOn
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentOrdersPage.map((order) => (
            <tr key={order.orderId} className="hover:bg-gray-50">
              <td className="px-10 py-4 whitespace-nowrap font-bold text-sm  text-gray-900">
                {order.orderId}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-m  text-gray-900">
                {order.clientName}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-m text-gray-900">
                {order.year}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-m  text-gray-900">
                {order.make}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-m text-gray-900">
                {order.model}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-m   text-gray-900">
                {order.status}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-m  text-gray-900">
                {order.damageType}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-m  text-gray-900">
                {formatTimestampToDate(order.createdAt)}              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex justify-between items-center">
        <button
          className="px-4 py-2 bg-red-400 text-gray-800  font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 "
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 "
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
