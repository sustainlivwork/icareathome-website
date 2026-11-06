import { m } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]
const VIEWPORT = { once: true, margin: '0px 0px -8% 0px' }

const groupVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

/** Fades and lifts its content into place the first time it scrolls into view. */
export function Reveal({ as = 'div', className, children, ...rest }) {
  const Component = m[as]
  return (
    <Component
      data-reveal=""
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={itemVariants}
      {...rest}
    >
      {children}
    </Component>
  )
}

/** Container whose <RevealItem> children appear one after another. */
export function RevealGroup({ as = 'div', className, children, ...rest }) {
  const Component = m[as]
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={groupVariants}
      {...rest}
    >
      {children}
    </Component>
  )
}

export function RevealItem({ as = 'div', className, children, ...rest }) {
  const Component = m[as]
  return (
    <Component data-reveal="" className={className} variants={itemVariants} {...rest}>
      {children}
    </Component>
  )
}
