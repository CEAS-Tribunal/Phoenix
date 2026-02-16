import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";

interface Event {
  date: string;
  title: string;
  description: string;
  link?: string;
}

interface UpcomingEventsSectionProps {
  events?: Event[];
}

const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({
  events = [],
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section className="w-full bg-white py-16">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-[40px] font-bold text-black">Upcoming Events</h2>
          <p className="text-gray-600 text-lg mt-2">
            Stay connected with CEAS Tribunal activities
          </p>
        </motion.div>

        {/* Events Grid or Empty State */}
        {events.length === 0 ? (
          <motion.p
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 italic text-center mt-12"
          >
            No upcoming events at the moment. Check back soon!
          </motion.p>
        ) : (
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {events.map((event, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Date Badge */}
                <div className="inline-block bg-[#E00122] text-white rounded-full px-4 py-1 text-sm font-semibold">
                  {event.date}
                </div>

                {/* Event Title */}
                <h3 className="text-[20px] font-bold text-[#333333] mt-4">
                  {event.title}
                </h3>

                {/* Event Description */}
                <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                  {event.description}
                </p>

                {/* Learn More Link */}
                {event.link && (
                  <a
                    href={event.link}
                    className="inline-flex items-center gap-1 text-[#E00122] text-sm font-medium mt-4 hover:underline"
                  >
                    Learn More
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
