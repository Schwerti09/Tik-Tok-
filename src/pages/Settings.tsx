import React, { useState } from 'react'
import { Settings as SettingsIcon, User, CreditCard, Bell, Shield, Check } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/stores/appStore'
import type { SubscriptionPlan } from '@/types'

const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '5 video uploads/month',
      'Basic analytics',
      '10 AI ideas/month',
      'Community access',
    ],
    stripePriceId: '',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    features: [
      'Unlimited video uploads',
      'Advanced analytics + emotions',
      'Unlimited AI ideas',
      'AI enhancement & transcription',
      'Auto-scheduling',
      'Priority support',
    ],
    stripePriceId: 'price_pro_monthly',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'White-label reports',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
    ],
    stripePriceId: 'price_enterprise_monthly',
  },
]

export const Settings: React.FC = () => {
  const { user } = useAuthStore()
  const { addNotification } = useAppStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'notifications' | 'security'>(
    'profile'
  )
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  })

  const handleSaveProfile = () => {
    addNotification({ type: 'success', message: 'Profile updated successfully' })
  }

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    if (!plan.stripePriceId) return

    try {
      const res = await fetch('/.netlify/functions/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.stripePriceId, userId: user?.id }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      addNotification({ type: 'error', message: 'Failed to start checkout' })
    }
  }

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
  ] as const

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-neutral-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Sidebar tabs */}
        <div className="lg:w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-pink-500/20 to-pink-500/10 text-white border border-pink-500/20'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card p-6 space-y-5">
              <h2 className="text-white font-semibold">Profile Information</h2>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
                  {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
                </div>
                <Button variant="secondary" size="sm">Change Photo</Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-300 font-medium mb-2 block">Full Name</label>
                  <input
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm((f) => ({ ...f, full_name: e.target.value }))}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-pink-500/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-neutral-300 font-medium mb-2 block">Email</label>
                  <input
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                    type="email"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-pink-500/50 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-4">
              <div className="card p-4 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border-pink-500/20">
                <p className="text-sm text-neutral-300">
                  Current plan:{' '}
                  <span className="text-pink-400 font-semibold capitalize">
                    {user?.subscription_tier || 'Free'}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const isCurrent = user?.subscription_tier === plan.id
                  return (
                    <div
                      key={plan.id}
                      className={`card p-5 flex flex-col ${
                        plan.id === 'pro' ? 'border-pink-500/30' : ''
                      }`}
                    >
                      {plan.id === 'pro' && (
                        <span className="text-xs bg-gradient-to-r from-pink-500 to-cyan-400 text-white px-2 py-0.5 rounded-full w-fit mb-3 font-medium">
                          Most Popular
                        </span>
                      )}
                      <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                      <div className="mt-1 mb-4">
                        <span className="text-3xl font-bold text-white">${plan.price}</span>
                        {plan.price > 0 && (
                          <span className="text-neutral-500 text-sm">/{plan.interval}</span>
                        )}
                      </div>
                      <ul className="space-y-2 flex-1 mb-4">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-neutral-300">
                            <Check size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={isCurrent ? 'secondary' : plan.id === 'pro' ? 'primary' : 'outline'}
                        className="w-full"
                        disabled={isCurrent}
                        onClick={() => handleUpgrade(plan)}
                        size="sm"
                      >
                        {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-6 space-y-4">
              <h2 className="text-white font-semibold">Notification Preferences</h2>
              {[
                { label: 'Video processing complete', desc: 'Get notified when your video is ready' },
                { label: 'New trend alerts', desc: 'Daily digest of trending topics' },
                { label: 'Analytics reports', desc: 'Weekly performance summary' },
                { label: 'Community mentions', desc: 'When someone mentions you' },
                { label: 'Schedule reminders', desc: '1 hour before a scheduled post' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-neutral-500 text-xs mt-0.5">{desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-500"></div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6 space-y-5">
              <h2 className="text-white font-semibold">Security</h2>
              <div>
                <label className="text-sm text-neutral-300 font-medium mb-2 block">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-pink-500/50 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium mb-2 block">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-pink-500/50 text-sm"
                />
              </div>
              <div>
                <label className="text-sm text-neutral-300 font-medium mb-2 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-pink-500/50 text-sm"
                />
              </div>
              <Button>Update Password</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
