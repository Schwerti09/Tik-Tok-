import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { apiFetch } from '../api';

const tiers = [
  {
    id: 'creator',
    name: 'Creator',
    price: '$9/mo',
    features: ['5 idea generations/day', '10 scheduled posts', 'Basic analytics', 'Community access'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29/mo',
    features: ['Unlimited idea generations', 'Unlimited scheduling', 'Advanced analytics', 'Video processing', 'Priority support'],
    highlight: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '$79/mo',
    features: ['Everything in Pro', 'Team collaboration', 'Custom branding', 'Dedicated account manager', 'API access'],
  },
];

export default function PricingPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  async function subscribe(tier) {
    setLoading(tier);
    setError('');
    try {
      const res = await apiFetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ tier }),
      }, token);
      if (!res.ok) throw new Error('Failed to start checkout');
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading('');
    }
  }

  async function openPortal() {
    setLoading('portal');
    try {
      const res = await apiFetch('/api/stripe/create-portal-session', { method: 'POST' }, token);
      if (!res.ok) throw new Error('Failed to open billing portal');
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading('');
    }
  }

  return (
    <div className="page">
      <h1>💎 Pricing Plans</h1>
      <p className="page-subtitle">Choose the plan that fits your creator journey.</p>
      {error && <div className="error-msg">{error}</div>}
      <div className="pricing-grid">
        {tiers.map(tier => (
          <div key={tier.id} className={`pricing-card${tier.highlight ? ' highlight' : ''}`}>
            {tier.highlight && <div className="popular-badge">Most Popular</div>}
            <h2>{tier.name}</h2>
            <div className="tier-price">{tier.price}</div>
            <ul>
              {tier.features.map(f => <li key={f}>✓ {f}</li>)}
            </ul>
            <button
              onClick={() => subscribe(tier.id)}
              disabled={loading === tier.id}
            >
              {loading === tier.id ? 'Redirecting...' : `Get ${tier.name}`}
            </button>
          </div>
        ))}
      </div>
      <div className="billing-portal">
        <button className="btn-outline" onClick={openPortal} disabled={loading === 'portal'}>
          {loading === 'portal' ? 'Opening...' : 'Manage Billing'}
        </button>
      </div>
    </div>
  );
}
