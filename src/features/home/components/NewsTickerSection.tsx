/**
 * NewsTickerSection – Minimal full-width circulating news ticker.
 * One row of items (title + optional date), seamless loop via Framer Motion.
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export interface NewsItem {
  title: string;
  date?: string;
  link?: string;
}

interface NewsTickerSectionProps {
  items?: NewsItem[];
}

const NewsTickerSection: React.FC<NewsTickerSectionProps> = ({
  items = [],
}) => {
  if (items.length === 0) return null;

  const duration = 35;
  const duplicated = [...items, ...items];

  return (
    <section
      className="w-full bg-[#F9FAFB] border-y border-gray-200 py-3"
      aria-label="News and updates"
    >
      <div className="flex items-center overflow-hidden">
        {/* Fixed label */}
        <div className="shrink-0 pl-4 sm:pl-6 lg:pl-8 pr-6 sm:pr-8">
          <span className="text-[#E00122] text-xs font-semibold uppercase tracking-wide whitespace-nowrap">
            News
          </span>
        </div>

        {/* Scrolling row */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <motion.div
            className="flex items-center gap-8 sm:gap-12"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration,
                ease: "linear",
              },
            }}
          >
            {duplicated.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="shrink-0 flex items-center gap-3"
              >
                {item.link ? (
                  <Link
                    to={item.link}
                    className="text-[#333333] text-sm font-medium hover:text-[#E00122] transition-colors whitespace-nowrap"
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span className="text-[#333333] text-sm font-medium whitespace-nowrap">
                    {item.title}
                  </span>
                )}
                {item.date && (
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {item.date}
                  </span>
                )}
                <span
                  className="text-gray-300 shrink-0"
                  aria-hidden
                >
                  •
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsTickerSection;
