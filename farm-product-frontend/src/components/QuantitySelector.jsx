const QuantitySelector = ({quantity ,onIncrease,onDecrease,max})=>{
    return (
        <div className="flex items-center gap-3">
            <button
            type="button" 
            onClick={onDecrease}
            disabled={quantity<=1}
            className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-600 font-bold flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 active:scale-90 transition-all duration-150 hover:border-gray-400"
            >
                -
            </button>
            <span className="w-8 text-center font-semibold text-gray-800">{quantity}</span>
            <button 
            type="button"
            onClick={onIncrease}
            disabled={quantity>=max}
            className="w-9 h-9 rounded-lg border border-gray-300 bg-white text-gray-600 font-bold flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 active:scale-90 transition-all duration-150 hover:border-gray-400"
            >
                +

            </button>
        </div>
    )
}
export default QuantitySelector