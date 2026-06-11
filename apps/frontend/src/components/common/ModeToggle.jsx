import React from 'react'
import { useMode } from '../../context/ModeContext'

function ModeToggle() {
  const { isB2B, toggleMode } = useMode()

  return (
    <div className="flex items-center gap-2 select-none">
      {/* Retail label */}
      <span
        className={`text-xs font-semibold transition-colors duration-300 ${
          !isB2B ? 'text-green-700' : 'text-gray-400'
        }`}
      >
        Retail
      </span>

      {/* Toggle button */}
      <button
        onClick={toggleMode}
        role="switch"
        aria-checked={isB2B}
        aria-label="Toggle between B2C Retail and B2B Wholesale mode"
        className={`relative inline-flex items-center w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 shadow-inner ${
          isB2B
            ? 'bg-gradient-to-r from-amber-500 to-amber-600 focus:ring-amber-400'
            : 'bg-gradient-to-r from-green-500 to-green-700 focus:ring-green-400'
        }`}
      >
        {/* Sliding pill */}
        <span
          className={`absolute left-0.5 top-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
            isB2B ? 'translate-x-7' : 'translate-x-0'
          }`}
        >
          {isB2B ? (
            <span className="text-amber-500 text-xs font-bold">W</span>
          ) : (
            <span className="text-green-600 text-xs font-bold">R</span>
          )}
        </span>

        {/* Mode icon inside track */}
        <span className={`absolute text-white text-xs font-bold pointer-events-none transition-opacity duration-300 ${isB2B ? 'left-2 opacity-100' : 'left-2 opacity-0'}`}>
          B2B
        </span>
        <span className={`absolute text-white text-xs font-bold pointer-events-none transition-opacity duration-300 ${!isB2B ? 'right-1.5 opacity-100' : 'right-1.5 opacity-0'}`}>
          B2C
        </span>
      </button>

      {/* Wholesale label */}
      <span
        className={`text-xs font-semibold transition-colors duration-300 ${
          isB2B ? 'text-amber-600' : 'text-gray-400'
        }`}
      >
        Wholesale
      </span>
    </div>
  )
}

export default ModeToggle
