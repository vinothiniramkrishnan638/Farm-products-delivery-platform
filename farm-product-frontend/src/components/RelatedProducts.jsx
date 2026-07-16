import ProductCard from "./ProductCard";

const RelatedProducts = ({title ,products})=>{
    if (!products || products.length ===0){
        return null;

    }
    return(
        <div className="mt-8">
            <p className="font-bold text-gray-800 mb-3 text-lg font-heding">{title}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {products.map((product)=>(
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>

        </div>
    )
}
export default RelatedProducts;