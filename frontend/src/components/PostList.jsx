// import { useContext, useState, useRef, useEffect } from 'react';
// import { AppContext } from '../context/AppContext';
// import moment from 'moment';
// import { assets } from '../assets/assets';
// import { useNavigate } from 'react-router-dom';
// import { toast } from "react-toastify";
// import { ChatBubbleOvalLeftEllipsisIcon,TagIcon } from '@heroicons/react/24/outline';
// import ConfirmationModal from './ConfirmModal';
// import { ShoppingBagIcon as ShoppingBagSolid } from '@heroicons/react/24/solid';

// const PostList = ({ posts: postsProp }) => {
//   const { 
//     posts: contextPosts, 
//     isLoadingPosts, 
//     userdata, 
//     likePost, 
//     addComment,
//     deleteComment,
//     fetchPosts,
//     fetchComments,
//     updatePostInContext 
//   } = useContext(AppContext);
  
//   const navigate = useNavigate();
//   const posts = postsProp || contextPosts;
//   const [activeCommentPostId, setActiveCommentPostId] = useState(null);
//   const [commentText, setCommentText] = useState('');
//   const [isSubmittingComment, setIsSubmittingComment] = useState(false);
//   const commentInputRefs = useRef({});
//   const [commentsLoading, setCommentsLoading] = useState({});
//   const [showCommentsForPost, setShowCommentsForPost] = useState({});
//   const [localLikes, setLocalLikes] = useState({});
//   const [localLoading, setLocalLoading] = useState({});
//   const [postComments, setPostComments] = useState({});
//   const [delayedLoading, setDelayedLoading] = useState({});
//   const [filter, setFilter] = useState('all'); // 'all', 'images', 'text'
//   const [isFiltering, setIsFiltering] = useState(false);
//   const [deletingCommentId, setDeletingCommentId] = useState(null);
//   const [confirmDeleteId, setConfirmDeleteId] = useState(null);

 


  
//   // Filter posts based on selected filter
//   const filteredPosts = posts.filter(post => {
//     const hasImage = post.imageUrl && post.imageUrl.trim() !== '';
    
//     if (filter === 'images') return hasImage;
//     if (filter === 'text') return !hasImage;
//     return true; // 'all' filter
//   });

  
//   // Apply filter with loading delay
//   const handleFilterChange = (newFilter) => {
//     if (filter === newFilter) return;
    
//     setIsFiltering(true);
//     setFilter(newFilter);
    
//     // Simulate loading delay
//     setTimeout(() => {
//       setIsFiltering(false);
//     }, 500);
//   };

//   if (isLoadingPosts && !postsProp) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4"></div>
//           <p className="text-gray-700 font-semibold">Loading amazing posts...</p>
//         </div>
//       </div>
//     );
//   }

//   const handleProfileClick = (userId) => {
//     if (userId) {
//       navigate(`/view-users/${userId}`);
//     }
//   };

//   const handleLike = async (postId) => {
//     if (!userdata?.user?._id) {
//       navigate('/login');
//       return;
//     }
    
//     if (localLoading[postId]) return;
//     setLocalLoading(prev => ({ ...prev, [postId]: true }));

//     try {
//       const post = posts.find(p => p._id === postId);
//       const isCurrentlyLiked = post.likes.includes(userdata.user._id);
      
//       const updatedPost = {
//         ...post,
//         likes: isCurrentlyLiked 
//           ? post.likes.filter(id => id !== userdata.user._id)
//           : [...post.likes, userdata.user._id]
//       };
      
//       updatePostInContext(updatedPost);
//       await likePost(postId);
//     } catch (error) {
//       console.error('Like error:', error);
//     } finally {
//       setLocalLoading(prev => ({ ...prev, [postId]: false }));
//     }
//   };

//   const loadComments = async (postId) => {
//     if (commentsLoading[postId]) return;
    
//     setCommentsLoading(prev => ({ ...prev, [postId]: true }));
    
//     try {
//       console.log('Fetching comments for post:', postId);
//       const comments = await fetchComments(postId);
//       console.log('Received comments:', comments);
      
//       // Validate and process comments
//       const processedComments = Array.isArray(comments) ? comments.map(comment => {
//         // Handle both populated and unpopulated comments
//         if (typeof comment === 'string') {
//           return {
//             _id: comment,
//             content: 'Loading...',
//             author: {
//               _id: null,
//               name: 'Unknown User',
//               username: 'unknown',
//               photo: assets.user_image
//             },
//             createdAt: new Date().toISOString()
//           };
//         }
        
//         return {
//           ...comment,
//           _id: comment._id || Date.now().toString(),
//           content: comment.content || 'No content',
//           author: comment.author || {
//             _id: null,
//             name: 'Unknown User',
//             username: 'unknown',
//             photo: assets.user_image
//           },
//           createdAt: comment.createdAt || new Date().toISOString()
//         };
//       }) : [];
      
//       // Store comments in local state
//       setPostComments(prev => ({
//         ...prev,
//         [postId]: processedComments
//       }));
      
//       // Also update the post in context if needed
//       const post = posts.find(p => p._id === postId);
//       if (post && updatePostInContext) {
//         const updatedPost = {
//           ...post,
//           comments: processedComments
//         };
//         updatePostInContext(updatedPost);
//       }
//     } catch (error) {
//       console.error('Error loading comments:', error);
//       toast.error('Failed to load comments');
//       setPostComments(prev => ({
//         ...prev,
//         [postId]: []
//       }));
//     } finally {
//       setCommentsLoading(prev => ({ ...prev, [postId]: false }));
//     }
//   };


//   const toggleComments = async (postId) => {
//     const isCurrentlyShowing = showCommentsForPost[postId];
    
//     setShowCommentsForPost(prev => ({
//       ...prev,
//       [postId]: !isCurrentlyShowing
//     }));
    
//     // Load comments when showing them
//     if (!isCurrentlyShowing) {
//       const existingComments = postComments[postId];
//       const postFromContext = posts.find(p => p._id === postId);
//       const contextComments = postFromContext?.comments;
      
//       // Always load fresh comments when toggling to show
//       // This ensures we get the latest comments from the server
//       await loadComments(postId);
//     }
//   };



//   const toggleCommentInput = async (postId) => {
//     if (!userdata?.user?._id) {
//       navigate('/login');
//       return;
//     }

//     const isCurrentlyActive = activeCommentPostId === postId;
//     setActiveCommentPostId(isCurrentlyActive ? null : postId);
//     setCommentText('');
    
//     setTimeout(() => {
//       if (!isCurrentlyActive && commentInputRefs.current[postId]) {
//         commentInputRefs.current[postId].focus();
//       }
//     }, 100);
//   };

//   const handleCommentSubmit = async (postId) => {
//     if (!commentText.trim() || isSubmittingComment) return;
    
//     setIsSubmittingComment(true);
    
//     try {
//       const response = await addComment(postId, commentText);
//       console.log('Add comment response:', response);
      
//       if (response?.success) {
//         // Create the new comment object with proper author info
//         const newComment = {
//           _id: response.comment._id || Date.now().toString(),
//           content: response.comment.content || commentText,
//           createdAt: response.comment.createdAt || new Date().toISOString(),
//           author: {
//             _id: userdata.user._id,
//             name: userdata.user.name || 'You',
//             username: userdata.user.username || 'you',
//             photo: userdata.user.photo || assets.user_image
//           }
//         };

//         // Update local comments state
//         setPostComments(prev => ({
//           ...prev,
//           [postId]: [...(prev[postId] || []), newComment]
//         }));
        
//         // Update context if available
//         const currentPost = posts.find(p => p._id === postId);
//         if (currentPost && updatePostInContext) {
//           const updatedPost = {
//             ...currentPost,
//             comments: [...(postComments[postId] || []), newComment]
//           };
//           updatePostInContext(updatedPost);
//         }
        
//         setCommentText('');
//         setActiveCommentPostId(null);
//         toast.success('Comment added successfully! 🎉');
//       } else {
//         throw new Error(response?.message || 'Failed to add comment');
//       }
//     } catch (error) {
//       console.error('Error submitting comment:', error);
//       toast.error(error.message || 'Failed to add comment');
//     } finally {
//       setIsSubmittingComment(false);
//     }
//   };


// const handleDeleteComment = async (commentId) => { // Only need commentId now
//   if (!userdata?.user?._id) {
//     navigate('/login');
//     return;
//   }
//   setConfirmDeleteId(commentId);

// }
  
//  const confirmDelete = async () => {
//   const commentId = confirmDeleteId;
//    if (!commentId) return;
//   setDeletingCommentId(commentId);

//   try {
//     const response = await deleteComment(commentId);

//     if (response?.success) {
//       let postIdWithComment = null;
//       for (const [postId, comments] of Object.entries(postComments)) {
//         if (comments.some(comment => comment._id === commentId)) {
//           postIdWithComment = postId;
//           break;
//         }
//       }

//       if (postIdWithComment) {
//         setPostComments(prev => ({
//           ...prev,
//           [postIdWithComment]: (prev[postIdWithComment] || []).filter(c => c._id !== commentId)
//         }));

//         const currentPost = posts.find(p => p._id === postIdWithComment);
//         if (currentPost && updatePostInContext) {
//           updatePostInContext({
//             ...currentPost,
//             comments: (postComments[postIdWithComment] || []).filter(c => c._id !== commentId)
//           });
//         }
//       }

//       toast.success("Comment deleted successfully!");
//     } else {
//       throw new Error(response?.message || "Failed to delete comment");
//     }
//   } catch (error) {
//     console.error("Error deleting comment:", error);
//     toast.error(error.message || "Failed to delete comment");
//   } finally {
//     setDeletingCommentId(null);
//     setConfirmDeleteId(null); // close modal
//   }
// }


//   // Helper function to get comments for a post
//   const getCommentsForPost = (postId) => {
//     const localComments = postComments[postId] || [];
//     const postFromContext = posts.find(p => p._id === postId);
//     const contextComments = postFromContext?.comments || [];
    
//     // Return local comments if available, otherwise context comments
//     return localComments.length > 0 ? localComments : contextComments;
//   };

//   // Check if current user is the author of a comment
//   const isCommentAuthor = (comment) => {
//     return comment.author && comment.author._id === userdata?.user?._id;
//   };

//   // Color schemes for cards
//   const cardColorSchemes = [
//     'from-purple-50 to-pink-50 border-purple-200',
//     'from-blue-50 to-cyan-50 border-blue-200', 
//     'from-emerald-50 to-teal-50 border-emerald-200',
//     'from-orange-50 to-red-50 border-orange-200',
//     'from-indigo-50 to-purple-50 border-indigo-200',
//     'from-pink-50 to-rose-50 border-pink-200'
//   ];


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-3 sm:px-4 md:px-6 lg:px-8 py-6">
//       {/* Filter Buttons */}
//       <div className="max-w-7xl mx-auto mb-6">
//         <div className="flex flex-wrap gap-3 justify-center">
//           <button
//             onClick={() => handleFilterChange('all')}
//             className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
//               filter === 'all'
//                 ? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
//                 : 'text-gray-700 bg-white/80 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 shadow-md'
//             }`}
//             disabled={isFiltering}
//           >
//             {filter === 'all' && isFiltering ? (
//               <div className="flex items-center">
//                 <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
//                 Loading...
//               </div>
//             ) : (
//               'All Posts'
//             )}
//           </button>
          
//           <button
//             onClick={() => handleFilterChange('images')}
//             className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
//               filter === 'images'
//                 ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg'
//                 : 'text-gray-700 bg-white/80 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 shadow-md'
//             }`}
//             disabled={isFiltering}
//           >
//             {filter === 'images' && isFiltering ? (
//               <div className="flex items-center">
//                 <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
//                 Loading...
//               </div>
//             ) : (
//               'Image Posts'
//             )}
//           </button>
          
//           <button
//             onClick={() => handleFilterChange('text')}
//             className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
//               filter === 'text'
//                 ? 'text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg'
//                 : 'text-gray-700 bg-white/80 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 shadow-md'
//             }`}
//             disabled={isFiltering}
//           >
//             {filter === 'text' && isFiltering ? (
//               <div className="flex items-center">
//                 <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
//                 Loading...
//               </div>
//             ) : (
//               'Text Posts'
//             )}
//           </button>
//         </div>
//       </div>

//       {isFiltering ? (
//         <div className="flex justify-center items-center min-h-[400px]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4"></div>
//             <p className="text-gray-700 font-semibold">Filtering posts...</p>
//           </div>
//         </div>
//       ) : filteredPosts.length === 0 ? (
//         <div className="max-w-md mx-auto text-center py-20">
//           <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-pulse">
//             <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
//             </svg>
//           </div>
//           <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
//             {filter === 'images' ? 'No image posts yet' : 
//              filter === 'text' ? 'No text posts yet' : 'No posts yet'}
//           </h3>
//           <p className="text-gray-600 text-lg">
//             {filter === 'images' ? 'Start sharing your amazing photos!' : 
//              filter === 'text' ? 'Share your thoughts and ideas!' : 'Start sharing your amazing moments!'}
//           </p>
//         </div>
//       ) : (
//         <div className="max-w-7xl mx-auto">
//           <div className="columns-1 sm:columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-5 md:gap-6 space-y-4 sm:space-y-5 md:space-y-6">
//             {filteredPosts.map((post, index) => {
//               const isLiked = localLikes[post._id] ?? post.likes?.includes(userdata?.user?._id);
//               const likeCount = post.likes?.length || 0;
//               const isLoading = localLoading[post._id];
//               const comments = getCommentsForPost(post._id);
//               const commentCount = comments.length;
//               const hasImage = post.imageUrl && post.imageUrl.trim() !== '';
//               const isCommentSectionOpen = activeCommentPostId === post._id;
//               const showComments = showCommentsForPost[post._id];
//               const colorScheme = cardColorSchemes[index % cardColorSchemes.length];

//               return (
//                 <div 
//                   key={post._id} 
//                   className={`break-inside-avoid bg-gradient-to-br ${colorScheme} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm`}
//                 >
//                   {/* Post Header */}
//                   <div className="p-5 pb-3">
//                     <div className="flex items-center space-x-4 mb-4">
//                       <div className="relative group/avatar flex-shrink-0">
//                         <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-0.5">
//                           <img 
//                             src={post.author?.photo  || assets.user_image} 
//                             alt="User avatar" 
//                             className="w-full h-full rounded-full object-cover bg-white cursor-pointer hover:scale-110 transition-transform duration-300"
//                             onClick={() => handleProfileClick(post.author?._id)}
//                           />
//                         </div>
//                         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <h3 
//                           className="font-bold text-gray-900 truncate cursor-pointer hover:text-purple-600 transition-colors text-base"
//                           onClick={() => handleProfileClick(post.author?._id)}
//                         >
//                           {post.author?.name || 'Unknown User'}
//                         </h3>
//                         <p className="text-gray-600 text-sm font-medium">
//                           @  {moment(post.createdAt).fromNow()}
//                         </p>

                        
//                       </div>

//                       {(post.descriptionProduct || post.price || post.productModel) && (

//                         <div className='flex items-center justify-center '>
//   <button

//     onClick={() => navigate(`/view-detail/product/${post.author?._id}/${post._id}`)}
//     className="px-3 py-3  rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-gray-700 bg-white/70 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:text-green-600 shadow-md"
//   >
//     {/* <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//     </svg> */}
  
      
//       <ShoppingBagSolid className="h-5 w-5 text-green-500" />
//     <span className="text-sm "></span>
//   </button>
//     </div>


// )}

//                     </div>
                      
//                   {post.content && (
//                       <div className="mb-4">
//                         <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line font-medium"> 
//                           {post.content} Product 
//                         </p>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Post Image - FIXED SIZING */}
//                   {/* {hasImage && (
//                     <div className="relative mx-5 mb-4">
//                       <div className="rounded-2xl overflow-hidden shadow-lg">
//                         <img 
//                           src={post.imageUrl} 
//                           alt="Post content" 
//                           className="w-full h-auto max-h-80 object-cover group-hover:scale-105 transition-transform duration-700"
//                           loading="lazy"
//                           style={{
//                             aspectRatio: 'auto',
//                             maxHeight: '320px',
//                             objectFit: 'cover'
//                           }}
//                         />
//                       </div>
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
//                     </div>
//                   )} */}

//                   {hasImage && (
//   <div className="relative mx-5 mb-4">
//     <div className="rounded-2xl overflow-hidden shadow-lg">
//       <a 
//         href={post.imageUrl} 
//         target="_blank" 
//         rel="noopener noreferrer"
//         className="block cursor-pointer"
//       >
//         <img 
//           src={post.imageUrl} 
//           alt="Post content" 
//           className="w-full h-auto  object-cover group-hover:scale-103 transition-transform duration-700 cursor-pointer"
//           loading="lazy"
//           style={{
//             aspectRatio: 'auto',
//             maxHeight: '100%',
//             objectFit: 'cover'
//           }}
//           onClick={(e) => {
//             e.preventDefault();
//             window.open(post.imageUrl, '_blank');
//           }}
//         />
//       </a>
//     </div>
//     <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
//   </div>
// )}


// {/* View Details Button (only show for posts with product info) */}

                  
//                   {/* Post Actions */}
//                   <div className="px-5 pb-5">
//                     <div className="flex items-center justify-between mb-4">
//                       {/* Like Button */}
//                       <button 
//                         className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
//                           isLiked 
//                             ? 'text-white bg-gradient-to-r from-red-400 to-pink-500 shadow-lg' 
//                             : 'text-gray-700 bg-white/70 hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 hover:text-red-600 shadow-md'
//                         } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                         onClick={() => handleLike(post._id)}
//                         disabled={isLoading}
//                       >
//                         <svg 
//                           className="w-5 h-5" 
//                           fill={isLiked ? 'currentColor' : 'none'} 
//                           stroke="currentColor" 
//                           viewBox="0 0 24 24"
//                         >
//                           <path 
//                             strokeLinecap="round" 
//                             strokeLinejoin="round" 
//                             strokeWidth="2" 
//                             d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
//                           />
//                         </svg>
//                         <span className="text-sm">{likeCount}</span>
//                       </button>
                      
//                       {/* Comment Buttons */}
//                       <div className="flex space-x-2">
//                         {/* View Comments Button */}
//                         <button 
//                           className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
//                             showComments 
//                               ? 'text-white bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg' 
//                               : 'text-gray-700 bg-white/70 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:text-blue-600 shadow-md'
//                           }`}
//                           onClick={() => toggleComments(post._id)}
//                         >
//                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
// </svg>
//                           <span className="text-sm">{commentCount}</span>
//                         </button>
                        
//                         {/* Add Comment Button */}
//                         <button 
//                           className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
//                             isCommentSectionOpen 
//                               ? 'text-white bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg' 
//                               : 'text-gray-700 bg-white/70 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:text-emerald-600 shadow-md'
//                           }`}
//                           onClick={() => toggleCommentInput(post._id)}
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                           </svg>
//                           <span className="text-sm">Add</span>
//                         </button>
//                       </div>
//                     </div>

//                     {/* Comment Input Section */}
//                     {isCommentSectionOpen && (
//                       <div className="mb-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-inner">
//                         <div className="flex items-center space-x-3">
//                           <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-0.5">
//                             <img 
//                               src={userdata?.user?.photo || assets.user_image} 
//                               alt="Your avatar" 
//                               className="w-full h-full rounded-full object-cover bg-white"
//                             />
//                           </div>
//                           <div className="flex-1 relative">
//                             <input
//                               ref={el => commentInputRefs.current[post._id] = el}
//                               type="text"
//                               value={commentText}
//                               onChange={(e) => setCommentText(e.target.value)}
//                               placeholder="Share your thoughts..."
//                               className="w-full px-4 py-3 text-sm bg-white/90 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300 font-medium"
//                               onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
//                             />
//                             <button
//                               onClick={() => handleCommentSubmit(post._id)}
//                               disabled={!commentText.trim() || isSubmittingComment}
//                               className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-300 ${
//                                 !commentText.trim() 
//                                   ? 'text-gray-400' 
//                                   : 'text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:scale-105'
//                               }`}
//                             >
//                               {isSubmittingComment ? (
//                                 <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                               ) : (
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
//                                 </svg>
//                               )}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {/* Comments List */}
//                     {showComments && (
//                       <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-inner max-h-64 overflow-y-auto">
//                         {commentsLoading[post._id] ? (
//                           <div className="flex justify-center py-8">
//                             <div className="flex items-center space-x-3">
//                               <div className="animate-spin rounded-full h-6 w-6 border-t-3 border-purple-500"></div>
//                               <div className="flex flex-col items-center justify-center space-y-4 py-8">
//   {/* Animated Spinner with Gradient Effect */}
//   <div className="relative flex justify-center items-center">
//     {/* Static outer ring (optional) */}
//     <div className="absolute w-14 h-14 rounded-full border-2 border-gray-100 opacity-70"></div>
    
//     {/* Main Spinner (Smooth & Gradient) */}
//     <div className="w-12 h-12 rounded-full animate-spin border-4 border-transparent border-t-purple-500 border-r-blue-500" 
//          style={{ animation: "spin 1s linear infinite" }}></div>
    
//     {/* Optional inner dot (for extra flair) */}
//     <div className="absolute w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
//   </div>
  
//   {/* Text with fading animation */}
//   <span className="text-sm font-medium text-gray-500 animate-pulse">
//     Loading conversations...
//   </span>
// </div>

// <style>{`
//   @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `}</style>
//                             </div>
//                           </div>
//                         ) : (
//                           comments.length > 0 ? (
//                             <div className="space-y-3">
//                               {comments.map((comment, commentIndex) => {
//                                 // Handle both string IDs and full comment objects
//                                 const fullComment = typeof comment === 'string' ? 
//                                   { _id: comment, content: 'Loading...', author: null } : 
//                                   comment;
                                
//                                 const author = fullComment.author || {
//                                   _id: null,
//                                   name: 'Unknown User',
//                                   username: 'unknown',
//                                   photo: assets.user_image
//                                 };
                                
//                                 return (
//                                   <div key={fullComment._id || commentIndex} className="flex items-start space-x-3 p-3 bg-white/80 rounded-xl hover:bg-white transition-colors group/comment">
//                                     <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 p-0.5 flex-shrink-0">
//                                       <img 
//                                         src={author.photo || assets.user_image} 
//                                         alt="Commenter avatar" 
//                                         className="w-full h-full rounded-full object-cover bg-white cursor-pointer hover:scale-110 transition-transform"
//                                         onClick={() => author._id && handleProfileClick(author._id)}
//                                       />
//                                     </div>
//                                     <div className="flex-1">
//                                       <div className="flex items-center space-x-2 mb-1">
//                                         <span 
//                                           className={`text-sm font-bold text-gray-900 transition-colors ${
//                                             author._id ? 'hover:text-purple-600 cursor-pointer' : ''
//                                           }`}
//                                           onClick={() => author._id && handleProfileClick(author._id)}
//                                         >
//                                           {author.name}
//                                         </span>
//                                         <span className="text-xs text-gray-500 font-medium">
//                                           {fullComment.createdAt ? moment(fullComment.createdAt).fromNow() : 'now'}
//                                         </span>
//                                       </div>
//                                       <p className="text-sm text-gray-700 leading-relaxed font-medium">
//                                         {fullComment.content || 'Loading...'}
//                                       </p>
//                                     </div>
                                    
//                                     {/* Delete Button (only show for comment author) */}
//                                     {isCommentAuthor(fullComment) && (
//                                       <button
//                                         onClick={() => setConfirmDeleteId(fullComment._id)}
//                                         disabled={deletingCommentId === fullComment._id}
//                                         className="opacity-0 group-hover/comment:opacity-100 transition-opacity duration-300 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
//                                         title="Delete comment"
//                                       >
//                                         {deletingCommentId === fullComment._id ? (
//                                           <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                           </svg>
//                                         ) : (
//                                           <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//                                           </svg>
//                                         )}
//                                       </button>
//                                     )}
//                                   </div>
//                                 );
//                               })}
//                             </div>
//                           ) : (
//                             <div className="text-center py-8">
//                               <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
//                                 <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-gray-500" />
//                                 </svg>
//                               </div>
//                               <p className="text-sm text-gray-600 font-bold mb-1">No comments yet</p>
//                               <p className="text-xs text-gray-500">Start the conversation!</p>
//                             </div>
//                           )
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//        <ConfirmationModal
//       isOpen={!!confirmDeleteId}
//       onClose={() => setConfirmDeleteId(null)}
//       onConfirm={confirmDelete}
//       title="Delete Comment?"
//       message="Are you sure you want to delete this comment? This action cannot be undone."
//       loading={deletingCommentId === confirmDeleteId}
//     />
//     </div>
//   );
// };

// export default PostList;


import { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import moment from 'moment';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { ChatBubbleOvalLeftEllipsisIcon, TagIcon } from '@heroicons/react/24/outline';
import ConfirmationModal from './ConfirmModal';
import { ShoppingBagIcon as ShoppingBagSolid } from '@heroicons/react/24/solid';

const PostList = ({ posts: postsProp }) => {
  const { 
    posts: contextPosts, 
    isLoadingPosts, 
    userdata, 
    likePost, 
    addComment,
    deleteComment,
    fetchPosts,
    fetchComments,
    updatePostInContext 
  } = useContext(AppContext);
  
  const navigate = useNavigate();
  const posts = postsProp || contextPosts;
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const commentInputRefs = useRef({});
  const [commentsLoading, setCommentsLoading] = useState({});
  const [showCommentsForPost, setShowCommentsForPost] = useState({});
  const [localLikes, setLocalLikes] = useState({});
  const [localLoading, setLocalLoading] = useState({});
  const [postComments, setPostComments] = useState({});
  const [delayedLoading, setDelayedLoading] = useState({});
  const [filter, setFilter] = useState('all'); // 'all', 'images', 'text'
  const [isFiltering, setIsFiltering] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Helper function to check if post has images
  const hasImages = (post) => {
    // Check for imageUrl (legacy) or images array
    return (post.imageUrl && post.imageUrl.trim() !== '') || 
           (post.images && Array.isArray(post.images) && post.images.length > 0);
  };

  // Helper function to get first image URL
  const getFirstImageUrl = (post) => {
    if (post.imageUrl && post.imageUrl.trim() !== '') {
      return post.imageUrl;
    }
    if (post.images && Array.isArray(post.images) && post.images.length > 0) {
      // Handle both object format and direct URL format
      const firstImage = post.images[0];
      return firstImage.url || firstImage.imageUrl || firstImage;
    }
    return null;
  };

  // Helper function to get all image URLs
  const getAllImageUrls = (post) => {
    const urls = [];
    
    // Add legacy imageUrl if exists
    if (post.imageUrl && post.imageUrl.trim() !== '') {
      urls.push(post.imageUrl);
    }
    
    // Add images from images array
    if (post.images && Array.isArray(post.images)) {
      post.images.forEach(image => {
        if (image && (image.url || image.imageUrl)) {
          urls.push(image.url || image.imageUrl);
        } else if (typeof image === 'string') {
          urls.push(image);
        }
      });
    }
    
    return urls;
  };

  // Filter posts based on selected filter
  const filteredPosts = posts.filter(post => {
    const hasImageContent = hasImages(post);
    const hasTextContent = post.content && post.content.trim() !== '';
    
    if (filter === 'images') return hasImageContent;
    if (filter === 'text') return hasTextContent && !hasImageContent;
    return true; // 'all' filter
  });

  // Apply filter with loading delay
  const handleFilterChange = (newFilter) => {
    if (filter === newFilter) return;
    
    setIsFiltering(true);
    setFilter(newFilter);
    
    // Simulate loading delay
    setTimeout(() => {
      setIsFiltering(false);
    }, 500);
  };

  if (isLoadingPosts && !postsProp) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading amazing posts...</p>
        </div>
      </div>
    );
  }

  const handleProfileClick = (userId) => {
    if (userId) {
      navigate(`/view-users/${userId}`);
    }
  };

  const handleLike = async (postId) => {
    if (!userdata?.user?._id) {
      navigate('/login');
      return;
    }
    
    if (localLoading[postId]) return;
    setLocalLoading(prev => ({ ...prev, [postId]: true }));

    try {
      const post = posts.find(p => p._id === postId);
      const isCurrentlyLiked = post.likes.includes(userdata.user._id);
      
      const updatedPost = {
        ...post,
        likes: isCurrentlyLiked 
          ? post.likes.filter(id => id !== userdata.user._id)
          : [...post.likes, userdata.user._id]
      };
      
      updatePostInContext(updatedPost);
      await likePost(postId);
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLocalLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const loadComments = async (postId) => {
    if (commentsLoading[postId]) return;
    
    setCommentsLoading(prev => ({ ...prev, [postId]: true }));
    
    try {
      console.log('Fetching comments for post:', postId);
      const comments = await fetchComments(postId);
      console.log('Received comments:', comments);
      
      // Validate and process comments
      const processedComments = Array.isArray(comments) ? comments.map(comment => {
        // Handle both populated and unpopulated comments
        if (typeof comment === 'string') {
          return {
            _id: comment,
            content: 'Loading...',
            author: {
              _id: null,
              name: 'Unknown User',
              username: 'unknown',
              photo: assets.user_image
            },
            createdAt: new Date().toISOString()
          };
        }
        
        return {
          ...comment,
          _id: comment._id || Date.now().toString(),
          content: comment.content || 'No content',
          author: comment.author || {
            _id: null,
            name: 'Unknown User',
            username: 'unknown',
            photo: assets.user_image
          },
          createdAt: comment.createdAt || new Date().toISOString()
        };
      }) : [];
      
      // Store comments in local state
      setPostComments(prev => ({
        ...prev,
        [postId]: processedComments
      }));
      
      // Also update the post in context if needed
      const post = posts.find(p => p._id === postId);
      if (post && updatePostInContext) {
        const updatedPost = {
          ...post,
          comments: processedComments
        };
        updatePostInContext(updatedPost);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
      setPostComments(prev => ({
        ...prev,
        [postId]: []
      }));
    } finally {
      setCommentsLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleComments = async (postId) => {
    const isCurrentlyShowing = showCommentsForPost[postId];
    
    setShowCommentsForPost(prev => ({
      ...prev,
      [postId]: !isCurrentlyShowing
    }));
    
    // Load comments when showing them
    if (!isCurrentlyShowing) {
      const existingComments = postComments[postId];
      const postFromContext = posts.find(p => p._id === postId);
      const contextComments = postFromContext?.comments;
      
      // Always load fresh comments when toggling to show
      // This ensures we get the latest comments from the server
      await loadComments(postId);
    }
  };

  const toggleCommentInput = async (postId) => {
    if (!userdata?.user?._id) {
      navigate('/login');
      return;
    }

    const isCurrentlyActive = activeCommentPostId === postId;
    setActiveCommentPostId(isCurrentlyActive ? null : postId);
    setCommentText('');
    
    setTimeout(() => {
      if (!isCurrentlyActive && commentInputRefs.current[postId]) {
        commentInputRefs.current[postId].focus();
      }
    }, 100);
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim() || isSubmittingComment) return;
    
    setIsSubmittingComment(true);
    
    try {
      const response = await addComment(postId, commentText);
      console.log('Add comment response:', response);
      
      if (response?.success) {
        // Create the new comment object with proper author info
        const newComment = {
          _id: response.comment._id || Date.now().toString(),
          content: response.comment.content || commentText,
          createdAt: response.comment.createdAt || new Date().toISOString(),
          author: {
            _id: userdata.user._id,
            name: userdata.user.name || 'You',
            username: userdata.user.username || 'you',
            photo: userdata.user.photo || assets.user_image
          }
        };

        // Update local comments state
        setPostComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment]
        }));
        
        // Update context if available
        const currentPost = posts.find(p => p._id === postId);
        if (currentPost && updatePostInContext) {
          const updatedPost = {
            ...currentPost,
            comments: [...(postComments[postId] || []), newComment]
          };
          updatePostInContext(updatedPost);
        }
        
        setCommentText('');
        setActiveCommentPostId(null);
        toast.success('Comment added successfully! 🎉');
      } else {
        throw new Error(response?.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!userdata?.user?._id) {
      navigate('/login');
      return;
    }
    setConfirmDeleteId(commentId);
  }
  
  const confirmDelete = async () => {
    const commentId = confirmDeleteId;
    if (!commentId) return;
    setDeletingCommentId(commentId);

    try {
      const response = await deleteComment(commentId);

      if (response?.success) {
        let postIdWithComment = null;
        for (const [postId, comments] of Object.entries(postComments)) {
          if (comments.some(comment => comment._id === commentId)) {
            postIdWithComment = postId;
            break;
          }
        }

        if (postIdWithComment) {
          setPostComments(prev => ({
            ...prev,
            [postIdWithComment]: (prev[postIdWithComment] || []).filter(c => c._id !== commentId)
          }));

          const currentPost = posts.find(p => p._id === postIdWithComment);
          if (currentPost && updatePostInContext) {
            updatePostInContext({
              ...currentPost,
              comments: (postComments[postIdWithComment] || []).filter(c => c._id !== commentId)
            });
          }
        }

        toast.success("Comment deleted successfully!");
      } else {
        throw new Error(response?.message || "Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error(error.message || "Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
      setConfirmDeleteId(null);
    }
  }

  // Helper function to get comments for a post
  const getCommentsForPost = (postId) => {
    const localComments = postComments[postId] || [];
    const postFromContext = posts.find(p => p._id === postId);
    const contextComments = postFromContext?.comments || [];
    
    return localComments.length > 0 ? localComments : contextComments;
  };

  // Check if current user is the author of a comment
  const isCommentAuthor = (comment) => {
    return comment.author && comment.author._id === userdata?.user?._id;
  };

  // Color schemes for cards
  const cardColorSchemes = [
    'from-purple-50 to-pink-50 border-purple-200',
    'from-blue-50 to-cyan-50 border-blue-200', 
    'from-emerald-50 to-teal-50 border-emerald-200',
    'from-orange-50 to-red-50 border-orange-200',
    'from-indigo-50 to-purple-50 border-indigo-200',
    'from-pink-50 to-rose-50 border-pink-200'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-3 sm:px-4 md:px-6 lg:px-8 py-6">
      {/* Filter Buttons */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              filter === 'all'
                ? 'text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
                : 'text-gray-700 bg-white/80 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 shadow-md'
            }`}
            disabled={isFiltering}
          >
            {filter === 'all' && isFiltering ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : (
              'All Products'
            )}
          </button>
          
          <button
            onClick={() => handleFilterChange('images')}
            className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              filter === 'images'
                ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg'
                : 'text-gray-700 bg-white/80 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 shadow-md'
            }`}
            disabled={isFiltering}
          >
            {filter === 'images' && isFiltering ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : (
              'Product Posts'
            )}
          </button>
          
          <button
            onClick={() => handleFilterChange('text')}
            className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
              filter === 'text'
                ? 'text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg'
                : 'text-gray-700 bg-white/80 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 shadow-md'
            }`}
            disabled={isFiltering}
          >
            {filter === 'text' && isFiltering ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : (
              'Text Products'
            )}
          </button>
        </div>
      </div>

      {isFiltering ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold">Filtering posts...</p>
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-20">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-full flex items-center justify-center mb-8 shadow-2xl animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            {filter === 'images' ? 'No image posts yet' : 
             filter === 'text' ? 'No text posts yet' : 'No posts yet'}
          </h3>
          <p className="text-gray-600 text-lg">
            {filter === 'images' ? 'Start sharing your amazing photos!' : 
             filter === 'text' ? 'Share your thoughts and ideas!' : 'Start sharing your amazing moments!'}
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-5 md:gap-6 space-y-4 sm:space-y-5 md:space-y-6">
            {filteredPosts.map((post, index) => {
              const isLiked = localLikes[post._id] ?? post.likes?.includes(userdata?.user?._id);
              const likeCount = post.likes?.length || 0;
              const isLoading = localLoading[post._id];
              const comments = getCommentsForPost(post._id);
              const commentCount = comments.length;
              const hasImageContent = hasImages(post);
              const hasTextContent = post.content && post.content.trim() !== '';
              const isCommentSectionOpen = activeCommentPostId === post._id;
              const showComments = showCommentsForPost[post._id];
              const colorScheme = cardColorSchemes[index % cardColorSchemes.length];
              const firstImageUrl = getFirstImageUrl(post);
              const allImageUrls = getAllImageUrls(post);

              return (
                <div 
                  key={post._id} 
                  className={`break-inside-avoid bg-gradient-to-br ${colorScheme} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:-translate-y-2 hover:scale-[1.02] backdrop-blur-sm`}
                >
                  {/* Post Header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative group/avatar flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-0.5">
                          <img 
                            src={post.author?.photo  || assets.user_image} 
                            alt="User avatar" 
                            className="w-full h-full rounded-full object-cover bg-white cursor-pointer hover:scale-110 transition-transform duration-300"
                            onClick={() => handleProfileClick(post.author?._id)}
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 
                          className="font-bold text-gray-900 truncate cursor-pointer hover:text-purple-600 transition-colors text-base"
                          onClick={() => handleProfileClick(post.author?._id)}
                        >
                          {post.author?.name || 'Unknown User'}
                        </h3>
                        <p className="text-gray-600 text-sm font-medium">
                          @  {moment(post.createdAt).fromNow()}
                        </p>
                      </div>

                      {(post.descriptionProduct || post.price || post.productModel || post) && (
                        <div className='flex items-center justify-center '>
                          <button
                            onClick={() => navigate(`/view-detail/product/${post.author?._id}/${post._id}`)}
                            className="px-3 py-3  rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 text-gray-700 bg-white/70 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:text-green-600 shadow-md"
                          >
                            <ShoppingBagSolid className="h-5 w-5 text-green-500" />
                          </button>
                        </div>
                      )}
                    </div>
                      
                    {/* Show content only if it exists and this is not an image-only post */}
                    {/* {hasTextContent && (
                      <div className="mb-4">
                        <p className="text-gray-800 text-base leading-relaxed whitespace-pre-line font-medium"> 
                          {post.content} Product
                        </p>
                      </div>
                    )} */}

                    {hasTextContent && (
  <div className="mb-4">
    <p className="text-base leading-relaxed whitespace-pre-line font-medium"> 
      <span className="text-indigo-600 font-semibold">{post.content}</span>
      <span className=" bg-gradient-to-r from-orange-300 to-blue-400 bg-clip-text text-transparent font-black ml-2">Product</span>
    </p>
  </div>
)}

                  </div>
                  
                  {/* Post Image - Only show if image exists */}
                  {hasImageContent && firstImageUrl && (
                    <div className="relative mx-5 mb-4">
                      <div className="rounded-2xl overflow-hidden shadow-lg">
                        <a 
                          href={firstImageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block cursor-pointer"
                        >
                          <img 
                            src={firstImageUrl} 
                            alt="Post content" 
                            className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700 cursor-pointer"
                            loading="lazy"
                            style={{
                              aspectRatio: 'auto',
                              maxHeight: '100%',
                              objectFit: 'cover'
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              window.open(firstImageUrl, '_blank');
                            }}
                          />
                        </a>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                      
                      {/* Show image count badge if there are multiple images */}
                      {allImageUrls.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                          +{allImageUrls.length -1 } More
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Post Actions */}
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between mb-4">
                      {/* Like Button */}
                      <button 
                        className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                          isLiked 
                            ? 'text-white bg-gradient-to-r from-red-400 to-pink-500 shadow-lg' 
                            : 'text-gray-700 bg-white/70 hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 hover:text-red-600 shadow-md'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleLike(post._id)}
                        disabled={isLoading}
                      >
                        <svg 
                          className="w-5 h-5" 
                          fill={isLiked ? 'currentColor' : 'none'} 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                          />
                        </svg>
                        <span className="text-sm">{likeCount}</span>
                      </button>
                      
                      {/* Comment Buttons */}
                      <div className="flex space-x-2">
                        {/* View Comments Button */}
                        <button 
                          className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                            showComments 
                              ? 'text-white bg-gradient-to-r from-blue-400 to-indigo-500 shadow-lg' 
                              : 'text-gray-700 bg-white/70 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:text-blue-600 shadow-md'
                          }`}
                          onClick={() => toggleComments(post._id)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-sm">{commentCount}</span>
                        </button>
                        
                        {/* Add Comment Button */}
                        <button 
                          className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                            isCommentSectionOpen 
                              ? 'text-white bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg' 
                              : 'text-gray-700 bg-white/70 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 hover:text-emerald-600 shadow-md'
                          }`}
                          onClick={() => toggleCommentInput(post._id)}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="text-sm">Add</span>
                        </button>
                      </div>
                    </div>

                    {/* Comment Input Section */}
                    {isCommentSectionOpen && (
                      <div className="mb-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-inner">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-0.5">
                            <img 
                              src={userdata?.user?.photo || assets.user_image} 
                              alt="Your avatar" 
                              className="w-full h-full rounded-full object-cover bg-white"
                            />
                          </div>
                          <div className="flex-1 relative">
                            <input
                              ref={el => commentInputRefs.current[post._id] = el}
                              type="text"
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Share your thoughts..."
                              className="w-full px-4 py-3 text-sm bg-white/90 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300 font-medium"
                              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
                            />
                            <button
                              onClick={() => handleCommentSubmit(post._id)}
                              disabled={!commentText.trim() || isSubmittingComment}
                              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-xl transition-all duration-300 ${
                                !commentText.trim() 
                                  ? 'text-gray-400' 
                                  : 'text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:scale-105'
                              }`}
                            >
                              {isSubmittingComment ? (
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Comments List */}
                    {showComments && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-inner max-h-64 overflow-y-auto">
                        {commentsLoading[post._id] ? (
                          <div className="flex justify-center py-8">
                            <div className="flex items-center space-x-3">
                              <div className="animate-spin rounded-full h-6 w-6 border-t-3 border-purple-500"></div>
                              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                                <div className="relative flex justify-center items-center">
                                  <div className="absolute w-14 h-14 rounded-full border-2 border-gray-100 opacity-70"></div>
                                  <div className="w-12 h-12 rounded-full animate-spin border-4 border-transparent border-t-purple-500 border-r-blue-500" 
                                       style={{ animation: "spin 1s linear infinite" }}></div>
                                  <div className="absolute w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                </div>
                                <span className="text-sm font-medium text-gray-500 animate-pulse">
                                  Loading conversations...
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          comments.length > 0 ? (
                            <div className="space-y-3">
                              {comments.map((comment, commentIndex) => {
                                const fullComment = typeof comment === 'string' ? 
                                  { _id: comment, content: 'Loading...', author: null } : 
                                  comment;
                                
                                const author = fullComment.author || {
                                  _id: null,
                                  name: 'Unknown User',
                                  username: 'unknown',
                                  photo: assets.user_image
                                };
                                
                                return (
                                  <div key={fullComment._id || commentIndex} className="flex items-start space-x-3 p-3 bg-white/80 rounded-xl hover:bg-white transition-colors group/comment">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 p-0.5 flex-shrink-0">
                                      <img 
                                        src={author.photo || assets.user_image} 
                                        alt="Commenter avatar" 
                                        className="w-full h-full rounded-full object-cover bg-white cursor-pointer hover:scale-110 transition-transform"
                                        onClick={() => author._id && handleProfileClick(author._id)}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <span 
                                          className={`text-sm font-bold text-gray-900 transition-colors ${
                                            author._id ? 'hover:text-purple-600 cursor-pointer' : ''
                                          }`}
                                          onClick={() => author._id && handleProfileClick(author._id)}
                                        >
                                          {author.name}
                                        </span>
                                        <span className="text-xs text-gray-500 font-medium">
                                          {fullComment.createdAt ? moment(fullComment.createdAt).fromNow() : 'now'}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                        {fullComment.content || 'Loading...'}
                                      </p>
                                    </div>
                                    
                                    {isCommentAuthor(fullComment) && (
                                      <button
                                        onClick={() => setConfirmDeleteId(fullComment._id)}
                                        disabled={deletingCommentId === fullComment._id}
                                        className="opacity-0 group-hover/comment:opacity-100 transition-opacity duration-300 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                                        title="Delete comment"
                                      >
                                        {deletingCommentId === fullComment._id ? (
                                          <svg className="animate-spin h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                        ) : (
                                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                          </svg>
                                        )}
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-gray-500" />
                                </svg>
                              </div>
                              <p className="text-sm text-gray-600 font-bold mb-1">No comments yet</p>
                              <p className="text-xs text-gray-500">Start the conversation!</p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Comment?"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        loading={deletingCommentId === confirmDeleteId}
      />
    </div>
  );
};

export default PostList;