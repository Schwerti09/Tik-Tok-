import React from 'react'

interface CardProps {
  className?: string
  children: React.ReactNode
}

// Einfache Karten-Komponente mit einheitlichem Stil
export const Card: React.FC<CardProps> = ({ className = '', children }) => (
  <div
    className={`bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm ${className}`}
  >
    {children}
  </div>
)

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className="text-base font-semibold text-gray-100">{title}</h3>
      {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
)
