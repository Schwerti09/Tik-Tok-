import { TrendingUp, Users, Heart, DollarSign, ArrowUpRight } from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const viewsData = [
  { name: 'Jan', views: 12400, followers: 1200 },
  { name: 'Feb', views: 18200, followers: 1800 },
  { name: 'Mär', views: 15800, followers: 2200 },
  { name: 'Apr', views: 24600, followers: 3100 },
  { name: 'Mai', views: 31200, followers: 4200 },
  { name: 'Jun', views: 28400, followers: 5000 },
  { name: 'Jul', views: 42000, followers: 6800 },
]

const contentPerf = [
  { name: 'Morning Routine', views: 12400, likes: 1840, comments: 320 },
  { name: 'KI Tools', views: 9800, likes: 1560, comments: 280 },
  { name: 'Produktivität', views: 8200, likes: 1120, comments: 190 },
  { name: 'Side Hustle', views: 15600, likes: 2340, comments: 450 },
  { name: 'Editing Tips', views: 7400, likes: 980, comments: 150 },
]

const sales = [
  { product: 'Productivity Course', sales: 42, revenue: '2.100€', trend: '+12%' },
  { product: 'Creator Toolkit', sales: 31, revenue: '1.550€', trend: '+8%' },
  { product: 'KI Workshop', sales: 18, revenue: '1.800€', trend: '+23%' },
  { product: 'Affiliate Links', sales: 156, revenue: '780€', trend: '+5%' },
]

const colorClasses = {
  pink: { bg: 'bg-pink-600/20', text: 'text-pink-400' },
  violet: { bg: 'bg-violet-600/20', text: 'text-violet-400' },
  red: { bg: 'bg-red-600/20', text: 'text-red-400' },
  green: { bg: 'bg-green-600/20', text: 'text-green-400' },
}

const stats = [
  { icon: TrendingUp, label: 'Gesamte Views', value: '182.6K', change: '+18%', color: 'pink' },
  { icon: Users, label: 'Follower', value: '6.8K', change: '+34%', color: 'violet' },
  { icon: Heart, label: 'Engagement Rate', value: '8.4%', change: '+1.2%', color: 'red' },
  { icon: DollarSign, label: 'Monatlicher Umsatz', value: '6.230€', change: '+23%', color: 'green' },
]

const tooltipStyle = { backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#f9fafb' }

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-400 mt-1">Deine Performance im Überblick</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, change, color }) => (
          <div key={label} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className={`w-10 h-10 rounded-xl ${colorClasses[color].bg} flex items-center justify-center mb-4`}>
              <Icon size={20} className={colorClasses[color].text} />
            </div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-gray-400 text-sm mb-2">{label}</div>
            <div className="flex items-center gap-1 text-green-400 text-xs"><ArrowUpRight size={12} />{change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="font-semibold mb-6">Views & Follower (2025)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#ec4899" strokeWidth={2} dot={false} name="Views" />
              <Line type="monotone" dataKey="followers" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Follower" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="font-semibold mb-6">Content-Performance</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={contentPerf}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="views" fill="#ec4899" radius={[4, 4, 0, 0]} name="Views" />
              <Bar dataKey="likes" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Likes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h2 className="font-semibold mb-6">Verkaufs-Tracking</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                <th className="pb-3 font-medium">Produkt</th>
                <th className="pb-3 font-medium">Verkäufe</th>
                <th className="pb-3 font-medium">Umsatz</th>
                <th className="pb-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {sales.map(row => (
                <tr key={row.product} className="text-sm">
                  <td className="py-4 font-medium">{row.product}</td>
                  <td className="py-4 text-gray-400">{row.sales}</td>
                  <td className="py-4 text-gray-300">{row.revenue}</td>
                  <td className="py-4 text-green-400">
                    <span className="flex items-center gap-1"><ArrowUpRight size={12} />{row.trend}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
