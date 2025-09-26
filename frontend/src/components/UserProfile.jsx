


// import { useContext, useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// import { 
//   FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaEnvelope, 
//   FaPhone, FaVenusMars, FaCheckCircle, FaTimesCircle,
//   FaChevronLeft, FaChevronRight
// } from "react-icons/fa";
// import { 
//   FiMessageSquare, FiHeart, FiUser, FiMapPin, FiFileText, 
//   FiPlus, FiCalendar, FiEdit2, FiTrash2, FiMail, FiPhone, 
//   FiMap, FiNavigation, FiGlobe, FiHash, FiActivity, 
//   FiCheckCircle, FiLink, FiExternalLink, FiEdit, FiAtSign,
//   FiBook, FiBookOpen, FiAward, FiTarget, FiClock, FiFileText as FiFileTextIcon,
//   FiX,FiImage
// } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import LikesModal from "./LikesModal";
// import CommentsModal from "./CommentsModal";
// import ConfirmationModal from "./ConfirmModal";

// const UserProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const {
//     posts = [],
//     userdata,
//     deletePost,
//     getUserById
//   } = useContext(AppContext);
//   const [profileUser, setProfileUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userPosts, setUserPosts] = useState([]);
//   const [activeTab, setActiveTab] = useState("posts");

//   const [showLikesModal, setShowLikesModal] = useState(false);
//   const [showCommentsModal, setShowCommentsModal] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState(null);
//   const [selectedUserId, setSelectedUserId] = useState('');

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [postToDelete, setPostToDelete] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Image carousel states
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [isCarouselOpen, setIsCarouselOpen] = useState(false);
//   const [currentPostImages, setCurrentPostImages] = useState([]);

//   // Helper function to get all images from a post
//   const getPostImages = (post) => {
//     const images = [];
    
//     // Add legacy imageUrl if exists
//     if (post.imageUrl && post.imageUrl.trim() !== '') {
//       images.push(post.imageUrl);
//     }
    
//     // Add images from images array
//     if (post.images && Array.isArray(post.images)) {
//       post.images.forEach(image => {
//         if (image && (image.url || image.imageUrl)) {
//           images.push(image.url || image.imageUrl);
//         } else if (typeof image === 'string') {
//           images.push(image);
//         }
//       });
//     }
    
//     return images;
//   };

//   // Open carousel with images
//   const openCarousel = (post, startIndex = 0) => {
//     const images = getPostImages(post);
//     if (images.length > 0) {
//       setCurrentPostImages(images);
//       setSelectedImageIndex(startIndex);
//       setIsCarouselOpen(true);
//     }
//   };

//   // Close carousel
//   const closeCarousel = () => {
//     setIsCarouselOpen(false);
//     setCurrentPostImages([]);
//     setSelectedImageIndex(0);
//   };

//   // Navigate carousel
//   const nextImage = () => {
//     setSelectedImageIndex((prev) => 
//       prev === currentPostImages.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setSelectedImageIndex((prev) => 
//       prev === 0 ? currentPostImages.length - 1 : prev - 1
//     );
//   };

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!isCarouselOpen) return;
      
//       if (e.key === 'Escape') closeCarousel();
//       if (e.key === 'ArrowRight') nextImage();
//       if (e.key === 'ArrowLeft') prevImage();
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [isCarouselOpen]);

//   // Touch swipe for mobile
//   const [touchStart, setTouchStart] = useState(null);
//   const [touchEnd, setTouchEnd] = useState(null);

//   const minSwipeDistance = 50;

//   const onTouchStart = (e) => {
//     setTouchEnd(null);
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

//   const onTouchEnd = () => {
//     if (!touchStart || !touchEnd) return;
//     const distance = touchStart - touchEnd;
//     const isLeftSwipe = distance > minSwipeDistance;
//     const isRightSwipe = distance < -minSwipeDistance;

//     if (isLeftSwipe) nextImage();
//     if (isRightSwipe) prevImage();
//   };

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         if (userdata?.user?._id === id) {
//           setProfileUser(userdata.user);
//           const userPostsData = posts.filter(post => post?.author?._id === id);
//           setUserPosts(userPostsData);
//           setLoading(false);
//           return;
//         }
        
//         const userData = await getUserById(id);
//         if (userData) {
//           setProfileUser(userData);
//           const userPostsData = posts.filter(post => post?.author?._id === id);
//           setUserPosts(userPostsData);
//         } else {
//           setError("User not found");
//         }
//       } catch (err) {
//         console.error("Error fetching user:", err);
//         setError("Failed to load user profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [id, getUserById, posts, userdata]);

//   const handleDeletePost = async (postId) => {
//     if (window.confirm("Are you sure you want to delete this post?")) {
//       await deletePost(postId);
//       setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
//     }
//   };

//   const handleShowLikes = (postId, userId, id) => {
//     setSelectedPostId(postId);
//     setSelectedUserId(userId);
//     setShowLikesModal(true);
//   };

//   const handleShowComments = (postId) => {
//     setSelectedPostId(postId);
//     setShowCommentsModal(true);
//   };

//   const handleDeleteClick = (postId) => {
//     setPostToDelete(postId);
//     setIsModalOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     setIsDeleting(true);
//     try {
//       await deletePost(postToDelete);
//       setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postToDelete));
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error deleting post:", error);
//     } finally {
//       setIsDeleting(false);
//       setPostToDelete(null);
//     }
//   };

//   const handleCancelDelete = () => {
//     setIsModalOpen(false);
//     setPostToDelete(null);
//   };

//   const formatDate = (dateString) => {
//     const options = { year: 'numeric', month: 'long', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const calculateAge = (dobString) => {
//     const dob = new Date(dobString);
//     const diff = Date.now() - dob.getTime();
//     const ageDate = new Date(diff);
//     return Math.abs(ageDate.getUTCFullYear() - 1970);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="text-center"
//         >
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
//             className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
//           />
//           <p className="text-gray-600 font-medium">Loading profile...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   if (error || !profileUser) {
//     return (
//       <div className="max-w-md mx-auto min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-purple-50">
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.4 }}
//           className="bg-white rounded-2xl shadow-xl p-8 w-full"
//         >
//           <div className="text-center">
//             <motion.div 
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2 }}
//               className="mx-auto w-20 h-20 flex items-center justify-center bg-red-100 rounded-full mb-4"
//             >
//               <FiUser className="text-3xl text-red-500" />
//             </motion.div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-3">User not found</h2>
//             <p className="text-gray-600 mb-6">
//               {error || "The user you're looking for doesn't exist."}
//             </p>
//             <motion.button
//               whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => navigate("/home")}
//               className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-md"
//             >
//               Go Home
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   const isCurrentUser = userdata?.user?._id === profileUser._id;
//   const memberSince = profileUser.createdAt ? new Date(profileUser.createdAt).getFullYear() : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-12">
//       {/* Image Carousel Modal */}
//       <AnimatePresence>
//         {isCarouselOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
//             onClick={closeCarousel}
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Close Button */}
//               <button
//                 onClick={closeCarousel}
//                 className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full p-2 backdrop-blur-sm"
//               >
//                 <FiX className="w-6 h-6" />
//               </button>

//               {/* Navigation Arrows */}
//               {currentPostImages.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="absolute left-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full p-3 backdrop-blur-sm hidden md:flex items-center justify-center"
//                   >
//                     <FaChevronLeft className="w-5 h-5" />
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="absolute right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full p-3 backdrop-blur-sm hidden md:flex items-center justify-center"
//                   >
//                     <FaChevronRight className="w-5 h-5" />
//                   </button>
//                 </>
//               )}

//               {/* Main Image */}
//               <motion.div
//                 key={selectedImageIndex}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.3 }}
//                 className="w-full h-full flex items-center justify-center"
//                 onTouchStart={onTouchStart}
//                 onTouchMove={onTouchMove}
//                 onTouchEnd={onTouchEnd}
//               >
//                 <img
//                   src={currentPostImages[selectedImageIndex]}
//                   alt={`Post image ${selectedImageIndex + 1}`}
//                   className="max-w-full max-h-full object-contain rounded-lg"
//                   draggable={false}
//                 />
//               </motion.div>

//               {/* Image Counter */}
//               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
//                 {selectedImageIndex + 1} / {currentPostImages.length}
//               </div>

//               {/* Thumbnail Strip (Desktop) */}
//               {currentPostImages.length > 1 && (
//                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-2 max-w-full overflow-x-auto pb-2">
//                   {currentPostImages.map((image, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setSelectedImageIndex(index)}
//                       className={`flex-shrink-0 w-12 h-12 rounded border-2 transition-all duration-200 ${
//                         index === selectedImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
//                       }`}
//                     >
//                       <img
//                         src={image}
//                         alt={`Thumbnail ${index + 1}`}
//                         className="w-full h-full object-cover rounded"
//                         draggable={false}
//                       />
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {/* Mobile Swipe Indicator */}
//               <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/70 text-xs bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm md:hidden">
//                 Swipe to navigate
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Header */}
//       <motion.header
//         initial={{ y: -20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b shadow-sm py-4 px-4 sm:px-6 lg:px-8"
//       >
//         <div className="max-w-7xl mx-auto flex items-center">
//           <motion.button
//             whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => navigate("/home")}
//             className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition-all duration-200 ease-in-out shadow-sm border border-gray-200 flex-shrink-0"
//             aria-label="Go back"
//           >
//             <FaArrowLeft className="text-xl" />
//           </motion.button>
//           <h1 className="text-xl md:text-2xl font-bold ml-4 truncate max-w-[calc(100%-5rem)] text-gray-800">
//             {profileUser.name}'s Profile
//           </h1>
//         </div>
//       </motion.header>

//       {/* Profile Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* ... (Rest of your profile header content remains the same) ... */}

//         {/* Tabs and Content */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="bg-white rounded-2xl shadow-xl overflow-hidden"
//         >
//           {/* Tabs */}
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 onClick={() => setActiveTab("posts")}
//                 className={`py-4 px-6 text-center font-medium text-sm flex-1 flex items-center justify-center ${activeTab === "posts" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
//               >
//                 Posts
//                 {userPosts.length > 0 && (
//                   <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
//                     {userPosts.length}
//                   </span>
//                 )}
//               </button>
//               <button
//                 onClick={() => setActiveTab("about")}
//                 className={`py-4 px-6 text-center font-medium text-sm flex-1 flex items-center justify-center ${activeTab === "about" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
//               >
//                 About
//               </button>
//             </nav>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//                 {activeTab === "posts" && (
//     <div>
//       <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//         <FiFileText className="text-blue-600" />
//         Posts
//         <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full ml-2">
//           {userPosts.length}
//         </span>
//       </h2>
      
//       {userPosts.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {userPosts.map((post) => {
//             const postImages = getPostImages(post);
//             const hasImages = postImages.length > 0;

//             return (
//               <motion.div
//                 key={post._id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3 }}
//                 whileHover={{ 
//                   y: -5,
//                   boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
//                 }}
//                 className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
//               >
//                 <div className="p-5 h-full flex flex-col">
//                   <div className="flex justify-between items-start mb-4">
//                     <div className="flex items-center min-w-0">
//                       <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-blue-100 shadow-sm">
//                         <img
//                           src={post.author?.photo  || assets.user_image || "/default-avatar.png"}
//                           alt={post.author?.name}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                       <div className="min-w-0">
//                         <h3 className="font-semibold text-gray-800 truncate">
//                           {post.author?.name}
//                         </h3>
//                         <p className="text-gray-500 text-sm flex items-center gap-1">
//                           <FiCalendar className="text-gray-400" />
//                           {post.createdAt && formatDate(post.createdAt)}
//                         </p>
//                       </div>
//                     </div>
//                     {isCurrentUser && (
//                       <div className="flex space-x-2">
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => navigate(`/edit-post/${post._id}`)}
//                           className="text-blue-500 hover:text-blue-600 flex-shrink-0 transition-colors duration-200 p-2 rounded-lg bg-blue-50 hover:bg-blue-100"
//                           aria-label="Edit post"
//                         >
//                           <FiEdit2 className="text-lg" />
//                         </motion.button>
//                         <motion.button
//                           whileHover={{ scale: 1.1 }}
//                           whileTap={{ scale: 0.9 }}
//                           onClick={() => handleDeleteClick(post._id)}
//                           className="text-red-500 hover:text-red-600 flex-shrink-0 transition-colors duration-200 p-2 rounded-lg bg-red-50 hover:bg-red-100"
//                           aria-label="Delete post"
//                         >
//                           <FiTrash2 className="text-lg" />
//                         </motion.button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Post Content */}
//                   {post.content && (
//                     <p className="mb-4 whitespace-pre-line break-words text-gray-700 flex-grow leading-relaxed">
//                       {post.content}
//                     </p>
//                   )}

//                   {/* Enhanced Responsive Image Gallery with Carousel */}
//                   {hasImages && (
//                     <div className="mb-4">
//                       {/* Single Image - Full Width */}
//                       {postImages.length === 1 && (
//                         <motion.div
//                           whileHover={{ scale: 0.98 }}
//                           className="rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer group"
//                           onClick={() => openCarousel(post, 0)}
//                         >
//                           <div className="aspect-video w-full bg-gray-100 relative">
//                             <img
//                               src={postImages[0]}
//                               alt="Post content"
//                               className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                               loading="lazy"
//                             />
//                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
//                               <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 rounded-full p-3">
//                                 <FiExternalLink className="w-5 h-5 text-gray-700" />
//                               </div>
//                             </div>
//                           </div>
//                         </motion.div>
//                       )}

//                       {/* Multiple Images - Carousel Style */}
//                       {postImages.length > 1 && (
//                         <div className="relative">
//                           {/* Main Carousel Container */}
//                           <div className="relative rounded-xl overflow-hidden border border-gray-100 shadow-sm">
//                             {/* Images Stack with Navigation */}
//                             <div className="relative aspect-video bg-gray-100 overflow-hidden">
//                               {postImages.slice(0, 3).map((image, index) => (
//                                 <motion.div
//                                   key={index}
//                                   className={`absolute inset-0 transition-all duration-500 ${
//                                     index === 0 ? 'z-10 opacity-100' : 
//                                     index === 1 ? 'z-5 opacity-70 translate-x-4 scale-95' : 
//                                     'z-0 opacity-50 translate-x-8 scale-90'
//                                   }`}
//                                   whileHover={{ 
//                                     scale: index === 0 ? 1.02 : 1.01,
//                                     transition: { duration: 0.3 }
//                                   }}
//                                 >
//                                   <img
//                                     src={image}
//                                     alt={`Post content ${index + 1}`}
//                                     className="w-full h-full object-cover cursor-pointer"
//                                     loading="lazy"
//                                     onClick={() => openCarousel(post, index)}
//                                   />
//                                   {/* Overlay for stacked effect */}
//                                   {index > 0 && (
//                                     <div className="absolute inset-0 bg-black/20"></div>
//                                   )}
//                                 </motion.div>
//                               ))}
                              
//                               {/* Navigation Arrows for Desktop */}
//                               <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between p-4 z-20">
//                                 <button 
//                                   className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     // Logic to navigate carousel
//                                   }}
//                                 >
//                                   <FaChevronLeft className="w-4 h-4 text-gray-700" />
//                                 </button>
//                                 <button 
//                                   className="bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0"
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     // Logic to navigate carousel
//                                   }}
//                                 >
//                                   <FaChevronRight className="w-4 h-4 text-gray-700" />
//                                 </button>
//                               </div>

//                               {/* Image Counter */}
//                               <div className="absolute top-4 right-4 z-20 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
//                                 {postImages.length} photos
//                               </div>

//                               {/* View All Button */}
//                               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
//                                 <motion.button
//                                   whileHover={{ scale: 1.05 }}
//                                   whileTap={{ scale: 0.95 }}
//                                   onClick={() => openCarousel(post, 0)}
//                                   className="bg-white/90 hover:bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
//                                 >
//                                   <FiExternalLink className="w-4 h-4" />
//                                   View All
//                                 </motion.button>
//                               </div>
//                             </div>
//                           </div>

//                           {/* Thumbnail Strip for Desktop */}
//                           <div className="hidden md:flex gap-2 mt-3 overflow-x-auto pb-2">
//                             {postImages.slice(0, 5).map((image, index) => (
//                               <motion.button
//                                 key={index}
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-200"
//                                 onClick={() => openCarousel(post, index)}
//                               >
//                                 <img
//                                   src={image}
//                                   alt={`Thumbnail ${index + 1}`}
//                                   className="w-full h-full object-cover"
//                                 />
//                                 {index === 4 && postImages.length > 5 && (
//                                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                                     <span className="text-white text-xs font-bold">
//                                       +{postImages.length - 5}
//                                     </span>
//                                   </div>
//                                 )}
//                               </motion.button>
//                             ))}
//                           </div>

//                           {/* Mobile Swipe Indicator */}
//                           <div className="md:hidden text-center mt-2">
//                             <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                               👆 Swipe to view images
//                             </span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Product Info */}
//                   {(post.descriptionProduct || post.price || post.productModel) && (
//                     <button
//                       onClick={() => navigate(`/view-detail/product/${post.author?._id}/${post._id}`)}
//                       className="flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-gray-700 bg-white/70 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:text-green-600 shadow-md mb-4"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                       <span className="text-sm">View More</span>
//                     </button>
//                   )}

//                   {/* Post Actions */}
//                   <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
//                     <div className="flex items-center space-x-4">
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => handleShowLikes(post._id, id)}
//                         className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
//                       >
//                         <FiHeart className="text-lg" />
//                         <span className="text-sm font-medium">{post.likes?.length || 0}</span>
//                       </motion.button>
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => handleShowComments(post._id)}
//                         className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
//                       >
//                         <FiMessageSquare className="text-lg" />
//                         <span className="text-sm font-medium">{post.comments?.length || 0}</span>
//                       </motion.button>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       ) : (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.3 }}
//           className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border-2 border-dashed border-blue-200"
//         >
//           <div className="text-blue-400 mb-6">
//             <FiFileText className="h-20 w-20 mx-auto" />
//           </div>
//           <h3 className="text-2xl font-bold text-gray-800 mb-3">
//             No posts yet
//           </h3>
//           <p className="text-gray-600 mb-6 max-w-md mx-auto">
//             {isCurrentUser
//               ? "Share your thoughts and experiences with the community!"
//               : "This user hasn't shared any posts yet."}
//           </p>
//           {isCurrentUser && (
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//               <Link
//                 to="/home"
//                 className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:shadow-xl"
//               >
//                 <FiPlus className="text-lg" />
//                 Create your first post
//               </Link>
//             </motion.div>
//           )}
//         </motion.div>
//       )}

//       {/* Modals */}
//       {showLikesModal && (
//         <LikesModal 
//           postId={selectedPostId} 
//           userId={selectedUserId}
//           onClose={() => setShowLikesModal(false)} 
//         />
//       )}

//       {showCommentsModal && (
//         <CommentsModal 
//           postId={selectedPostId} 
//           onClose={() => setShowCommentsModal(false)} 
//         />
//       )}
//     </div>
//   )}

//               {activeTab === "about" && (
//   <div className="p-4 md:p-6">
//     <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
//       <FiUser className="text-purple-600 text-lg md:text-xl" />
//       About
//     </h2>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//       {/* Personal Information Card */}
//       <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
//         <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
//           <FiUser className="text-blue-600 text-sm md:text-base" />
//           Personal Information
//         </h3>
//         <div className="space-y-3 md:space-y-4">
//           <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-blue-50">
//             <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//               <FiUser className="text-blue-500 text-sm md:text-base" />
//               Full Name
//             </span>
//             <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.name}</span>
//           </div>
//           {profileUser.username && (
//             <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-green-50">
//               <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                 <FiAtSign className="text-green-500 text-sm md:text-base" />
//                 Username
//               </span>
//               <span className="font-medium text-gray-800 text-sm md:text-base">@{profileUser.username}</span>
//             </div>
//           )}
//           {profileUser.dateOfBirth && (
//             <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-purple-50">
//               <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                 <FiCalendar className="text-purple-500 text-sm md:text-base" />
//                 Date of Birth
//               </span>
//               <span className="font-medium text-gray-800 text-sm md:text-base">{formatDate(profileUser.dateOfBirth)}</span>
//             </div>
//           )}
//           {profileUser.gender && (
//             <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-pink-50">
//               <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                 <FiHeart className="text-pink-500 text-sm md:text-base" />
//                 Gender
//               </span>
//               <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.gender}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Contact Information Card */}
//       <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
//         <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
//           <FiMail className="text-green-600 text-sm md:text-base" />
//           Contact Information
//         </h3>
//         <div className="space-y-3 md:space-y-4">
//         {profileUser.email && (
//   <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-green-50">
//     <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//       <FiMail className="text-green-500 text-sm md:text-base" />
//       Email
//     </span>
//     <span className="font-medium text-gray-800 text-sm md:text-base break-all">
//       {'' + profileUser.email}
//     </span>
//   </div>
// )}

//           {profileUser.mobile && (
//             <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-blue-50">
//               <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                 <FiPhone className="text-blue-500 text-sm md:text-base" />
//                 Phone
//               </span>
//               <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.mobile}</span>
//             </div>
//           )}
//           {profileUser.address && (
//             <>
//               {profileUser.address.street && (
//                 <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
//                   <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                     <FiMapPin className="text-gray-500 text-sm md:text-base" />
//                     Street
//                   </span>
//                   <span className="font-medium text-gray-800 text-sm md:text-base text-right">{profileUser.address.street}</span>
//                 </div>
//               )}
//               {profileUser.address.city && (
//                 <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
//                   <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                     <FiMap className="text-gray-500 text-sm md:text-base" />
//                     City
//                   </span>
//                   <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.city}</span>
//                 </div>
//               )}
//               {profileUser.address.state && (
//                 <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
//                   <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                     <FiNavigation className="text-gray-500 text-sm md:text-base" />
//                     State
//                   </span>
//                   <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.state}</span>
//                 </div>
//               )}
//               {profileUser.address.country && (
//                 <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
//                   <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                     <FiGlobe className="text-gray-500 text-sm md:text-base" />
//                     Country
//                   </span>
//                   <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.country}</span>
//                 </div>
//               )}
//               {profileUser.address.zipCode && (
//                 <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
//                   <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                     <FiHash className="text-gray-500 text-sm md:text-base" />
//                     Zip Code
//                   </span>
//                   <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.zipCode}</span>
//                 </div>
//               )}
//             </>
//           )}
//           <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-yellow-50">
//             <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//               <FiActivity className="text-yellow-500 text-sm md:text-base" />
//               Account Status
//             </span>
//             <span className={`font-medium text-sm md:text-base ${profileUser.isAccountActive ? 'text-green-600' : 'text-red-600'}`}>
//               {profileUser.isAccountActive ? 'Active' : 'Inactive'}
//             </span>
//           </div>
//           <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-indigo-50">
//             <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//               <FiCheckCircle className="text-indigo-500 text-sm md:text-base" />
//               Verification
//             </span>
//             <span className={`font-medium text-sm md:text-base ${profileUser.isAccountVerified ? 'text-green-600' : 'text-red-600'}`}>
//               {profileUser.isAccountVerified ? 'Verified' : 'Not Verified'}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Portfolio Card */}
//       {profileUser.portfolioUrl && (
//         <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-2">
//           <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
//             <FiLink className="text-purple-600 text-sm md:text-base" />
//             Portfolio
//           </h3>
//           <div className="space-y-3 md:space-y-4">
//             <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-purple-50">
//               <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                 <FiExternalLink className="text-purple-500 text-sm md:text-base" />
//                 Website
//               </span>
//               <a 
//                 href={profileUser.portfolioUrl} 
//                 target="_blank" 
//                 rel="noopener noreferrer" 
//                 className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200 flex items-center gap-1 text-sm md:text-base"
//               >
//                 Visit Portfolio
//                 <FiExternalLink className="text-sm" />
//               </a>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Education Card */}
//       {profileUser.education && profileUser.education.length > 0 && (
//         <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-2">
//           <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
//             <FiBook className="text-green-600 text-sm md:text-base" />
//             Education
//           </h3>
//           <div className="space-y-4 md:space-y-6">
//             {profileUser.education.map((edu, index) => (
//               <div key={index} className="border-l-4 border-green-200 pl-3 md:pl-4 py-2">
//                 <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
//                   <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-3 gap-1 md:gap-0">
//                     <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                       <FiBookOpen className="text-green-500 text-sm md:text-base" />
//                       Institution
//                     </span>
//                     <span className="font-semibold text-gray-800 text-sm md:text-base md:text-right">{edu.institution}</span>
//                   </div>
//                   {edu.degree && (
//                     <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-3 gap-1 md:gap-0">
//                       <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                         <FiAward className="text-blue-500 text-sm md:text-base" />
//                         Degree
//                       </span>
//                       <span className="font-medium text-gray-800 text-sm md:text-base md:text-right">{edu.degree}</span>
//                     </div>
//                   )}
//                   {edu.fieldOfStudy && (
//                     <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-3 gap-1 md:gap-0">
//                       <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                         <FiTarget className="text-purple-500 text-sm md:text-base" />
//                         Field of Study
//                       </span>
//                       <span className="font-medium text-gray-800 text-sm md:text-base md:text-right">{edu.fieldOfStudy}</span>
//                     </div>
//                   )}
//                   {(edu.startYear || edu.endYear) && (
//                     <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-3 gap-1 md:gap-0">
//                       <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
//                         <FiClock className="text-orange-500 text-sm md:text-base" />
//                         Duration
//                       </span>
//                       <span className="font-medium text-gray-800 text-sm md:text-base md:text-right">
//                         {edu.startYear} - {edu.endYear || 'Present'}
//                       </span>
//                     </div>
//                   )}
//                   {edu.description && (
//                     <div className="mt-3 md:mt-4 p-2 md:p-3 bg-gray-50 rounded-lg">
//                       <span className="text-gray-600 block mb-1 md:mb-2 flex items-center gap-2 text-sm md:text-base">
//                         <FiFileText className="text-gray-500 text-sm md:text-base" />
//                         Description
//                       </span>
//                       <p className="text-gray-700 whitespace-pre-line break-words leading-relaxed text-sm md:text-base">
//                         {edu.description}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Bio Card */}
//       {profileUser.bio && profileUser.bio !== "gshgd" && (
//         <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-2">
//           <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
//             <FiEdit className="text-indigo-600 text-sm md:text-base" />
//             Bio
//           </h3>
//           <div className="p-3 md:p-4 bg-indigo-50 rounded-lg md:rounded-xl">
//             <p className="text-gray-700 whitespace-pre-line break-words leading-relaxed text-sm md:text-base md:text-lg">
//               {profileUser.bio}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   </div>
// )}

           
            
//           </div>
//         </motion.div>
//       </div>

//       <ConfirmationModal
//         isOpen={isModalOpen}
//         onClose={handleCancelDelete}
//         onConfirm={handleConfirmDelete}
//         title="Delete Post"
//         message="Are you sure you want to delete this post? This action cannot be undone."
//         loading={isDeleting}
//       />
//     </div>
//   );
// };


// export default UserProfile;


import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { 
  FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaEnvelope, 
  FaPhone, FaVenusMars, FaCheckCircle, FaTimesCircle,
  FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { 
  FiMessageSquare, FiHeart, FiUser, FiMapPin, FiFileText, 
  FiPlus, FiCalendar, FiEdit2, FiTrash2, FiMail, FiPhone, 
  FiMap, FiNavigation, FiGlobe, FiHash, FiActivity, 
  FiCheckCircle, FiLink, FiExternalLink, FiEdit, FiAtSign,
  FiBook, FiBookOpen, FiAward, FiTarget, FiClock, FiFileText as FiFileTextIcon,
  FiX, FiImage,
} from "react-icons/fi";
import { FiRefreshCw } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import LikesModal from "./LikesModal";
import CommentsModal from "./CommentsModal";
import ConfirmationModal from "./ConfirmModal";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    posts = [],
    userdata,
    deletePost,
    getUserById,
    fetchPosts, // Add this to refresh posts
    updateUserBio,
    updateUserProfile,
    updateUserPhoto,
    likePost,
    addComment,
    fetchComments
  } = useContext(AppContext);
  
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Image carousel states
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [currentPostImages, setCurrentPostImages] = useState([]);

  // Real-time update states
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Helper function to get all images from a post
  const getPostImages = (post) => {
    const images = [];
    
    // Add legacy imageUrl if exists
    if (post.imageUrl && post.imageUrl.trim() !== '') {
      images.push(post.imageUrl);
    }
    
    // Add images from images array
    if (post.images && Array.isArray(post.images)) {
      post.images.forEach(image => {
        if (image && (image.url || image.imageUrl)) {
          images.push(image.url || image.imageUrl);
        } else if (typeof image === 'string') {
          images.push(image);
        }
      });
    }
    
    return images;
  };

  // Open carousel with images
  const openCarousel = (post, startIndex = 0) => {
    const images = getPostImages(post);
    if (images.length > 0) {
      setCurrentPostImages(images);
      setSelectedImageIndex(startIndex);
      setIsCarouselOpen(true);
    }
  };

  // Close carousel
  const closeCarousel = () => {
    setIsCarouselOpen(false);
    setCurrentPostImages([]);
    setSelectedImageIndex(0);
  };

  // Navigate carousel
  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === currentPostImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? currentPostImages.length - 1 : prev - 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isCarouselOpen) return;
      
      if (e.key === 'Escape') closeCarousel();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCarouselOpen]);

  // Touch swipe for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  // Fetch user data with real-time updates
  const fetchUserData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      // If it's the current user, use cached data but also refresh
      if (userdata?.user?._id === id) {
        setProfileUser(userdata.user);
        
        // Force refresh posts if needed
        if (forceRefresh) {
          await fetchPosts();
        }
        
        const userPostsData = posts.filter(post => post?.author?._id === id);
        setUserPosts(userPostsData);
        
        if (forceRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
        return;
      }
      
      // For other users, fetch fresh data
      const userData = await getUserById(id);
      if (userData) {
        setProfileUser(userData);
        
        if (forceRefresh) {
          await fetchPosts();
        }
        
        const userPostsData = posts.filter(post => post?.author?._id === id);
        setUserPosts(userPostsData);
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to load user profile");
    } finally {
      if (forceRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Initial load and refresh on post changes
  useEffect(() => {
    fetchUserData();
  }, [id, getUserById, userdata]);

  // Listen for post updates
  useEffect(() => {
    if (profileUser) {
      const userPostsData = posts.filter(post => post?.author?._id === profileUser._id);
      setUserPosts(userPostsData);
    }
  }, [posts, profileUser?._id]);

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Refresh when lastUpdate changes
  useEffect(() => {
    if (lastUpdate > 0 && !loading) {
      fetchUserData(true);
    }
  }, [lastUpdate]);

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      // Posts will update via the useEffect above
    }
  };

  const handleShowLikes = (postId, userId, id) => {
    setSelectedPostId(postId);
    setSelectedUserId(userId);
    setShowLikesModal(true);
  };

  const handleShowComments = (postId) => {
    setSelectedPostId(postId);
    setShowCommentsModal(true);
  };

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(postToDelete);
      setIsModalOpen(false);
      // Force refresh to get latest data
      fetchUserData(true);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setPostToDelete(null);
  };

  // New function to handle like
  const handleLikePost = async (postId) => {
    try {
      await likePost(postId);
      // Refresh posts to get updated like count
      fetchUserData(true);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // New function to handle comment
  const handleAddComment = async (postId, content) => {
    try {
      await addComment(postId, content);
      // Refresh posts to get updated comment count
      fetchUserData(true);
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error; // Re-throw to let CommentsModal handle it
    }
  };

  // New function to handle manual refresh
  const handleRefresh = () => {
    fetchUserData(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full"
        >
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-20 h-20 flex items-center justify-center bg-red-100 rounded-full mb-4"
            >
              <FiUser className="text-3xl text-red-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">User not found</h2>
            <p className="text-gray-600 mb-6">
              {error || "The user you're looking for doesn't exist."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-md"
            >
              Go Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isCurrentUser = userdata?.user?._id === profileUser._id;
  const memberSince = profileUser.createdAt ? new Date(profileUser.createdAt).getFullYear() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-12">
      {/* Refresh Indicator */}
      {refreshing && (
        <div className="fixed top-20 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
          Updating...
        </div>
      )}

      {/* Image Carousel Modal */}
      <AnimatePresence>
        {isCarouselOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeCarousel}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeCarousel}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full p-2 backdrop-blur-sm"
              >
                <FiX className="w-6 h-6" />
              </button>

              {/* Navigation Arrows */}
              {currentPostImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full p-3 backdrop-blur-sm hidden md:flex items-center justify-center"
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200 bg-black/50 rounded-full p-3 backdrop-blur-sm hidden md:flex items-center justify-center"
                  >
                    <FaChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Main Image */}
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex items-center justify-center"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <img
                  src={currentPostImages[selectedImageIndex]}
                  alt={`Post image ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  draggable={false}
                />
              </motion.div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {selectedImageIndex + 1} / {currentPostImages.length}
              </div>

              {/* Thumbnail Strip (Desktop) */}
              {currentPostImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden md:flex space-x-2 max-w-full overflow-x-auto pb-2">
                  {currentPostImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-12 h-12 rounded border-2 transition-all duration-200 ${
                        index === selectedImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Mobile Swipe Indicator */}
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/70 text-xs bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm md:hidden">
                Swipe to navigate
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b shadow-sm py-4 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition-all duration-200 ease-in-out shadow-sm border border-gray-200 flex-shrink-0"
              aria-label="Go back"
            >
              <FaArrowLeft className="text-xl" />
            </motion.button>
            <h1 className="text-xl md:text-2xl font-bold ml-4 truncate max-w-[calc(100%-5rem)] text-gray-800">
              {profileUser.name}'s Profile
            </h1>
          </div>
          
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
          >
            <motion.div
              animate={{ rotate: refreshing ? 360 : 0 }}
              transition={{ duration: 1, ease: "linear" }}
            >
              <FiRefreshCw className="w-4 h-4" />
            </motion.div>
            Refresh
          </motion.button>
        </div>
      </motion.header>

      {/* Profile Header Content - Keep your existing profile header JSX here */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Your existing profile header content */}
        
        {/* Tabs and Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-4 px-6 text-center font-medium text-sm flex-1 flex items-center justify-center ${activeTab === "posts" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                Posts
                {userPosts.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {userPosts.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`py-4 px-6 text-center font-medium text-sm flex-1 flex items-center justify-center ${activeTab === "about" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                About
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "posts" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiFileText className="text-blue-600" />
                  Posts
                  <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full ml-2">
                    {userPosts.length}
                  </span>
                </h2>
                
                {userPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userPosts.map((post) => {
                      const postImages = getPostImages(post);
                      const hasImages = postImages.length > 0;

                      return (
                        <motion.div
                          key={post._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ 
                            y: -5,
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                          }}
                          className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
                        >
                          <div className="p-5 h-full flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center min-w-0">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-blue-100 shadow-sm">
                                  <img
                                    src={post.author?.photo  || assets.user_image || "/default-avatar.png"}
                                    alt={post.author?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-gray-800 truncate">
                                    {post.author?.name}
                                  </h3>
                                  <p className="text-gray-500 text-sm flex items-center gap-1">
                                    <FiCalendar className="text-gray-400" />
                                    {post.createdAt && formatDate(post.createdAt)}
                                  </p>
                                </div>
                              </div>
                              {isCurrentUser && (
                                <div className="flex space-x-2">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => navigate(`/edit-post/${post._id}`)}
                                    className="text-blue-500 hover:text-blue-600 flex-shrink-0 transition-colors duration-200 p-2 rounded-lg bg-blue-50 hover:bg-blue-100"
                                    aria-label="Edit post"
                                  >
                                    <FiEdit2 className="text-lg" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDeleteClick(post._id)}
                                    className="text-red-500 hover:text-red-600 flex-shrink-0 transition-colors duration-200 p-2 rounded-lg bg-red-50 hover:bg-red-100"
                                    aria-label="Delete post"
                                  >
                                    <FiTrash2 className="text-lg" />
                                  </motion.button>
                                </div>
                              )}
                            </div>

                            {/* Post Content */}
                            {post.content && (
                              <p className="mb-4 whitespace-pre-line break-words text-gray-700 flex-grow leading-relaxed">
                                {post.content}
                              </p>
                            )}

                            {/* Enhanced Responsive Image Gallery with Carousel */}
                            {hasImages && (
                              <div className="mb-4">
                                {/* Your existing image gallery code */}
                              </div>
                            )}

                            {/* Product Info */}
                            {(post.descriptionProduct || post.price || post.productModel) && (
                              <button
                                onClick={() => navigate(`/view-detail/product/${post.author?._id}/${post._id}`)}
                                className="flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-gray-700 bg-white/70 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:text-green-600 shadow-md mb-4"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="text-sm">View More</span>
                              </button>
                            )}

                            {/* Post Actions */}
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                              <div className="flex items-center space-x-4">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleLikePost(post._id)}
                                  className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                                >
                                  <FiHeart className="text-lg" />
                                  <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleShowComments(post._id)}
                                  className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
                                >
                                  <FiMessageSquare className="text-lg" />
                                  <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border-2 border-dashed border-blue-200"
                  >
                    <div className="text-blue-400 mb-6">
                      <FiFileText className="h-20 w-20 mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      No posts yet
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {isCurrentUser
                        ? "Share your thoughts and experiences with the community!"
                        : "This user hasn't shared any posts yet."}
                    </p>
                    {isCurrentUser && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to="/home"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:shadow-xl"
                        >
                          <FiPlus className="text-lg" />
                          Create your first post
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Modals */}
                {showLikesModal && (
                  <LikesModal 
                    postId={selectedPostId} 
                    userId={selectedUserId}
                    onClose={() => setShowLikesModal(false)} 
                  />
                )}

                {showCommentsModal && (
                  <CommentsModal 
                    postId={selectedPostId} 
                    onClose={() => setShowCommentsModal(false)}
                    onCommentAdded={() => fetchUserData(true)}
                  />
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="p-4 md:p-6">
                {/* Your existing about tab content */}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  );
};

export default UserProfile;