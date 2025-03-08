import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import AddClothingItem from '../components/AddClothingItem';
import EditClothingItem from '../components/EditClothingItem';
import Modal from '../components/Modal';
import Button from '../components/Button';

const CARD_WIDTH = '250px'; // You can adjust this value as needed

const Home = () => {
  const [clothingItems, setClothingItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        const response = await axiosInstance.get('/clothing');
        setClothingItems(response.data);
      } catch (error) {
        console.error('Error fetching clothing items:', error);
      }
    };

    fetchClothingItems();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleItemAdded = () => {
    // Refresh the clothing items after adding a new one
    const fetchClothingItems = async () => {
      try {
        const response = await axiosInstance.get('/clothing');
        setClothingItems(response.data);
      } catch (error) {
        console.error('Error fetching clothing items:', error);
      }
    };
    fetchClothingItems();
  };

  const handleItemUpdated = () => {
    // Refresh the clothing items after updating an item
    const fetchClothingItems = async () => {
      try {
        const response = await axiosInstance.get('/clothing');
        setClothingItems(response.data);
      } catch (error) {
        console.error('Error fetching clothing items:', error);
      }
    };
    fetchClothingItems();
  };

  const handleEditClick = (itemId) => {
    setEditingItemId(itemId);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCloseEdit = () => {
    setEditingItemId(null);
  };

  const handleDeleteClick = async (itemId) => {
    try {
      await axiosInstance.delete(`/clothing/${itemId}`);
      handleItemUpdated(); // Refresh the item list after deletion
    } catch (error) {
      console.error('Error deleting clothing item:', error);
    }
  };

  const swapLocations = async () => {
    const updatedItems = selectedItems.map(itemId => {
      const item = clothingItems.find(item => item.id === itemId);
      return {
        ...item,
        location: item.location === "London" ? "Stockholm" : "London",
      };
    });

    // Update the state with swapped items
    setClothingItems(prevItems => 
      prevItems.map(item => 
        updatedItems.find(updatedItem => updatedItem.id === item.id) || item
      )
    );

    // Update the backend with the new locations
    for (const item of updatedItems) {
      await axiosInstance.put(`/clothing/${item.id}/move`, { location: item.location });
    }
  };

  const handleCardClick = (itemId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        return prevSelected.filter(id => id !== itemId); // Deselect
      } else {
        return [...prevSelected, itemId]; // Select
      }
    });
  };

  const categories = [...new Set(clothingItems.map(item => item.category))]; // Unique categories
  const colors = [...new Set(clothingItems.map(item => item.main_color))]; // Unique colors

  const filteredItems = clothingItems.filter(item => {
    return (
      (selectedCategory === '' || item.category === selectedCategory) &&
      (selectedColor === '' || item.main_color === selectedColor)
    );
  });

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">Digital Wardrobe</h1>
      <div className="flex flex-col items-center mb-4">
        <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white rounded p-2 mb-4">Add Item</button>
        <input
          type="text"
          placeholder="Search clothing items..."
          value={searchQuery}
          onChange={handleSearch}
          className="border rounded p-2 mb-4 w-full md:w-1/2 bg-gray-800 text-white"
        />
      </div>
      <div className="flex justify-center mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded p-2 mx-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="border rounded p-2 mx-2"
        >
          <option value="">All Colors</option>
          {colors.map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isEditing ? (
          <EditClothingItem
            item={clothingItems.find(item => item.id === editingItemId)}
            onItemUpdated={handleItemUpdated}
            onClose={() => {
              setIsModalOpen(false);
              setIsEditing(false);
            }}
          />
        ) : (
          <AddClothingItem onItemAdded={handleItemAdded} />
        )}
      </Modal>
      
      <div className="flex flex-col items-center justify-center mb-4">
        <Button onClick={swapLocations} className="mb-4">Swap Locations</Button>
      </div>

      <div className="flex justify-between">
        <div className="w-1/2 pr-2">
          <h2 className="text-2xl font-bold mb-4 text-center">London</h2>
          <div className="flex flex-wrap justify-center">
            {filteredItems.filter(item => item.location === "London").map(item => (
              <div key={item.id} 
                   className={`border p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow mb-2 mx-2 ${selectedItems.includes(item.id) ? 'border-blue-500 bg-blue-600' : ''}`} 
                   onClick={() => handleCardClick(item.id)}
                   style={{ width: '100%', maxWidth: CARD_WIDTH }}>
                <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover mb-2 rounded" />
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm">Category: {item.category}</p>
                <p className="text-sm">Main Color: {item.main_color}</p>
                <div className="flex space-x-2 mt-2">
                  <Button onClick={() => handleEditClick(item.id)} type="yellow">Edit</Button>
                  <Button onClick={() => handleDeleteClick(item.id)} type="red">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2 pl-2">
          <h2 className="text-2xl font-bold mb-4 text-center">Stockholm</h2>
          <div className="flex flex-wrap justify-center">
            {filteredItems.filter(item => item.location === "Stockholm").map(item => (
              <div key={item.id} 
                   className={`border p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow mb-2 mx-2 ${selectedItems.includes(item.id) ? 'border-blue-500 bg-blue-600' : ''}`} 
                   onClick={() => handleCardClick(item.id)}
                   style={{ width: '100%', maxWidth: CARD_WIDTH }}>
                <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover mb-2 rounded" />
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm">Category: {item.category}</p>
                <p className="text-sm">Main Color: {item.main_color}</p>
                <div className="flex space-x-2 mt-2">
                  <Button onClick={() => handleEditClick(item.id)} type="yellow">Edit</Button>
                  <Button onClick={() => handleDeleteClick(item.id)} type="red">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
