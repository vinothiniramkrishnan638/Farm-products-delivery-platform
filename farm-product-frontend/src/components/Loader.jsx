const Loader = ({text ="Loading ....."})=>{
    return(
        <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm mt-3">{text}</p>
        </div>
    );
};
export default Loader;
