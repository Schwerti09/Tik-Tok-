import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

// Preisplan-Typen
interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  highlighted: boolean
  stripePriceId?: string
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '0',
    period: 'für immer',
    description: 'Für Einsteiger und neugierige Creator.',
    features: [
      '3 Videos pro Monat',
      '10 KI-Ideen pro Monat',
      'Basis-Analytics',
      'Community-Zugang',
    ],
    cta: 'Jetzt starten',
    highlighted: false,
  },
  {
    name: 'Creator',
    price: '19',
    period: 'pro Monat',
    description: 'Für aktive Creator, die regelmäßig veröffentlichen.',
    features: [
      '30 Videos pro Monat',
      '100 KI-Ideen pro Monat',
      'TrendRadar Vollzugang',
      'Erweiterte Analytics',
      'Scheduler (20 Posts)',
      'E-Mail-Support',
    ],
    cta: 'Creator werden',
    highlighted: true,
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_CREATOR,
  },
  {
    name: 'Pro',
    price: '49',
    period: 'pro Monat',
    description: 'Für professionelle Creator mit hohem Volumen.',
    features: [
      'Unbegrenzte Videos',
      'Unbegrenzte KI-Ideen',
      'Echtzeit-TrendRadar',
      'Revenue-Analytics',
      'Unbegrenzte Posts',
      'Priority-Support',
      'API-Zugang',
    ],
    cta: 'Pro starten',
    highlighted: false,
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_PRO,
  },
]

// Preisseite
const Pricing: React.FC = () => {
  const handleCheckout = async (priceId: string | undefined) => {
    if (!priceId) return
    try {
      const res = await fetch('/.netlify/functions/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const { url } = await res.json() as { url: string }
      if (url) window.location.href = url
    } catch {
      alert('Checkout konnte nicht gestartet werden. Bitte versuche es erneut.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Überschrift */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Einfache, transparente Preise
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Starte kostenlos und wechsle jederzeit zu einem höheren Plan.
            Keine versteckten Kosten.
          </p>
        </div>

        {/* Pläne */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlighted
                ? 'border-brand-500 ring-1 ring-brand-500'
                : ''}
            >
              {plan.highlighted && (
                <div className="text-center mb-4">
                  <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Beliebtester Plan
                  </span>
                </div>
              )}
              <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-white">{plan.price}€</span>
                <span className="text-gray-400 text-sm">/{plan.period}</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
              <ul className="space-y-2 mb-8">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              {plan.stripePriceId ? (
                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  size="md"
                  className="w-full"
                  onClick={() => void handleCheckout(plan.stripePriceId)}
                >
                  {plan.cta}
                </Button>
              ) : (
                <Link to="/auth?tab=register">
                  <Button variant="secondary" size="md" className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pricing
