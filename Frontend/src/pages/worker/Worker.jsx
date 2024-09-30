// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';



// export default function Worker() {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const [workerType, setWorkerType] = useState(null);
//   const [allStages, setAllStages] = useState([]);
//   const [error, setError] = useState('');
//   const [pendingTasks, setPendingTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [heading, setHeading] = useState('');

//   const [stageFilter, setStageFilter] = useState('');
//   const [damageTypeFilter, setDamageTypeFilter] = useState('');
//   const [showImage, setShowImage] = useState(false);
//   const [showAdditionalImage, setShowAdditionalImage] = useState(false);
//   const [showSecondImage, setShowSecondImage] = useState(false);


//   const userIdToWorkerTypeMap = {
//     'Worker1': '1', // Inventory worker
//     'Worker2': '2', // Soldering worker
//     'Worker3': '3', // Painting worker
//     'Worker4': '4', // Packaging workerf
//   };

//   useEffect(() => {
//     const workerTypeFromUserId = userIdToWorkerTypeMap[userId];
//     setWorkerType(workerTypeFromUserId);

//     const fetchPendingTasks = async () => {
//       try {
//         let response;
//         const token = localStorage.getItem('token');
//         if (workerTypeFromUserId) {
//           switch (workerTypeFromUserId) {
//             case '1':
//               response = await axios.get('http://localhost:5041/api/Orders/Inventory', {
//                 headers: { Authorization: `Bearer ${token}` },
//               });
//               setHeading("Orders Tasks for Inventory");

//               break;
//             case '2':
//               response = await axios.get('http://localhost:5041/api/task/soldering', {
//                 headers: { Authorization: `Bearer ${token}` },
//               });
//               setHeading("Orders Tasks for SandBlasting");

//               break;

//             case '3':
//               response = await axios.get('http://localhost:5041/api/task/painting', {
//                 headers: { Authorization: `Bearer ${token}` },
//               });
//               setHeading("Orders Tasks for Painting");

//               break;
//             case '4':
//               response = await axios.get('http://localhost:5041/api/task/packaging', {
//                 headers: { Authorization: `Bearer ${token}` },
//               });
//               setHeading("Orders Tasks for Packaging");

//               break;
//             default:
//               console.log('Invalid worker type');
//               return;
//           }
//           setPendingTasks(response.data);
//         }
//       } catch (error) {
//         setError('Error fetching pending tasks');
//         console.error(error);
//       }
//     };

//     if (workerTypeFromUserId) {
//       fetchPendingTasks();
//     }
//   }, [userId]);
//   const formatDate = (timestamp) => {
//     const date = new Date(timestamp);
//     const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
//     const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format as HH:MM
//     return { formattedDate, formattedTime };
//   };
//   const handleProcessClick = (orderId) => {
//     setIsModalOpen(false);
//     switch (workerType) {
//       case '1':
//         navigate('/inventory', { state: { orderId } });
//         break;
//       case '2':
//         navigate('/soldering', { state: { orderId } });
//         break;
//       case '3':
//         navigate('/painting', { state: { orderId } });
//         break;
//       case '4':
//         navigate('/packaging', { state: { orderId } });
//         break;
//       default:
//         console.log('Invalid worker type');
//     }
//   };

//   const handleDetailsClick = async (orderId) => {
//     try {
//       let taskEndpoint, additionalEndpoint, SecondEndpoint;
//       const token = localStorage.getItem('token');
//       switch (workerType) {
//         case '1': // Inventory
//           taskEndpoint = `http://localhost:5041/api/Orders/${orderId}`;
//           break;
//         case '2': // Soldering
//           taskEndpoint = `http://localhost:5041/api/Orders/${orderId}`;
//           break;
//         case '3': // Painting
//           taskEndpoint = `http://localhost:5041/api/Orders/${orderId}`;
//           additionalEndpoint = `http://localhost:5041/api/Task/soldering/${orderId}`;
//           break;
//         case '4': // Packaging
//           taskEndpoint = `http://localhost:5041/api/Orders/${orderId}`;
//           additionalEndpoint = `http://localhost:5041/api/Task/soldering/${orderId}`;
//           SecondEndpoint = `http://localhost:5041/api/Task/painting/${orderId}`;
//           break;
//         default:
//           throw new Error('Invalid worker type');
//       }

//       const taskResponse = await axios.get(taskEndpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       let additionalData = null;
//       let SecondData = null;
//       if (additionalEndpoint) {
//         const additionalResponse = await axios.get(additionalEndpoint, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         additionalData = additionalResponse.data;
//       }
//       if (SecondEndpoint) {
//         const SecondResponse = await axios.get(SecondEndpoint, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         SecondData = SecondResponse.data;
//       }

//       setSelectedTask({ ...taskResponse.data, additionalData, SecondData });
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error('Error fetching task details:', error);
//       setError('Failed to fetch task details');
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedTask(null);
//   };


//   if (error) {
//     return <p className="text-red-500 text-center mt-8">{error}</p>;
//   }

//   const filteredOrders = pendingTasks.filter(order =>
//     (!stageFilter || order.Stage === stageFilter) &&
//     (!damageTypeFilter || order.DamageType === damageTypeFilter)
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   return (
//     <div className="overflow-x-auto bg-white shadow-md rounded-lg p-2">
//       {/* <header className="flex justify-between items-center p-5 bg-gray-900 text-white rounded-lg shadow-md mb-8"> */}
//       <div className="overflow-x-auto rounded-lg">
//   <header 
//     className="flex justify-between items-center p-5 text-white rounded-lg shadow-md mb-8"
//     style={{
//       backgroundImage: 'url("/bg-images/bag.jpg")', // Use leading slash for correct path
//       backgroundSize: 'cover', 
//       backgroundPosition: 'center', 
//       backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: add a background color overlay for better text contrast
//     }}
//   >
//     <div className="flex space-x-4">
//       <h1 className="text-2xl font-bold">{heading}</h1>
//     </div>
//     <button
//       className="flex items-center justify-center px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition"
//       onClick={() => { localStorage.clear(); navigate('/') }}
//     >
//       LOGOUT
//     </button>
//   </header>
// </div>

//       <h3 className="text-2xl font-light text-center mb-6">PENDING ORDERS LIST</h3>
//       <div className="overflow-x-auto rounded-lg">
//         <table className="min-w-full bg-white border rounded border-gray-300 shadow-md">
//           <thead className="bg-gray-950 text-white font-bold font-serif font-large">
//             <tr>
//               <th className="p-4 text-left">Order ID</th>
//               <th className="p-4 text-left">Year</th>
//               <th className="p-4 text-left">Make</th>
//               <th className="p-4 text-left">Model</th>
//               <th className="p-4 text-left">Image</th>
//               <th className="p-4 text-left">Action</th>
//             </tr>
//           </thead>
//           <tbody className='text-m  text-black font-sans font-medium'>
//             {currentItems.map((task) => (
//               <tr key={task.orderId} className="border-t">
//                 <td className="p-4">{task.orderId}</td>
//                 <td className="p-4">{task.year}</td>
//                 <td className="p-4">{task.make}</td>
//                 <td className="p-4">{task.model}</td>
//                 <td className="p-4">{task.imageUrl}</td>
//                 <td className="p-4">
//                   <button
//                     className=" bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
//                     onClick={() => handleDetailsClick(task.orderId)}
//                   >
//                     Preview
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="flex justify-between items-center mt-4">
//         <button
//           className="bg-red-400 text-black font-semibold px-4 py-2 rounded "
//           onClick={() => paginate(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span className="text-lg">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           className="bg-green-600  text-white font-semibold px-4 py-2 rounded "
//           onClick={() => paginate(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
//           <div className="bg-white p-4 rounded-md shadow-md w-1/2 max-w-2xl">
//             {selectedTask && (
//               <div className="space-y-4 font-sans">
//                 <span className='font-bold text-xl '>InventoryDetails</span>
//                 <hr />
//                 <div className="flex justify-between items-start">
//                   <div className="flex-grow">
//                     <div>
//                       <strong>Order ID:</strong> {selectedTask.orderId}
//                     </div>
//                     <div>
//                       <strong>Status:</strong> {selectedTask.status}
//                     </div>
//                     <div>
//                       <strong>Damage Type:</strong> {selectedTask.damageType}
//                     </div>
//                     <div>
//                       <strong>Notes:</strong> {selectedTask.notes}
//                     </div>
//                     <strong>Completed:</strong>
//                     {(() => {
//             const { formattedDate, formattedTime } = formatDate(selectedTask.createdAt);
//             return (
//               <>
//                 <p>{formattedDate},{formattedTime}</p>
//               </>
//             );
//           })()}
//                   </div>
//                   {selectedTask.imageUrl && (
//                     <div className="ml-6">
//                       <img
//                         src={selectedTask.imageUrl}
//                         alt="Task"
//                         className="mt-2"
//                         style={{ maxWidth: '100px', height: 'auto' }}
//                       />
//                     </div>
//                   )}

//                 </div>
//               </div>
//             )}
//             {selectedTask.additionalData && selectedTask.additionalData.length > 0 && (

//               <div><hr />
//                 <br /><span className='font-bold text-xl '>SandBlastingDetails</span>
//                 <br /><hr />
//                 <div className="flex justify-between items-start border-t pt-2">


//                   <div className="w-full">
//                     <div>
//                       <strong>Sand Blasting Notes:</strong> {selectedTask.additionalData[0].notes}
//                     </div>
//                     <div>
//                       <strong>Sand Blasting Level:</strong> {selectedTask.additionalData[0].sandBlastingLevel}
//                     </div>
//                     <strong>Completed:</strong>
//                     {(() => {
//             const { formattedDate, formattedTime } = formatDate(selectedTask.additionalData[0].createdAt);
//             return (
//               <>
//                 <p>{formattedDate},{formattedTime}</p>
//               </>
//             );
//           })()}
//           </div>
//                   {selectedTask.additionalData[0].imageUrl && (
//                     <div className="ml-6">
//                       <img
//                         src={selectedTask.additionalData[0].imageUrl}
//                         alt="Additional"
//                         className="mt-4"
//                         style={{ maxWidth: '100px', height: 'auto' }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {selectedTask.SecondData && selectedTask.SecondData.length > 0 && (
//               <div><hr />
//                 <span className='font-bold text-xl '>PaintingDetails</span>
//                 <hr />
//                 <div className="flex justify-between items-start border-t pt-2">

//                   <div className="w-full">
//                     <div>
//                       <strong>Paint Color:</strong> {selectedTask.SecondData[0].pColor}
//                     </div>
//                     <div>
//                       <strong>Paint Type:</strong> {selectedTask.SecondData[0].pType}
//                     </div>
//                     <div>
//                       <strong>Notes:</strong> {selectedTask.SecondData[0].notes}
//                     </div>
//                     <strong>Completed:</strong>
//                     {(() => {
//             const { formattedDate, formattedTime } = formatDate(selectedTask.SecondData[0].createdAt);
//             return (
//               <>
//                 <p>{formattedDate},{formattedTime}</p>
//               </>
//             );
//           })()}
//                   </div>
//                   {selectedTask.SecondData[0].imageUrl && (
//                     <div className="ml-4">
//                       <img
//                         src={selectedTask.SecondData[0].imageUrl}
//                         alt="Second"
//                         className="mt-2"
//                         style={{ maxWidth: '100px', height: 'auto' }}
//                       />
//                     </div>
//                   )}

//                 </div>
//               </div>
//             )}

//             <div className="mt-4 flex justify-center space-x-4">
//               <button
//                 className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
//                 onClick={() => handleProcessClick(selectedTask.orderId)}
//               >
//                 Process
//               </button>

//               <button
//                 className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600"
//                 onClick={closeModal}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Worker() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [workerType, setWorkerType] = useState(null);
  const [error, setError] = useState('');
  const [pendingTasks, setPendingTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [heading, setHeading] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [damageTypeFilter, setDamageTypeFilter] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchOrderId, setSearchOrderId] = useState('');

  // Single date filter state
  const [filterDate, setFilterDate] = useState('');

  const userIdToWorkerTypeMap = {
    'Worker1': '1',
    'Worker2': '2',
    'Worker3': '3',
    'Worker4': '4',
  };

  useEffect(() => {
    const workerTypeFromUserId = userIdToWorkerTypeMap[userId];
    setWorkerType(workerTypeFromUserId);

    const fetchPendingTasks = async () => {
      try {
        let response;
        const token = localStorage.getItem('token');
        if (workerTypeFromUserId) {
          switch (workerTypeFromUserId) {
            case '1':
              response = await axios.get('http://localhost:5041/api/Orders/Inventory', {
                headers: { Authorization: `Bearer ${token}` },
              });
              setHeading("Orders Tasks for Inventory");
              break;
            case '2':
              response = await axios.get('http://localhost:5041/api/task/soldering', {
                headers: { Authorization: `Bearer ${token}` },
              });
              setHeading("Orders Tasks for SandBlasting");
              break;
            case '3':
              response = await axios.get('http://localhost:5041/api/task/painting', {
                headers: { Authorization: `Bearer ${token}` },
              });
              setHeading("Orders Tasks for Painting");
              break;
            case '4':
              response = await axios.get('http://localhost:5041/api/task/packaging', {
                headers: { Authorization: `Bearer ${token}` },
              });
              setHeading("Orders Tasks for Packaging");
              break;
            default:
              console.log('Invalid worker type');
              return;
          }
          setPendingTasks(response.data);
        }
      } catch (error) {
        setError('Error fetching pending tasks');
        console.error(error);
      }
    };

    if (workerTypeFromUserId) {
      fetchPendingTasks();
    }
  }, [userId]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { formattedDate, formattedTime };
  };

  const handleProcessClick = (orderId) => {
    setIsModalOpen(false);
    switch (workerType) {
      case '1':
        navigate('/inventory', { state: { orderId } });
        break;
      case '2':
        navigate('/soldering', { state: { orderId } });
        break;
      case '3':
        navigate('/painting', { state: { orderId } });
        break;
      case '4':
        navigate('/packaging', { state: { orderId } });
        break;
      default:
        console.log('Invalid worker type');
    }
  };

  const handleDetailsClick = async (orderId) => {
    try {
      let taskEndpoint, additionalEndpoint, secondEndpoint;
      const token = localStorage.getItem('token');
      switch (workerType) {
        case '1': // Inventory
        case '2': // Soldering
          taskEndpoint = `http://localhost:5041/api/Orders/${orderId}`;
          break;
        case '3': // Painting
          taskEndpoint = `http://localhost:5041/api/Orders/${orderId}`;
          additionalEndpoint = `http://localhost:5041/api/Task/soldering/${orderId}`;
          break;
        case '4': // Packaging
          taskEndpoint = `http://localhost:5041/api/Orders/${orderId}`;
          additionalEndpoint = `http://localhost:5041/api/Task/soldering/${orderId}`;
          secondEndpoint = `http://localhost:5041/api/Task/painting/${orderId}`;
          break;
        default:
          throw new Error('Invalid worker type');
      }

      const taskResponse = await axios.get(taskEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let additionalData = null;
      let secondData = null;
      if (additionalEndpoint) {
        const additionalResponse = await axios.get(additionalEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        additionalData = additionalResponse.data;
      }
      if (secondEndpoint) {
        const secondResponse = await axios.get(secondEndpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        secondData = secondResponse.data;
      }

      setSelectedTask({ ...taskResponse.data, additionalData, secondData });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching task details:', error);
      setError('Failed to fetch task details');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setActiveTab('inventory'); // Reset tab when closing modal
  };

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  // Date filter function
  const isWithinDate = (date) => {
    return !filterDate || new Date(date).toISOString().split('T')[0] === filterDate;
  };

  // Order ID search function
  const isMatchingOrderId = (orderId) => {
    return !searchOrderId || orderId.toString().includes(searchOrderId);
  };

  const filteredOrders = pendingTasks.filter(order =>
    isWithinDate(order.createdAt) &&
    isMatchingOrderId(order.orderId) &&
    (!stageFilter || order.Stage === stageFilter) &&
    (!damageTypeFilter || order.DamageType === damageTypeFilter)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-2">
      <div className="overflow-x-auto rounded-lg">
        <header 
          className="flex justify-between items-center p-5 text-white rounded-lg shadow-md mb-8"
          style={{
            backgroundImage: 'url("/bg-images/bag.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div className="flex space-x-4">
            <h1 className="text-2xl font-bold">{heading}</h1>
          </div>
          <button
            className="flex items-center justify-center px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition"
            onClick={() => { localStorage.clear(); navigate('/') }}
          >
            LOGOUT
          </button>
        </header>
      </div>

      <h3 className="text-2xl font-semibold text-center mb-6">PENDING ORDERS LIST</h3>    
<div className="mb-6 flex space-x-4">
  <div className="rounded-lg px-6 py-2 flex items-center">
    <label htmlFor="" className="mr-2 font-bold text-gray-700">OrderId:</label>
     <input
          type="text"
          placeholder="Search by Order ID"
          className="border border-gray-600 p-2 rounded-md text-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchOrderId}
          onChange={(e) => setSearchOrderId(e.target.value)}
        />
  <label htmlFor="filterDate" className="mr-2 ml-4 font-bold text-gray-700">Filter by Date:</label>
    <input
      type="date"
      id="filterDate"
      className="border border-gray-600 p-2  rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={filterDate}
      onChange={(e) => setFilterDate(e.target.value)}
    />
  </div>
  <div className="bg-purple-100 text-gray-900 font-bold rounded-lg shadow-md px-8 py-5">
    <span className="font-bold">PendingOrders:</span> {filteredOrders.length}
  </div>
</div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white border rounded border-gray-300 shadow-md">
          <thead className="bg-gray-950 text-white font-bold font-serif font-large">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Year</th>
              <th className="p-4 text-left">Make</th>
              <th className="p-4 text-left">Model</th>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Completed</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className='text-m text-black font-sans font-medium'>
            {currentItems.map((task) => (
              <tr key={task.orderId} className="border-t">
                <td className="p-4">{task.orderId}</td>
                <td className="p-4">{task.year}</td>
                <td className="p-4">{task.make}</td>
                <td className="p-4">{task.model}</td>
                <td className="p-4">{task.imageUrl}</td>
                <td className="p-4">{formatDate(task.createdAt).formattedDate}</td>
                <td className="p-4">
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
                    onClick={() => handleDetailsClick(task.orderId)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-red-400 text-black font-semibold px-4 py-2 rounded"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-green-600 text-white font-semibold px-4 py-2 rounded"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-md shadow-md w-1/2 max-w-2xl">
            <div className="flex space-x-4 mb-4">
              <button 
                className={`px-4 py-2 rounded ${activeTab === 'inventory' ? 'bg-gray-950 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('inventory')}
              >
                Inventory Details
              </button>
              {selectedTask?.additionalData && selectedTask.additionalData.length > 0 && (
                <button 
                  className={`px-4 py-2 rounded ${activeTab === 'sandblasting' ? 'bg-gray-950 text-white' : 'bg-gray-200'}`}
                  onClick={() => setActiveTab('sandblasting')}
                >
                  Sand Blasting Details
                </button>
              )}
              {selectedTask?.secondData && selectedTask.secondData.length > 0 && (
                <button 
                  className={`px-4 py-2 rounded ${activeTab === 'painting' ? 'bg-gray-950 text-white' : 'bg-gray-200'}`}
                  onClick={() => setActiveTab('painting')}
                >
                  Painting Details
                </button>
              )}
            </div>

            <div className="space-y-4 font-sans">
              {activeTab === 'inventory' && selectedTask && (
                <div>
                  <strong>Order ID:</strong> {selectedTask.orderId}
                  <div><strong>Status:</strong> {selectedTask.status}</div>
                  <div><strong>Damage Type:</strong> {selectedTask.damageType}</div>
                  <div><strong>Notes:</strong> {selectedTask.notes}</div>
                  <strong>Completed:</strong>
                  {(() => {
                    const { formattedDate, formattedTime } = formatDate(selectedTask.createdAt);
                    return <p>{formattedDate}, {formattedTime}</p>;
                  })()}
                  {selectedTask.imageUrl && (
                    <img
                      src={selectedTask.imageUrl}
                      alt="Task"
                      className="mt-2"
                      style={{ maxWidth: '200px', height: '180px' }}
                    />
                  )}
                </div>
              )}

              {activeTab === 'sandblasting' && selectedTask?.additionalData?.[0] && (
                <div>
                  <strong>Sand Blasting Notes:</strong> {selectedTask.additionalData[0].notes}
                  <div><strong>Sand Blasting Level:</strong> {selectedTask.additionalData[0].sandBlastingLevel}</div>
                  <strong>Completed:</strong>
                  {(() => {
                    const { formattedDate, formattedTime } = formatDate(selectedTask.additionalData[0].createdAt);
                    return <p>{formattedDate}, {formattedTime}</p>;
                  })()}
                  {selectedTask.additionalData[0].imageUrl && (
                    <img
                      src={selectedTask.additionalData[0].imageUrl}
                      alt="Additional"
                      className="mt-4"
                      style={{ maxWidth: '200px', height: '180px' }}
                    />
                  )}
                </div>
              )}

              {activeTab === 'painting' && selectedTask?.secondData?.[0] && (
                <div>
                  <strong>Paint Color:</strong> {selectedTask.secondData[0].pColor}
                  <div><strong>Paint Type:</strong> {selectedTask.secondData[0].pType}</div>
                  <div><strong>Notes:</strong> {selectedTask.secondData[0].notes}</div>
                  <strong>Completed:</strong>
                  {(() => {
                    const { formattedDate, formattedTime } = formatDate(selectedTask.secondData[0].createdAt);
                    return <p>{formattedDate}, {formattedTime}</p>;
                  })()}
                  {selectedTask.secondData[0].imageUrl && (
                    <img
                      src={selectedTask.secondData[0].imageUrl}
                      alt="Second"
                      className="mt-2"
                      style={{ maxWidth: '200px', height: '180px' }}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-center space-x-4">
              <button
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
                onClick={() => handleProcessClick(selectedTask.orderId)}
              >
                Process
              </button>
              <button
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


