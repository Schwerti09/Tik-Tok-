import React from 'react'
import { Card } from '@/components/ui/Card'

interface UsageCardProps {
  label: string
  used: number
  total: number
  unit?: string
}

// Karte zur Anzeige des Nutzungskontingents (z.B. Videos, API-Aufrufe)
export const UsageCard: React.FC<UsageCardProps> = ({ label, used, total, unit = '' }) => {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0
  const color =
    percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-brand-500'

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm font-medium text-gray-200">
          {used}{unit} / {total}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1.5">{percentage.toFixed(0)}% verwendet</p>
    </Card>
  )
}
