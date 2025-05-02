'use client'
import React from 'react'
import { motion } from 'framer-motion'

export const DoodleDecoration = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 手绘风格的装饰元素 */}
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute left-0 top-0 size-full"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        {/* 手绘风格的线条 */}
        <motion.path
          d="M20,50 C30,30 70,30 80,50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-slate-300 dark:text-slate-700"
          strokeLinecap="round"
          strokeDasharray="5,5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        {/* 手绘风格的圆点 */}
        <motion.circle
          cx="25"
          cy="25"
          r="2"
          className="fill-pink-300/50"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
        <motion.circle
          cx="75"
          cy="75"
          r="2"
          className="fill-blue-300/50"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 0.7, duration: 0.5 }}
        />
        {/* 手绘风格的星星 */}
        <motion.path
          d="M80,20 l1,1 l1,-1 l-1,-1 z"
          className="fill-yellow-300/50"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 180 }}
          transition={{ delay: 1, duration: 0.7 }}
        />
        <motion.path
          d="M20,80 l1,1 l1,-1 l-1,-1 z"
          className="fill-green-300/50"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: -180 }}
          transition={{ delay: 1.2, duration: 0.7 }}
        />
      </motion.svg>
    </div>
  )
}
