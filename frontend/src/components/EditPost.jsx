// import { useContext, useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import { FaArrowLeft, FaTrash, FaDollarSign, FaTag, FaInfoCircle, FaRupeeSign } from 'react-icons/fa';
// import { toast } from 'react-toastify';

// const EditPost = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { posts, updatePost, deletePostImage } = useContext(AppContext);
//   const [content, setContent] = useState('');
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [removeImage, setRemoveImage] = useState(false);
//   const [descriptionProduct, setDescriptionProduct] = useState('');
//   const [price, setPrice] = useState('');
//   const [productModel, setProductModel] = useState('');
//   const [isFormValid, setIsFormValid] = useState(false);
//   const fileInputRef = useRef(null);

//   // Validate form whenever content, image, or product info changes
//   useEffect(() => {
//     const hasContent = content.trim().length > 0;
//     const hasImage = image !== null || imagePreview !== null;
//     const hasProductInfo = descriptionProduct.trim() || price || productModel.trim();
    
//     // Check if product info is complete if any field is filled
//     const isProductInfoComplete = !descriptionProduct.trim() && !price && !productModel.trim() ? true : 
//                                  descriptionProduct.trim() && price && productModel.trim();
    
//     // Form is valid only if there's content AND (either no product info or product info is complete)
//     setIsFormValid(
//       hasContent && 
//       (!hasProductInfo || isProductInfoComplete)
//     );
//   }, [content, image, imagePreview, descriptionProduct, price, productModel]);

//   useEffect(() => {
//     const post = posts.find(p => p._id === id);
//     if (post) {
//       setContent(post.content || '');
//       setImagePreview(post.imageUrl || null);
//       setDescriptionProduct(post.descriptionProduct || '');
//       setPrice(post.price || '');
//       setProductModel(post.productModel || '');
//       setLoading(false);
//     } else {
//       toast.error('Post not found');
//       navigate('/home');
//     }
//   }, [id, posts, navigate]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validate file type
//     if (!file.type.startsWith('image/')) {
//       toast.error('Please select an image file (JPEG, PNG, etc.)');
//       return;
//     }
    
//     // Validate file size (5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error('Image size should be less than 5MB');
//       return;
//     }

//     setImage(file);
//     setImagePreview(URL.createObjectURL(file));
//     setRemoveImage(false); // If adding new image, cancel removal
//   };

//   const handleRemoveImage = async () => {
//     try {
//       setIsSubmitting(true);
      
//       // Check if there's an existing image in the backend
//       const post = posts.find(p => p._id === id);
//       const hasBackendImage = post?.imageUrl;
      
//       // If there's a backend image, try to delete it
//       if (hasBackendImage) {
//         const success = await deletePostImage(id);
//         if (!success) return; // If deletion failed, don't proceed
//       }
      
//       // Clear the frontend image state regardless
//       setImage(null);
//       setImagePreview(null);
//       setRemoveImage(true);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
      
//       // If it was just a frontend image (not saved yet), no need for backend call
//       if (!hasBackendImage) {
//         toast.success("Image removed successfully");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate content is required (like in PostForm)
//     if (!content.trim()) {
//       toast.error('Please add some text to your post');
//       return;
//     }
    
//     // Validate product info if any field is filled
//     const hasProductInfo = descriptionProduct.trim() || price || productModel.trim();
//     if (hasProductInfo) {
//       if (!descriptionProduct.trim() || !price || !productModel.trim()) {
//         toast.error('Please complete all product information fields');
//         return;
//       }
//     }

//     setIsSubmitting(true);
//     try {
//       const formData = new FormData();
//       if (content.trim()) formData.append('content', content);
//       if (image) formData.append('image', image);
//       if (removeImage) formData.append('removeImage', 'true');
      
//       // Add product information as a JSON string
//       const productInfo = {
//         description: descriptionProduct,
//         price: price,
//         model: productModel
//       };
//       formData.append('productInfo', JSON.stringify(productInfo));

//       const success = await updatePost(id, formData);
//       if (success) {
//         navigate(-1); // Go back to previous page
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading post...</div>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto">
//       <div className="px-4 py-4 flex items-center sticky top-0 bg-white z-10 border-b">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition duration-200 ease-in-out shadow-sm border border-gray-200"
//           aria-label="Go back"
//         >
//           <FaArrowLeft className="text-xl" />
//         </button>
//         <h1 className="text-xl md:text-2xl font-bold ml-4">Edit Product Post</h1>
//       </div>

//       <div className="p-4">
//         <form onSubmit={handleSubmit}>
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Post Content (Required)
//             </label>
//             <textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="What's on your mind? (Required)"
//               className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows="3"
//               maxLength={150}
//               required
//             />
//             <div className="flex justify-end mt-1">
//               <span className={`text-sm ${content.length === 150 ? 'text-red-500' : 'text-gray-500'}`}>
//                 {content.length}/150
//               </span>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Price (INR)
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                
//                   <FaRupeeSign className="text-gray-400" />
//                 </div>
//                 <input
//                   type="number"
//                   value={price}
//                   onChange={(e) => setPrice(e.target.value)}
//                   placeholder="0.00"
//                   step="0.01"
//                   min="0"
//                   className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Product Condition
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FaTag className="text-gray-400" />
//                 </div>
//                 <select
//                   value={productModel}
//                   onChange={(e) => setProductModel(e.target.value)}
//                   className="pl-10 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select condition</option>
//                   <option value="New">New</option>
//                   <option value="Used">Used</option>
//                   <option value="Refurbished">Refurbished</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Product Description
//             </label>
//             <div className="relative">
//               <div className="absolute top-3 left-3 text-gray-400">
//                 <FaInfoCircle />
//               </div>
//               <textarea
//                 value={descriptionProduct}
//                 onChange={(e) => setDescriptionProduct(e.target.value)}
//                 placeholder="Describe your product in detail..."
//                 className="w-full p-4 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows="4"
//                 maxLength={500}
//               />
//             </div>
//           </div>
          
//           {/* Image preview section */}
//           {imagePreview && (
//             <div className="mt-4 relative group mb-6">
//               <img 
//                 src={imagePreview} 
//                 alt="Preview" 
//                 className="w-full max-h-96 rounded-lg object-contain border border-gray-200"
//               />
//               <div className="absolute top-3 right-3 flex space-x-2">
//                 {posts.find(p => p._id === id)?.imageUrl && (
//                   <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
//                     Saved Image
//                   </span>
//                 )}
//                 <button
//                   type="button"
//                   onClick={handleRemoveImage}
//                   className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
//                   aria-label="Remove image"
//                   disabled={isSubmitting}
//                 >
//                   <FaTrash className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           )}
          
//           <div className="flex justify-between items-center mt-6">
//             <div className="flex items-center space-x-3">
//               <label className="inline-flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleImageChange}
//                   accept="image/*"
//                   className="hidden"
//                 />
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span className="text-sm font-medium text-gray-700">
//                   {imagePreview ? 'Change Image' : 'Add Image'}
//                 </span>
//               </label>
//             </div>
            
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
//               disabled={isSubmitting || !isFormValid}
//             >
//               {isSubmitting ? 'Updating Post...' : 'Update Post'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditPost;


// import { useContext, useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import { FaArrowLeft, FaTrash, FaTag, FaInfoCircle, FaRupeeSign, FaPlus, FaTimes } from 'react-icons/fa';
// import { toast } from 'react-toastify';

// const EditPost = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { posts, updatePost } = useContext(AppContext);
//   const [content, setContent] = useState('');
//   const [newImages, setNewImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [imagesToRemove, setImagesToRemove] = useState([]);
//   const [descriptionProduct, setDescriptionProduct] = useState('');
//   const [price, setPrice] = useState('');
//   const [productModel, setProductModel] = useState('');
//   const [isFormValid, setIsFormValid] = useState(false);
//   const fileInputRef = useRef(null);

//   // Validate form
//   useEffect(() => {
//     const hasContent = content.trim().length > 0;
//     const hasImages = newImages.length > 0 || imagePreviews.length > imagesToRemove.length;
//     const hasProductInfo = descriptionProduct.trim() || price || productModel.trim();
    
//     const isProductInfoComplete = !descriptionProduct.trim() && !price && !productModel.trim() ? true : 
//                                  descriptionProduct.trim() && price && productModel.trim();
    
//     setIsFormValid(
//       hasContent && 
//       (!hasProductInfo || isProductInfoComplete)
//     );
//   }, [content, newImages, imagePreviews, imagesToRemove, descriptionProduct, price, productModel]);

//   useEffect(() => {
//     const post = posts.find(p => p._id === id);
//     if (post) {
//       setContent(post.content || '');
//       setDescriptionProduct(post.descriptionProduct || '');
//       setPrice(post.price || '');
//       setProductModel(post.productModel || '');
      
//       // Handle existing images from backend
//       if (post.images && post.images.length > 0) {
//         const existingImagePreviews = post.images.map(img => ({
//           url: img.url,
//           publicId: img.publicId,
//           isExisting: true
//         }));
//         setImagePreviews(existingImagePreviews);
//       }
      
//       setLoading(false);
//     } else {
//       toast.error('Post not found');
//       navigate('/home');
//     }
//   }, [id, posts, navigate]);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (!files.length) return;

//     // Calculate available slots (5 total - existing images not marked for removal + new images)
//     const existingImagesCount = imagePreviews.filter(img => img.isExisting && !imagesToRemove.includes(img.publicId)).length;
//     const availableSlots = 5 - existingImagesCount - newImages.length;
    
//     if (files.length > availableSlots) {
//       toast.error(`Maximum 5 images allowed. You can add ${availableSlots} more images.`);
//       return;
//     }

//     // Validate files
//     const validFiles = files.filter(file => {
//       if (!file.type.startsWith('image/')) {
//         toast.error('Please select only image files (JPEG, PNG, etc.)');
//         return false;
//       }
      
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error(`Image "${file.name}" size should be less than 5MB`);
//         return false;
//       }
      
//       return true;
//     });

//     if (validFiles.length === 0) return;

//     // Create previews for new images
//     const newImagePreviews = validFiles.map(file => ({
//       file: file,
//       url: URL.createObjectURL(file),
//       isExisting: false,
//       isNew: true
//     }));

//     setImagePreviews(prev => [...prev, ...newImagePreviews]);
//     setNewImages(prev => [...prev, ...validFiles]);
    
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleRemoveImage = (index) => {
//     const imageToRemove = imagePreviews[index];
    
//     if (imageToRemove.isExisting && imageToRemove.publicId) {
//       // Mark existing backend image for removal
//       setImagesToRemove(prev => [...prev, imageToRemove.publicId]);
//     } else if (imageToRemove.isNew) {
//       // Remove from new images array
//       const newIndex = imagePreviews.slice(0, index).filter(img => img.isNew).length;
//       setNewImages(prev => prev.filter((_, i) => i !== newIndex));
//     }
    
//     // Remove from previews
//     setImagePreviews(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleRemoveAllImages = () => {
//     // Mark all existing backend images for removal
//     const existingImagesToRemove = imagePreviews
//       .filter(img => img.isExisting && img.publicId)
//       .map(img => img.publicId);
    
//     setImagesToRemove(prev => [...prev, ...existingImagesToRemove]);
//     setImagePreviews([]);
//     setNewImages([]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!content.trim()) {
//       toast.error('Please add some text to your post');
//       return;
//     }
    
//     const hasProductInfo = descriptionProduct.trim() || price || productModel.trim();
//     if (hasProductInfo) {
//       if (!descriptionProduct.trim() || !price || !productModel.trim()) {
//         toast.error('Please complete all product information fields');
//         return;
//       }
//     }

//     setIsSubmitting(true);
//     try {
//       const formData = new FormData();
      
//       // Add content (required by backend validation)
//       formData.append('content', content.trim());
      
//       // Add new images - CORRECTED: use 'images' instead of 'image'
//       newImages.forEach(image => {
//         formData.append('images', image); // Changed from 'image' to 'images'
//       });
      
//       // Add images to remove
//       if (imagesToRemove.length > 0) {
//         imagesToRemove.forEach(publicId => {
//           formData.append('removeImages', publicId);
//         });
//       }
      
//       // Add product information
//       const productInfo = {
//         description: descriptionProduct,
//         price: price,
//         model: productModel
//       };
//       formData.append('productInfo', JSON.stringify(productInfo));

//       const result = await updatePost(id, formData);
//       if (result.success) {
//         navigate(-1);
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   const existingImagesCount = imagePreviews.filter(img => img.isExisting && !imagesToRemove.includes(img.publicId)).length;
//   const totalImagesCount = existingImagesCount + newImages.length;
//   const remainingImageSlots = 5 - totalImagesCount;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-2xl mx-auto bg-white min-h-screen">
//         {/* Header */}
//         <div className="px-4 py-4 flex items-center sticky top-0 bg-white z-10 border-b shadow-sm">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center justify-center bg-white text-gray-700 rounded-full p-2 w-10 h-10 hover:bg-gray-100 transition duration-200 ease-in-out border border-gray-200"
//             aria-label="Go back"
//           >
//             <FaArrowLeft className="text-lg" />
//           </button>
//           <h1 className="text-xl md:text-2xl font-bold ml-4">Edit Product Post</h1>
//         </div>

//         {/* Form */}
//         <div className="p-4 md:p-6">
//           <form onSubmit={handleSubmit}>
//             {/* Content Section */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Post Content <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 placeholder="What's on your mind? (Required)"
//                 className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 rows="3"
//                 maxLength={150}
//                 required
//               />
//               <div className="flex justify-between items-center mt-1">
//                 <span className="text-xs text-gray-500">Describe your product</span>
//                 <span className={`text-sm ${content.length === 150 ? 'text-red-500' : 'text-gray-500'}`}>
//                   {content.length}/150
//                 </span>
//               </div>
//             </div>

//             {/* Product Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Price (INR) {price && <span className="text-red-500">*</span>}
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaRupeeSign className="text-gray-400" />
//                   </div>
//                   <input
//                     type="number"
//                     value={price}
//                     onChange={(e) => setPrice(e.target.value)}
//                     placeholder="0.00"
//                     step="0.01"
//                     min="0"
//                     className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Condition {productModel && <span className="text-red-500">*</span>}
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FaTag className="text-gray-400" />
//                   </div>
//                   <select
//                     value={productModel}
//                     onChange={(e) => setProductModel(e.target.value)}
//                     className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
//                   >
//                     <option value="">Select condition</option>
//                     <option value="New">New</option>
//                     <option value="Used">Used</option>
//                     <option value="Refurbished">Refurbished</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Product Description */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Product Description {descriptionProduct && <span className="text-red-500">*</span>}
//               </label>
//               <div className="relative">
//                 <div className="absolute top-3 left-3 text-gray-400">
//                   <FaInfoCircle />
//                 </div>
//                 <textarea
//                   value={descriptionProduct}
//                   onChange={(e) => setDescriptionProduct(e.target.value)}
//                   placeholder="Describe your product in detail..."
//                   className="w-full p-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   rows="4"
//                   maxLength={500}
//                 />
//               </div>
//               <div className="flex justify-between items-center mt-1">
//                 <span className="text-xs text-gray-500">Detailed product information</span>
//                 <span className={`text-sm ${descriptionProduct.length === 500 ? 'text-red-500' : 'text-gray-500'}`}>
//                   {descriptionProduct.length}/500
//                 </span>
//               </div>
//             </div>

//             {/* Images Section */}
//             <div className="mb-6">
//               <div className="flex justify-between items-center mb-3">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Product Images {totalImagesCount > 0 && `(${totalImagesCount}/5)`}
//                 </label>
//                 {imagePreviews.length > 0 && (
//                   <button
//                     type="button"
//                     onClick={handleRemoveAllImages}
//                     className="text-sm text-red-600 hover:text-red-700 font-medium"
//                   >
//                     Remove All
//                   </button>
//                 )}
//               </div>

//               {/* Image Previews Grid */}
//               {imagePreviews.length > 0 && (
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
//                   {imagePreviews.map((preview, index) => (
//                     <div key={index} className="relative group">
//                       <img 
//                         src={preview.url} 
//                         alt={`Preview ${index + 1}`}
//                         className="w-full h-24 md:h-32 object-cover rounded-lg border border-gray-200"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveImage(index)}
//                         className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                         aria-label="Remove image"
//                       >
//                         <FaTimes className="w-3 h-3" />
//                       </button>
//                       {preview.isExisting && (
//                         <span className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
//                           {imagesToRemove.includes(preview.publicId) ? 'Removing' : 'Saved'}
//                         </span>
//                       )}
//                     </div>
//                   ))}
                  
//                   {/* Add more image slots */}
//                   {remainingImageSlots > 0 && (
//                     <label className="flex flex-col items-center justify-center w-full h-24 md:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
//                       <FaPlus className="w-6 h-6 text-gray-400 mb-1" />
//                       <span className="text-xs text-gray-500 text-center px-2">
//                         Add more ({remainingImageSlots} left)
//                       </span>
//                       <input
//                         type="file"
//                         ref={fileInputRef}
//                         onChange={handleImageChange}
//                         accept="image/*"
//                         multiple
//                         className="hidden"
//                       />
//                     </label>
//                   )}
//                 </div>
//               )}

//               {/* Add Image Button (when no images) */}
//               {imagePreviews.length === 0 && (
//                 <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors p-4">
//                   <FaPlus className="w-8 h-8 text-gray-400 mb-2" />
//                   <span className="text-sm font-medium text-gray-600">Add Product Images</span>
//                   <span className="text-xs text-gray-500 text-center mt-1">
//                     Upload up to 5 images. JPEG, PNG supported. Max 5MB each.
//                   </span>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleImageChange}
//                     accept="image/*"
//                     multiple
//                     className="hidden"
//                   />
//                 </label>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 className="w-full md:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 font-medium"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </button>
              
//               <div className="flex items-center space-x-3 w-full md:w-auto">
//                 <label className="inline-flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg transition-colors w-full md:w-auto justify-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   <span className="text-sm font-medium text-gray-700">
//                     Add Images
//                   </span>
//                   <input
//                     type="file"
//                     onChange={handleImageChange}
//                     accept="image/*"
//                     multiple
//                     className="hidden"
//                   />
//                 </label>
                
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full md:w-auto flex-1"
//                   disabled={isSubmitting || !isFormValid}
//                 >
//                   {isSubmitting ? (
//                     <span className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       Updating...
//                     </span>
//                   ) : (
//                     'Update Post'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditPost;


import { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaArrowLeft, FaTrash, FaTag, FaInfoCircle, FaRupeeSign, FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditPost = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const { posts, updatePost, deletePostImage,userdata } = useContext(AppContext);
  const [content, setContent] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [descriptionProduct, setDescriptionProduct] = useState('');
  const [price, setPrice] = useState('');
  const [productModel, setProductModel] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [removingImageId, setRemovingImageId] = useState(null);
  const fileInputRef = useRef(null);

  // Validate form
  useEffect(() => {
    const hasContent = content.trim().length > 0;
    const hasImages = newImages.length > 0 || imagePreviews.length > imagesToRemove.length;
    const hasProductInfo = descriptionProduct.trim() || price || productModel.trim();
    
    const isProductInfoComplete = !descriptionProduct.trim() && !price && !productModel.trim() ? true : 
                                 descriptionProduct.trim() && price && productModel.trim();
    
    setIsFormValid(
      hasContent && 
      (!hasProductInfo || isProductInfoComplete)
    );
  }, [content, newImages, imagePreviews, imagesToRemove, descriptionProduct, price, productModel]);

  useEffect(() => {
    const post = posts.find(p => p._id === id);
    if (post) {
      setContent(post.content || '');
      setDescriptionProduct(post.descriptionProduct || '');
      setPrice(post.price || '');
      setProductModel(post.productModel || '');
      
      // Handle existing images from backend - add unique IDs
      if (post.images && post.images.length > 0) {
        const existingImagePreviews = post.images.map(img => ({
          id: img.publicId, // Use publicId as unique identifier
          url: img.url,
          publicId: img.publicId,
          isExisting: true
        }));
        setImagePreviews(existingImagePreviews);
      }
      
      setLoading(false);
    } else {
      // toast.error('Post not found');
      navigate('/home');
    }
  }, [id, posts, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Calculate available slots (5 total - existing images not marked for removal + new images)
    const existingImagesCount = imagePreviews.filter(img => img.isExisting && !imagesToRemove.includes(img.publicId)).length;
    const availableSlots = 5 - existingImagesCount - newImages.length;
    
    if (files.length > availableSlots) {
      // toast.error(`Maximum 5 images allowed. You can add ${availableSlots} more images.`);
      return;
    }

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        // toast.error('Please select only image files (JPEG, PNG, etc.)');
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        // toast.error(`Image "${file.name}" size should be less than 5MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Create previews for new images with unique IDs
    const newImagePreviews = validFiles.map(file => ({
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
      file: file,
      url: URL.createObjectURL(file),
      isExisting: false,
      isNew: true
    }));

    setImagePreviews(prev => [...prev, ...newImagePreviews]);
    setNewImages(prev => [...prev, ...validFiles]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (imageId) => {
    const imageToRemove = imagePreviews.find(img => img.id === imageId);
    
    if (!imageToRemove) return;
    
    // Show loading state for this specific image
    setRemovingImageId(imageId);
    
    try {
      if (imageToRemove.isExisting && imageToRemove.publicId) {
        // Call API to delete existing backend image
        const result = await deletePostImage(id, imageToRemove.publicId);
        
        if (result.success) {
          // Remove from imagePreviews using the unique ID
          setImagePreviews(prev => prev.filter(img => img.id !== imageId));
          // toast.success('Image removed successfully');
        } else {
          // toast.error('Failed to remove image');
          return; // Don't remove from UI if API call failed
        }
      } else {
        // For new images, remove from both arrays using unique ID
        setImagePreviews(prev => prev.filter(img => img.id !== imageId));
        
        // Remove from newImages array by finding the corresponding file
        setNewImages(prev => {
          // Find the index in newImages by counting new images before this one
          const imageIndex = imagePreviews.findIndex(img => img.id === imageId);
          const newImagesBefore = imagePreviews
            .slice(0, imageIndex)
            .filter(img => !img.isExisting).length;
          
          return prev.filter((_, i) => i !== newImagesBefore);
        });
        
        // Revoke object URL to prevent memory leaks
        if (imageToRemove.url && imageToRemove.url.startsWith('blob:')) {
          URL.revokeObjectURL(imageToRemove.url);
        }
      }
    } catch (error) {
      console.error('Error removing image:', error);
      // toast.error('Failed to remove image');
    } finally {
      setRemovingImageId(null);
    }
  };

  const handleRemoveAllImages = async () => {
    if (imagePreviews.length === 0) return;

    try {
      setIsSubmitting(true);
      
      // Remove all existing backend images via API
      const existingImages = imagePreviews.filter(img => img.isExisting && img.publicId);
      
      // Remove each existing image via API
      for (const image of existingImages) {
        await deletePostImage(id, image.publicId);
      }
      
      // Clear all images from state
      setImagePreviews([]);
      setNewImages([]);
      setImagesToRemove([]);
      
      // Revoke object URLs for new images
      imagePreviews.forEach(preview => {
        if (preview.isNew && preview.url && preview.url.startsWith('blob:')) {
          URL.revokeObjectURL(preview.url);
        }
      });
      
      // toast.success('All images removed successfully');
    } catch (error) {
      // console.error('Error removing all images:', error);
      toast.error('Failed to remove some images');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!content.trim()) {
    toast.error('Please add some text to your post');
    return;
  }
  
  const hasProductInfo = descriptionProduct.trim() || price || productModel.trim();
  if (hasProductInfo) {
    if (!descriptionProduct.trim() || !price || !productModel.trim()) {
      toast.error('Please complete all product information fields');
      return;
    }
  }

  setIsSubmitting(true);
  try {
    const formData = new FormData();
    
    // Add content (required by backend validation)
    formData.append('content', content.trim());
    
    // Add new images
    newImages.forEach(image => {
      formData.append('images', image);
    });
    
    // Add images to remove
    if (imagesToRemove.length > 0) {
      imagesToRemove.forEach(publicId => {
        formData.append('removeImages', publicId);
      });
    }
    
    // Add product information directly (not nested)
    if (descriptionProduct.trim()) {
      formData.append('descriptionProduct', descriptionProduct.trim());
    }
    if (price) {
      formData.append('price', price);
    }
    if (productModel.trim()) {
      formData.append('productModel', productModel.trim());
    }

    const result = await updatePost(id, formData);
    if (result.success) {
      // console.log(userdata)
      // toast.success('Post updated successfully');
      navigate(`/user-profile/${userdata?.user._id}`);
    }
  } catch (error) {
    console.error('Submit error:', error);
    // toast.error('Failed to update post');
  } finally {
    setIsSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const existingImagesCount = imagePreviews.filter(img => img.isExisting && !imagesToRemove.includes(img.publicId)).length;
  const totalImagesCount = existingImagesCount + newImages.length;
  const remainingImageSlots = 5 - totalImagesCount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="px-4 py-4 flex items-center sticky top-0 bg-white z-10 border-b shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center bg-white text-gray-700 rounded-full p-2 w-10 h-10 hover:bg-gray-100 transition duration-200 ease-in-out border border-gray-200"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-lg" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold ml-4">Edit Product Post</h1>
        </div>

        {/* Form */}
        <div className="p-4 md:p-6">
          <form onSubmit={handleSubmit}>
            {/* Content Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? (Required)"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows="3"
                maxLength={150}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">Describe your product</span>
                <span className={`text-sm ${content.length === 150 ? 'text-red-500' : 'text-gray-500'}`}>
                  {content.length}/150
                </span>
              </div>
            </div>

            {/* Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (INR) {price && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaRupeeSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Condition {productModel && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTag className="text-gray-400" />
                  </div>
                  <select
                    value={productModel}
                    onChange={(e) => setProductModel(e.target.value)}
                    className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description {descriptionProduct && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 text-gray-400">
                  <FaInfoCircle />
                </div>
                <textarea
                  value={descriptionProduct}
                  onChange={(e) => setDescriptionProduct(e.target.value)}
                  placeholder="Describe your product in detail..."
                  className="w-full p-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  maxLength={2500}
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">Detailed product information</span>
                <span className={`text-sm ${descriptionProduct.length === 500 ? 'text-red-500' : 'text-gray-500'}`}>
                  {descriptionProduct.length}/2500
                </span>
              </div>
            </div>

            {/* Images Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Product Images {totalImagesCount > 0 && `(${totalImagesCount}/5)`}
                </label>
                {imagePreviews.length > 0 && (
                  <button
                    type="button"
                    onClick={handleRemoveAllImages}
                    disabled={isSubmitting}
                    className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                  >
                    {/* {isSubmitting ? 'Removing...' : 'Remove All'} */}
                  </button>
                )}
              </div>

              {/* Image Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                  {imagePreviews.map((preview) => (
                    <div key={preview.id} className="relative group">
                      <img 
                        src={preview.url} 
                        alt={`Preview`}
                        className="w-full h-24 md:h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(preview.id)}
                        disabled={removingImageId === preview.id || isSubmitting}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                        aria-label="Remove image"
                      >
                        {removingImageId === preview.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <FaTimes className="w-3 h-3" />
                        )}
                      </button>
                      {preview.isExisting && (
                        <span className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
                          Saved
                        </span>
                      )}
                      {removingImageId === preview.id && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Add more image slots */}
                  {remainingImageSlots > 0 && (
                    <label className="flex flex-col items-center justify-center w-full h-24 md:h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                      <FaPlus className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500 text-center px-2">
                        Add more ({remainingImageSlots} left)
                      </span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}

              {/* Add Image Button (when no images) */}
              {imagePreviews.length === 0 && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors p-4">
                  <FaPlus className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Add Product Images</span>
                  <span className="text-xs text-gray-500 text-center mt-1">
                    Upload up to 5 images. JPEG, PNG supported. Max 5MB each.
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full md:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 font-medium"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              
              <div className="flex items-center space-x-3 w-full md:w-auto">
                {imagePreviews.length < 5 && (
                  <label className="inline-flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-lg transition-colors w-full md:w-auto justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Add Images
                    </span>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                  </label>
                )}
                
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full md:w-auto flex-1"
                  disabled={isSubmitting || !isFormValid}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </span>
                  ) : (
                    'Update Post'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;

