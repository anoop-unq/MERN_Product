
import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const [islogged, setIsLogged] = useState(false);
  const [userdata, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
   const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

   const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkGuestAuth();
  }, []);

    const createGuest = async (username, displayName) => {
    try {
      const response = await api.post('/api/guest/create', { username, displayName });
      if (response.data.success) {
        setGuest(response.data.guest);
        return { success: true };
      }
    } catch (error) {
      console.error('Guest creation failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Guest creation failed' 
      };
    }
  };

  const getGuestDetails = async () => {
    try {
      const response = await api.get('/api/guest/details');
      return response.data;
    } catch (error) {
      console.log('No active guest session');
      throw error;
    }
  };

  const logoutGuest = async () => {
    try {
      await api.post('/api/guest/logout');
      setGuest(null);
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Logout failed' 
      };
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await api.get(`/api/guest/check-username?username=${username}`);
      return response.data;
    } catch (error) {
      console.error('Username check failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Username check failed' 
      };
    }
  };

  const findGuestByUsername = async (username) => {
    try {
      const response = await api.post('/api/guest/find-by-username', { username });
      if (response.data.success) {
        setGuest(response.data.guest);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.data.message || 'Guest not found' 
        };
      }
    } catch (error) {
      console.error('Find guest failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Find guest failed' 
      };
    }
  };

  const checkGuestAuth = async () => {
    try {
      const response = await getGuestDetails();
      if (response.success) {
        setGuest(response.guest);
      }
    } catch (error) {
      // Silent fail for initial auth check
    } finally {
      setLoading(false);
    }
  };


   


  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUserData(response.data.userData);
      } else {
        toast.error(response.data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };






  const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/user-details/${userId}`, {
      withCredentials: true,
    });

    if (response.data.success) {
      return response.data.userData;
    } else {
      toast.error(response.data.message || "Failed to fetch user data");
      return null;
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return null;
  }
};





  // // Check auth state
  const getAuthState = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user-auth`, {
        withCredentials: true
      });

      if (response.data.success) {
        setIsLogged(true);
        await getUserData();
      } else {
        setIsLogged(false);
      }
    } catch (error) {
      setIsLogged(false);
      console.warn("Not logged in:", error?.response?.data?.message);
    }
  };




    const searchUsers = async (query, page = 1, limit = 10) => {
    if (!query || query.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`${backendUrl}/api/search`, {
        params: { query, page, limit },
        withCredentials: true
      });
      
      if (response.data.success) {
        setSearchResults(response.data.users);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearchResults = () => {
    setSearchResults([]);
    setIsSearching(false);
  };






// Fetch !

// const fetchPosts = useCallback(async () => {
//   setIsLoadingPosts(true);
//   try {
//     const response = await axios.get(`${backendUrl}/api/posts`, {
//       withCredentials: true
//     });
//     // console.log(response.data, "API Context");
//     console.log(response.data,"API")
//     setPosts(response.data);
//   } catch (error) {
//     toast.error("Failed to fetch posts");
//     console.error("Error fetching posts:", error);
//   } finally {
//     setIsLoadingPosts(false);
//   }
// }, [backendUrl]);

// const createPost = useCallback(async (formData) => {
//   try {
//     // Check if we have productInfo in FormData and extract it
//     if (formData.has('productInfo')) {
//       try {
//         const productInfo = JSON.parse(formData.get('productInfo'));
//         formData.append('descriptionProduct', productInfo.description || '');
//         formData.append('price', productInfo.price || '');
//         formData.append('productModel', productInfo.model || '');
//         // Remove the original productInfo field to avoid duplication
//         formData.delete('productInfo');
//       } catch (error) {
//         console.error('Error parsing productInfo:', error);
//       }
//     }

//     const response = await axios.post(
//       `${backendUrl}/api/posts`,
//       formData,
//       { 
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       }
//     );
    
//     console.log('Post creation response:', response.data); // Debug
    
//     if (response.data.success && response.data.post) {
//       // Transform the post data to match your frontend expectations
//       const newPost = {
//         ...response.data.post,
//         // Add any additional frontend-only fields if needed
//       };
      
//       setPosts(prevPosts => [newPost, ...prevPosts]);
//       return true;
//     }
//     throw new Error(response.data.message || 'Invalid response format');
    
//   } catch (error) {
//     console.error('Create post error:', error);
//     toast.error(
//       error.response?.data?.error || 
//       error.response?.data?.message || 
//       error.message || 
//       'Failed to create post'
//     );
//     return false;
//   }
// }, [backendUrl]);

  // const deletePost = useCallback(async (postId) => {
  //   console.log(postId,"deleter")
  //   try {
  //     await axios.delete(`${backendUrl}/api/posts/${postId}`, {
  //       withCredentials: true
  //     });
  //     setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  //     toast.success("Post deleted successfully");
  //     return true;
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || "Failed to delete post");
  //     return false;
  //   }
  // }, [backendUrl]);

// const updatePost = useCallback(async (postId, formData) => {
//   try {
//     // Determine if we're sending FormData (for images) or JSON (for text-only updates)
//     const isFormData = formData instanceof FormData;
    
//     const config = {
//       withCredentials: true,
//       headers: {
//         'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
//       }
//     };

//     // Prepare the data to send
//     let requestData;
//     if (isFormData) {
//       // For FormData, check if we have product info to append
//       if (formData.has('productInfo')) {
//         try {
//           const productInfo = JSON.parse(formData.get('productInfo'));
//           formData.append('descriptionProduct', productInfo.description || '');
//           formData.append('price', productInfo.price || '');
//           formData.append('productModel', productInfo.model || '');
//           // Remove the original productInfo field to avoid duplication
//           formData.delete('productInfo');
//         } catch (error) {
//           console.error('Error parsing productInfo:', error);
//         }
//       }
//       requestData = formData;
//     } else {
//       // For JSON requests, extract product info from the formData object
//       const { content, productInfo, removeImage, ...rest } = formData;
      
//       requestData = {
//         content: content || '',
//         ...(productInfo && {
//           descriptionProduct: productInfo.description || '',
//           price: productInfo.price || '',
//           productModel: productInfo.model || ''
//         }),
//         ...rest
//       };
      
//       // Add removeImage flag if needed
//       if (removeImage) {
//         requestData.removeImage = removeImage;
//       }
//     }

//     console.log('Sending update data:', requestData); // Debug log

//     const response = await axios.put(
//       `${backendUrl}/api/posts/${postId}`,
//       requestData,
//       config
//     );

//     if (response.data.success && response.data.post) {
//       // Update the post in context
//       setPosts(prevPosts => 
//         prevPosts.map(post => 
//           post._id === postId ? response.data.post : post
//         )
//       );
//       toast.success("Post updated successfully");
//       return true;
//     }
//     throw new Error(response.data.message || 'Invalid response format');
//   } catch (error) {
//     console.error('Update post error:', {
//       error: error.response?.data || error.message
//     });
//     toast.error(
//       error.response?.data?.error || 
//       error.response?.data?.message || 
//       error.message || 
//       'Failed to update post'
//     );
//     return false;
//   }
// }, [backendUrl]);

// const deletePostImage = useCallback(async (postId) => {
//   try {
//     const response = await axios.delete(
//       `${backendUrl}/api/posts/${postId}/delete-image`,
//       {},
//       { withCredentials: true }
//     );

//     if (response.data.success) {
//       setPosts(prevPosts => 
//         prevPosts.map(post => 
//           post._id === postId ? response.data.post : post
//         )
//       );
//       toast.success("Image removed successfully");
//       return true;
//     }

//     throw new Error(response.data.message || 'Failed to remove image');
//   } catch (error) {
//     // Only show error if it's not a 404/400 about missing image
//     if (!error.response || 
//         (error.response.status !== 400 && error.response.status !== 404)) {
//       toast.error(
//         error.response?.data?.message || 
//         error.message || 
//         'Failed to remove image'
//       );
//     }
//     return false;
//   }
// }, [backendUrl]);

// // In your AppContext provider
const updatePostInContext = (updatedPost) => {
  setPosts(prevPosts => 
    prevPosts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    )
  );
};



const fetchPosts = useCallback(async () => {
  setIsLoadingPosts(true);
  try {
    const response = await axios.get(`${backendUrl}/api/posts`, {
      withCredentials: true
    });
    console.log(response.data, "API Response");
    
    // Handle both array response and object with posts property
    if (response.data && response.data.posts) {
      setPosts(response.data.posts);
    } else if (Array.isArray(response.data)) {
      setPosts(response.data);
    } else {
      console.error("Unexpected response format:", response.data);
      setPosts([]);
    }
  } catch (error) {
    toast.error("Failed to fetch posts");
    console.error("Error fetching posts:", error);
  } finally {
    setIsLoadingPosts(false);
  }
}, [backendUrl]);
const createPost = useCallback(async (formData) => {
  try {
    // Check if we have productInfo in FormData and extract it
    if (formData.has('productInfo')) {
      try {
        const productInfo = JSON.parse(formData.get('productInfo'));
        formData.append('descriptionProduct', productInfo.description || '');
        formData.append('price', productInfo.price || '');
        formData.append('productModel', productInfo.model || '');
        formData.delete('productInfo');
      } catch (error) {
        console.error('Error parsing productInfo:', error);
      }
    }

    const response = await axios.post(
      `${backendUrl}/api/posts`,
      formData,
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log('Post creation response:', response.data);
    
    if (response.data.success && response.data.post) {
      const newPost = response.data.post;
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      toast.success("Post created successfully!");
      return { success: true, post: newPost };
    }
    throw new Error(response.data.message || 'Invalid response format');
    
  } catch (error) {
    console.error('Create post error:', error);
    toast.error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'Failed to create post'
    );
    return { success: false, error: error.message };
  }
}, [backendUrl]);

const updatePost = useCallback(async (postId, formData) => {
  try {
    const isFormData = formData instanceof FormData;
    
    const config = {
      withCredentials: true,
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
      }
    };

    let requestData;
    if (isFormData) {
      // For FormData with images - send as is, backend expects direct fields
      requestData = formData;
    } else {
      // For JSON requests
      requestData = {
        content: formData.content || '',
        descriptionProduct: formData.descriptionProduct || '',
        price: formData.price || '',
        productModel: formData.productModel || '',
        removeImages: formData.removeImages || []
      };
    }

    console.log('Sending update data:', requestData);

    const response = await axios.put(
      `${backendUrl}/api/posts/${postId}`,
      requestData,
      config
    );

    if (response.data.success && response.data.post) {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data.post : post
        )
      );
      toast.success("Post updated successfully");
      return { success: true, post: response.data.post };
    }
    throw new Error(response.data.message || 'Invalid response format');
  } catch (error) {
    console.error('Update post error:', error);
    toast.error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'Failed to update post'
    );
    return { success: false, error: error.message };
  }
}, [backendUrl]);

const deletePostImage = useCallback(async (postId, imagePublicId) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/api/posts/${postId}/delete-image`,
      {
        data: { imagePublicId },
        withCredentials: true
      }
    );

    if (response.data.success && response.data.post) {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data.post : post
        )
      );
      toast.success("Image removed successfully");
      return { success: true, post: response.data.post };
    }

    throw new Error(response.data.message || 'Failed to remove image');
  } catch (error) {
    if (!error.response || 
        (error.response.status !== 400 && error.response.status !== 404)) {
      toast.error(
        error.response?.data?.error || 
        error.message || 
        'Failed to remove image'
      );
    }
    return { success: false, error: error.message };
  }
}, [backendUrl]);

// New function to update image caption
const updateImageCaption = useCallback(async (postId, imagePublicId, caption) => {
  try {
    const response = await axios.put(
      `${backendUrl}/api/posts/${postId}/update-caption`,
      { imagePublicId, caption },
      { withCredentials: true }
    );

    if (response.data.success && response.data.post) {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data.post : post
        )
      );
      toast.success("Caption updated successfully");
      return { success: true, post: response.data.post };
    }

    throw new Error(response.data.message || 'Failed to update caption');
  } catch (error) {
    console.error('Update caption error:', error);
    toast.error(
      error.response?.data?.error || 
      error.message || 
      'Failed to update caption'
    );
    return { success: false, error: error.message };
  }
}, [backendUrl]);

const deletePost = useCallback(async (postId) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/api/posts/${postId}`,
      { withCredentials: true }
    );

    if (response.data.success) {
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      toast.success("Post deleted successfully");
      return { success: true };
    }

    throw new Error(response.data.message || 'Failed to delete post');
  } catch (error) {
    console.error('Delete post error:', error);
    toast.error(
      error.response?.data?.error || 
      error.message || 
      'Failed to delete post'
    );
    return { success: false, error: error.message };
  }
}, [backendUrl]);

// Helper function to add images to existing post
const addImagesToPost = useCallback(async (postId, imagesFormData) => {
  try {
    const response = await axios.put(
      `${backendUrl}/api/posts/${postId}`,
      imagesFormData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data.success && response.data.post) {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data.post : post
        )
      );
      toast.success("Images added successfully");
      return { success: true, post: response.data.post };
    }

    throw new Error(response.data.message || 'Failed to add images');
  } catch (error) {
    console.error('Add images error:', error);
    toast.error(
      error.response?.data?.error || 
      error.message || 
      'Failed to add images'
    );
    return { success: false, error: error.message };
  }
}, [backendUrl]);



const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(
      `${backendUrl}/api/users/edit/${userId}`, 
      profileData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    if (response.data.success) {
      setUserData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          ...response.data.user
        }
      }));
      toast.success('Profile updated successfully');
      return true;
    }
    return false;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update profile');
    return false;
  }
};

const updateUserBio = async (userId, bio) => {
  try {
    const response = await axios.put(
      `${backendUrl}/api/user/${userId}`,
      { bio },
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data.success) {
      // Update local state
      if (userdata?.user?._id === userId) {
        setUserData(prev => ({
          ...prev,
          user: {
            ...prev.user,
            bio: response.data.user.bio
          }
        }));
      }
      toast.success("Bio updated successfully");
      return true;
    }
    throw new Error(response.data.message || 'Update failed');
    
  } catch (error) {
    console.error('Bio update failed:', {
      error: error.response?.data || error.message
    });
    toast.error(
      error.response?.data?.message || 
      error.message || 
      'Failed to update bio'
    );
    return false;
  }
};




// Update this function in your AppContext

const getPostLikes = async (postId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/posts/${postId}/likes`, { // ← Remove comma here
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Get post comments
 const getPostComments = async (postId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};






const addComment = async (postId, content) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/posts/${postId}/comments`,
      { content },
      { withCredentials: true }
    );
    
    if (response.data.success && response.data.comment) {
      const comment = response.data.comment;
      
      // Ensure author data is properly structured
      if (!comment.author) {
        comment.author = {
          name: 'Unknown User',
          username: 'unknown',
          photo: assets.user_image
        };
      }
      
      return {
        success: true,
        message: response.data.message,
        comment: comment
      };
    }
    throw new Error(response.data.message || 'Failed to add comment');
  } catch (error) {
    console.error('Add comment error:', error);
    
    // Provide more specific error messages
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('Network error or server unavailable');
    }
  }
};

// In your API context (AppContext)
const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/api/posts/comments/${commentId}`, // Correct endpoint
      { withCredentials: true }
    );
    
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message
      };
    }
    throw new Error(response.data.message || 'Failed to delete comment');
  } catch (error) {
    console.error('Delete comment error:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('Network error or server unavailable');
    }
  }
};


const fetchComments = async (postId) => {
  try {
    console.log('Fetching comments for postId:', postId);
    
    const response = await axios.get(
      `${backendUrl}/api/posts/${postId}/user-comments`,
      { withCredentials: true }
    );
    
    console.log('fetchComments raw response:', response.data);
    console.log('Response status:', response.status);
    console.log('Comments received:', response.data.comments);
    
    if (response.data.success) {
      // Ensure comments is always an array
      const comments = Array.isArray(response.data.comments) ? response.data.comments : [];
      
      console.log('Processing', comments.length, 'comments');
      
      // Process each comment to ensure proper structure
      const processedComments = comments.map((comment, index) => {
        console.log(`Processing comment ${index}:`, comment);
        
        // Handle case where comment might be just an ID string
        if (typeof comment === 'string') {
          console.warn('Comment is just a string ID:', comment);
          return {
            _id: comment,
            content: 'Comment details not found',
            author: {
              _id: null,
              name: 'Unknown User',
              username: 'unknown',
              photo: assets.user_image
            },
            createdAt: new Date().toISOString()
          };
        }
        
        // Ensure comment has all required fields
        const processedComment = {
          _id: comment._id || `temp-${Date.now()}-${index}`,
          content: comment.content || 'No content available',
          createdAt: comment.createdAt || new Date().toISOString(),
          author: null // Will be set below
        };
        
        // Handle author data
        if (comment.author) {
          // If author is populated
          if (typeof comment.author === 'object') {
            processedComment.author = {
              _id: comment.author._id || null,
              name: comment.author.name || comment.author.username || 'Unknown User',
              username: comment.author.username || 'unknown',
              photo: comment.author.photo || comment.author.profilePicture || assets.user_image
            };
          } else if (typeof comment.author === 'string') {
            // If author is just an ID (not populated)
            console.warn('Author not populated for comment:', comment._id);
            processedComment.author = {
              _id: comment.author,
              name: 'User',
              username: 'user',
              photo: assets.user_image
            };
          }
        } else {
          // No author data at all
          console.warn('No author data for comment:', comment._id);
          processedComment.author = {
            _id: null,
            name: 'Anonymous User',
            username: 'anonymous',
            photo: assets.user_image
          };
        }
        
        console.log('Processed comment:', processedComment);
        return processedComment;
      });
      
      console.log('Final processed comments:', processedComments);
      return processedComments;
    } else {
      console.error('API returned success: false', response.data);
      throw new Error(response.data.message || 'Failed to fetch comments');
    }
  } catch (error) {
    console.error('Fetch comments error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.message);
    
    // Don't throw the error, return empty array to prevent UI crashes
    return [];
  }
};






const updateUserPhoto = async (userId, photoFile) => {
  try {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await axios.put(
      `${backendUrl}/api/users/edit/${userId}/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    if (response.data.success) {
      setUserData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          photo: response.data.photoUrl
        }
      }));
      toast.success('Profile photo updated successfully');
      return true;
    }
    return false;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update profile photo');
    return false;
  }
};



const likePost = async (postId) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/posts/${postId}/like`,
      {},
      { withCredentials: true }
    );
    return response.data; // Return the updated post data
  } catch (error) {
    console.error('Like failed:', error);
    throw error; // Re-throw to handle in component
  }
};

  // Delete post




  // Initial data loading
  useEffect(() => {
    getAuthState();
    fetchPosts();
  }, []);

  const value = {
    backendUrl,
    getUserData,
    islogged,
    setIsLogged,
    userdata,
    setUserData,
    posts,
    fetchPosts,
    createPost,
    deletePost,
    isLoadingPosts,
    updateUserBio,
    updateUserProfile,
    updatePost,
    updateUserPhoto,
    likePost,
    deletePostImage,
    updatePostInContext,
    addComment,
    searchUsers,
    clearSearchResults,
    searchResults,
   isSearching,
    fetchComments,
    guest,
    createGuest,
    findGuestByUsername,
    logoutGuest,
    checkUsernameAvailability,
    loading,
  getUserById,
  getPostLikes,
  getPostComments,
  updateImageCaption,
  addImagesToPost,
  deleteComment
  };

  return (
    <AppContext.Provider value={value}>{!loading && props.children}</AppContext.Provider>
  );
};






// import axios from "axios";
// import { createContext, useCallback, useEffect, useState } from "react";
// import { toast } from "react-toastify";


// export const AppContext = createContext();

// export const AppContextProvider = (props) => {
//   axios.defaults.withCredentials = true;
//   const [islogged, setIsLogged] = useState(false);
//   const [userdata, setUserData] = useState(null);
//   const [guest, setGuest] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [isLoadingPosts, setIsLoadingPosts] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   // Guest API methods
//   const guestAPI = {
//     create: (data) => axios.post(`${backendUrl}/api/guest/create`, data, { withCredentials: true }),
//     findByUsername: (data) => axios.post(`${backendUrl}/api/guest/find-by-username`, data, { withCredentials: true }),
//     getDetails: () => axios.get(`${backendUrl}/api/guest/details`, { withCredentials: true }),
//     logout: () => axios.post(`${backendUrl}/api/guest/logout`, {}, { withCredentials: true }),
//     checkUsername: (username) => axios.get(`${backendUrl}/api/guest/check-username?username=${username}`, { withCredentials: true })
//   };

//   // Check guest auth state
//   const checkGuestAuth = async () => {
//     try {
//       const response = await guestAPI.getDetails();
//       if (response.data.success) {
//         setGuest(response.data.guest);
//         return true;
//       }
//     } catch (error) {
//       console.log('No active guest session');
//     }
//     return false;
//   };
//   // Initial authentication check
//   const checkAuth = async () => {
//     // First check if regular user is logged in
//     const isUserLoggedIn = await getAuthState();
    
//     // If not, check if guest is logged in
//     if (!isUserLoggedIn) {
//       await checkGuestAuth();
//     }
    
//     setLoading(false);
//   };

//   // Guest functions
//   const createGuest = async (username, displayName) => {
//     try {
//       const response = await guestAPI.create({ username, displayName });
//       if (response.data.success) {
//         setGuest(response.data.guest);
//         setIsLogged(false); // Ensure regular user login state is false
//         return { success: true };
//       }
//     } catch (error) {
//       console.error('Guest creation failed:', error);
//       return { 
//         success: false, 
//         error: error.response?.data?.message || 'Guest creation failed' 
//       };
//     }
//   };

//   const findGuestByUsername = async (username) => {
//     try {
//       const response = await guestAPI.findByUsername({ username });
//       if (response.data.success) {
//         setGuest(response.data.guest);
//         setIsLogged(false); // Ensure regular user login state is false
//         return { success: true };
//       } else {
//         return { 
//           success: false, 
//           error: response.data.message || 'Guest not found' 
//         };
//       }
//     } catch (error) {
//       console.error('Find guest failed:', error);
//       return { 
//         success: false, 
//         error: error.response?.data?.message || 'Find guest failed' 
//       };
//     }
//   };

//   const logoutGuest = async () => {
//     try {
//       await guestAPI.logout();
//       setGuest(null);
//       return { success: true };
//     } catch (error) {
//       console.error('Logout failed:', error);
//       return { 
//         success: false, 
//         error: error.response?.data?.message || 'Logout failed' 
//       };
//     }
//   };

//   const checkUsernameAvailability = async (username) => {
//     try {
//       const response = await guestAPI.checkUsername(username);
//       return response.data;
//     } catch (error) {
//       console.error('Username check failed:', error);
//       return { 
//         success: false, 
//         error: error.response?.data?.message || 'Username check failed' 
//       };
//     }
//   };

//    // Check regular user auth state
//   const getAuthState = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/user-auth`, {
//         withCredentials: true
//       });

//       if (response.data.success) {
//         setIsLogged(true);
//         await getUserData();
//         return true;
//       }
//     } catch (error) {
//       console.warn("Not logged in:", error?.response?.data?.message);
//     }
//     return false;
//   };

//   // Regular user functions
//   const getUserData = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/user/data`, {
//         withCredentials: true,
//       });

//       if (response.data.success) {
//         setUserData(response.data.userData);
//       } else {
//         toast.error(response.data.message || "Failed to fetch user data");
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || error.message || "Something went wrong"
//       );
//     }
//   };

//   const getUserById = async (userId) => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/user-details/${userId}`, {
//         withCredentials: true,
//       });

//       if (response.data.success) {
//         return response.data.userData;
//       } else {
//         toast.error(response.data.message || "Failed to fetch user data");
//         return null;
//       }
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.message || error.message || "Something went wrong"
//       );
//       return null;
//     }
//   };

//   const searchUsers = async (query, page = 1, limit = 10) => {
//     if (!query || query.trim().length === 0) {
//       setSearchResults([]);
//       return;
//     }

//     setIsSearching(true);
//     try {
//       const response = await axios.get(`${backendUrl}/api/search`, {
//         params: { query, page, limit },
//         withCredentials: true
//       });
      
//       if (response.data.success) {
//         setSearchResults(response.data.users);
//       } else {
//         setSearchResults([]);
//       }
//     } catch (error) {
//       console.error("Search error:", error);
//       setSearchResults([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const clearSearchResults = () => {
//     setSearchResults([]);
//     setIsSearching(false);
//   };

//   // Fetch all posts
//   const fetchPosts = useCallback(async () => {
//     setIsLoadingPosts(true);
//     try {
//       const response = await axios.get(`${backendUrl}/api/posts`,{
//         withCredentials:true
//       });
//       console.log(response.data,"API Context")
//       setPosts(response.data);
//     } catch (error) {
//       toast.error("Failed to fetch posts");
//       console.error("Error fetching posts:", error);
//     } finally {
//       setIsLoadingPosts(false);
//     }
//   }, [backendUrl]);

//   const createPost = useCallback(async (formData) => {
//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/posts`,
//         formData,
//         { 
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         }
//       );
      
//       console.log('Post creation response:', response.data);
      
//       if (response.data.success && response.data.post) {
//         const newPost = {
//           ...response.data.post,
//         };
        
//         setPosts(prevPosts => [newPost, ...prevPosts]);
//         return true;
//       }
//       throw new Error(response.data.message || 'Invalid response format');
      
//     } catch (error) {
//       console.error('Create post error:', error);
//       toast.error(
//         error.response?.data?.error || 
//         error.response?.data?.message || 
//         error.message || 
//         'Failed to create post'
//       );
//       return false;
//     }
//   }, [backendUrl]);

//   const updateUserBio = async (userId, bio) => {
//     try {
//       const response = await axios.put(
//         `${backendUrl}/api/user/${userId}`,
//         { bio },
//         { 
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json',
//           }
//         }
//       );

//       if (response.data.success) {
//         if (userdata?.user?._id === userId) {
//           setUserData(prev => ({
//             ...prev,
//             user: {
//               ...prev.user,
//               bio: response.data.user.bio
//             }
//           }));
//         }
//         toast.success("Bio updated successfully");
//         return true;
//       }
//       throw new Error(response.data.message || 'Update failed');
      
//     } catch (error) {
//       console.error('Bio update failed:', {
//         error: error.response?.data || error.message
//       });
//       toast.error(
//         error.response?.data?.message || 
//         error.message || 
//         'Failed to update bio'
//       );
//       return false;
//     }
//   };

//   const deletePostImage = useCallback(async (postId) => {
//     try {
//       const response = await axios.delete(
//         `${backendUrl}/api/posts/${postId}/delete-image`,
//         {},
//         { withCredentials: true }
//       );

//       if (response.data.success) {
//         setPosts(prevPosts => 
//           prevPosts.map(post => 
//             post._id === postId ? response.data.post : post
//           )
//         );
//         toast.success("Image removed successfully");
//         return true;
//       }

//       throw new Error(response.data.message || 'Failed to remove image');
//     } catch (error) {
//       if (!error.response || 
//           (error.response.status !== 400 && error.response.status !== 404)) {
//         toast.error(
//           error.response?.data?.message || 
//           error.message || 
//           'Failed to remove image'
//         );
//       }
//       return false;
//     }
//   }, [backendUrl]);

//   const updateUserProfile = async (userId, profileData) => {
//     try {
//       const response = await axios.put(
//         `${backendUrl}/api/users/edit/${userId}`, 
//         profileData,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           withCredentials: true,
//         }
//       );
      
//       if (response.data.success) {
//         setUserData(prev => ({
//           ...prev,
//           user: {
//             ...prev.user,
//             ...response.data.user
//           }
//         }));
//         toast.success('Profile updated successfully');
//         return true;
//       }
//       return false;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to update profile');
//       return false;
//     }
//   };

//   const getPostLikes = async (postId) => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/posts/${postId}/likes`, {
//         withCredentials: true
//       });
//       return response.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   };

//   const getPostComments = async (postId) => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/posts/${postId}/comments`);
//       return response.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   };

//   const addComment = async (postId, content) => {
//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/posts/${postId}/comments`,
//         { content },
//         { withCredentials: true }
//       );
      
//       if (response.data.success && response.data.comment) {
//         const comment = response.data.comment;
        
//         if (!comment.author) {
//           comment.author = {
//             name: 'Unknown User',
//             username: 'unknown',
//             photo: assets.user_image
//           };
//         }
        
//         return {
//           success: true,
//           message: response.data.message,
//           comment: comment
//         };
//       }
//       throw new Error(response.data.message || 'Failed to add comment');
//     } catch (error) {
//       console.error('Add comment error:', error);
      
//       if (error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       } else if (error.message) {
//         throw error;
//       } else {
//         throw new Error('Network error or server unavailable');
//       }
//     }
//   };

//   const deleteComment = async (commentId) => {
//     try {
//       const response = await axios.delete(
//         `${backendUrl}/api/posts/comments/${commentId}`,
//         { withCredentials: true }
//       );
      
//       if (response.data.success) {
//         return {
//           success: true,
//           message: response.data.message
//         };
//       }
//       throw new Error(response.data.message || 'Failed to delete comment');
//     } catch (error) {
//       console.error('Delete comment error:', error);
      
//       if (error.response?.data?.message) {
//         throw new Error(error.response.data.message);
//       } else if (error.message) {
//         throw error;
//       } else {
//         throw new Error('Network error or server unavailable');
//       }
//     }
//   };

//   const fetchComments = async (postId) => {
//     try {
//       const response = await axios.get(
//         `${backendUrl}/api/posts/${postId}/user-comments`,
//         { withCredentials: true }
//       );
      
//       if (response.data.success) {
//         const comments = Array.isArray(response.data.comments) ? response.data.comments : [];
        
//         const processedComments = comments.map((comment, index) => {
//           if (typeof comment === 'string') {
//             return {
//               _id: comment,
//               content: 'Comment details not found',
//               author: {
//                 _id: null,
//                 name: 'Unknown User',
//                 username: 'unknown',
//                 photo: assets.user_image
//               },
//               createdAt: new Date().toISOString()
//             };
//           }
          
//           const processedComment = {
//             _id: comment._id || `temp-${Date.now()}-${index}`,
//             content: comment.content || 'No content available',
//             createdAt: comment.createdAt || new Date().toISOString(),
//             author: null
//           };
          
//           if (comment.author) {
//             if (typeof comment.author === 'object') {
//               processedComment.author = {
//                 _id: comment.author._id || null,
//                 name: comment.author.name || comment.author.username || 'Unknown User',
//                 username: comment.author.username || 'unknown',
//                 photo: comment.author.photo || comment.author.profilePicture || assets.user_image
//               };
//             } else if (typeof comment.author === 'string') {
//               processedComment.author = {
//                 _id: comment.author,
//                 name: 'User',
//                 username: 'user',
//                 photo: assets.user_image
//               };
//             }
//           } else {
//             processedComment.author = {
//               _id: null,
//               name: 'Anonymous User',
//               username: 'anonymous',
//               photo: assets.user_image
//             };
//           }
          
//           return processedComment;
//         });
        
//         return processedComments;
//       } else {
//         throw new Error(response.data.message || 'Failed to fetch comments');
//       }
//     } catch (error) {
//       console.error('Fetch comments error:', error);
//       return [];
//     }
//   };

//   const updateUserPhoto = async (userId, photoFile) => {
//     try {
//       const formData = new FormData();
//       formData.append('photo', photoFile);

//       const response = await axios.put(
//         `${backendUrl}/api/users/edit/${userId}/photo`,
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//           withCredentials: true,
//         }
//       );

//       if (response.data.success) {
//         setUserData(prev => ({
//           ...prev,
//           user: {
//             ...prev.user,
//             photo: response.data.photoUrl
//           }
//         }));
//         toast.success('Profile photo updated successfully');
//         return true;
//       }
//       return false;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to update profile photo');
//       return false;
//     }
//   };

//   const updatePost = useCallback(async (postId, formData) => {
//     try {
//       const isFormData = formData instanceof FormData;
      
//       const config = {
//         withCredentials: true,
//         headers: {
//           'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
//         }
//       };

//       const response = await axios.put(
//         `${backendUrl}/api/posts/${postId}`,
//         isFormData ? formData : { content: formData },
//         config
//       );

//       if (response.data.success && response.data.post) {
//         setPosts(prevPosts => 
//           prevPosts.map(post => 
//             post._id === postId ? response.data.post : post
//           )
//         );
//         toast.success("Post updated successfully");
//         return true;
//       }
//       throw new Error(response.data.message || 'Invalid response format');
//     } catch (error) {
//       console.error('Update post error:', {
//         error: error.response?.data || error.message
//       });
//       toast.error(
//         error.response?.data?.error || 
//         error.response?.data?.message || 
//         error.message || 
//         'Failed to update post'
//       );
//       return false;
//     }
//   }, [backendUrl]);

//   const updatePostInContext = (updatedPost) => {
//     setPosts(prevPosts => 
//       prevPosts.map(post => 
//         post._id === updatedPost._id ? updatedPost : post
//       )
//     );
//   };

//   const likePost = async (postId) => {
//     try {
//       const response = await axios.post(
//         `${backendUrl}/api/posts/${postId}/like`,
//         {},
//         { withCredentials: true }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Like failed:', error);
//       throw error;
//     }
//   };

//   const deletePost = useCallback(async (postId) => {
//     console.log(postId,"deleter")
//     try {
//       await axios.delete(`${backendUrl}/api/posts/${postId}`, {
//         withCredentials: true
//       });
//       setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
//       toast.success("Post deleted successfully");
//       return true;
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Failed to delete post");
//       return false;
//     }
//   }, [backendUrl]);

//   // Initial data loading
//   useEffect(() => {
//     checkAuth();
//     fetchPosts();
//   }, []);

//   const value = {
    
//     // Guest functions
//     createGuest,
//     findGuestByUsername,
//     logoutGuest,
//     checkUsernameAvailability,
//     guest,
//     loading,
//         backendUrl,
//     getUserData,
//     islogged,
//     setIsLogged,
//     userdata,
//     setUserData,
//     posts,
//     fetchPosts,
//     createPost,
//     deletePost,
//     isLoadingPosts,
//     updateUserBio,
//     updateUserProfile,
//     updatePost,
//     updateUserPhoto,
//     likePost,
//     deletePostImage,
//     updatePostInContext,
//     addComment,
//     searchUsers,
//     clearSearchResults,
//     searchResults,
//    isSearching,
//     fetchComments,

//   getUserById,
//   getPostLikes,
//   getPostComments,
//   deleteComment

//       };

//   return (
//     <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
//   );
// };