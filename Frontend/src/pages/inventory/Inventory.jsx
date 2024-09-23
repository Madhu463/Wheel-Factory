import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from '@/hooks/use-toast'; 
  const Inventory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);
    const [role, setRole] = useState('');
    const orderId = location.state?.orderId;
  
    useEffect(() => {
      if (orderId) {
        const fetchOrderData = async () => {
          try {
            const token = localStorage.getItem('token');
            setRole(localStorage.getItem('role'));
            if (!token) {
              throw new Error('Authorization token not found');
            }
            const response = await axios.get(`http://localhost:5041/api/Orders/${orderId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setOrderData(response.data);
          } catch (error) {
            console.error('Error fetching order data:', error);
          }
        };
  
      
        fetchOrderData();
        
      }
    }, [orderId]);
  
    const handleSubmit = async ({ resetForm }) => {
      const formData = new FormData();
      formData.append('clientName', orderData?.clientName || '');
      formData.append('year', orderData?.year || '');
      formData.append('make', orderData?.make || '');
      formData.append('model', orderData?.model || '');
      formData.append('damageType', orderData?.damageType || '');
      formData.append('imageUrl', orderData?.imageUrl || '');
      formData.append('notes', orderData?.notes || '');
      formData.append('status', orderData?.status || '');
  
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authorization token not found');
        }
        await axios.put(`http://localhost:5041/api/Orders/Inventory/${orderId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        toast({ title: 'Inventory task submitted successfully' , duration: 5000,
        style: {
          backgroundColor: "#90EE90",
          color: "black",
          fontWeight: "bold"
        }},
        );
        resetForm();
      } catch (error) {
        console.error('Error submitting form', error);
      }
    };
  
    const handleScrap = async ({ resetForm }) => {
      const requestBody = {
        clientName: orderData?.clientName || '',
        year: orderData?.year || '',
        make: orderData?.make || '',
        model: orderData?.model || '',
        damageType: orderData?.damageType || '',
        notes: orderData?.notes || '',
        imageUrl: null,
        status: orderData?.status || ''
      };
  
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authorization token not found');
        }
        await axios.put(`http://localhost:5041/api/Orders/scrap/${orderId}`, requestBody, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        toast({ title: 'Scrap order submitted successfully' });
        resetForm();


      } catch (error) {
        console.error('Error marking order as scrap', error);
      }
    };
  
    return (
      <div className="p-4">

<header 
className="flex justify-between items-center p-8 rounded-md shadow-md mb-8"
style={{
backgroundImage: 'url("public/bg-images/bag.jpg")',
backgroundSize: 'cover', 
backgroundPosition: 'center', 
}}
>     
          <div className="flex space-x-4">
            <button
              className="border border-gray-300 font-bold text-white p-2 rounded-md shadow-sm hover:bg-gray-200 hover:text-black transition"
              onClick={() => navigate(`/workers/${role}`)}
            >
              PREVIOUS
            </button>
            <h1 className="text-xl text-white pt-1 font-bold">LEVEL-1 INVENTORY MANAGEMENT</h1>
          </div>
          <button
            className="border border-red-400 hover:text-black p-2 rounded-md shadow-sm font-bold text-red-500 hover:bg-red-600 transition"
            onClick={() =>{localStorage.clear(); navigate('/')}}
          >
            LOGOUT
          </button>
        </header>
  
        <div className="md:flex mt-4 space-x-4">
          {/* Left Side - Profile */}
          <div className="md:w-1/2 p-4 bg-gray-50 rounded-md shadow-md">
            <div className="flex items-center mb-8">
              <div className="bg-gray-300 rounded-full h-20 w-20 flex items-center justify-center text-3xl text-gray-600">
               IN
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-extrabold text-gray-900">WORKER1-INVENTORY</h2>
                <p className="text-sm text-gray-650">Inventory</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-600 font-semibold">Role</p>
                <p className="mt-1 text-lg font-medium text-gray-900">Inventory Technician</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-600 font-semibold">ID</p>
                <p className="mt-1 text-lg font-medium text-gray-900">Worker001</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-600 font-semibold">Type of Work</p>
                <p className="mt-1 text-lg font-medium text-gray-900">Full-time</p>
              </div>
            </div>
          </div>
  
          {/* Right Side - Order Form Fields */}
          <div className="md:w-1/2 p-4 bg-gray-50 rounded-md shadow-md">
            <h2 className="text-lg font-bold text-black mb-4">Order Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Order Id:</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{orderData?.orderId || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Client Name:</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{orderData?.clientName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Year:</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{orderData?.year || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Make:</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{orderData?.make || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Model:</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{orderData?.model || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Damage Type:</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{orderData?.damageType || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Notes:</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{orderData?.notes || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Status:</label>
                <p className="mt-1 text-lg font-medium text-gray-900">{orderData?.status || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Image:</label>
                {orderData?.imageUrl ? (
                  <img src={orderData.imageUrl} className="mt-1" style={{ maxWidth: '100%', height: 'auto' }} alt="Order" />
                ) : (
                  <p className="mt-1 text-gray-700">No image available</p>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-4">
              <button
                className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 transition ease-in-out duration-300"
                onClick={handleSubmit}
                type="button"
              >
                Submit
              </button>
              <button
                className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 transition ease-in-out duration-300"
                onClick={handleScrap}
                type="button"
              >
                Scrap
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Inventory;

  