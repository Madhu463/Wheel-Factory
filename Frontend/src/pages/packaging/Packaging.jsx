import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from '@/hooks/use-toast'; 

const Packaging = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;
  const [orderDetails, setOrderDetails] = useState(null);
  const [ratingOptions, setRatingOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        console.error("Error fetching data:", error);
        setError('Failed to load order details.');
      }
    }
  };

  const fetchRatingOptions = async () => {
    try {
      const response = await axios.get('http://localhost:5041/api/Ratings');
      setRatingOptions(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching rating options:", error);
      setError('Failed to load rating options.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchOrderDetails();
      await fetchRatingOptions();
      console.log(ratingOptions);
      setLoading(false);
    };

    fetchData();
  }, [orderId]);

  const formik = useFormik({
    initialValues: {
      iRating: '',
      notes: '',
      imageUrl: null,
    },
    validationSchema: Yup.object({
    iRating: Yup.string().required('Rating is required'),
      notes: Yup.string().required('Notes are required'),
      imageUrl: Yup.mixed().required('Proof of Inspection (image) is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('orderId', orderDetails?.orderId);
      formData.append('status', orderDetails?.status );
      formData.append('iRating', values.iRating);
      formData.append('notes', values.notes);
      if (values.imageUrl) {
        formData.append('imageUrl', values.imageUrl);
      }

      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5041/api/Task/packaging', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        toast({ title: 'Packaging task submitted successfully' ,
        style: {
          backgroundColor: "#90EE90",
          color: "black",
          fontWeight: "bold"
        }});
        
        resetForm();
      } catch (error) {
        console.error('Error submitting packaging task:', error);
        toast({ title: 'Failed to submit the packaging task', variant: 'error' });
      }
    },
  });

  if (loading) return <p>Loading...</p>;

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
            onClick={() => navigate(`/Workers/${role} `)} 
          >
            PREVIOUS
          </button>
          <h1 className="text-xl text-white pt-1 font-bold">PACKAGING</h1>
        </div>
        <button
          className="border border-red-400 p-2 rounded-md shadow-sm font-bold text-red-500"
          onClick={() =>{localStorage.clear(); navigate('/')}}
        >
          LOGOUT
        </button>
      </header>

      <div className="md:flex mt-4 space-x-4">
        {/* Left Side - Profile */}
        <div className="md:w-1/2  p-4 bg-gray-50">
          <div className="flex items-center mb-8">
            <div className="bg-gray-300 rounded-full h-20 w-20 flex items-center justify-center text-3xl text-gray-600">
              PG
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-extrabold text-gray-900">WORKER4-PACKAGING</h2>
              <p className="text-sm text-gray-650">Packaging</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-m uppercase tracking-wide text-gray-600 font-semibold">Role</p>
              <p className="mt-1 text-lg font-medium text-gray-900">Packaging Technician</p>
            </div>
            <div>
              <p className="text-m uppercase tracking-wide text-gray-600 font-semibold">ID</p>
              <p className="mt-1 text-lg font-medium text-gray-900">Worker004</p>
            </div>
            <div>
              <p className="text-m uppercase tracking-wide text-gray-600 font-semibold">Type of Work</p>
              <p className="mt-1 text-lg font-medium text-gray-900">Full-time</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="md:w-2/3 p-4">
          {error && <p className="text-red-500">{error}</p>}
          {orderDetails && (
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
          )}

          <form className="mt-4 space-y-4" onSubmit={formik.handleSubmit}>
            {/* Rating */}
            <div>
              <label className="text-lg font-bold text-black">Rating:</label>
              <select
                name="iRating"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={formik.values.iRating}
                onChange={formik.handleChange}
              >
                <option value="">select rating</option>
                {ratingOptions.map((option) => (
                  <option key={option.id}> {option.iRating} 
                   
                  </option>

                ))}
              </select>
              {formik.errors.iRating && formik.touched.iRating && (
                <p className="text-red-500">{formik.errors.iRating}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="text-lg font-bold text-black">Notes:</label>
              <textarea
                name="notes"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md h-28"
                value={formik.values.notes}
                onChange={formik.handleChange}
              ></textarea>
              {formik.errors.notes && formik.touched.notes && (
                <p className="text-red-500">{formik.errors.notes}</p>
              )}
            </div>

            <div>
              <label className="text-lg font-bold text-black">Proof of Inspection (Image):</label>
              <input
                type="file"
                name="imageUrl"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                onChange={(event) => {
                  formik.setFieldValue('imageUrl', event.currentTarget.files[0]);
                }}
              />
              {formik.errors.imageUrl && formik.touched.imageUrl && (
                <p className="text-red-500">{formik.errors.imageUrl}</p>
              )}
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

           
          </form>
        </div>
      </div>
    </div>
  );
};

export default Packaging;

