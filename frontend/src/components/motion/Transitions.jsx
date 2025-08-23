import { motion } from 'framer-motion'

export function FadeIn({ children, delay = 0, style }) {
    return (
        <motion.div
            style={style}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay }}
        >
            {children}
        </motion.div>
    )
}

export function ScaleOnHover({ children }) {
    return (
        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            {children}
        </motion.div>
    )
}

export default { FadeIn, ScaleOnHover }


