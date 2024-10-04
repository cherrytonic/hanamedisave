import React from 'react'
import { motion } from 'framer-motion'

export function SplitText({
  children,
  alternate = false,
  overshoot = 5,
  style = {},
  ...rest
}) {
  let chars = children.split('')
  return chars.map((char, charIndex) => {
    let num = parseInt(char, 10)

    return (
      <div
        key={children + charIndex}
        style={{ display: 'inline-block', overflow: 'hidden', ...style }}
      >
        <motion.div
          {...rest}
          style={{
            display: 'inline-block',
            willChange: 'transform',
            position: 'relative'
          }}
          custom={charIndex}
          initial={{
            y:
              alternate && charIndex % 2 === 0
                ? // ? `${-(num - 1) * 100}%`
                  // : `${(num - 1) * 100}%`
                  `${-overshoot * 100}%`
                : `${overshoot * 100}%`
          }}
          animate={{ y: 0 }}
          transition={{
            type: 'spring',
            velocity: 1,
            damping: 200
          }}
          // transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {Array(overshoot)
            .fill(null)
            .map((_, i) => {
              let n = alternate && charIndex % 2 === 0 ? num + i : num - i
              if (n > 9) n = n - 10
              if (n < 0) n = n + 10
              return (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    position: n === num ? 'static' : 'absolute',
                    left: 0,
                    top:
                      alternate && charIndex % 2 === 0
                        ? `${i * 100}%`
                        : `${-i * 100}%`
                  }}
                >
                  {n}
                </span>
              )
            })}
        </motion.div>
      </div>
    )
  })
}