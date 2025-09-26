// import Comment from '../models/Comment.js';
// import Post from '../models/Post.js';
// import userModel from '../models/user.js';
// import { v2 as cloudinary } from 'cloudinary';
// import mongoose from 'mongoose';

// export const createPost = async (req, res) => {
//   try {
//     if (!req.userId) {
//       return res.status(401).json({ 
//         success: false,
//         error: 'Unauthorized - No user ID found' 
//       });
//     }

//     const { content, descriptionProduct, price, productModel } = req.body;
//     const hasContent = content && content.trim() !== '';
//     const hasImage = req.file;
//     const hasProductInfo = descriptionProduct || price || productModel;

//     if (!hasContent && !hasImage && !hasProductInfo) {
//       return res.status(400).json({
//         success: false,
//         error: 'Post must contain either content, an image, or product information'
//       });
//     }

//     let imageData = null;
//     if (hasImage) {
//       try {
//         const b64 = Buffer.from(req.file.buffer).toString("base64");
//         const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        
//         const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
//           folder: "posts",
//           resource_type: "auto",
//           quality: "auto:good"
//         });

//         imageData = {
//           url: cloudinaryResponse.secure_url,
//           publicId: cloudinaryResponse.public_id
//         };
//       } catch (uploadError) {
//         console.error('Cloudinary upload error:', uploadError);
//         return res.status(500).json({
//           success: false,
//           error: 'Failed to upload image',
//           details: uploadError.message
//         });
//       }
//     }

//     const post = new Post({
//       content: hasContent ? content.trim() : null,
//       author: req.userId,
//       descriptionProduct: descriptionProduct || null,
//       price: price ? parseFloat(price) : null,
//       productModel: productModel || null,
//       ...(imageData && {
//         imageUrl: imageData.url,
//         imagePublicId: imageData.publicId
//       })
//     });

//     await post.save();

//     try {
//       await userModel.findByIdAndUpdate(
//         req.userId,
//         { $push: { posts: post._id } },
//         { new: true }
//       );
//     } catch (userUpdateError) {
//       console.error('User update error:', userUpdateError);
//     }

//     // Populate the post with author information - FIXED
//     const populatedPost = await Post.findById(post._id)
//       .populate({
//         path: 'author',
//         select: 'name email bio avatar photo username',
//       })
//       .lean();

//     // Ensure consistent response structure
//     const responseData = {
//       _id: populatedPost._id,
//       content: populatedPost.content,
//       imageUrl: populatedPost.imageUrl,
//       imagePublicId: populatedPost.imagePublicId,
//       descriptionProduct: populatedPost.descriptionProduct,
//       price: populatedPost.price,
//       productModel: populatedPost.productModel,
//       author: {
//         _id: populatedPost.author._id,
//         name: populatedPost.author.name,
//         username: populatedPost.author.username,
//         avatar: populatedPost.author.avatar,
//         photo: populatedPost.author.photo
//       },
//       likes: populatedPost.likes || [],
//       comments: populatedPost.comments || [],
//       createdAt: populatedPost.createdAt,
//       updatedAt: populatedPost.updatedAt
//     };

//     res.status(201).json({
//       success: true,
//       post: responseData  // Consistent structure
//     });
    
//   } catch (error) {
//     console.error('Post creation error:', error);
    
//     if (imageData?.publicId) {
//       await cloudinary.uploader.destroy(imageData.publicId)
//         .catch(cleanupError => 
//           console.error('Image cleanup failed:', cleanupError)
//         );
//     }
    
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to create post',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// export const getPosts = async (req, res) => {
//   try {
//     // Get all public posts, newest first
//     const posts = await Post.find()
//       .sort({ createdAt: -1 })
//       .populate('author', 'name email bio photo username');
    
//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch posts' });
//   }
// };

// export const getPost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id)
//       .populate('author', 'name email bio username');
      
//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }
//     res.json(post);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export const deletePost = async (req, res) => {
//   try {
//     console.log("Request params:", req.params);
//     console.log("User ID from middleware:", req.userId);
    
//     const post = await Post.findById(req.params.id);
//     console.log("Found post:", post);
    
//     if (!post) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'Post not found' 
//       });
//     }

//     // Verify ownership using req.userId from middleware
//     if (!req.userId) {
//       return res.status(401).json({
//         success: false,
//         error: 'User authentication required'
//       });
//     }

//     if (post.author.toString() !== req.userId.toString()) {
//       return res.status(403).json({ 
//         success: false,
//         error: 'Unauthorized to delete this post' 
//       });
//     }

//     // Delete image from Cloudinary if exists
//     if (post.imagePublicId) {
//       try {
//         await cloudinary.uploader.destroy(post.imagePublicId);
//       } catch (cloudinaryError) {
//         console.error('Cloudinary deletion error:', cloudinaryError);
//       }
//     }

//     // Remove post from user's posts array
//     await userModel.findByIdAndUpdate(
//       req.userId,
//       { $pull: { posts: post._id } }
//     );

//     const deletedPost = await Post.findByIdAndDelete(req.params.id);
//     console.log("Deleted post:", deletedPost);
    
//     if (!deletedPost) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'Post not found during deletion' 
//       });
//     }

//     res.json({ 
//       success: true,
//       message: 'Post deleted successfully',
//       deletedPost 
//     });
    
//   } catch (error) {
//     console.error("Delete error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: error.message 
//     });
//   }
// };

// export const updatePost = async (req, res) => {
//   try {
//     console.log("Request params:", req.params);
//     console.log("User ID from middleware:", req.userId);
//     console.log("Request body:", req.body);
//     console.log("Request file:", req.file);

//     const post = await Post.findById(req.params.id);
//     console.log("Found post:", post);
    
//     if (!post) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'Post not found' 
//       });
//     }

//     if (!req.userId) {
//       return res.status(401).json({
//         success: false,
//         error: 'User authentication required'
//       });
//     }

//     if (post.author.toString() !== req.userId.toString()) {
//       return res.status(403).json({ 
//         success: false,
//         error: 'Unauthorized to edit this post' 
//       });
//     }

//     const { content, descriptionProduct, price, productModel } = req.body;
    
//     // At least one of content, image, or product info must be present
//     const hasContent = content && content.trim();
//     const hasImage = req.file;
//     const hasProductInfo = descriptionProduct || price || productModel;
    
//     if (!hasContent && !hasImage && !hasProductInfo) {
//       return res.status(400).json({
//         success: false,
//         error: 'Post must contain either content, an image, or product information'
//       });
//     }

//     let imageData = null;
    
//     // Handle image upload if present
//     if (req.file) {
//       try {
//         // Delete old image if exists
//         if (post.imagePublicId) {
//           await cloudinary.uploader.destroy(post.imagePublicId);
//         }

//         const b64 = Buffer.from(req.file.buffer).toString("base64");
//         const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        
//         const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
//           folder: "posts",
//           resource_type: "auto",
//           quality: "auto:good"
//         });

//         imageData = {
//           url: cloudinaryResponse.secure_url,
//           publicId: cloudinaryResponse.public_id
//         };
//       } catch (uploadError) {
//         console.error('Cloudinary upload error:', uploadError);
//         return res.status(500).json({
//           success: false,
//           error: 'Failed to upload image',
//           details: uploadError.message
//         });
//       }
//     }

//     // Prepare update data
//     const updateData = {
//       content: hasContent ? content.trim() : post.content,
//       descriptionProduct: descriptionProduct !== undefined ? descriptionProduct : post.descriptionProduct,
//       price: price !== undefined ? parseFloat(price) : post.price,
//       productModel: productModel !== undefined ? productModel : post.productModel,
//       ...(imageData && {
//         imageUrl: imageData.url,
//         imagePublicId: imageData.publicId
//       })
//     };

//     // Remove image if requested
//     if (req.body.removeImage === 'true') {
//       if (post.imagePublicId) {
//         await cloudinary.uploader.destroy(post.imagePublicId);
//       }
//       updateData.imageUrl = null;
//       updateData.imagePublicId = null;
//     }

//     // Update the post and save it
//     Object.assign(post, updateData);
//     await post.save();

//     // Populate the updated post with author information
//     const updatedPost = await Post.findById(post._id)
//       .populate('author', 'name username photo');

//     console.log("Updated post:", updatedPost);
    
//     res.json({ 
//       success: true,
//       message: 'Post updated successfully',
//       post: updatedPost 
//     });
    
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to update post',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// export const deletePostImage = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
    
//     if (!post) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'Post not found' 
//       });
//     }

//     // Authorization check (middleware already verified the user)
//     if (post.author.toString() !== req.userId.toString()) {
//       return res.status(403).json({ 
//         success: false,
//         error: 'Unauthorized to edit this post' 
//       });
//     }

//     // Check if post has an image to delete
//     if (!post.imageUrl && !post.imagePublicId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Post does not have an image to delete'
//       });
//     }

//     // Delete image from Cloudinary if exists
//     if (post.imagePublicId) {
//       await cloudinary.uploader.destroy(post.imagePublicId);
//     }

//     // Update post to remove image references
//     const updatedPost = await Post.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           imageUrl: null,
//           imagePublicId: null
//         }
//       },
//       { new: true, runValidators: true }
//     ).populate('author', 'name username avatar');

//     res.json({ 
//       success: true,
//       message: 'Image deleted successfully',
//       post: updatedPost 
//     });
    
//   } catch (error) {
//     console.error("");
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to delete image from post',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };


import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import userModel from '../models/user.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

export const createPost = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized - No user ID found' 
      });
    }

    const { content, descriptionProduct, price, productModel } = req.body;
    const hasContent = content && content.trim() !== '';
    const hasImages = req.files && req.files.length > 0;
    const hasProductInfo = descriptionProduct || price || productModel;

    if (!hasContent && !hasImages && !hasProductInfo) {
      return res.status(400).json({
        success: false,
        error: 'Post must contain either content, images, or product information'
      });
    }

    // Handle multiple image uploads
    let imagesData = [];
    if (hasImages) {
      try {
        // Check if too many images are uploaded
        if (req.files.length > 5) {
          return res.status(400).json({
            success: false,
            error: 'Cannot upload more than 5 images'
          });
        }

        // Upload each image to Cloudinary
        const uploadPromises = req.files.map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString("base64");
          const dataURI = "data:" + file.mimetype + ";base64," + b64;
          
          const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
            folder: "posts",
            resource_type: "auto",
            quality: "auto:good"
          });

          return {
            url: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
            caption: '' // Default empty caption
          };
        });

        imagesData = await Promise.all(uploadPromises);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        
        // Cleanup any uploaded images if error occurs
        if (imagesData.length > 0) {
          const cleanupPromises = imagesData.map(image => 
            cloudinary.uploader.destroy(image.publicId)
          );
          await Promise.all(cleanupPromises);
        }
        
        return res.status(500).json({
          success: false,
          error: 'Failed to upload images',
          details: uploadError.message
        });
      }
    }

    const post = new Post({
      content: hasContent ? content.trim() : null,
      author: req.userId,
      descriptionProduct: descriptionProduct || null,
      price: price ? parseFloat(price) : null,
      productModel: productModel || null,
      images: imagesData
    });

    await post.save();

    try {
      await userModel.findByIdAndUpdate(
        req.userId,
        { $push: { posts: post._id } },
        { new: true }
      );
    } catch (userUpdateError) {
      console.error('User update error:', userUpdateError);
    }

    // Populate the post with author information
    const populatedPost = await Post.findById(post._id)
      .populate({
        path: 'author',
        select: 'name email bio avatar photo username',
      })
      .lean();

    // Ensure consistent response structure
    const responseData = {
      _id: populatedPost._id,
      content: populatedPost.content,
      images: populatedPost.images || [],
      descriptionProduct: populatedPost.descriptionProduct,
      price: populatedPost.price,
      productModel: populatedPost.productModel,
      author: {
        _id: populatedPost.author._id,
        name: populatedPost.author.name,
        username: populatedPost.author.username,
        avatar: populatedPost.author.avatar,
        photo: populatedPost.author.photo
      },
      likes: populatedPost.likes || [],
      comments: populatedPost.comments || [],
      createdAt: populatedPost.createdAt,
      updatedAt: populatedPost.updatedAt,
      likeCount: populatedPost.likeCount,
      commentCount: populatedPost.commentCount,
      imageCount: populatedPost.imageCount
    };

    res.status(201).json({
      success: true,
      post: responseData
    });
    
  } catch (error) {
    console.error('Post creation error:', error);
    
    // Cleanup uploaded images if error occurs after upload
    if (imagesData && imagesData.length > 0) {
      const cleanupPromises = imagesData.map(image => 
        cloudinary.uploader.destroy(image.publicId)
      );
      await Promise.all(cleanupPromises)
        .catch(cleanupError => 
          console.error('Image cleanup failed:', cleanupError)
        );
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    // Get all public posts, newest first
    const posts = await Post.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .populate('author', 'name email bio photo username')
      .populate('likes', 'name username')
      .populate('comments');
    
    res.status(200).json({
      success: true,
      posts: posts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch posts' 
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email bio username')
      .populate('likes', 'name username')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name username avatar'
        }
      });
      
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }
    
    res.json({
      success: true,
      post: post
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    console.log("Request params:", req.params);
    console.log("User ID from middleware:", req.userId);
    
    const post = await Post.findById(req.params.id);
    console.log("Found post:", post);
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    // Verify ownership using req.userId from middleware
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false,
        error: 'Unauthorized to delete this post' 
      });
    }

    // Delete images from Cloudinary if exist
    if (post.images && post.images.length > 0) {
      try {
        const deletePromises = post.images.map(image => 
          cloudinary.uploader.destroy(image.publicId)
        );
        await Promise.all(deletePromises);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
      }
    }

    // Remove post from user's posts array
    await userModel.findByIdAndUpdate(
      req.userId,
      { $pull: { posts: post._id } }
    );

    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    console.log("Deleted post:", deletedPost);
    
    if (!deletedPost) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found during deletion' 
      });
    }

    res.json({ 
      success: true,
      message: 'Post deleted successfully',
      deletedPost 
    });
    
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const updatePost = async (req, res) => {
  let newImagesData = []; // Declare at the top level

  try {
    console.log("Request params:", req.params);
    console.log("User ID from middleware:", req.userId);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const post = await Post.findById(req.params.id);
    console.log("Found post:", post);
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        error: 'User authentication required'
      });
    }

    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false,
        error: 'Unauthorized to edit this post' 
      });
    }

    const { content, descriptionProduct, price, productModel } = req.body;
    
    // At least one of content, images, or product info must be present
    const hasContent = content && content.trim();
    const hasNewImages = req.files && req.files.length > 0;
    const hasProductInfo = descriptionProduct || price || productModel;
    
    if (!hasContent && !hasNewImages && !hasProductInfo) {
      return res.status(400).json({
        success: false,
        error: 'Post must contain either content, images, or product information'
      });
    }

    // Handle new image uploads if present
    if (hasNewImages) {
      try {
        // Check if adding new images would exceed the limit
        const currentImageCount = post.images ? post.images.length : 0;
        if (currentImageCount + req.files.length > 5) {
          return res.status(400).json({
            success: false,
            error: `Cannot add more than 5 images total. Current: ${currentImageCount}, Trying to add: ${req.files.length}`
          });
        }

        // Upload new images to Cloudinary
        const uploadPromises = req.files.map(async (file) => {
          const b64 = Buffer.from(file.buffer).toString("base64");
          const dataURI = "data:" + file.mimetype + ";base64," + b64;
          
          const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
            folder: "posts",
            resource_type: "auto",
            quality: "auto:good"
          });

          return {
            url: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
            caption: ''
          };
        });

        newImagesData = await Promise.all(uploadPromises);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        
        // Cleanup any uploaded images if error occurs
        if (newImagesData.length > 0) {
          const cleanupPromises = newImagesData.map(image => 
            cloudinary.uploader.destroy(image.publicId)
          );
          await Promise.all(cleanupPromises);
        }
        
        return res.status(500).json({
          success: false,
          error: 'Failed to upload images',
          details: uploadError.message
        });
      }
    }

    // Prepare update data
    const updateData = {
      content: hasContent ? content.trim() : post.content,
      descriptionProduct: descriptionProduct !== undefined ? descriptionProduct : post.descriptionProduct,
      price: price !== undefined ? parseFloat(price) : post.price,
      productModel: productModel !== undefined ? productModel : post.productModel,
    };

    // Add new images to existing images
    if (newImagesData.length > 0) {
      updateData.$push = {
        images: { $each: newImagesData }
      };
    }

    // Remove specific images if requested
    if (req.body.removeImages) {
      const imagesToRemove = Array.isArray(req.body.removeImages) 
        ? req.body.removeImages 
        : [req.body.removeImages];
      
      // Delete images from Cloudinary
      const imagesToDelete = post.images.filter(img => 
        imagesToRemove.includes(img.publicId)
      );
      
      if (imagesToDelete.length > 0) {
        const deletePromises = imagesToDelete.map(image => 
          cloudinary.uploader.destroy(image.publicId)
        );
        await Promise.all(deletePromises);
      }
      
      updateData.$pull = {
        images: { publicId: { $in: imagesToRemove } }
      };
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name username photo')
     .populate('likes', 'name username');

    console.log("Updated post:", updatedPost);
    
    res.json({ 
      success: true,
      message: 'Post updated successfully',
      post: updatedPost 
    });
    
  } catch (error) {
    console.error("Update error:", error);
    
    // Cleanup uploaded images if error occurs after upload
    if (newImagesData && newImagesData.length > 0) {
      const cleanupPromises = newImagesData.map(image => 
        cloudinary.uploader.destroy(image.publicId)
      );
      await Promise.all(cleanupPromises)
        .catch(cleanupError => 
          console.error('Image cleanup failed:', cleanupError)
        );
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to update post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const deletePostImage = async (req, res) => {
  try {
    const { imagePublicId } = req.body;
    
    if (!imagePublicId) {
      return res.status(400).json({
        success: false,
        error: 'Image public ID is required'
      });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    // Authorization check
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false,
        error: 'Unauthorized to edit this post' 
      });
    }

    // Find the image to delete
    const imageToDelete = post.images.find(img => img.publicId === imagePublicId);
    
    if (!imageToDelete) {
      return res.status(404).json({
        success: false,
        error: 'Image not found in post'
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(imagePublicId);

    // Remove image from post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { images: { publicId: imagePublicId } }
      },
      { new: true, runValidators: true }
    ).populate('author', 'name username avatar')
     .populate('likes', 'name username');

    res.json({ 
      success: true,
      message: 'Image deleted successfully',
      post: updatedPost 
    });
    
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete image from post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add this new function to handle image caption updates
export const updateImageCaption = async (req, res) => {
  try {
    const { imagePublicId, caption } = req.body;
    
    if (!imagePublicId) {
      return res.status(400).json({
        success: false,
        error: 'Image public ID is required'
      });
    }

    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    // Authorization check
    if (post.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ 
        success: false,
        error: 'Unauthorized to edit this post' 
      });
    }

    // Update the image caption
    const updatedPost = await Post.findOneAndUpdate(
      { 
        _id: req.params.id, 
        'images.publicId': imagePublicId 
      },
      {
        $set: { 'images.$.caption': caption || '' }
      },
      { new: true, runValidators: true }
    ).populate('author', 'name username avatar');

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        error: 'Image not found in post'
      });
    }

    res.json({ 
      success: true,
      message: 'Image caption updated successfully',
      post: updatedPost 
    });
    
  } catch (error) {
    console.error("Update caption error:", error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update image caption',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const getPostLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    
    const post = await Post.findById(postId)
      .populate({
        path: 'likes',
        select: 'name username photo'
      });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user can view private post
    if (!post.isPublic && post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied to private post' });
    }
    
    res.status(200).json({
      success: true,
      likes: post.likes || []
    });
  } catch (error) {
    console.error('Error fetching post likes:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching likes' 
    });
  }
};
// Get comments for a specific post with user details
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    
    // Validate post ID
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    
    // Check if the post exists and is accessible
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if the post is public or user is the author
    if (!post.isPublic && post.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied to private post' });
    }
    
    // Find comments for the post and populate author details
    const comments = await Comment.find({ post: postId })
      .populate({
        path: 'author',
        select: 'name username photo'
      })
      .populate({
        path: 'likes',
        select: 'name username photo'
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    console.error('Error fetching post comments:', error);
    res.status(500).json({ message: 'Server error while fetching comments' });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.userId;

    // Validate input
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create new comment
    const comment = new Comment({
      content,
      author: userId,
      post: postId
    });

    // Save comment
    await comment.save();

    // Add comment to post's comments array
    post.comments.push(comment._id);
    await post.save();

    // Populate author info before sending response
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name username photo');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    // Find the comment and populate author info if needed
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ 
        success: false,
        message: 'Comment not found' 
      });
    }
    console.log(comment.author.toString(),"525")
    // Check authorization
    if (comment.author.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this comment' 
      });
    }

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    // Remove comment reference from the post
    await Post.findByIdAndUpdate(
      comment.post,
      { $pull: { comments: commentId } }
    );

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};


export const getComments = async (req, res) => {

  try {
    const { postId } = req.params;
    
    // If you have a separate Comment model
    const comments = await Comment.find({ post: postId })
      .populate('author', 'name username photo email profilePicture avatar')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    console.log('Found comments:', comments.length);
    
    res.status(200).json({
      success: true,
      comments: comments
    });
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching comments'
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId; // From auth middleware

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Post not found' 
      });
    }

    // Check if user already liked the post
    const isLiked = post.likes.some(id => id.toString() === userId.toString());

    // Toggle like status
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Post unliked' : 'Post liked',
      post: updatedPost
    });

  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update like status' 
    });
  }
};



// In your posts routes file
export const searchUser = async (req, res) => {
  try {
    const query = req.query.q || '';
    const posts = await Post.find({
      $or: [
        { content: { $regex: query, $options: 'i' } },
        { 'author.name': { $regex: query, $options: 'i' } },
        { 'author.username': { $regex: query, $options: 'i' } }
      ]
    })
    .populate('author', 'name username avatar')
    .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
};