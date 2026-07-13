import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import chickenFarmCategory from "../assets/chicken_farm_category.jpg";
import freshWaterPrawn from "../assets/fresh_water_prawn.jpg";

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [category]);

  const handleClick = () => {
    navigate(`/category/${category.id}`);
  };

  const getCategoryImage = () => {
    if (category.category_name) {
      const name = category.category_name.toLowerCase();
      if (name.includes("chicken farm")) return chickenFarmCategory;
      if (name.includes("fresh water prawn")) return freshWaterPrawn;
    }
    return category.category_image;
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col items-center text-center cursor-pointer hover-card-effect active:scale-95 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden bg-green-100 flex items-center justify-center mb-2">
        {!imgError && getCategoryImage() ? (
          <img
            src={getCategoryImage()}
            alt={category.category_name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-green-700 font-bold text-lg">
            {category.category_name?.charAt(0)}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-tight">{category.category_name}</p>
      <p className="text-xs text-gray-400 mt-0.5">{category.product_count ?? 0} products</p>
    </div>
  );
};

export default CategoryCard;