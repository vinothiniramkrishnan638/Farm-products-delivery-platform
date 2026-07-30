import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <motion.div
      onClick={handleClick}
      whileHover={{
        scale: 1.04,
        rotateY: 8,
        rotateX: -6,
        z: 30,
        boxShadow: "0px 20px 40px rgba(16, 185, 129, 0.15)",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className="bg-white rounded-xl border border-gray-100/60 p-4 flex flex-col items-center text-center cursor-pointer active:scale-95 shadow-sm hover:border-emerald-200/60 transition-colors"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden bg-green-50 flex items-center justify-center mb-3 ring-2 ring-green-100 shadow-inner">
        {!imgError && getCategoryImage() ? (
          <img
            src={getCategoryImage()}
            alt={category.category_name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          <span className="text-green-700 font-bold text-lg">
            {category.category_name?.charAt(0)}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-tight">{category.category_name}</p>
      <p className="text-xs text-gray-400 mt-1">{category.product_count ?? 0} products</p>
    </motion.div>
  );
};

export default CategoryCard;