import { motion } from "framer-motion";

const StatsCard = ({ title, value, subtitle, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon size={24} />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="mt-3 text-xs text-gray-400 font-medium">{subtitle}</p>
      )}
    </motion.div>
  );
};

export default StatsCard;
