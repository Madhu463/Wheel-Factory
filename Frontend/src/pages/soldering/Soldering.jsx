import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const Soldering = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId || 0; 
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(); 
  const [sandBlastingOptions, setSandBlastingOptions] = useState([]); 
  const [role, setRole] = useState('');

const fetchOrderDetails = async () => {
  if (orderId !== 0) {
    try {
      const token = localStorage.getItem('token');
      setRole(localStorage.getItem('role'));
      const response = await axios.get(`http://localhost:5041/api/Orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response.data);
      setOrderDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Failed to load order details. Please try again later.');
      setLoading(false);
    }
  } else {
    setError('');
    setLoading(false);
  }
};

  // Fetch sand blasting levels
  const fetchSandBlastingLevels = async () => {
    try {
      const response = await axios.get('http://localhost:5041/api/SandBlastingLevels'); // Adjust the URL to your API endpoint
      setSandBlastingOptions(response.data);
      console.log(response.data) 
    } catch (error) {
      console.error("Error fetching sand blasting levels:", error);
      setError('Failed to load sand blasting levels.');
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    fetchSandBlastingLevels(); 
  }, [orderId]);

const formik = useFormik({
  initialValues: {
    sandBlastingLevel: '',
    solderingNote: '',
    imageUrl: null,
  },
  validationSchema: Yup.object({
    sandBlastingLevel: Yup.string().required('Sandblasting level is required'),
    solderingNote: Yup.string().required('SandBlasting note is required'),
    imageUrl: Yup.mixed().required('An image is required'),
  }),
  onSubmit: async (values,{resetForm}) => {
    const formData = new FormData();
    formData.append('orderId', orderDetails?.orderId);
    formData.append('status', orderDetails?.status);
    formData.append('sandBlastingLevel', values.sandBlastingLevel);
    formData.append('notes', values.solderingNote);

    if (values.imageUrl) {
      formData.append('imageUrl', values.imageUrl);  // Append the uploaded file
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5041/api/task/soldering', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      toast({ title: 'sandBlasting task  submitted successfully' ,
        style: {
          backgroundColor: "#90EE90",
          color: "black",
          fontWeight: "bold"
        }});
        resetForm();
    } catch (error) {
      console.error('Error submitting form', error);
      toast({ title: 'Failed to submit the painting task', variant: 'error' });
    }
  },
});


  if (loading) {
    return <p>Loading order details...</p>; 
  }
  
    return (
      <div className="min-h-screen bg-gray-100 ">
        <div className="max-w-7xl mx-auto">
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
      className="border border-gray-300 font-bold text-white p-2 rounded-md shadow-sm"
      onClick={() => navigate(`/Workers/${role}`)}
    >
      PREVIOUS
    </button>
    <h1 className="text-xl text-white font-bold">SANDBLASTING</h1>
  </div>
  <button 
    className="border border-red-400 p-2 rounded-md font-bold text-red-500"
    onClick={() =>{localStorage.clear(); navigate('/')}}
  >
    LOGOUT
  </button>
</header>

  
          <div className="bg-white shadow-xl rounded-lg overflow-hidden md:flex">
            {/* Profile Section */}
            <div className="md:w-1/2 p-4 bg-gray-50">
              <div className="flex items-center mb-8">
                <div className="bg-gray-300 rounded-full h-20 w-20 flex items-center justify-center text-3xl text-gray-600">
                <img className="bg-gray-400 rounded-full h-25 w-25 flex items-center justify-center text-3xl text-gray-600"
         src="public/bg-images/profile.jpg"/>                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-extrabold text-gray-900">WORKER2-SANDBLASTING</h2>
                  <p className="text-sm text-gray-650">SandBlasting </p>
                </div>
              </div>
              <div className="space-y-4">
  <div className="">
    <p className="text-sm uppercase text-lg text-gray-900 font-bold">Role:</p>
    <p className="mt-1 text-md font-medium text-gray-700">SandBlasting Technician</p>
  </div>
  <div className="">
    <p className="text-sm uppercase  text-lg text-gray-900 font-bold">ID:</p>
    <p className="mt-1 text-md font-medium text-gray-700">Worker002</p>
  </div>
  <div className="">
    <p className="text-sm uppercase text-lg text-gray-900 font-bold">Type of Work:</p>
    <p className="mt-1 text-md font-medium text-gray-700">Full-time</p>
  </div>
              
              </div>
            </div>
  
            {/* Form Section */}
            <div className="md:w-2/3 p-8">
              {orderDetails ? (
                <div className="mb-8 space-y-4">
                  <div>
                    <h2 className="text-lg font-bold">Order Id:</h2>
                    <p className="mt-1 text-gray-900">{orderDetails.orderId}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Status:</h2>
                    <p className="mt-1 text-gray-900 font-serif text-m">{orderDetails.status}</p>
                  </div>
                </div>
              ) : (
                <div className="mb-8 text-center">
                  <h2 className="text-lg font-bold text-red-500">{error}</h2>
                </div>
              )}
  
              <form className="space-y-6" onSubmit={formik.handleSubmit}>
                <div>
                  <label className="text-lg font-bold">SandBlasting Level:</label>
                  <select
                    name="sandBlastingLevel"
                    className="mt-1 block w-full p-2 border text-gray-900 font-serif text-m border-gray-300 rounded-md"
                    value={formik.values.sandBlastingLevel}
                    onChange={formik.handleChange}
                  >
                    <option value="">Select SandBlasting Level</option>
                    {sandBlastingOptions.map((option) => (
                      <option key={option.id}>{option.sandBlastingLevel}</option>
                    ))}
                  </select>
                  {formik.errors.sandBlastingLevel && formik.touched.sandBlastingLevel && (
                    <p className="text-red-500">{formik.errors.sandBlastingLevel}</p>
                  )}
                </div>
  
                <div>
  <label className="text-lg font-bold text-black">SandBlasting Note:</label>
  <textarea
    className="mt-1 block w-full p-2 border border-gray-300 rounded-md h-28"
    name="solderingNote"
    value={formik.values.solderingNote}
    onChange={formik.handleChange}
  ></textarea>
  {formik.errors.solderingNote && formik.touched.solderingNote && (
    <p className="text-red-500">{formik.errors.solderingNote}</p>
  )}
</div>

  
                <div>
                  <label className="text-lg font-bold">Upload Image:</label>
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

                <div className="flex justify-center space-x-4 mt-4">
                <button 
                  type="submit" 
                  className="border border-gray-300 font-bold text-white p-2 rounded-md shadow-sm bg-black px-4 py-2"
                  onClick={() => {toast({title:"Form submitted Successfully",
                  style: {
                    backgroundColor: "#90EE90",
                    color: "black",
                    fontWeight: "bold"
                  }})}}
                >
                  Submit
                </button>
            <button
              type="submit"
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600"
              onClick={() => navigate(`/Workers/${role} `)}>
              Cancel
            </button>
          </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
 
  
   export default Soldering;




















