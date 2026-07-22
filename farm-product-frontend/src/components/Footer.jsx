const Footer = () => {
    return (
        <div className="bg-gradient-to-br from-green-800 via-green-900 to-emerald-950 text-white text-center py-8 px-4 mt-12 border-t border-green-700/30 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-lg">🌾</span>
                <p className="font-extrabold tracking-wide text-base font-heading">Village Fresh Farm Platform</p>
                <span className="text-lg">🌿</span>
            </div>
            <p className="text-xs text-green-200/90 font-medium">Directly connecting organic village farms to your doorstep</p>
            <div className="w-12 h-0.5 bg-green-500/40 mx-auto my-3 rounded-full"></div>
            <p className="text-xs text-gray-400 font-medium">© 2026 Fresh Farm Products. All rights reserved.</p>
        </div>
    );
};
export default Footer;