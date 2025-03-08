import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

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

const AddClothingItem = ({ onItemAdded }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [mainColor, setMainColor] = useState('');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [count, setCount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('main_color', mainColor);
    formData.append('secondary_color', secondaryColor);
    formData.append('image_url', imageFile);
    formData.append('location', location);
    formData.append('count', count);

    setLoading(true); // Set loading to true
    try {
      await axiosInstance.post('/clothing', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onItemAdded(); // Call the function to refresh the item list
      // Clear the form
      setName('');
      setCategory('');
      setMainColor('');
      setSecondaryColor('');
      setImageFile(null);
      setLocation('');
      setCount('');
    } catch (error) {
      console.error('Error adding clothing item:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Add New Clothing Item</h2>
      <label className="block mb-1">Name</label>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
        required
      />
      <label className="block mb-1">Category</label>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
        required
      />
      <label className="block mb-1">Main Color</label>
      <select
        value={mainColor}
        onChange={(e) => setMainColor(e.target.value)}
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
        value={secondaryColor}
        onChange={(e) => setSecondaryColor(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      >
        <option value="">Select Secondary Color</option>
        {colors.map((color) => (
          <option key={color} value={color}>{color}</option>
        ))}
      </select>
      <label className="block mb-1">Location</label>
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
        required
      >
        <option value="">Select Location</option>
        <option value="London">London</option>
        <option value="Stockholm">Stockholm</option>
      </select>
      <label className="block mb-1">Count (optional)</label>
      <input
        type="number"
        placeholder="Count"
        value={count}
        onChange={(e) => setCount(e.target.value)}
        className="border rounded p-2 mb-2 w-full"
      />
      <label className="block mb-1">Upload Image</label>
      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="border rounded p-2 mb-2 w-full"
        required
      />
      <button type="submit" className="bg-blue-500 text-white rounded p-2" disabled={loading}>
        {loading ? 'Adding...' : 'Add Item'}
      </button>
    </form>
  );
};

export default AddClothingItem;
