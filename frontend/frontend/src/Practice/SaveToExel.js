// import React, { useState } from 'react';
// import axios from 'axios';

// const FormComponent = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     // other form fields
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:8080/submit-form', formData);
//       alert('Form submitted successfully');
//     } catch (error) {
//       console.error('Error submitting form', error);
//     }
//   };

//   const handleDownload = async () => {
//     try {
//       const response = await axios.get('http://localhost:8080/download', { responseType: 'blob' });
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'data.xlsx'); // Ensure .xlsx extension
//       document.body.appendChild(link);
//       link.click();
//     } catch (error) {
//       console.error('Error downloading file', error);
//     }
//   };
  

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//         />
//         {/* Other form fields */}
//         <button type="submit">Submit</button>
//       </form>
//       <button onClick={handleDownload}>Download Excel</button>
//     </div>
//   );
// };

// export default FormComponent;
