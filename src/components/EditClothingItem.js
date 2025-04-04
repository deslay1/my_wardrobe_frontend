import { useState } from 'react';
import Image from 'next/image';
import axiosInstance from '../utils/axiosInstance';
import Button from './Button';
import ColorSelect from './ColorSelect';

const locations = ["London", "Stockholm"];

const categories = [
  "Dress",
  "Shirt",
  "T-Shirt",
  "Blouse",
  "Sweater",
  "Jacket",
  "Coat",
  "Pants",
  "Jeans",
  "Skirt",
  "Shorts",
  "Suit",
  "Blazer",
  "Hat",
  "Scarf",
  "Belt",
  "Shoes",
  "Boots",
  "Sneakers",
  "Bag",
  "Accessories"
];

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

const EditClothingItem = ({ item: initialItem, onItemUpdated, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null); 
  const [item, setItem] = useState(initialItem);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('category', item.category);
    formData.append('main_color', item.main_color);
    if (item.secondary_color) { 
      formData.append('secondary_color', item.secondary_color);
    }
    formData.append('location', item.location);
    formData.append('count', item.count || '1'); 
    
    // Only append new image if one was selected
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
      
      {item.image_url && (
        <div className="mb-4 relative h-32">
          <Image
            src={item.image_url}
            alt="Current"
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, 400px"
          />
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
      <select
        value={item.category}
        onChange={(e) => setItem({ ...item, category: e.target.value })}
        className="border rounded p-2 mb-2 w-full bg-gray-800 text-white"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      
      <label className="block mb-1">Main Color</label>
      <ColorSelect
        value={item.main_color}
        onChange={(color) => setItem({ ...item, main_color: color })}
        required
        placeholder="Select Main Color"
        colors={colors}
      />
      
      <label className="block mb-1">Secondary Color (Optional)</label>
      <ColorSelect
        value={item.secondary_color || ''}
        onChange={(color) => setItem({ ...item, secondary_color: color })}
        placeholder="No Secondary Color"
        colors={colors}
      />
      
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
      
      <label className="block mb-1">Count (Optional)</label>
      <input
        type="number"
        min="1"
        placeholder="1"
        value={item.count || '1'}
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
