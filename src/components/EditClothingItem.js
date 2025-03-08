import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Button from './Button'; // Import the Button component

const locations = ["London", "Stockholm"]; // Define available locations
const colors = [
  "Beige",
  "Black",
  "White",
  "Navy",
  "Red",
  "Green",
  "Blue",
  "Gray",
  "Brown",
  "Yellow",
];

const EditClothingItem = ({ item, onItemUpdated, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null); // State for the image file

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare the form data
    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('category', item.category);
    formData.append('main_color', item.main_color);
    formData.append('secondary_color', item.secondary_color);
    formData.append('location', item.location);
    formData.append('count', item.count); // Include count in the form data
    
    // If a new image is uploaded, append it to the form data
    if (imageFile) {
      formData.append('image_url', imageFile);
    }

    await axiosInstance.put(`/clothing/${item.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    onItemUpdated();
    onClose();
  };

  if (!item) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Edit Clothing Item</h2>
      
      {/* Current Image Display */}
      {item.image_url && (
        <div className="mb-4">
          <img src={item.image_url} alt="Current" className="w-full h-32 object-cover mb-2 rounded" />
        </div>
      )}
      
      <label className="block mb-1">Name</label>
      <input
        type="text"
        placeholder="Name"
        value={item.name}
        onChange={(e) => setItem({ ...item, name: e.target.value })}
        className="border rounded p-2 mb-2 w-full"
        required
      />
      
      <label className="block mb-1">Category</label>
      <input
        type="text"
        placeholder="Category"
        value={item.category}
        onChange={(e) => setItem({ ...item, category: e.target.value })}
        className="border rounded p-2 mb-2 w-full"
        required
      />
      
      <label className="block mb-1">Main Color</label>
      <select
        value={item.main_color}
        onChange={(e) => setItem({ ...item, main_color: e.target.value })}
        className="border rounded p-2 mb-2 w-full"
        required
      >
        <option value="">Select Main Color</option>
        {colors.map((color) => (
          <option key={color} value={color}>{color}</option>
        ))}
      </select>
      
      <label className="block mb-1">Secondary Color</label>
      <select
        value={item.secondary_color}
        onChange={(e) => setItem({ ...item, secondary_color: e.target.value })}
        className="border rounded p-2 mb-2 w-full"
      >
        <option value="">Select Secondary Color</option>
        {colors.map((color) => (
          <option key={color} value={color}>{color}</option>
        ))}
      </select>
      
      <label className="block mb-1">Location</label>
      <select
        value={item.location}
        onChange={(e) => setItem({ ...item, location: e.target.value })}
        className="border rounded p-2 mb-2 w-full"
        required
      >
        <option value="">Select Location</option>
        {locations.map((location) => (
          <option key={location} value={location}>{location}</option>
        ))}
      </select>
      
      <label className="block mb-1">Count (optional)</label>
      <input
        type="number"
        placeholder="Count"
        value={item.count}
        onChange={(e) => setItem({ ...item, count: e.target.value })}
        className="border rounded p-2 mb-2 w-full"
      />
      
      <label className="block mb-1">Upload New Image (optional)</label>
      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="border rounded p-2 mb-2 w-full"
      />
      
      <div className="flex space-x-2 mt-4">
        <Button type="green" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Updating...' : 'Update Item'}
        </Button>
        <Button type="red" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditClothingItem;
