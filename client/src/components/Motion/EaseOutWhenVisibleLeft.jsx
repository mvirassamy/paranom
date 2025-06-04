import { motion } from "framer-motion";

export const EaseOutWhenVisibleLeft = ({children}) => {
        return (
            <motion.div
                initial={{ opacity: 0, x: -50, hidden: true }}
                whileInView="visible"
                viewport={{ once: true }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ease: "easeOut", duration: 2}}
                variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 }
                }}
            >
                {children}
            </motion.div>
        );
}