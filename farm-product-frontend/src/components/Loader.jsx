const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 select-none">
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer glowing 3D-like rings */}
        <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-ping"></div>
        <div className="absolute w-12 h-12 border-2 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
        {/* Leaf SVG in the center */}
        <svg className="w-6 h-6 text-emerald-600 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 8C8 10 5.9 16.1 5.9 16.1S12 14 17 8M17 8C19.5 8 21 6.5 21 6.5S19.5 5 17 5C14.5 5 13 6.5 13 6.5S14.5 8 17 8M5 19C5 19 6.5 17.5 9 17.5C11.5 17.5 13 19 13 19S11.5 20.5 9 20.5C6.5 20.5 5 19 5 19Z" />
        </svg>
      </div>
      <p className="text-emerald-700 font-extrabold text-xs mt-4 tracking-widest uppercase font-heading animate-pulse-subtle">
        {text}
      </p>
    </div>
  );
};

export default Loader;
