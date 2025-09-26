// import { useContext, useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import { assets } from '../assets/assets';
// import moment from 'moment';
// import { 
//   FaCheckCircle, 
//   FaStore, 
//   FaBox, 
//   FaTag, 
//   FaInfoCircle, 
//   FaArrowLeft, 
//   FaUser, 
//   FaClipboardList,
//   FaShieldAlt,
//   FaCalendarAlt,
//   FaPhone,
//   FaTimes,
//   FaChevronLeft,
//   FaChevronRight,
//   FaExpand,
//   FaExternalLinkAlt
// } from 'react-icons/fa';

// const ViewSeperateProduct = () => {
//   const { userId, postId } = useParams();
//   const navigate = useNavigate();
//   const { posts, userdata, getUserById } = useContext(AppContext);
//   const [productPost, setProductPost] = useState(null);
//   const [userDetails, setUserDetails] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingUser, setLoadingUser] = useState(false);
//   const [activeTab, setActiveTab] = useState('product');
//   const [isAuthor, setIsAuthor] = useState(false);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const location = useLocation();
//   const { verificationKey } = location.state || {};

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         const post = posts.find(p => p._id === postId);
        
//         if (!post) {
//           setLoading(false);
//           return;
//         }
        
//         setProductPost(post);
        
//         if (userdata?.user && userdata.user._id === post.author?._id) {
//           setIsAuthor(true);
//         }
        
//         if (post.author?._id) {
//           setLoadingUser(true);
//           const user = await getUserById(post.author._id);
//           setUserDetails(user);
          
//           const userPosts = posts.filter(p => 
//             p.author?._id === post.author._id && 
//             p._id !== post._id
//           );
//           setUserPosts(userPosts);
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//         setLoadingUser(false);
//       }
//     };

//     fetchData();
//   }, [postId, posts, userdata, getUserById]);

//   // Image gallery functions
//   const openImageModal = (index = 0) => {
//     setCurrentImageIndex(index);
//     setShowImageModal(true);
//   };

//   const closeImageModal = () => {
//     setShowImageModal(false);
//   };

//   const nextImage = () => {
//     setCurrentImageIndex((prev) => 
//       prev === productPost.images.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setCurrentImageIndex((prev) => 
//       prev === 0 ? productPost.images.length - 1 : prev - 1
//     );
//   };

//   const goToImage = (index) => {
//     setCurrentImageIndex(index);
//   };

//   // Handle keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!showImageModal) return;
      
//       if (e.key === 'Escape') closeImageModal();
//       if (e.key === 'ArrowRight') nextImage();
//       if (e.key === 'ArrowLeft') prevImage();
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [showImageModal]);

//   const handleViewAllProducts = () => {
//     if (userDetails) {
//       navigate(`/view-all/products/${userDetails._id}/${postId}`);
//     }
//   };

//   const handleView = (postId) => {
//     if (userDetails) {
//       navigate(`/view-detail/product/${userDetails._id}/${postId}`);
//     }
//   };

//   const contactSeller = (userId) => {
//     navigate(`/view-seller/contact-details/${userId}`);
//   };

//   const backInBack = () => {
//     if (verificationKey === "product_view_key_123") {
//       navigate(`/view-all/products/${userId}/${postId}`);
//     } else {
//       navigate('/home');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading product details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!productPost) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
//         <div className="text-center p-8 bg-white rounded-2xl shadow-2xl max-w-md mx-4">
//           <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
//             <FaBox className="text-4xl text-purple-500" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
//           <p className="text-gray-600 mb-6">The product you're looking for is not available.</p>
//           <button
//             onClick={() => navigate("/home")}
//             className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
//           >
//             Go Back Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const hasImages = productPost.images && productPost.images.length > 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
//       {/* Image Modal */}
//       {showImageModal && hasImages && (
//         <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
//           <div className="relative max-w-4xl w-full max-h-full">
//             {/* Close Button */}
//             <button
//               onClick={closeImageModal}
//               className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-2 sm:p-3 shadow-lg"
//             >
//               <FaTimes className="text-xl sm:text-2xl" />
//             </button>

//             {/* Navigation Arrows - Hidden on mobile */}
//             {productPost.images.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-2 sm:p-3 shadow-lg hidden sm:block"
//                 >
//                   <FaChevronLeft className="text-xl sm:text-2xl" />
//                 </button>
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-2 sm:p-3 shadow-lg hidden sm:block"
//                 >
//                   <FaChevronRight className="text-xl sm:text-2xl" />
//                 </button>
//               </>
//             )}

//             {/* Main Image */}
//             <div className="flex justify-center items-center h-full p-2 sm:p-4">
//               <img
//                 src={productPost.images[currentImageIndex].url}
//                 alt={`Product view ${currentImageIndex + 1}`}
//                 className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg shadow-2xl"
//               />
//             </div>

//             {/* Image Counter */}
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
//               {currentImageIndex + 1} / {productPost.images.length}
//             </div>

//             {/* Dots Indicator for Mobile */}
//             {productPost.images.length > 1 && (
//               <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:hidden">
//                 {productPost.images.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => goToImage(index)}
//                     className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                       index === currentImageIndex 
//                         ? 'bg-white scale-125' 
//                         : 'bg-white/50'
//                     }`}
//                   />
//                 ))}
//               </div>
//             )}

//             {/* Thumbnail Strip for Desktop */}
//             {productPost.images.length > 1 && (
//               <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 hidden sm:flex space-x-2 max-w-full overflow-x-auto px-4 py-2">
//                 {productPost.images.map((image, index) => (
//                   <button
//                     key={index}
//                     onClick={() => goToImage(index)}
//                     className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg border-2 transition-all duration-200 shadow-lg ${
//                       index === currentImageIndex 
//                         ? 'border-white scale-110' 
//                         : 'border-transparent opacity-70 hover:opacity-100'
//                     }`}
//                   >
//                     <img
//                       src={image.url}
//                       alt={`Thumbnail ${index + 1}`}
//                       className="w-full h-full object-cover rounded"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Back Button */}
//       <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
//         <button
//           onClick={backInBack}
//           className="flex items-center bg-white text-purple-600 hover:text-purple-700 transition-all duration-300 rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-lg hover:shadow-xl border border-purple-100 hover:border-purple-200 font-medium group text-sm sm:text-base"
//         >
//           <FaArrowLeft className="mr-2 sm:mr-3 group-hover:-translate-x-1 transition-transform" />
//           Back to Posts
//         </button>
//       </div>

//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
//           {/* Left Column - Product Image & Details */}
//           <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
//             {/* Product Image Gallery - SIMPLE GRID LAYOUT */}
//             <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl overflow-hidden border border-gray-100">
//               <div className="relative">
//                 {hasImages ? (
//                   <div className="p-3 sm:p-4 lg:p-6">
//                     {/* Price Badge */}
//                     {productPost.price && (
//                       <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-full shadow-2xl font-bold text-sm sm:text-base lg:text-lg">
//                         ₹{parseInt(productPost.price).toLocaleString('en-IN')}
//                       </div>
//                     )}

//                     {/* Single Image or Grid Layout */}
//                     {productPost.images.length === 1 ? (
//                       // Single Image
//                       <div 
//                         className="relative rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer bg-gray-50"
//                         onClick={() => openImageModal(0)}
//                       >
//                         <div className="aspect-square w-full flex items-center justify-center p-4">
//                           <img
//                             src={productPost.images[0].url}
//                             alt="Product"
//                             className="max-w-full max-h-80 object-contain transition-transform duration-300 hover:scale-105"
//                             loading="lazy"
//                           />
//                         </div>
//                         <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
//                           <div className="opacity-0 hover:opacity-100 transform translate-y-4 hover:translate-y-0 transition-all duration-300 bg-white/90 rounded-full p-3">
//                             <FaExpand className="w-5 h-5 text-gray-700" />
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       // Multiple Images - SIMPLE GRID (No Carousel)
//                       <div className="space-y-3 sm:space-y-4">
//                         {/* Main Image - Larger */}
//                         <div 
//                           className="relative rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer bg-gray-50"
//                           onClick={() => openImageModal(0)}
//                         >
//                           <div className="aspect-video w-full flex items-center justify-center p-4">
//                             <img
//                               src={productPost.images[0].url}
//                               alt="Product main view"
//                               className="max-w-full max-h-64 sm:max-h-80 object-contain transition-transform duration-300 hover:scale-105"
//                               loading="lazy"
//                             />
//                           </div>
//                           <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium">
//                             {productPost.images.length} photos
//                           </div>
//                         </div>

//                         {/* Thumbnail Grid */}
//                         <div className="grid grid-cols-4 gap-2 sm:gap-3">
//                           {productPost.images.slice(0, 4).map((image, index) => (
//                             <button
//                               key={index}
//                               onClick={() => openImageModal(index)}
//                               className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-200 bg-gray-100"
//                             >
//                               <img
//                                 src={image.url}
//                                 alt={`Thumbnail ${index + 1}`}
//                                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
//                               />
//                               {index === 3 && productPost.images.length > 4 && (
//                                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                                   <span className="text-white text-xs font-bold">
//                                     +{productPost.images.length - 4}
//                                   </span>
//                                 </div>
//                               )}
//                             </button>
//                           ))}
//                         </div>

//                         {/* View All Button */}
//                         <button
//                           onClick={() => openImageModal(0)}
//                           className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 sm:py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
//                         >
//                           <FaExternalLinkAlt className="w-4 h-4" />
//                           View All Photos ({productPost.images.length})
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   // No Image Available
//                   <div className="w-full h-48 sm:h-64 lg:h-96 bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-6">
//                     <FaBox className="text-4xl sm:text-6xl lg:text-8xl text-purple-400 mb-2 sm:mb-4" />
//                     <p className="text-gray-500 font-medium text-base sm:text-lg">No Image Available</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Product Details Card */}
//             <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
//               <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 sm:mb-6 lg:mb-8">
//                 <div className="mb-3 sm:mb-4 lg:mb-0">
//                   {productPost.content && (
//                     <div className="mb-3 sm:mb-4 lg:mb-6">
//                       <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4 flex items-center">
//                         <FaClipboardList className="mr-2 sm:mr-3 text-blue-500 text-lg sm:text-xl lg:text-2xl" />
//                         Product Details
//                       </h3>
//                       <p className="text-gray-800 leading-relaxed text-sm sm:text-base lg:text-lg bg-blue-50 p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl border border-blue-200 whitespace-pre-line">
//                         {productPost.content}
//                       </p>
//                     </div>
//                   )}
//                   <div className="flex items-center text-gray-600 text-xs sm:text-sm lg:text-lg">
//                     <FaCalendarAlt className="mr-2 sm:mr-3 text-purple-500" />
//                     <span>Posted {moment(productPost.createdAt).fromNow()}</span>
//                   </div>
//                 </div>
//                 {productPost.productModel && (
//                   <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center self-start lg:self-auto mt-3 lg:mt-0">
//                     <FaShieldAlt className="mr-1 sm:mr-2" />
//                     {productPost.productModel}
//                   </span>
//                 )}
//               </div>

//               {/* Description Section */}
//               {productPost.descriptionProduct && (
//                 <div className="mb-4 sm:mb-6">
//                   <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4 flex items-center">
//                     <FaInfoCircle className="mr-2 sm:mr-3 text-purple-500 text-lg sm:text-xl lg:text-2xl" />
//                     Product Description
//                   </h3>
//                   <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg bg-gray-50 p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl border border-gray-200 whitespace-pre-line">
//                     {productPost.descriptionProduct}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Column - Seller Info & Actions */}
//           <div className="space-y-4 sm:space-y-6 lg:space-y-8">
//             {/* Seller Information Card */}
//             <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl p-4 sm:p-6 border border-gray-100">
//               <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 flex items-center">
//                 <FaUser className="mr-2 sm:mr-3 text-purple-500 text-lg sm:text-xl lg:text-2xl" />
//                 Seller Information
//               </h2>
              
//               {loadingUser ? (
//                 <div className="flex justify-center py-4 sm:py-6 lg:py-8">
//                   <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-purple-500"></div>
//                 </div>
//               ) : userDetails ? (
//                 <div className="space-y-3 sm:space-y-4 lg:space-y-6">
//                   {/* Seller Profile */}
//                   <div className="flex items-center space-x-3 sm:space-x-4">
//                     <div className="relative">
//                       <img
//                         src={userDetails.photo || assets.user_image}
//                         alt="Seller"
//                         className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl lg:rounded-2xl object-cover border-2 sm:border-4 border-purple-200 shadow-lg"
//                       />
//                       {userDetails.isAccountVerified && (
//                         <FaCheckCircle className="absolute -top-1 -right-1 text-blue-500 text-xs sm:text-sm lg:text-xl bg-white rounded-full" />
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-xl truncate">{userDetails.name || 'Unknown Seller'}</h3>
//                       <p className="text-gray-600 text-xs sm:text-sm flex items-center">
//                         <FaCalendarAlt className="mr-1 sm:mr-2" />
//                         Member since {moment(userDetails.createdAt).format('MMMM YYYY')}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Seller Stats */}
//                   <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl lg:rounded-2xl">
//                     <div className="text-center">
//                       <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">{userPosts.length + 1}</p>
//                       <p className="text-xs sm:text-sm text-gray-600">Total Products</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
//                         {userDetails.isAccountActive ? 'Active' : 'Inactive'}
//                       </p>
//                       <p className="text-xs sm:text-sm text-gray-600">Account Status</p>
//                     </div>
//                   </div>

//                   {/* Contact Button */}
//                   {!isAuthor && (
//                     <button 
//                       onClick={() => contactSeller(userDetails._id)}
//                       className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-lg sm:rounded-xl lg:rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold text-xs sm:text-sm lg:text-lg shadow-lg hover:shadow-xl flex items-center justify-center"
//                     >
//                       <FaPhone className="mr-1 sm:mr-2 lg:mr-3" />
//                       Contact Seller
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center py-4 sm:py-6 lg:py-8 text-sm sm:text-base">Seller information not available</p>
//               )}
//             </div>

//             {/* Tabs Section */}
//             {!isAuthor && (
//               <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl overflow-hidden border border-gray-100">
//                 {/* Tab Headers */}
//                 <div className="flex border-b border-gray-200">
//                   <button
//                     className={`flex-1 py-2 sm:py-3 lg:py-4 px-2 sm:px-3 lg:px-4 text-center font-semibold flex items-center justify-center transition-all duration-300 text-xs sm:text-sm ${
//                       activeTab === 'product' 
//                         ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
//                         : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                     }`}
//                     onClick={() => setActiveTab('product')}
//                   >
//                     <FaTag className="mr-1 sm:mr-2 text-xs sm:text-sm" />
//                     Specifications
//                   </button>
                  
//                   <button
//                     className={`flex-1 py-2 sm:py-3 lg:py-4 px-2 sm:px-3 lg:px-4 text-center font-semibold flex items-center justify-center transition-all duration-300 text-xs sm:text-sm ${
//                       activeTab === 'posts' 
//                         ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
//                         : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//                     }`}
//                     onClick={() => setActiveTab('posts')}
//                   >
//                     <FaStore className="mr-1 sm:mr-2 text-xs sm:text-sm" />
//                     Other Items ({userPosts.length})
//                   </button>
//                 </div>

//                 {/* Tab Content */}
//                 <div className="p-3 sm:p-4 lg:p-6">
//                   {activeTab === 'product' && (
//                     <div className="space-y-2 sm:space-y-3 lg:space-y-4">
//                       <h3 className="font-bold text-gray-800 text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 lg:mb-4">Product Specifications</h3>
//                       <div className="space-y-2 sm:space-y-3">
//                         {productPost.price && (
//                           <div className="flex justify-between items-center py-2 sm:py-3 px-2 sm:px-3 lg:px-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg sm:rounded-xl">
//                             <span className="text-gray-600 flex items-center text-xs sm:text-sm lg:text-base">
//                               <FaTag className="mr-1 sm:mr-2 lg:mr-3 text-green-500" />
//                               Price:
//                             </span>
//                             <span className="font-bold text-green-600 text-sm sm:text-base lg:text-lg">
//                               ₹{parseInt(productPost.price).toLocaleString('en-IN')}
//                             </span>
//                           </div>
//                         )}
//                         {productPost.productModel && (
//                           <div className="flex justify-between items-center py-2 sm:py-3 px-2 sm:px-3 lg:px-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg sm:rounded-xl">
//                             <span className="text-gray-600 flex items-center text-xs sm:text-sm lg:text-base">
//                               <FaShieldAlt className="mr-1 sm:mr-2 lg:mr-3 text-blue-500" />
//                               Condition:
//                             </span>
//                             <span className="font-medium text-blue-600 capitalize text-xs sm:text-sm lg:text-base">{productPost.productModel}</span>
//                           </div>
//                         )}
//                         <div className="flex justify-between items-center py-2 sm:py-3 px-2 sm:px-3 lg:px-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg sm:rounded-xl">
//                           <span className="text-gray-600 flex items-center text-xs sm:text-sm lg:text-base">
//                             <FaCalendarAlt className="mr-1 sm:mr-2 lg:mr-3 text-purple-500" />
//                             Listed:
//                           </span>
//                           <span className="font-medium text-purple-600 text-xs sm:text-sm lg:text-base">{moment(productPost.createdAt).fromNow()}</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {activeTab === 'posts' && (
//                     <div>
//                       {userPosts.length > 0 ? (
//                         <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:gap-4 max-h-48 sm:max-h-64 lg:max-h-96 overflow-y-auto pr-1">
//                           {userPosts.slice(0, 4).map(post => (
//                             <div 
//                               key={post._id} 
//                               className="border border-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 hover:shadow-md sm:hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-purple-200 bg-white group"
//                               onClick={() => handleView(post._id)}
//                             >
//                               <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
//                                 {post.images?.[0]?.url ? (
//                                   <img 
//                                     src={post.images[0].url} 
//                                     alt={post.content} 
//                                     className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200"
//                                   />
//                                 ) : (
//                                   <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
//                                     <FaBox className="text-lg sm:text-xl lg:text-2xl text-gray-400" />
//                                   </div>
//                                 )}
//                                 <div className="flex-1 min-w-0">
//                                   <h4 className="font-semibold text-gray-800 text-xs sm:text-sm lg:text-base line-clamp-2 mb-1 group-hover:text-purple-600 transition-colors">
//                                     {post.descriptionProduct || post.content?.split(' ').slice(0, 6).join(' ') || 'Product'}
//                                   </h4>
//                                   {post.price && (
//                                     <p className="text-purple-600 font-bold text-sm sm:text-base lg:text-lg">
//                                       ₹{parseInt(post.price).toLocaleString('en-IN')}
//                                     </p>
//                                   )}
//                                   <p className="text-gray-500 text-xs sm:text-sm flex items-center">
//                                     <FaCalendarAlt className="mr-1" />
//                                     {moment(post.createdAt).fromNow()}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="text-center py-4 sm:py-6 lg:py-8">
//                           <FaBox className="text-2xl sm:text-3xl lg:text-4xl text-gray-400 mx-auto mb-2" />
//                           <p className="text-gray-500 text-xs sm:text-sm lg:text-base">No other items for sale</p>
//                         </div>
//                       )}
                      
//                       {userPosts.length > 4 && (
//                         <button 
//                           className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold text-xs sm:text-sm shadow-lg"
//                           onClick={handleViewAllProducts}
//                         >
//                           View All {userPosts.length} Items
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             {isAuthor && (
//               <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl p-3 sm:p-4 lg:p-6 border border-gray-100">
//                 <h3 className="font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4 text-base sm:text-lg lg:text-xl">Manage Your Product</h3>
//                 <button 
//                   onClick={() => navigate(`/edit-post/${productPost._id}`)}
//                   className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 sm:py-3 lg:py-4 px-3 sm:px-4 lg:px-6 rounded-lg sm:rounded-xl lg:rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold text-xs sm:text-sm lg:text-lg shadow-lg hover:shadow-xl"
//                 >
//                   Edit Product Details
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ViewSeperateProduct;


import { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import moment from 'moment';
import { 
  FaCheckCircle, 
  FaStore, 
  FaBox, 
  FaTag, 
  FaInfoCircle, 
  FaArrowLeft, 
  FaUser, 
  FaClipboardList,
  FaShieldAlt,
  FaCalendarAlt,
  FaPhone,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaExternalLinkAlt,
  FaStar,
  FaHeart,
  FaShare,
  FaMapMarkerAlt,
  FaEye,
  FaShoppingCart,
  FaCreditCard,
  FaTruck,
  FaUndo,
  // FaShieldHeart,
  FaCrown
} from 'react-icons/fa';
import { BackButton } from './BackButton';

const ViewSeperateProduct = () => {
  const { userId, postId } = useParams();
  const navigate = useNavigate();
  const { posts, userdata, getUserById } = useContext(AppContext);
  const [productPost, setProductPost] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // Changed to 'description' as default
  const [isAuthor, setIsAuthor] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const location = useLocation();
  const { verificationKey } = location.state || {};
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const post = posts.find(p => p._id === postId);
        
        if (!post) {
          setLoading(false);
          return;
        }
        
        setProductPost(post);
        
        if (userdata?.user && userdata.user._id === post.author?._id) {
          setIsAuthor(true);
        }
        
        if (post.author?._id) {
          setLoadingUser(true);
          const user = await getUserById(post.author._id);
          setUserDetails(user);
          
          const userPosts = posts.filter(p => 
            p.author?._id === post.author._id && 
            p._id !== post._id
          );
          setUserPosts(userPosts);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setLoadingUser(false);
      }
    };

    fetchData();
  }, [postId, posts, userdata, getUserById]);

  console.log(userPosts)
  // Image gallery functions
  const openImageModal = (index = 0) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === productPost.images.length - 1 ? 0 : prev + 1
    );
    setSelectedThumbnail(currentImageIndex === productPost.images.length - 1 ? 0 : currentImageIndex + 1);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? productPost.images.length - 1 : prev - 1
    );
    setSelectedThumbnail(currentImageIndex === 0 ? productPost.images.length - 1 : currentImageIndex - 1);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
    setSelectedThumbnail(index);
  };

  const handleThumbnailClick = (index) => {
    setSelectedThumbnail(index);
    setCurrentImageIndex(index);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productPost.descriptionProduct || 'Check out this product',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showImageModal) return;
      
      if (e.key === 'Escape') closeImageModal();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, currentImageIndex]);

  const handleViewAllProducts = () => {
    if (userDetails) {
      navigate(`/view-all/products/${userDetails._id}/${postId}`);
    }
  };

  const handleView = (postId) => {
    if (userDetails) {
      navigate(`/view-detail/product/${userDetails._id}/${postId}`);
    }
  };

  const contactSeller = (userId) => {
    navigate(`/view-seller/contact-details/${userId}`);
  };

  const backInBack = () => {
    if (verificationKey === "product_view_key_123") {
      navigate(`/view-all/products/${userId}/${postId}`);
    } else {
      navigate('/home');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-l-pink-500 animate-spin delay-75"></div>
          </div>
          <p className="text-gray-600 font-medium text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!productPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-2xl max-w-md mx-4 border border-gray-100">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <FaBox className="text-4xl text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for is not available.</p>
          <button
            onClick={() => navigate("/home")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const hasImages = productPost.images && productPost.images.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Enhanced Image Modal */}
      {showImageModal && hasImages && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl w-full max-h-full flex flex-col h-full">
            {/* Header Controls */}
            <div className="flex justify-between items-center p-4 bg-black bg-opacity-50 text-white">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {productPost.images.length}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 mt-16">
              
                <button
                  onClick={handleShare}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <FaShare />
                </button>
                <button
                  onClick={closeImageModal}
                  className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            {/* Main Image Container */}
            <div className="flex-1 flex items-center justify-center p-4 relative">
              {/* Navigation Arrows */}
              {productPost.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all duration-200 bg-black bg-opacity-60 rounded-full p-4 shadow-2xl hover:bg-opacity-80 hover:scale-110"
                  >
                    <FaChevronLeft className="text-2xl" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all duration-200 bg-black bg-opacity-60 rounded-full p-4 shadow-2xl hover:bg-opacity-80 hover:scale-110"
                  >
                    <FaChevronRight className="text-2xl" />
                  </button>
                </>
              )}

              {/* Main Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={productPost.images[currentImageIndex].url}
                  alt={`Product view ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                  onLoad={() => setImageLoading(false)}
                />
                
                {/* Loading Spinner */}
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {productPost.images.length > 1 && (
              <div className="bg-black bg-opacity-50 p-4">
                <div className="flex space-x-3 overflow-x-auto pb-2 justify-center scrollbar-hide">
                  {productPost.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 transition-all duration-200 shadow-lg overflow-hidden ${
                        index === currentImageIndex 
                          ? 'border-white scale-110' 
                          : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back Button */}
      <BackButton id = {userId} post = {postId} />

      <div className="max-w-7xl mx-auto mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="">
                {hasImages ? (
                  <div className="p-6">
                  

                    {/* Action Buttons */}
                    {/* <div className="absolute top-12 right-2 z-10 flex space-x-2">
                    
                      <button
                        onClick={handleShare}
                        className="p-3 bg-white text-gray-600 rounded-2xl shadow-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
                      >
                        <FaShare />
                      </button>
                      <button
                        onClick={() => openImageModal(0)}
                        className="p-3 bg-white text-gray-600 rounded-2xl shadow-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
                      >
                        <FaExpand />
                      </button>
                    </div> */}

                    {/* Main Image Display */}
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Thumbnail Column */}
                      {productPost.images.length > 1 && (
                        <div className="lg:order-first flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 scrollbar-hide">
                          {productPost.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => handleThumbnailClick(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                                selectedThumbnail === index
                                  ? 'border-purple-500 shadow-lg scale-105'
                                  : 'border-gray-200 hover:border-purple-300'
                              }`}
                            >
                              <img
                                src={image.url}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Main Image */}
                      <div 
                        className="flex-1 relative rounded-2xl overflow-hidden bg-gray-50 cursor-zoom-in"
                        onClick={() => openImageModal(selectedThumbnail)}
                        ref={imageContainerRef}
                      >
                        <div className="aspect-square w-full flex items-center justify-center p-8">
                          <img
                            src={productPost.images[selectedThumbnail]?.url}
                            alt="Product"
                            className="max-w-full max-h-96 object-contain transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold flex items-center space-x-2">
                            <FaExpand className="text-purple-600" />
                            <span>Click to enlarge</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Counter */}
                    <div className="text-center mt-4">
                      <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Image {selectedThumbnail + 1} of {productPost.images.length}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6 relative">
                    <FaBox className="text-8xl text-gray-400 mb-4" />
                    <p className="text-gray-500 font-medium text-lg">No Image Available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Information Tabs */}
            <div className="mt-8 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {[
                    { key: 'description', label: 'Description' },
                    { key: 'details', label: 'Details' },
                    { key: 'specifications', label: 'Specifications' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      className={`flex-1 min-w-max px-3 py-4 font-semibold text-sm tracking-wider transition-all duration-300 border-b-2 ${
                        activeTab === tab.key
                          ? 'border-purple-600 text-purple-600 bg-purple-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'description' && productPost.descriptionProduct && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {productPost.descriptionProduct}
                    </p>
                  </div>
                )}

                {activeTab === 'details' && productPost.content && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Product Details</h3>
                    <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-xl border border-blue-200 whitespace-pre-line">
                      {productPost.content}
                    </p>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <span className="text-gray-600 font-medium">Price</span>
                        <span className="font-bold text-green-600 text-lg">
                          ₹{parseInt(productPost.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                        <span className="text-gray-600 font-medium">Condition</span>
                        <span className="font-medium text-blue-600 capitalize">{productPost.productModel}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                        <span className="text-gray-600 font-medium">Listed</span>
                        <span className="font-medium text-purple-600">{moment(productPost.createdAt).fromNow()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                        <span className="text-gray-600 font-medium">Category</span>
                        <span className="font-medium text-orange-600">Electronics</span>
                      </div>
                    </div>
                  </div>
                )}

             
              </div>
            </div>
          </div>

          {/* Right Column - Product Actions & Seller Info */}
          <div className="space-y-8">
            {/* Product Action Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Information</h2>
              
              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-2">
                  <span className="text-3xl font-bold text-blue-900">
                    ₹{parseInt(productPost.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm font-semibold">
                    Negotiable
                  </span>
                </div>
                <p className="text-gray-600 text-sm">Inclusive of all taxes</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                {!isAuthor ? (
                  <>
                    <button 
                      onClick={() => contactSeller(userDetails?._id)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 transform hover:-translate-y-0.5"
                    >
                      <FaPhone className="text-xl" />
                      <span>Contact Seller</span>
                    </button>
                   
                  </>
                ) : (
                  <button 
                    onClick={() => navigate(`/edit-post/${productPost._id}`)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Edit Product Details
                  </button>
                )}
              </div>

            
            </div>

            {/* Seller Information Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FaUser className="text-purple-500" />
                <span>Seller Information</span>
              </h2>
              
              {loadingUser ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : userDetails ? (
                <div className="space-y-4">
                  {/* Seller Profile */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={userDetails.photo || assets.user_image}
                        alt="Seller"
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-purple-200 shadow-lg"
                      />
                      {userDetails.isAccountVerified && (
                        <FaCheckCircle className="absolute -top-1 -right-1 text-blue-500 text-lg bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg truncate flex items-center space-x-2">
                        <span>{userDetails.name || 'Unknown Seller'}</span>
                        {userDetails.isAccountVerified && (
                          <FaCrown className="text-yellow-500 text-sm" />
                        )}
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center space-x-1">
                        <FaMapMarkerAlt className="text-red-400" />
                        <span>Location not specified</span>
                      </p>
                    </div>
                  </div>

                  {/* Seller Stats */}
                  <div className="grid grid-cols-2 gap-3 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-2xl">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{userPosts.length + 1}</p>
                     <p className="text-xs text-gray-600">
  {userPosts.length > 1 ? "Products" : "Product"}
</p>
                    </div>
                    {/* <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        <FaEye className="inline mr-1" />
                        1.2K
                      </p>
                      <p className="text-xs text-gray-600">Views</p>
                    </div> */}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {userDetails.isAccountActive ? 'Active' : 'Inactive'}
                      </p>
                      <p className="text-xs text-gray-600">Status</p>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <FaCalendarAlt className="text-purple-500" />
                    <span>Member since {moment(userDetails.createdAt).format('MMMM YYYY')}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Seller information not available</p>
              )}
            </div>

            {/* Other Items from Seller */}
            {!isAuthor && userPosts.length > 0 && (
              <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <FaStore className="text-purple-500" />
                  <span>More from this Seller ({userPosts.length})</span>
                </h2>
                
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-hide">
                  {userPosts.slice(0, 3).map(post => (
                    <div 
                      key={post._id} 
                      className="border border-gray-200 rounded-xl p-3 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-purple-300 bg-white group"
                      onClick={() => handleView(post._id)}
                    >
                      <div className="flex space-x-3">
                        {post.images?.[0]?.url ? (
                          <img 
                            src={post.images[0].url} 
                            alt={post.content} 
                            className="w-16 h-16 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                            <FaBox className="text-xl text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1 group-hover:text-purple-600 transition-colors">
                            {post.descriptionProduct || post.content?.split(' ').slice(0, 6).join(' ') || 'Product'}
                          </h4>
                          {post.price && (
                            <p className="text-purple-600 font-bold">
                              ₹{parseInt(post.price).toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {userPosts.length > 3 && (
                  <button 
                    className="w-full mt-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300 font-semibold"
                    onClick={handleViewAllProducts}
                  >
                    View All {userPosts.length} Items
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ViewSeperateProduct;