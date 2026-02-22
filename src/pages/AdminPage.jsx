import { Users, DollarSign, Video, Activity, Search, MoreVertical, CheckCircle, AlertCircle } from 'lucide-react'

const stats = [
  { icon: Users, label: 'Gesamt-Nutzer', value: '1.247', change: '+48 diese Woche', color: 'blue' },
  { icon: DollarSign, label: 'Monatlicher Umsatz', value: '18.420€', change: '+12% MoM', color: 'green' },
  { icon: Video, label: 'Clips verarbeitet', value: '8.934', change: '+234 heute', color: 'pink' },
  { icon: Activity, label: 'Aktive Nutzer (24h)', value: '342', change: '27% des Totals', color: 'violet' },
]

const users = [
  { id: 1, name: 'Max Mustermann', email: 'max@example.com', plan: 'Pro', clips: 28, status: 'active', joined: '15. Jan 2025' },
  { id: 2, name: 'Lisa Schmidt', email: 'lisa@example.com', plan: 'Business', clips: 145, status: 'active', joined: '3. Feb 2025' },
  { id: 3, name: 'Tom Wagner', email: 'tom@example.com', plan: 'Free', clips: 4, status: 'active', joined: '20. Feb 2025' },
  { id: 4, name: 'Anna Bauer', email: 'anna@example.com', plan: 'Pro', clips: 42, status: 'suspended', joined: '8. Jan 2025' },
  { id: 5, name: 'Felix Müller', email: 'felix@example.com', plan: 'Free', clips: 2, status: 'active', joined: '21. Feb 2025' },
]

const systemServices = [
  { name: 'API Server', status: 'online', latency: '42ms' },
  { name: 'Video Processing Queue', status: 'online', latency: '120ms' },
  { name: 'Database', status: 'online', latency: '8ms' },
  { name: 'Storage Service', status: 'degraded', latency: '340ms' },
  { name: 'AI Service', status: 'online', latency: '580ms' },
]

const planColors = { Free: 'text-gray-400 bg-gray-800', Pro: 'text-violet-400 bg-violet-600/20', Business: 'text-amber-400 bg-amber-600/20' }
const statusColors = { active: 'text-green-400 bg-green-600/20', suspended: 'text-red-400 bg-red-600/20' }
const serviceColors = { online: 'text-green-400', degraded: 'text-amber-400', offline: 'text-red-400' }

export default function AdminPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Admin</h1>
          <span className="px-2 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-medium">Administrator</span>
        </div>
        <p className="text-gray-400">Systemübersicht und Nutzerverwaltung</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, change, color }) => (
          <div key={label} className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className={`w-10 h-10 rounded-xl bg-${color}-600/20 flex items-center justify-center mb-4`}>
              <Icon size={20} className={`text-${color}-400`} />
            </div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-gray-400 text-sm mb-1">{label}</div>
            <div className="text-gray-500 text-xs">{change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-lg">Nutzer</h2>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Suchen..."
                className="pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
                  <th className="pb-3 font-medium">Nutzer</th>
                  <th className="pb-3 font-medium">Plan</th>
                  <th className="pb-3 font-medium">Clips</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map(user => (
                  <tr key={user.id} className="text-sm">
                    <td className="py-4">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${planColors[user.plan]}`}>{user.plan}</span>
                    </td>
                    <td className="py-4 text-gray-400">{user.clips}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                        {user.status === 'active' ? 'Aktiv' : 'Gesperrt'}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="text-gray-500 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="font-semibold text-lg mb-6">System-Status</h2>
          <div className="space-y-4">
            {systemServices.map(service => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {service.status === 'online' ? (
                    <CheckCircle size={14} className="text-green-400" />
                  ) : (
                    <AlertCircle size={14} className="text-amber-400" />
                  )}
                  <span className="text-sm">{service.name}</span>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium ${serviceColors[service.status]}`}>
                    {service.status === 'online' ? 'Online' : 'Beeinträchtigt'}
                  </div>
                  <div className="text-gray-500 text-xs">{service.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
