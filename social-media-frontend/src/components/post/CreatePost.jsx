import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaImage, FaTimes } from 'react-icons/fa';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.match('image.*')) {
      toast.error('Only image files are allowed');
      return;
    }

    setImage(file);

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setDebugInfo('Starting submission...\n');
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        setIsSubmitting(false);
        return;
      }

      let response;

      if (image) {
        // Create FormData for image upload
        const formData = new FormData();
        formData.append('content', content.trim());
        formData.append('image', image);
        
        setDebugInfo(prev => prev + 'Sending with FormData including image...\n');
        setDebugInfo(prev => prev + `Content: ${content.trim()}\n`);
        setDebugInfo(prev => prev + `Image: ${image.name} (${image.type}, ${image.size} bytes)\n`);
        
        // Log FormData contents
        for (let pair of formData.entries()) {
          setDebugInfo(prev => prev + `FormData: ${pair[0]} = ${pair[1]}\n`);
        }
        
        // Send request with image
        response = await axios.post(
          'http://localhost:5000/api/posts',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              // Don't set Content-Type here, axios will set it with the correct boundary
            }
          }
        );
      } else {
        // No image, use JSON
        setDebugInfo(prev => prev + 'Sending with JSON (no image)...\n');
        
        response = await axios.post(
          'http://localhost:5000/api/posts',
          { content: content.trim() },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
      
      setDebugInfo(prev => prev + `Response status: ${response.status}\n`);
      setDebugInfo(prev => prev + `Response data: ${JSON.stringify(response.data)}\n`);
      
      toast.success('Post created successfully!');
      setContent('');
      setImage(null);
      setImagePreview(null);
      navigate('/');
    } catch (error) {
      setDebugInfo(prev => prev + `Error: ${error.message}\n`);
      
      if (error.response) {
        setDebugInfo(prev => prev + `Response status: ${error.response.status}\n`);
        setDebugInfo(prev => prev + `Response data: ${JSON.stringify(error.response.data)}\n`);
      }
      
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Create a New Post</h1>
      
      <div className="bg-white rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text content input */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Post Content (required)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>
          
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (optional)
            </label>
            
            {imagePreview ? (
              <div className="relative mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-60 rounded-lg mx-auto"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>Upload an image</span>
                      <input
                        id="image-upload"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className={`px-8 py-3 rounded-md font-bold text-white text-lg ${
                isSubmitting || !content.trim() 
                  ? 'bg-blue-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors shadow-lg`}
            >
              {isSubmitting ? 'Creating Post...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Debug information */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
        <pre className="whitespace-pre-wrap text-sm">{debugInfo}</pre>
      </div>
    </div>
  );
};

export default CreatePost; 