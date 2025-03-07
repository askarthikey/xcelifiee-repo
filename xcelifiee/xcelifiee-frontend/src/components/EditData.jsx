// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { motion } from 'framer-motion';

// function EditPublication() {
//   const { id } = useParams(); // Fetch the publication ID from the URL
//   const [formData, setFormData] = useState({
//     username: '',
//     typeOfPublication: '',
//     nameOfJournal: '',
//     titleOfPaper: '',
//     dateOfPublication: '',
//     indexing: '',
//     authorPosition: '',
//     linkForProof: '',
//   });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   // Fetch publication data on component mount
//   useEffect(() => {
//     const fetchPublication = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await fetch(`http://localhost:4000/user-api/getPublicationById/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setFormData(data);
//         } else {
//           setError('Failed to fetch publication details. Please try again.');
//         }
//       } catch (err) {
//         console.error('Error fetching publication:', err);
//         setError('An error occurred. Please try again later.');
//       }
//     };

//     fetchPublication();
//   }, [id]);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     const token = localStorage.getItem('token');
//     try {
//       const response = await fetch(`http://localhost:4000/updatePublications/${id}`, {
//         method: 'PUT',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         navigate('/publications'); // Redirect to the publications list page
//       } else {
//         setError('Failed to update publication. Please try again.');
//       }
//     } catch (err) {
//       console.error('Error updating publication:', err);
//       setError('An error occurred. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-zinc-100">
//       <div className="relative w-full max-w-2xl mx-4">
//         <div className="bg-white rounded-lg shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70 hover:shadow-2xl transition-shadow duration-300 p-8 relative z-10">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="text-3xl font-bold text-center mb-6 text-violet-800"
//           >
//             Edit Publication
//           </motion.h2>

//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded mb-4">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             {Object.keys(formData).map((key) => (
//               <div key={key} className="mb-4">
//                 <label htmlFor={key} className="block text-sm font-medium text-violet-700 capitalize">
//                   {key.replace(/([A-Z])/g, ' $1')}
//                 </label>
//                 <input
//                   type={key === 'dateOfPublication' ? 'date' : 'text'}
//                   id={key}
//                   name={key}
//                   value={formData[key]}
//                   onChange={handleInputChange}
//                   required={key !== 'linkForProof'} // Optional for proof link
//                   disabled={isLoading}
//                   className="mt-2 p-2 border border-gray-300 rounded w-full focus:outline-none hover:shadow-xl hover:shadow-violet-200 transition-shadow duration-300 hover:ring-1 hover:ring-violet-500 focus:ring-2 focus:ring-violet-500"
//                 />
//               </div>
//             ))}

//             <div className="mb-4">
//               <motion.button
//                 type="submit"
//                 disabled={isLoading}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.4 }}
//                 className="w-full bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg border border-transparent hover:bg-white hover:text-violet-700 hover:border-violet-700 text-lg transition-colors duration-300 shadow-md hover:shadow-lg hover:shadow-violet-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-violet-700 disabled:hover:text-white disabled:hover:scale-100"
//               >
//                 {isLoading ? 'Saving...' : 'Save Changes'}
//               </motion.button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditPublication;
function EditData() {
  return (
    <div>Page Under Construction.</div>
  )
}

export default EditData