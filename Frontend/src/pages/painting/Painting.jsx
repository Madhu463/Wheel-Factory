import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from '@/hooks/use-toast';

const Painting = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paintTypes, setPaintTypes] = useState([]);
  const [paintColors, setPaintColors] = useState([]);
  const [role, setRole] = useState('');

  const fetchOrderDetails = async () => {
    if (orderId) {
      try {
        const token = localStorage.getItem('token');
        setRole(localStorage.getItem('role'));

        const response = await axios.get(`http://localhost:5041/api/Orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Order ID is missing.');
      setLoading(false);
    }
  };

  const fetchPaintTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5041/api/PaintTypes');
      setPaintTypes(response.data);
    } catch (error) {
      console.error("Error fetching paint types:", error);
      setError('Failed to load paint types. Please try again later.');
    }
  };

  const fetchPaintColors = async () => {
    try {
      const response = await axios.get('http://localhost:5041/api/Colors');
      setPaintColors(response.data);
    } catch (error) {
      console.error("Error fetching paint colors:", error);
      setError('Failed to load paint colors. Please try again later.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchOrderDetails();
      await fetchPaintTypes();
      await fetchPaintColors();
    };

    fetchData();
  }, [orderId]);

  const formik = useFormik({
    initialValues: {
      paint: '',
      typeOfPaint: '',
      notes: '',
      imageUrl: null,
    },
    validationSchema: Yup.object({
      paint: Yup.string().required('Paint is required'),
      typeOfPaint: Yup.string().required('Type of paint is required'),
      notes: Yup.string().required('Notes are required'),
      imageUrl: Yup.mixed().required('Image is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('orderId', orderDetails?.orderId);
      formData.append('pColor', values.paint);
      formData.append('pType', values.typeOfPaint);
      formData.append('status', orderDetails?.status);
      formData.append('notes', values.notes);
      if (values.imageUrl) {
        formData.append('imageUrl', values.imageUrl);
      }

      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5041/api/Task/painting', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        toast({ title: 'Painting task submitted successfully' ,
        style: {
          backgroundColor: "#90EE90",
          color: "black",
          fontWeight: "bold"
        }});
        resetForm();
      } catch (error) {
        console.error('Error submitting painting task:', error);
        toast({ title: 'Failed to submit the painting task', variant: 'error' });
      }
    },
  });

  return (
    <div className="p-4">
      <header
        className="flex justify-between items-center p-8 rounded-md shadow-md mb-8"
        style={{
          backgroundImage: 'url("public/bg-images/bag.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >        <div className="flex space-x-4">
          <button
            className="border border-gray-300 font-bold text-white p-2 rounded-md shadow-sm"
            onClick={() => navigate(`/Workers/${role}`)}
          >
            PREVIOUS
          </button>
          <h1 className="text-xl text-white pt-1 font-bold">PAINTING</h1>
        </div>
        <button
          className="border border-red-400 p-2 rounded-md shadow-sm font-bold text-red-500"
          onClick={() => { localStorage.clear(); navigate('/') }}
        >
          LOGOUT
        </button>
      </header>

      <form className="bg-white shadow-xl rounded-lg overflow-hidden md:flex mt-4 space-y-4 md:space-y-0" onSubmit={formik.handleSubmit}>
        {/* Profile Section */}
        <div className="md:w-1/2 p-4 bg-gray-50">
          <div className="flex items-center mb-8">
            <div className="bg-gray-300 rounded-full h-20 w-20 flex items-center justify-center text-3xl text-gray-600">
              PT
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-extrabold text-gray-900">WORKER2-PAINTING</h2>
              <p className="text-sm text-gray-650">Painting</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-m uppercase tracking-wide text-gray-600 font-semibold">Role</p>
              <p className="mt-1 text-lg font-medium text-gray-900">Painting Technician</p>
            </div>
            <div>
              <p className="text-m uppercase tracking-wide text-gray-600 font-semibold">ID</p>
              <p className="mt-1 text-lg font-medium text-gray-900">Worker003</p>
            </div>
            <div>
              <p className="text-m uppercase tracking-wide text-gray-600 font-semibold">Type of Work</p>
              <p className="mt-1 text-lg font-medium text-gray-900">Full-time</p>
            </div>
          </div>
        </div>

        {/* Right Side - Order Details and Painting Form */}
        <div className="md:w-1/2 p-4">
          {/* Order Details */}
          {loading ? (
            <p>Loading order details...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : orderDetails ? (
            <div className="mt-4 space-y-4">
              <div>
                <h2 className="text-lg font-bold">Order Id:</h2>
                <p className="mt-1 text-gray-700">{orderDetails.orderId}</p>
              </div>
              <div>
                <h2 className="text-lg font-bold">Status:</h2>
                <p className="mt-1 text-gray-700">{orderDetails.status}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-gray-700">No order details available.</p>
          )}

          {/* Painting Form */}
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-lg font-bold text-black">Paint Color:</label>
              <select
                name="paint"
                className="mt-1 block w-full text-black font-serif text-medium p-2 border border-gray-300 rounded-md"
                value={formik.values.paint}
                onChange={formik.handleChange}
              >
                <option value="" label="Select paint color" />
                {paintColors.map((color) => (
                  <option key={color.id} value={color.pColor}>
                    {color.pColor}
                  </option>
                ))}
              </select>
              {formik.errors.paint && formik.touched.paint && (
                <p className="text-red-500">{formik.errors.paint}</p>
              )}
            </div>

            <div>
              <label className="text-lg font-bold text-black">Type of Paint:</label>
              <select
                name="typeOfPaint"
                className="mt-1 block w-full p-2 border text-medium font-serif border-gray-300 rounded-md"
                value={formik.values.typeOfPaint}
                onChange={formik.handleChange}
              >
                <option value="" label="Select paint type" />
                {paintTypes.map((type) => (
                  <option key={type.id} value={type.pType}>
                    {type.pType}
                  </option>
                ))}
              </select>
              {formik.errors.typeOfPaint && formik.touched.typeOfPaint && (
                <p className="text-red-500">{formik.errors.typeOfPaint}</p>
              )}
            </div>

            <div>
              <label className="text-lg font-bold text-black">Notes:</label>
              <textarea
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md h-28"
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
              ></textarea>
              {formik.errors.notes && formik.touched.notes && (
                <p className="text-red-500">{formik.errors.notes}</p>
              )}
            </div>

            <div>
              <label className="text-lg font-bold text-black">Upload Image:</label>
              <input
                type="file"
                name="imageUrl"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                onChange={(event) => {
                  formik.setFieldValue("imageUrl", event.currentTarget.files[0]);
                }}
              />
              {formik.errors.imageUrl && formik.touched.imageUrl && (
                <p className="text-red-500">{formik.errors.imageUrl}</p>
              )}
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <button
              type="submit"
              className="border border-gray-300 font-bold text-white p-2 rounded-md shadow-sm bg-black px-4 py-2"
            >
              Submit
            </button>

            <button
              type="submit"
              className="border border-gray-300 font-bold text-white p-2 rounded-md shadow-sm bg-black px-4 py-2"
              onClick={() => navigate(`/Workers/${role} `)}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Painting;
