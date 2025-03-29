const ColorOption = ({ color }) => {
  const colorToHex = {
    Beige: '#F5F5DC',
    Black: '#000000',
    White: '#FFFFFF',
    Navy: '#000080',
    Red: '#FF0000',
    Green: '#008000',
    Blue: '#0000FF',
    Gray: '#808080',
    Brown: '#A52A2A',
    Yellow: '#FFFF00',
  };

  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-4 h-4 border border-gray-300" 
        style={{ 
          backgroundColor: colorToHex[color] || color,
          borderColor: color === 'White' ? '#666' : undefined
        }} 
      />
      {color}
    </div>
  );
};

export default ColorOption;
