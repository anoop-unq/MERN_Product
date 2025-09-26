// import { useContext, useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import { assets } from '../assets/assets';
// import { FaArrowLeft, FaBox, FaUser, FaStore, FaMapMarkerAlt, FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
// import moment from 'moment';

// const ViewAllProductsUser = () => {
//   const { userId, postId } = useParams();
//   const navigate = useNavigate();
//   const { posts, getUserById } = useContext(AppContext);
//   const [userDetails, setUserDetails] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const user = await getUserById(userId);
//         setUserDetails(user);
//         const userPosts = posts.filter(p => p.author?._id === userId);
//         setUserPosts(userPosts);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userId, posts, getUserById]);

//   const handleProduct = (postId) => {
//     navigate(`/view-detail/product/${userId}/${postId}`, {
//       state: {
//         verificationKey: "product_view_key_123",
//         sourceComponent: "ViewSeperateProduct",
//         timestamp: Date.now()
//       }
//     });
//   };

//   const backButton = (userId) => {
//     navigate(`/view-detail/product/${userId}/${postId}`
//       , {
//       state: {
//         verifiyKey: "product_back_123",
//         source: "ViewSeperate",
//         timestamp: Date.now()
//       }
//     }
//     );
//   };

//   // Open modal with selected post and reset image index
//   const openImageModal = (post, index = 0) => {
//     setSelectedPost(post);
//     setCurrentImageIndex(index);
//     setIsModalOpen(true);
//     // Prevent body scroll when modal is open
//     document.body.style.overflow = 'hidden';
//   };

//   // Close modal and restore body scroll
//   const closeImageModal = () => {
//     setIsModalOpen(false);
//     setSelectedPost(null);
//     setCurrentImageIndex(0);
//     document.body.style.overflow = 'unset';
//   };

//   // Navigate to next image
//   const nextImage = () => {
//     if (selectedPost && selectedPost.images) {
//       setCurrentImageIndex((prevIndex) => 
//         prevIndex === selectedPost.images.length - 1 ? 0 : prevIndex + 1
//       );
//     }
//   };

//   // Navigate to previous image
//   const prevImage = () => {
//     if (selectedPost && selectedPost.images) {
//       setCurrentImageIndex((prevIndex) => 
//         prevIndex === 0 ? selectedPost.images.length - 1 : prevIndex - 1
//       );
//     }
//   };

//   // Handle keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!isModalOpen) return;
      
//       switch(e.key) {
//         case 'Escape':
//           closeImageModal();
//           break;
//         case 'ArrowRight':
//           nextImage();
//           break;
//         case 'ArrowLeft':
//           prevImage();
//           break;
//         default:
//           break;
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [isModalOpen, selectedPost, currentImageIndex]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
//         <div className="flex flex-col items-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
//           <p className="text-gray-600">Loading products...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <button
//             onClick={() => backButton(userDetails._id)}
//             className="flex items-center text-purple-600 hover:text-purple-700 transition-colors bg-white rounded-full px-4 py-2 shadow-sm hover:shadow-md"
//           >
//             <FaArrowLeft className="mr-2" />
//             Back
//           </button>
          
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
//             All Products by {userDetails?.name || 'Seller'}
//           </h1>
          
//           <div className="w-10"></div>
//         </div>

//         {/* Seller Info Card */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
//           <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
//             <img
//               src={userDetails?.photo || assets.user_image}
//               alt="Seller"
//               className="w-20 h-20 rounded-full object-cover border-2 border-purple-200"
//             />
            
//             <div className="flex-1 text-center md:text-left">
//               <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
//                 <h2 className="text-xl font-bold text-gray-900">{userDetails?.name || 'Unknown Seller'}</h2>
//                 {userDetails?.isAccountVerified && (
//                   <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                     Verified
//                   </span>
//                 )}
//               </div>
              
//               <p className="text-gray-600 mb-4">
//                 Member since {moment(userDetails?.createdAt).format('MMMM YYYY')}
//               </p>
              
//               {userDetails?.address && (
//                 <div className="flex items-center justify-center md:justify-start text-gray-500 text-sm">
//                   <FaMapMarkerAlt className="mr-2" />
//                   {userDetails.address.city}, {userDetails.address.state}, {userDetails.address.country}
//                 </div>
//               )}
//             </div>
            
//             <div className="bg-purple-100 text-purple-800 px-4 py-3 rounded-lg text-center">
//               <div className="text-2xl font-bold">{userPosts.length}</div>
//               <div className="text-sm">Products</div>
//             </div>
//           </div>
//         </div>

//         {/* Products Grid */}
//         {userPosts.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {userPosts.map(post => (
//               <div 
//                 key={post._id} 
//                 className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
//               >
//                 {/* Product Image with Quick View Button */}
//                 {post.images && post.images.length > 0 ? (
//                   <div className="h-48 w-full relative overflow-hidden">
//                     <img
//                       src={post.images[0].url}
//                       alt="Product"
//                       className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                       onClick={() => handleProduct(post._id)}
//                     />
                    
//                     {/* Quick View Button */}
//                     {post.images.length > 1 && (
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openImageModal(post, 0);
//                         }}
//                         className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110"
//                         title="Quick View All Images"
//                       >
//                         <FaExpand className="text-sm" />
//                       </button>
//                     )}
                    
//                     {/* Image Count Badge */}
//                     {post.images.length > 1 && (
//                       <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
//                         {post.images.length} images
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div 
//                     className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center cursor-pointer"
//                     onClick={() => handleProduct(post._id)}
//                   >
//                     <FaBox className="text-4xl text-gray-400" />
//                   </div>
//                 )}
                
//                 {/* Product Details */}
//                 <div className="p-4" onClick={() => handleProduct(post._id)}>
//                   <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
//                     {post.descriptionProduct || post.content}
//                   </h3>
                  
//                   {post.price && (
//                     <p className="text-2xl font-bold text-purple-600 mb-3">
//                       ₹{parseInt(post.price).toLocaleString('en-IN')}
//                     </p>
//                   )}
                  
//                   {post.productModel && (
//                     <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3 capitalize">
//                       {post.productModel}
//                     </span>
//                   )}
                  
//                   <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
//                     <span>{moment(post.createdAt).fromNow()}</span>
//                     <div className="flex items-center">
//                       <FaUser className="mr-1 text-gray-400" />
//                       <span>{userDetails?.name}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
//             <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//               <FaBox className="text-3xl text-gray-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
//             <p className="text-gray-600">This seller hasn't listed any products yet.</p>
//           </div>
//         )}
//       </div>

//       {/* Image Modal */}
//       {isModalOpen && selectedPost && (
//         <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
//           <div className="relative w-full max-w-4xl max-h-full">
//             {/* Close Button */}
//             <button
//               onClick={closeImageModal}
//               className="absolute top-4 right-4 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
//             >
//               <FaTimes />
//             </button>

//             {/* Navigation Arrows */}
//             {selectedPost.images.length > 1 && (
//               <>
//                 <button
//                   onClick={prevImage}
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
//                 >
//                   <FaChevronLeft />
//                 </button>
//                 <button
//                   onClick={nextImage}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
//                 >
//                   <FaChevronRight />
//                 </button>
//               </>
//             )}

//             {/* Main Image */}
//             <div className="flex flex-col items-center">
//               <img
//                 src={selectedPost.images[currentImageIndex].url}
//                 alt={`Product image ${currentImageIndex + 1}`}
//                 className="max-w-full max-h-[70vh] object-contain rounded-lg"
//               />
              
//               {/* Image Caption */}
//               {selectedPost.images[currentImageIndex].caption && (
//                 <p className="text-white text-center mt-4 text-lg">
//                   {selectedPost.images[currentImageIndex].caption}
//                 </p>
//               )}
//             </div>

//             {/* Thumbnail Navigation */}
//             {selectedPost.images.length > 1 && (
//               <div className="flex justify-center mt-6 space-x-2 overflow-x-auto py-2">
//                 {selectedPost.images.map((image, index) => (
//                   <button
//                     key={image._id}
//                     onClick={() => setCurrentImageIndex(index)}
//                     className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
//                       index === currentImageIndex ? 'border-white border-2' : 'border-gray-500 opacity-60'
//                     } hover:opacity-100`}
//                   >
//                     <img
//                       src={image.url}
//                       alt={`Thumbnail ${index + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* Image Counter */}
//             <div className="text-white text-center mt-4">
//               {currentImageIndex + 1} / {selectedPost.images.length}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewAllProductsUser;

import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { FaBox, FaUser, FaMapMarkerAlt, FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import moment from 'moment';
import { BackButton } from './BackButton';

const ViewAllProductsUser = () => {
  const { userId, postId } = useParams();
  const navigate = useNavigate();
  const { posts, getUserById } = useContext(AppContext);
  const [userDetails, setUserDetails] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserById(userId);
        setUserDetails(user);
        const userPosts = posts.filter(p => p.author?._id === userId);
        setUserPosts(userPosts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, posts, getUserById]);

  const handleProduct = (postId) => {
    navigate(`/view-detail/product/${userId}/${postId}`, {
      state: {
        verificationKey: "product_view_key_123",
        sourceComponent: "ViewSeperateProduct",
        timestamp: Date.now()
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* BackButton Header with state passed as props */}
      <BackButton 
        id={userId} 
        post={postId}
        state={{
          verifiyKey: "product_back_123",
          source: "ViewAllProductsUser",
          timestamp: Date.now()
        }}
      />
      
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              All Products by {userDetails?.name || 'Seller'}
            </h1>
          </div>

          {/* Seller Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img
                src={userDetails?.photo || assets.user_image}
                alt="Seller"
                className="w-20 h-20 rounded-full object-cover border-2 border-purple-200"
              />
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{userDetails?.name || 'Unknown Seller'}</h2>
                  {userDetails?.isAccountVerified && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">
                  Member since {moment(userDetails?.createdAt).format('MMMM YYYY')}
                </p>
                
                {userDetails?.address && (
                  <div className="flex items-center justify-center md:justify-start text-gray-500 text-sm">
                    <FaMapMarkerAlt className="mr-2" />
                    {userDetails.address.city}, {userDetails.address.state}, {userDetails.address.country}
                  </div>
                )}
              </div>
              
              <div className="bg-purple-100 text-purple-800 px-4 py-3 rounded-lg text-center">
                <div className="text-2xl font-bold">{userPosts.length}</div>
                <div className="text-sm">Products</div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPosts.map(post => (
                <div 
                  key={post._id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  {/* Product Image with Quick View Button */}
                  {post.images && post.images.length > 0 ? (
                    <div className="h-48 w-full relative overflow-hidden">
                      <img
                        src={post.images[0].url}
                        alt="Product"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onClick={() => handleProduct(post._id)}
                      />
                      
                      {/* Quick View Button */}
                      {post.images.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openImageModal(post, 0);
                          }}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110"
                          title="Quick View All Images"
                        >
                          <FaExpand className="text-sm" />
                        </button>
                      )}
                      
                      {/* Image Count Badge */}
                      {post.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                          {post.images.length} images
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center cursor-pointer"
                      onClick={() => handleProduct(post._id)}
                    >
                      <FaBox className="text-4xl text-gray-400" />
                    </div>
                  )}
                  
                  {/* Product Details */}
                  <div className="p-4" onClick={() => handleProduct(post._id)}>
                    <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2">
                      {post.descriptionProduct || post.content}
                    </h3>
                    
                    {post.price && (
                      <p className="text-2xl font-bold text-purple-600 mb-3">
                        ₹{parseInt(post.price).toLocaleString('en-IN')}
                      </p>
                    )}
                    
                    {post.productModel && (
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mb-3 capitalize">
                        {post.productModel}
                      </span>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                      <span>{moment(post.createdAt).fromNow()}</span>
                      <div className="flex items-center">
                        <FaUser className="mr-1 text-gray-400" />
                        <span>{userDetails?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FaBox className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-600">This seller hasn't listed any products yet.</p>
            </div>
          )}
        </div>

        {/* Image Modal */}
        {isModalOpen && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl max-h-full">
              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
              >
                <FaTimes />
              </button>

              {/* Navigation Arrows */}
              {selectedPost.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}

              {/* Main Image */}
              <div className="flex flex-col items-center">
                <img
                  src={selectedPost.images[currentImageIndex].url}
                  alt={`Product image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
                
                {/* Image Caption */}
                {selectedPost.images[currentImageIndex].caption && (
                  <p className="text-white text-center mt-4 text-lg">
                    {selectedPost.images[currentImageIndex].caption}
                  </p>
                )}
              </div>

              {/* Thumbnail Navigation */}
              {selectedPost.images.length > 1 && (
                <div className="flex justify-center mt-6 space-x-2 overflow-x-auto py-2">
                  {selectedPost.images.map((image, index) => (
                    <button
                      key={image._id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-white border-2' : 'border-gray-500 opacity-60'
                      } hover:opacity-100`}
                    >
                      <img
                        src={image.url}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Image Counter */}
              <div className="text-white text-center mt-4">
                {currentImageIndex + 1} / {selectedPost.images.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Modal functions
  const openImageModal = (post, index = 0) => {
    setSelectedPost(post);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (selectedPost && selectedPost.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === selectedPost.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedPost && selectedPost.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? selectedPost.images.length - 1 : prevIndex - 1
      );
    }
  };
};

export default ViewAllProductsUser;