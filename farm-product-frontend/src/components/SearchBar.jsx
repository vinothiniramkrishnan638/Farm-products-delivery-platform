import { useState } from "react";

const SearchBar =({onSearch,onClear})=>{
    const[query,setQuery] =useState("");

    const handleSubmit = (e) =>{
        e.preventDefault();
        if (query.trim().length ===0){
            onClear();
            return;

        }
        onSearch(query.trim());

    };
    const handleChange =(e) =>{
        const value =e.target.value;
        setQuery(value);
        if(value.trim().length ===0){
            onClear();
        } else {
            onSearch(value.trim());
        }
    };
    return (
        <form onSubmit={handleSubmit} className="px-4 py-3 bg-[#fafbfa]">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Search product or categories..."
                    className="w-full border border-green-100 bg-stone-50 rounded-full pl-4 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white shadow-inner transition-all duration-200"
                />
                <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white rounded-full w-8 h-8 flex items-center justify-center active:scale-90 transition-transform shadow-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>
        </form>
    );
};
export default SearchBar;
