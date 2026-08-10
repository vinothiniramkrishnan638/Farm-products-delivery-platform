import { motion } from "framer-motion";

const SummaryCard = ({ label, value, color, theme }) => {
  const shadowColor = theme === "blue" ? "rgba(59, 130, 246, 0.15)" : "rgba(16, 185, 129, 0.12)";
  const borderHover = theme === "blue" ? "hover:border-blue-200/50" : "hover:border-emerald-200/50";

  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        rotateY: 6,
        rotateX: -4,
        z: 25,
        boxShadow: `0px 15px 30px ${shadowColor}`,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={`bg-white rounded-2xl border border-gray-100/75 shadow-sm p-5 cursor-default select-none ${borderHover} transition-colors`}
    >
      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-extrabold mt-1 font-heading ${color || "text-gray-800"}`}>{value}</p>
    </motion.div>
  );
};

export default SummaryCard;