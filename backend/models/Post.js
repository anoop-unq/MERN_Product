// import mongoose from 'mongoose';

// const postSchema = new mongoose.Schema({
//   content: {
//     type: String,
//     trim: true,
//     required: function() {
//       return !this.imageUrl;
//     },
//     minlength: [1, 'Content must be at least 1 character long'],
//     maxlength: [2000, 'Content cannot exceed 2000 characters']
//   },
//   imageUrl: {
//     type: String,
//     default: null,
//     validate: {
//       validator: function(v) {
//         if (!v) return true;
//         return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(v);
//       },
//       message: props => `${props.value} is not a valid image URL!`
//     }
//   },
//   imagePublicId: {
//     type: String,
//     default: null
//   },
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }],
//   comments: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Comment'
//   }],
//   descriptionProduct:{
//     type:String
//   },
//   price:{
//     type:Number
//   },
//   productModel: {
//     type: String,
//     enum: {
//       values: ['New', 'Used', 'Refurbished'],
//       message: 'Product model must be either "new", "old", or "refurbished"'
//     },
//     // required:true
//   },
//   isPublic: {
//     type: Boolean,
//     default: true
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Virtuals
// postSchema.virtual('likeCount').get(function() {
//   return this.likes.length;
// });

// postSchema.virtual('commentCount').get(function() {
//   return this.comments.length;
// });

// // Middleware
// postSchema.pre('remove', async function(next) {
//   if (this.imagePublicId) {
//     try {
//       const { v2: cloudinary } = await import('cloudinary');
//       await cloudinary.uploader.destroy(this.imagePublicId);
//     } catch (err) {
//       console.error('Error deleting image from Cloudinary:', err);
//     }
//   }
//   next();
// });

// const Post = mongoose.model('Post', postSchema);
// export default Post;



import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
    required: function() {
      return !this.images || this.images.length === 0;
    },
    minlength: [1, 'Content must be at least 1 character long'],
    maxlength: [2000, 'Content cannot exceed 2000 characters']
  },
  images: [{
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i.test(v);
        },
        message: props => `${props.value} is not a valid image URL!`
      }
    },
    publicId: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      maxlength: [500, 'Caption cannot exceed 500 characters'],
      default: ''
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  descriptionProduct: {
    type: String
  },
  price: {
    type: Number
  },
  productModel: {
    type: String,
    enum: {
      values: ['New', 'Used', 'Refurbished'],
      message: 'Product model must be either "New", "Used", or "Refurbished"'
    }
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Custom validation to limit images to maximum 5
postSchema.path('images').validate(function(images) {
  return images.length <= 5;
}, 'Cannot add more than 5 images');

// Virtuals
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

postSchema.virtual('imageCount').get(function() {
  return this.images ? this.images.length : 0;
});

// Middleware to delete all images when post is removed
postSchema.pre('remove', async function(next) {
  if (this.images && this.images.length > 0) {
    try {
      const { v2: cloudinary } = await import('cloudinary');
      
      // Delete all images from Cloudinary
      const deletePromises = this.images.map(image => 
        cloudinary.uploader.destroy(image.publicId)
      );
      
      await Promise.all(deletePromises);
    } catch (err) {
      console.error('Error deleting images from Cloudinary:', err);
    }
  }
  next();
});

// Instance method to add an image
postSchema.methods.addImage = function(imageData) {
  if (this.images.length >= 5) {
    throw new Error('Maximum image limit reached (5 images)');
  }
  
  this.images.push(imageData);
  return this.save();
};

// Instance method to remove an image by publicId
postSchema.methods.removeImage = function(publicId) {
  const imageIndex = this.images.findIndex(img => img.publicId === publicId);
  
  if (imageIndex === -1) {
    throw new Error('Image not found');
  }
  
  this.images.splice(imageIndex, 1);
  return this.save();
};

const Post = mongoose.model('Post', postSchema);
export default Post;