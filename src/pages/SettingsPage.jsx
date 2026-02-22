import { useState } from 'react'
import { User, CreditCard, Bell, Star, Check, Zap, Building2, Plus, Trash2 } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'subscription', label: 'Abonnement', icon: Star },
  { id: 'payment', label: 'Zahlungsmethoden', icon: CreditCard },
  { id: 'notifications', label: 'Benachrichtigungen', icon: Bell },
]

const plans = [
  { id: 'free', name: 'Free', price: '0€', icon: Zap, features: ['5 Clips/Monat', 'Basis-Features'] },
  { id: 'pro', name: 'Pro', price: '29€', icon: Star, features: ['50 Clips/Monat', 'Alle Core-Features', 'Analytics'] },
  { id: 'business', name: 'Business', price: '99€', icon: Building2, features: ['Unbegrenzte Clips', 'Team-Verwaltung', 'API-Zugang'] },
]

const notifications = [
  { id: 'trends', label: 'Neue Trends erkannt', desc: 'Benachrichtigungen wenn neue Trends erkannt werden' },
  { id: 'processing', label: 'Clip-Verarbeitung abgeschlossen', desc: 'Wenn ein Clip fertig bearbeitet wurde' },
  { id: 'scheduled', label: 'Geplante Posts', desc: '30 Minuten vor Veröffentlichung' },
  { id: 'community', label: 'Community-Antworten', desc: 'Wenn jemand auf deinen Beitrag antwortet' },
  { id: 'billing', label: 'Rechnungen & Zahlungen', desc: 'Wichtige Informationen zu deinem Abo' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({ name: 'Max Mustermann', email: 'max@example.com', bio: 'TikTok Creator & Produktivitäts-Enthusiast 🚀' })
  const [currentPlan, setCurrentPlan] = useState('pro')
  const [notif, setNotif] = useState({ trends: true, processing: true, scheduled: true, community: false, billing: true })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Einstellungen</h1>
        <p className="text-gray-400 mt-1">Verwalte dein Profil und Abonnement</p>
      </div>

      <div className="flex gap-6">
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === id ? 'bg-pink-600 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-white'}`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
              <h2 className="font-semibold text-xl mb-6">Profil bearbeiten</h2>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-pink-600 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {profile.name[0]}
                </div>
                <div>
                  <button className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm font-medium transition-colors">
                    Bild ändern
                  </button>
                  <p className="text-gray-500 text-xs mt-2">JPG, PNG oder GIF – max. 5MB</p>
                </div>
              </div>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">E-Mail</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white resize-none focus:outline-none focus:border-pink-500 transition-colors"
                  />
                </div>
                <button className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 font-medium transition-colors">
                  Änderungen speichern
                </button>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
              <h2 className="font-semibold text-xl mb-6">Abonnement verwalten</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map(({ id, name, price, icon: Icon, features }) => (
                  <div key={id} className={`p-6 rounded-2xl border ${currentPlan === id ? 'border-pink-500 bg-pink-600/10' : 'border-gray-800'}`}>
                    <Icon size={20} className={currentPlan === id ? 'text-pink-400 mb-3' : 'text-gray-400 mb-3'} />
                    <div className="font-bold text-lg mb-1">{name}</div>
                    <div className="text-2xl font-bold mb-4">{price}<span className="text-gray-400 text-sm font-normal">/Mo.</span></div>
                    <ul className="space-y-2 mb-6">
                      {features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check size={14} className="text-green-400 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setCurrentPlan(id)}
                      className={`w-full py-2 rounded-xl text-sm font-medium transition-colors ${currentPlan === id ? 'bg-pink-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                      {currentPlan === id ? '✓ Aktueller Plan' : 'Wechseln'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-xl">Zahlungsmethoden</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-sm font-medium transition-colors">
                  <Plus size={14} />
                  Karte hinzufügen
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { last4: '4242', brand: 'Visa', expiry: '12/26', default: true },
                  { last4: '5555', brand: 'Mastercard', expiry: '08/25', default: false },
                ].map(card => (
                  <div key={card.last4} className="flex items-center gap-4 bg-gray-800 rounded-xl p-4">
                    <div className="w-12 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                      {card.brand[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{card.brand} ···· {card.last4}</div>
                      <div className="text-xs text-gray-500">Läuft ab {card.expiry}</div>
                    </div>
                    {card.default && <span className="px-2 py-1 rounded-full bg-green-600/20 text-green-400 text-xs font-medium">Standard</span>}
                    <button className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
              <h2 className="font-semibold text-xl mb-6">Benachrichtigungen</h2>
              <div className="space-y-4">
                {notifications.map(({ id, label, desc }) => (
                  <div key={id} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{desc}</div>
                    </div>
                    <button
                      onClick={() => setNotif(n => ({ ...n, [id]: !n[id] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notif[id] ? 'bg-pink-600' : 'bg-gray-700'}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${notif[id] ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
