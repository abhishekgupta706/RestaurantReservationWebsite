const ProductCard = ({ title, description, image }) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  };
  
  export default ProductCard;