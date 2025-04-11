import { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import Image from 'next/image';
import axiosInstance from '../utils/axiosInstance';
import AddClothingItem from '../components/AddClothingItem';
import EditClothingItem from '../components/EditClothingItem';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { 
  FaTshirt, 
  FaHatCowboy,
  FaShoppingBag, 
  FaQuestion,
  FaShoePrints,
  FaScarf,
  FaGem,
  FaFemale
} from 'react-icons/fa';
import { 
  GiArmoredPants, 
  GiMonclerJacket, 
  GiRunningShoe,
  GiSkirt,
  GiTrousers,
  GiPoloShirt,
  GiLargeDress,
  GiBelt,
  GiLabCoat,
  GiSleevelessJacket,
  GiSuitcase
} from 'react-icons/gi';

const categories = [
  "Accessories",
  "Bag",
  "Belt",
  "Blazer",
  "Blouse",
  "Boots",
  "Bra",
  "Coat",
  "Dress",
  "Hat",
  "Jacket",
  "Jeans",
  "Pants",
  "Scarf",
  "Shirt",
  "Shoes",
  "Shorts",
  "Skirt",
  "Sneakers",
  "Sweater",
  "Suit",
  "T-Shirt"
];

const Home = () => {
  const [clothingItems, setClothingItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItemId, setEditingItemId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  useEffect(() => {
    // Add window resize listener for responsive layout
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const handleImageClick = (e, imageUrl) => {
    e.stopPropagation(); // Prevent triggering the row selection
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleImageModalClose = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const filteredItems = clothingItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.main_color.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesColor = !selectedColor || item.main_color === selectedColor;
    return matchesSearch && matchesCategory && matchesColor;
  });

  // Get category icon component
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Dress':
        return <GiLargeDress className="w-4 h-4 inline-block" />;
      case 'Shirt':
        return <GiPoloShirt className="w-4 h-4 inline-block" />;
      case 'T-Shirt':
        return <FaTshirt className="w-4 h-4 inline-block" />;
      case 'Blouse':
        return <GiLabCoat className="w-4 h-4 inline-block" />;
      case 'Sweater':
        return <GiSleevelessJacket className="w-4 h-4 inline-block" />;
      case 'Jacket':
        return <GiMonclerJacket className="w-4 h-4 inline-block" />;
      case 'Coat':
        return <GiLabCoat className="w-4 h-4 inline-block" />;
      case 'Pants':
        return <GiTrousers className="w-4 h-4 inline-block" />;
      case 'Jeans':
        return <GiArmoredPants className="w-4 h-4 inline-block" />;
      case 'Skirt':
        return <GiSkirt className="w-4 h-4 inline-block" />;
      case 'Shorts':
        return <GiTrousers className="w-4 h-4 inline-block" />;
      case 'Suit':
        return <GiSuitcase className="w-4 h-4 inline-block" />;
      case 'Blazer':
        return <GiMonclerJacket className="w-4 h-4 inline-block" />;
      case 'Hat':
        return <FaHatCowboy className="w-4 h-4 inline-block" />;
      case 'Scarf':
        return <FaScarf className="w-4 h-4 inline-block" />;
      case 'Belt':
        return <GiBelt className="w-4 h-4 inline-block" />;
      case 'Shoes':
        return <FaShoePrints className="w-4 h-4 inline-block" />;
      case 'Boots':
        return <GiRunningShoe className="w-4 h-4 inline-block" />;
      case 'Sneakers':
        return <GiRunningShoe className="w-4 h-4 inline-block" />;
      case 'Bag':
        return <FaShoppingBag className="w-4 h-4 inline-block" />;
      case 'Accessories':
        return <FaGem className="w-4 h-4 inline-block" />;
      case 'Bra':
        return <FaFemale className="w-4 h-4 inline-block" />;
      default:
        return <FaQuestion className="w-4 h-4 inline-block" />;
    }
  };

  // Function to get placeholder image if image_url is blank
  const getImageUrl = (item) => {
    if (!item.image_url) {
      return `data:image/svg+xml,${encodeURIComponent(
        ReactDOMServer.renderToString(getCategoryIcon(item.category))
      )}`;
    }
    return item.image_url;
  };

  // Color box component
  const ColorBox = ({ color }) => (
    <span 
      className="inline-block w-4 h-4 rounded border border-gray-300 mr-2" 
      style={{ backgroundColor: color.toLowerCase() }}
    />
  );

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">Digital Wardrobe</h1>

      {/* Search and Filters Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto whitespace-nowrap">
            Add Item
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Colors</option>
            {Array.from(new Set(clothingItems.map(item => item.main_color))).map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>

          {selectedItems.length > 0 && (
            <Button onClick={swapLocations} className="whitespace-nowrap">
              Swap Location ({selectedItems.length})
            </Button>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal isOpen={showImageModal} onClose={handleImageModalClose} isImagePreview>
        <div className="flex justify-center items-center h-full">
          <Image
            src={selectedImage}
            alt="Preview"
            width={800}
            height={800}
            className="max-w-full max-h-[80vh] object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      </Modal>

      {/* Responsive layout - side by side on desktop, stacked on mobile */}
      <div className={`flex ${windowWidth < 768 ? 'flex-col space-y-8' : 'flex-row space-x-4'}`}>
        <div className={`${windowWidth < 768 ? 'w-full' : 'w-1/2'}`}>
          <h2 className="text-2xl font-bold mb-4 text-center">London</h2>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <table className="w-full border-collapse text-black">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="py-3 px-4 w-16 text-center">Image</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">Category</th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">Color</th>
                  <th className="py-3 px-4 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.filter(item => item.location === "London").map(item => (
                  <tr 
                    key={item.id} 
                    className={`border-b border-gray-200 hover:bg-gray-100 transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-100' : ''}`}
                    onClick={() => handleCardClick(item.id)}
                  >
                    <td className="py-3 px-4 text-center">
                      <div 
                        className="relative w-12 h-12 cursor-pointer mx-auto" 
                        onClick={(e) => handleImageClick(e, getImageUrl(item))}
                      >
                        <Image
                          src={getImageUrl(item)}
                          alt={item.name}
                          fill
                          className="object-cover rounded border border-gray-300"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {getCategoryIcon(item.category)} {item.category}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <ColorBox color={item.main_color} /> {item.main_color}
                    </td>
                    <td className="py-3 px-4 flex space-x-1 justify-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(item.id);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(item.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredItems.filter(item => item.location === "London").length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">No items found in London</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${windowWidth < 768 ? 'w-full' : 'w-1/2'}`}>
          <h2 className="text-2xl font-bold mb-4 text-center">Stockholm</h2>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <table className="w-full border-collapse text-black">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="py-3 px-4 w-16 text-center">Image</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">Category</th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">Color</th>
                  <th className="py-3 px-4 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.filter(item => item.location === "Stockholm").map(item => (
                  <tr 
                    key={item.id} 
                    className={`border-b border-gray-200 hover:bg-gray-100 transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-100' : ''}`}
                    onClick={() => handleCardClick(item.id)}
                  >
                    <td className="py-3 px-4 text-center">
                      <div 
                        className="relative w-12 h-12 cursor-pointer mx-auto" 
                        onClick={(e) => handleImageClick(e, getImageUrl(item))}
                      >
                        <Image
                          src={getImageUrl(item)}
                          alt={item.name}
                          fill
                          className="object-cover rounded border border-gray-300"
                          sizes="48px"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {getCategoryIcon(item.category)} {item.category}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <ColorBox color={item.main_color} /> {item.main_color}
                    </td>
                    <td className="py-3 px-4 flex space-x-1 justify-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(item.id);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(item.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredItems.filter(item => item.location === "Stockholm").length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-4 text-center text-gray-500">No items found in Stockholm</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
          <AddClothingItem 
            onItemAdded={handleItemAdded} 
            onClose={() => {
              setIsModalOpen(false);
              setIsEditing(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Home;
