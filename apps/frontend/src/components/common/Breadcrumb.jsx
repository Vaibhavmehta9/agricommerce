import React from 'react'
import { Link } from 'react-router-dom'
import { FiChevronRight, FiHome } from 'react-icons/fi'

function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center space-x-1 text-sm" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center text-green-600 hover:text-green-800 transition-colors font-medium"
      >
        <FiHome className="w-3.5 h-3.5" />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <React.Fragment key={index}>
            <FiChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            {isLast || !item.href ? (
              <span
                className={`font-medium truncate max-w-[160px] sm:max-w-xs ${
                  isLast ? 'text-gray-600' : 'text-green-600 hover:text-green-800'
                }`}
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-green-600 hover:text-green-800 transition-colors font-medium truncate max-w-[160px] sm:max-w-xs"
                title={item.label}
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
