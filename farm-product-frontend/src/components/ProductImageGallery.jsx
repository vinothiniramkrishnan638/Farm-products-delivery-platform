import { useState, useEffect } from "react";

const ProductImageGallery = ({ images, productName }) => {
  const imageList = images && images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setImgError(false);
  }, [images]);

  const activeImage = imageList[activeIndex];

  return (
    <div className="w-full">
      <div className="w-full h-72 md:h-96 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100">
        {!imgError && activeImage ? (
          <img
            src={activeImage}
            alt={productName}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain bg-gray-50 p-2"
          />
        ) : (
          <span className="text-gray-400 text-sm font-medium">No Image Available</span>
        )}
      </div>

      {imageList.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {imageList.map((img, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setImgError(false);
              }}
              className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 ${
                index === activeIndex ? "border-green-600" : "border-gray-200"
              }`}
            >
              <img src={img} alt={`${productName} ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;