import { LazyMotion, MotionConfig } from 'motion/react'

// Animation features are downloaded after the page is shown, keeping the
// first load small. `reducedMotion="user"` turns off movement for visitors
// who prefer reduced motion in their operating system settings.
const loadFeatures = () => import('./motion-features.js').then((module) => module.default)

export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
