import { useState } from 'react'
import { useAuth } from '../context/useAuth'
import { apiClient } from '../services/api'

const plans = [
  {
    tier: 'creator',
    name: 'Creator',
    price: '$9',
    period: '/mo',
    features: [
      'Trend Scanner',
      '50 AI ideas/month',
      '5 GB video storage',
      'Basic analytics',
      'Community access',
    ],
    highlight: false,
  },
  {
    tier: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/mo',
    features: [
      'Everything in Creator',
      'Unlimited AI ideas',
      '50 GB video storage',
      'Advanced analytics',
      'Priority processing',
      'Mentor matching',
    ],
    highlight: true,
  },
  {
    tier: 'business',
    name: 'Business',
    price: '$79',
    period: '/mo',
    features: [
      'Everything in Pro',
      'Unlimited storage',
      'Team seats (5)',
      'White-label exports',
      'API access',
      'Dedicated support',
    ],
    highlight: false,
  },
]

export default function PricingPage() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState('')

  const subscribe = async (tier) => {
    setError('')
    setLoading(tier)
    try {
      const data = await apiClient(token).post('/api/stripe/create-checkout-session', { tier })
      if (data.url) window.location.href = data.url
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>💳 Pricing</h1>
        <p className="page-sub">Choose the plan that fits your growth goals</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="pricing-grid">
        {plans.map((plan) => (
          <div key={plan.tier} className={'pricing-card' + (plan.highlight ? ' pricing-card--highlight' : '')}>
            {plan.highlight && <div className="pricing-badge">Most popular</div>}
            <div className="pricing-name">{plan.name}</div>
            <div className="pricing-price">
              {plan.price}<span>{plan.period}</span>
            </div>
            <ul className="pricing-features">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <button
              className={'btn btn-full ' + (plan.highlight ? 'btn-primary' : 'btn-ghost')}
              onClick={() => subscribe(plan.tier)}
              disabled={loading === plan.tier}
            >
              {loading === plan.tier ? 'Redirecting…' : `Get ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
