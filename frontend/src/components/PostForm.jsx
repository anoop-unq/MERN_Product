// import { useContext, useState, useCallback, useRef, useEffect } from 'react';
// import { AppContext } from '../context/AppContext';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { assets } from '../assets/assets';

// const PostForm = () => {
//   const { createPost, islogged, userdata } = useContext(AppContext);
//   const [content, setContent] = useState('');
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showFullBio, setShowFullBio] = useState(false);
//   const [showProductForm, setShowProductForm] = useState(false);
//   const [productInfo, setProductInfo] = useState({
//     description: '',
//     price: '',
//     model: ''
//   });
//   const [savedProductInfo, setSavedProductInfo] = useState({
//     description: '',
//     price: '',
//     model: ''
//   });
//   const [isFormValid, setIsFormValid] = useState(false);
//   const fileInputRef = useRef(null);
//   const navigate = useNavigate();

//   // Validate form whenever content, image, or product info changes
//   useEffect(() => {
//     const hasContent = content.trim().length > 0;
//     const hasImage = image !== null;
//     const hasProductInfo = productInfo.description || productInfo.price || productInfo.model;
    
//     // Check if product info is complete if any field is filled
//     const isProductInfoComplete = !productInfo.description && !productInfo.price && !productInfo.model ? true : 
//                                  productInfo.description && productInfo.price && productInfo.model;
    
//     // Form is valid only if there's content AND (either no product form or product info is complete)
//     setIsFormValid(
//       hasContent && 
//       (!showProductForm || isProductInfoComplete)
//     );
//   }, [content, image, productInfo, showProductForm]);

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
//   };

//   const removeImage = () => {
//     setImage(null);
//     setImagePreview(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const handleProductInfoChange = (field, value) => {
//     setProductInfo(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const toggleProductForm = () => {
//     if (showProductForm) {
//       // Save product info when closing the form
//       setSavedProductInfo({ ...productInfo });
//       // Reset product info in the form
//       setProductInfo({
//         description: '',
//         price: '',
//         model: ''
//       });
//     } else {
//       // Restore saved product info when opening the form
//       setProductInfo({ ...savedProductInfo });
//     }
//     setShowProductForm(!showProductForm);
//   };

//   const handleSubmit = useCallback(async (e) => {
//     e.preventDefault();
    
//     const hasContent = content.trim();
//     const hasImage = image;
//     const hasProductInfo = productInfo.description || productInfo.price || productInfo.model;
    
//     // Content is now required
//     if (!hasContent) {
//       toast.error('Please add some text to your post');
//       return;
//     }
    
//     // Validate product info if any field is filled
//     if (hasProductInfo) {
//       if (!productInfo.description || !productInfo.price || !productInfo.model) {
//         toast.error('Please complete all product information fields');
//         return;
//       }
      
//       if (!['New', 'Used', 'Refurbished'].includes(productInfo.model)) {
//         toast.error('Product condition must be either "New", "Used", or "Refurbished"');
//         return;
//       }
//     }
    
//     if (isSubmitting) return;
    
//     setIsSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append('content', content); // Content is now always required
//       if (image) formData.append('image', image);
      
//       // Add product info if any field is filled
//       if (hasProductInfo) {
//         formData.append('productInfo', JSON.stringify(productInfo));
//       }

//       const success = await createPost(formData);
//       if (success) {
//         setContent('');
//         removeImage();
//         setProductInfo({
//           description: '',
//           price: '',
//           model: ''
//         });
//         setSavedProductInfo({
//           description: '',
//           price: '',
//           model: ''
//         });
//         setShowProductForm(false);
//         toast.success('Post created successfully!');
//       }
//     } catch (error) {
//       console.error('Post submission error:', error);
//       // Error is already handled in createPost function
//     } finally {
//       setIsSubmitting(false);
//     }
//   }, [content, image, productInfo, createPost, isSubmitting]);

//   const navigateToProfile = (id) => {
//     navigate(`/user-profile/${id}`);
//   };

//   const navigateToEditProfile = (id) => {
//     navigate(`/edit-profile/${id}`);
//   };

//   const toggleBio = () => {
//     setShowFullBio(!showFullBio);
//   };

//   if (!islogged) return null;

//   return (
//     <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 overflow-hidden">
//       <div className="flex justify-between items-start mb-4">
//         <div className="flex items-start flex-1 min-w-0" >
//           <img 
//             src={userdata?.user?.photo || assets.user_image || '/default-avatar.png'} 
//             alt="User avatar" 
//             className="w-10 h-10 rounded-full mr-3 cursor-pointer flex-shrink-0 object-cover"
//             onClick={() => navigateToProfile(userdata.user._id)}
//           />
//           <div className="min-w-0 flex-1">
//             <h3 
//               className="font-semibold truncate cursor-pointer"  
//               onClick={() => navigateToProfile(userdata.user._id)}
//             >
//               {userdata?.name}
//             </h3>
//             <p className="text-gray-500 text-sm truncate" >{userdata?.user?.username}</p>
//             {userdata?.user?.bio && (
//               <div className="text-gray-500 text-sm mt-1">
//                 {showFullBio ? (
//                   <p className="whitespace-pre-line break-words">{userdata.user.bio}</p>
//                 ) : (
//                   <p className="whitespace-pre-line break-words line-clamp-2">
//                     {userdata.user.bio}
//                   </p>
//                 )}
//                 {userdata.user.bio.length > 150 && (
//                   <button
//                     onClick={toggleBio}
//                     className="text-blue-500 hover:text-blue-700 text-sm mt-1 focus:outline-none"
//                   >
//                     {showFullBio ? 'Show less' : 'Read more'}
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
        
//         <button
//           onClick={() => navigateToEditProfile(userdata.user._id)}
//           className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-lg transition-colors md:px-4 md:py-2 flex-shrink-0 ml-2"
//           aria-label="Edit profile"
//         >
//           <span className="hidden sm:inline">Edit Profile</span>
//           <span className="sm:hidden">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//               <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//             </svg>
//           </span>
//         </button>
//       </div>
      
//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="What's on your mind? (Required)"
//           className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//           rows={3}
//           maxLength={150}
//           required
//         />
        
//         {/* Product Information Form */}
//         {showProductForm && (
//           <div className="mt-4 p-4 border rounded-lg bg-gray-50">
//             <h4 className="font-medium mb-3">Product Information (Optional)</h4>
            
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Product Description
//                 </label>
//                 <textarea
//                   value={productInfo.description}
//                   onChange={(e) => handleProductInfoChange('description', e.target.value)}
//                   placeholder="Describe your product..."
//                   className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                   rows={2}
//                   maxLength={500}
//                 />
//               </div>
              
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Price ($)
//                   </label>
//                   <input
//                     type="number"
//                     value={productInfo.price}
//                     onChange={(e) => handleProductInfoChange('price', e.target.value)}
//                     placeholder="0.00"
//                     min="0"
//                     step="0.01"
//                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Condition
//                   </label>
//                   <select
//                     value={productInfo.model}
//                     onChange={(e) => handleProductInfoChange('model', e.target.value)}
//                     className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select condition</option>
//                     <option value="New">New</option>
//                     <option value="Used">Used</option>
//                     <option value="Refurbished">Refurbished</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
            
//             <button
//               type="button"
//               onClick={toggleProductForm}
//               className="mt-3 text-sm text-red-600 hover:text-red-800"
//             >
//               Remove product information
//             </button>
//           </div>
//         )}
        
//         {imagePreview && (
//           <div className="mt-4 relative group">
//             <img 
//               src={imagePreview} 
//               alt="Preview" 
//               className="w-full max-h-96 rounded-lg object-contain border border-gray-200"
//             />
//             <button
//               type="button"
//               onClick={removeImage}
//               className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
//               aria-label="Remove image"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         )}
        
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-3">
//           <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
//             <label className="inline-flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-sm">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               <span className="text-xs sm:text-sm font-medium text-gray-700">
//                 {image ? 'Change' : 'Photo'}
//               </span>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleImageChange}
//                 accept="image/*"
//                 className="hidden"
//               />
//             </label>
            
//             <button
//               type="button"
//               onClick={toggleProductForm}
//               className="inline-flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-sm"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//               </svg>
//               <span className="text-xs sm:text-sm font-medium text-gray-700">
//                 {showProductForm ? 'Remove' : 'Product'}
//               </span>
//             </button>
            
//             <span className={`text-xs sm:text-sm ml-auto sm:ml-0 ${content.length === 150 ? 'text-red-500' : 'text-gray-500'}`}>
//               {content.length}/150
//             </span>
//           </div>
          
//           <button
//             type="submit"
//             disabled={isSubmitting || !isFormValid}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base"
//           >
//             {isSubmitting ? (
//               <span className="flex items-center justify-center sm:justify-start">
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Posting...
//               </span>
//             ) : 'Post'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default PostForm;

import { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const PostForm = () => {
  const { createPost, islogged, userdata } = useContext(AppContext);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productInfo, setProductInfo] = useState({
    description: '',
    price: '',
    model: ''
  });
  const [savedProductInfo, setSavedProductInfo] = useState({
    description: '',
    price: '',
    model: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Validate form whenever content, images, or product info changes
  useEffect(() => {
    const hasContent = content.trim().length > 0;
    const hasImages = images.length > 0;
    const hasProductInfo = productInfo.description || productInfo.price || productInfo.model;
    
    // Check if product info is complete if any field is filled
    const isProductInfoComplete = !productInfo.description && !productInfo.price && !productInfo.model ? true : 
                                 productInfo.description && productInfo.price && productInfo.model;
    
    // Form is valid only if there's content AND (either no product form or product info is complete)
    setIsFormValid(
      hasContent && 
      (!showProductForm || isProductInfoComplete)
    );
  }, [content, images, productInfo, showProductForm]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (!files.length) return;

    // Check total number of images won't exceed 5
    if (images.length + files.length > 5) {
      toast.error(`You can only upload up to 5 images. You currently have ${images.length} images.`);
      return;
    }

    // Validate each file
    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(file.name);
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (too large)`);
        return;
      }

      validFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      
      // Create previews for new images
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }

    // Reset file input to allow selecting same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeAllImages = () => {
    // Revoke all object URLs to avoid memory leaks
    imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    setImages([]);
    setImagePreviews([]);
  };

  const handleProductInfoChange = (field, value) => {
    setProductInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleProductForm = () => {
    if (showProductForm) {
      // Save product info when closing the form
      setSavedProductInfo({ ...productInfo });
      // Reset product info in the form
      setProductInfo({
        description: '',
        price: '',
        model: ''
      });
    } else {
      // Restore saved product info when opening the form
      setProductInfo({ ...savedProductInfo });
    }
    setShowProductForm(!showProductForm);
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    const hasContent = content.trim();
    const hasImages = images.length > 0;
    const hasProductInfo = productInfo.description || productInfo.price || productInfo.model;
    
    // Content is now required
    if (!hasContent) {
      toast.error('Please add some text to your post');
      return;
    }
    
    // Validate product info if any field is filled
    if (hasProductInfo) {
      if (!productInfo.description || !productInfo.price || !productInfo.model) {
        toast.error('Please complete all product information fields');
        return;
      }
      
      if (!['New', 'Used', 'Refurbished'].includes(productInfo.model)) {
        toast.error('Product condition must be either "New", "Used", or "Refurbished"');
        return;
      }
    }
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content); // Content is now always required
      
      // Append all images
      images.forEach((image, index) => {
        formData.append('images', image); // Note: using 'images' (plural) to match backend expectation
      });
      
      // Add product info if any field is filled
      if (hasProductInfo) {
        formData.append('productInfo', JSON.stringify(productInfo));
      }

      const result = await createPost(formData);
      if (result.success) {
        setContent('');
        removeAllImages();
        setProductInfo({
          description: '',
          price: '',
          model: ''
        });
        setSavedProductInfo({
          description: '',
          price: '',
          model: ''
        });
        setShowProductForm(false);
        // The toast is already shown in createPost function
      } else {
        // Error is already handled in createPost function, but you can handle it here if needed
        console.error('Post creation failed:', result.error);
      }
    } catch (error) {
      console.error('Post submission error:', error);
      // Error is already handled in createPost function
    } finally {
      setIsSubmitting(false);
    }
  }, [content, images, productInfo, createPost, isSubmitting]);

  const navigateToProfile = (id) => {
    navigate(`/user-profile/${id}`);
  };

  const navigateToEditProfile = (id) => {
    navigate(`/edit-profile/${id}`);
  };

  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  if (!islogged) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start flex-1 min-w-0" >
          <img 
            src={userdata?.user?.photo || assets.user_image || '/default-avatar.png'} 
            alt="User avatar" 
            className="w-10 h-10 rounded-full mr-3 cursor-pointer flex-shrink-0 object-cover"
            onClick={() => navigateToProfile(userdata.user._id)}
          />
          <div className="min-w-0 flex-1">
            <h3 
              className="font-semibold truncate cursor-pointer"  
              onClick={() => navigateToProfile(userdata.user._id)}
            >
              {userdata?.name}
            </h3>
            <p className="text-gray-500 text-sm truncate" >{userdata?.user?.username}</p>
            {userdata?.user?.bio && (
              <div className="text-gray-500 text-sm mt-1">
                {showFullBio ? (
                  <p className="whitespace-pre-line break-words">{userdata.user.bio}</p>
                ) : (
                  <p className="whitespace-pre-line break-words line-clamp-2">
                    {userdata.user.bio}
                  </p>
                )}
                {userdata.user.bio.length > 150 && (
                  <button
                    onClick={toggleBio}
                    className="text-blue-500 hover:text-blue-700 text-sm mt-1 focus:outline-none"
                  >
                    {showFullBio ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => navigateToEditProfile(userdata.user._id)}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded-lg transition-colors md:px-4 md:py-2 flex-shrink-0 ml-2"
          aria-label="Edit profile"
        >
          <span className="hidden sm:inline">Edit Profile</span>
          <span className="sm:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? (Required)"
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          maxLength={150}
          required
        />
        
        {/* Product Information Form */}
        {showProductForm && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3">Product Information (Optional)</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description
                </label>
                <textarea
                  value={productInfo.description}
                  onChange={(e) => handleProductInfoChange('description', e.target.value)}
                  placeholder="Describe your product..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  maxLength={2500}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={productInfo.price}
                    onChange={(e) => handleProductInfoChange('price', e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={productInfo.model}
                    onChange={(e) => handleProductInfoChange('model', e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={toggleProductForm}
              className="mt-3 text-sm text-red-600 hover:text-red-800"
            >
              Remove product information
            </button>
          </div>
        )}
        
        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {imagePreviews.length} / 5 images selected
              </span>
              {imagePreviews.length > 1 && (
                <button
                  type="button"
                  onClick={removeAllImages}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove all
                </button>
              )}
            </div>
            <div className={`grid gap-3 ${
              imagePreviews.length === 1 ? 'grid-cols-1' :
              imagePreviews.length === 2 ? 'grid-cols-2' :
              imagePreviews.length === 3 ? 'grid-cols-3' :
              imagePreviews.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : ''
            }`}>
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-all"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-3">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <label className="inline-flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {images.length > 0 ? `Photos (${images.length}/5)` : 'Photos'}
              </span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
                multiple
                disabled={images.length >= 5}
              />
            </label>
            
            <button
              type="button"
              onClick={toggleProductForm}
              className="inline-flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {showProductForm ? 'Remove' : 'Product'}
              </span>
            </button>
            
            <span className={`text-xs sm:text-sm ml-auto sm:ml-0 ${content.length === 150 ? 'text-red-500' : 'text-gray-500'}`}>
              {content.length}/150
            </span>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center sm:justify-start">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </span>
            ) : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;