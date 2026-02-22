import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Clock, Instagram, Youtube, Video, Calendar } from 'lucide-react'

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7
}

const scheduledPosts = {
  '2025-2-5': [{ id: 1, title: 'Morning Routine', platform: 'tiktok', time: '09:00' }],
  '2025-2-12': [{ id: 2, title: 'KI Tools Guide', platform: 'instagram', time: '12:00' }, { id: 3, title: 'Produktivitäts-Hacks', platform: 'tiktok', time: '18:00' }],
  '2025-2-19': [{ id: 4, title: 'Side Hustle Story', platform: 'youtube', time: '15:00' }],
  '2025-2-22': [{ id: 5, title: 'Geplanter Post', platform: 'tiktok', time: '20:00' }],
}

const platformIcons = {
  tiktok: { icon: Video, color: 'text-white', bg: 'bg-gray-900', label: 'TikTok' },
  instagram: { icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-600/20', label: 'Instagram' },
  youtube: { icon: Youtube, color: 'text-red-400', bg: 'bg-red-600/20', label: 'YouTube' },
}

export default function SchedulerPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [showModal, setShowModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', platform: 'tiktok', time: '12:00' })

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  const postsForDay = scheduledPosts[`${year}-${month}-${selectedDay}`] || []

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Scheduler</h1>
          <p className="text-gray-400 mt-1">Plane und automatisiere deine Veröffentlichungen</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-medium transition-colors"
        >
          <Plus size={18} />
          Neuer Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-800 transition-colors"><ChevronLeft size={18} /></button>
            <h2 className="font-semibold text-lg">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-800 transition-colors"><ChevronRight size={18} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(d => <div key={d} className="text-center text-xs text-gray-500 py-2 font-medium">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {blanks.map(i => <div key={`b${i}`} />)}
            {days.map(day => {
              const hasPosts = !!scheduledPosts[`${year}-${month}-${day}`]
              const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
              const isSelected = day === selectedDay
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-colors relative
                    ${isSelected ? 'bg-pink-600 text-white' : isToday ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                  {day}
                  {hasPosts && !isSelected && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-pink-500" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-pink-400" />
            {selectedDay}. {MONTHS[month]}
          </h2>
          {postsForDay.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock size={24} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Keine Posts geplant</p>
              <button onClick={() => setShowModal(true)} className="mt-3 text-pink-400 text-sm hover:underline">+ Post erstellen</button>
            </div>
          ) : (
            <div className="space-y-3">
              {postsForDay.map(post => {
                const { icon: PlatformIcon, color, bg, label } = platformIcons[post.platform]
                return (
                  <div key={post.id} className="bg-gray-800 rounded-xl p-4">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${bg} ${color} mb-2`}>
                      <PlatformIcon size={12} />{label}
                    </div>
                    <div className="font-medium text-sm">{post.title}</div>
                    <div className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                      <Clock size={10} /> {post.time} Uhr
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Neuen Post erstellen</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Titel</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost(p => ({ ...p, title: e.target.value }))}
                  placeholder="Post-Titel..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Plattform</label>
                <select
                  value={newPost.platform}
                  onChange={(e) => setNewPost(p => ({ ...p, platform: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Uhrzeit</label>
                <input
                  type="time"
                  value={newPost.time}
                  onChange={(e) => setNewPost(p => ({ ...p, time: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
                />
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-medium transition-colors"
              >
                Post speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
