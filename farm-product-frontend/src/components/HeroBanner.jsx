import { motion, useMotionValue, useTransform } from "framer-motion";
import chickenFarmCategory from "../assets/chicken_farm_category.jpg";
import countryEggs from "../assets/country_eggs.jpg";
import goatMilk from "../assets/goat_milk.jpg";

const HeroBanner = () => {
  // Mouse coordinates tracking for dynamic 3D tilt interaction
  const mouseX = useMotionValue(175);
  const mouseY = useMotionValue(150);

  // Map mouse movement to rotation degree angles
  const rotateX = useTransform(mouseY, [0, 300], [12, -12]);
  const rotateY = useTransform(mouseX, [0, 350], [-12, 12]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    // Return to center position smoothly with spring transition
    mouseX.set(175);
    mouseY.set(150);
  };

  return (
    <div className="mx-4 mt-3 rounded-3xl bg-gradient-to-br from-green-950 via-emerald-900 to-teal-950 text-white shadow-2xl border border-green-800/30 overflow-hidden relative min-h-[360px] flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6">
      {/* Glow overlays */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Left Content Column */}
      <div className="flex-1 space-y-4 text-center md:text-left z-10 max-w-lg">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          🌱 100% Organic &amp; Fresh
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-heading leading-tight drop-shadow">
          Fresh From the Village, <span className="text-emerald-400">Straight to You</span>
        </h1>
        <p className="text-emerald-100/80 text-xs md:text-sm font-medium leading-relaxed max-w-md">
          Farm-fresh milk, eggs, country chicken, and more - harvested at dawn and delivered straight to your doorstep daily.
        </p>
        
        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
          <button
            onClick={() => {
              const el = document.getElementById("featured") || document.getElementById("root");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg shadow-emerald-900/40 btn-3d"
          >
            Shop Now
          </button>
          <button
            onClick={() => {
              const el = document.getElementById("categories") || document.getElementById("root");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-extrabold text-xs px-5 py-3 rounded-xl btn-3d"
          >
            View Categories
          </button>
        </div>
      </div>

      {/* Right Column: Hardware-Accelerated 3D Parallax Showcase */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full md:w-[350px] lg:w-[380px] h-[300px] rounded-2xl relative overflow-hidden flex items-center justify-center cursor-pointer select-none perspective-[1000px]"
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-[240px] h-[240px] relative flex items-center justify-center"
        >
          {/* Layer 1: Backside Ambient Glow (translateZ: -30px) */}
          <div 
            style={{ transform: "translateZ(-30px)" }}
            className="absolute w-[180px] h-[180px] bg-emerald-500/20 rounded-full blur-2xl"
          />

          {/* Layer 2: Glassmorphic Plate (translateZ: 0px) */}
          <div 
            style={{ transform: "translateZ(0px)" }}
            className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-2xl flex items-center justify-center flex-col text-center p-4"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2 text-emerald-400">
              <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v18m9-9H3" />
              </svg>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-300">Fresh Produce</p>
            <p className="text-[10px] text-white/50 mt-0.5">Tilt to inspect</p>
          </div>

          {/* Layer 3: Floating 3D Item 1 - Eggs (translateZ: 40px) */}
          <motion.div
            style={{ transform: "translateZ(40px)" }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-2 w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-400 shadow-lg"
          >
            <img src={countryEggs} alt="Eggs" className="w-full h-full object-cover" />
          </motion.div>

          {/* Layer 3: Floating 3D Item 2 - Milk (translateZ: 50px) */}
          <motion.div
            style={{ transform: "translateZ(50px)" }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-2 left-0 w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-400 shadow-lg"
          >
            <img src={goatMilk} alt="Milk" className="w-full h-full object-cover" />
          </motion.div>

          {/* Layer 3: Floating 3D Item 3 - Chicken (translateZ: 45px) */}
          <motion.div
            style={{ transform: "translateZ(45px)" }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-4 right-4 w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400 shadow-lg"
          >
            <img src={chickenFarmCategory} alt="Chicken" className="w-full h-full object-cover" />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
