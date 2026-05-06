'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Card, Button } from '@hips/ui'
import { CheckoutDonationInput } from '@hips/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

const DONATION_TIERS = [
  {
    id: 'sponsor_session',
    name: 'Sponsor a Session',
    amount: 10000,
    displayAmount: '$100',
    description: 'Cover one peer support session for someone in need',
    icon: (
      <svg className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    id: 'restore_session',
    name: 'Restore a Session',
    amount: 25000,
    displayAmount: '$250',
    description: 'Fund a crisis de-escalation session with full support',
    icon: (
      <svg className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    id: 'restore_leader',
    name: 'Restore a Leader',
    amount: 50000,
    displayAmount: '$500',
    description: 'Support training and certifying a new peer support leader',
    icon: (
      <svg className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 4.472c1.548 0 3.045.187 4.5.576m-15.482 0a50.697 50.697 0 017.74-3.342M6.75 15v-3.675a55.38 55.38 0 013.472-.576m15.482 0a50.697 50.697 0 017.74-3.342M12 10.5a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    ),
  },
  {
    id: 'custom',
    name: 'Custom Amount',
    amount: 0,
    displayAmount: 'Any',
    description: 'Give what you can — every dollar makes a difference',
    icon: (
      <svg className="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

interface DonationFormProps {
  clientSecret: string
  amount: number
  tier: string
}

function DonationForm({ clientSecret, amount, tier }: DonationFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'An error occurred')
      setIsProcessing(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/donate?success=true&amount=${amount}`,
      },
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      {error && (
        <div className="rounded-lg bg-semantic-error/10 border border-semantic-error/20 p-4">
          <p className="text-sm text-semantic-error">{error}</p>
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isProcessing}
        disabled={!stripe}
        className="w-full"
      >
        Donate {amount && `$${(amount / 100).toFixed(2)}`}
      </Button>
    </form>
  )
}

function SuccessMessage({ amount }: { amount: number }) {
  return (
    <div className="text-center py-12 space-y-6">
      <div className="mx-auto w-20 h-20 rounded-full bg-semantic-success/10 flex items-center justify-center">
        <svg className="h-10 w-10 text-semantic-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">Thank you for your generosity!</h2>
        <p className="mt-2 text-neutral-600">
          Your donation of <span className="font-semibold text-brand-primary">${(amount / 100).toFixed(2)}</span> will help us continue providing critical peer support services.
        </p>
      </div>
      <p className="text-sm text-neutral-500">
        A receipt has been sent to your email. Your support makes a real difference.
      </p>
    </div>
  )
}

export default function DonatePage() {
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null)
  const [customDollarAmount, setCustomDollarAmount] = useState('')
  const [email, setEmail] = useState('')
  const [isCreatingIntent, setIsCreatingIntent] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [intentAmount, setIntentAmount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const selectedTier = DONATION_TIERS.find((t) => t.id === selectedTierId)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      const amt = params.get('amount')
      setIntentAmount(Number(amt) || 0)
      setShowSuccess(true)
      window.history.replaceState({}, '', '/donate')
    }
  }, [])

  const createPaymentIntent = useCallback(async () => {
    if (!selectedTier) return

    const isCustom = selectedTierId === 'custom'
    const dollarAmount = isCustom ? parseFloat(customDollarAmount) : parseFloat(selectedTier.displayAmount.replace('$', ''))
    const amountInCents = Math.round(dollarAmount * 100)

    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (isNaN(dollarAmount) || dollarAmount <= 0) {
      setError('Please enter a valid donation amount')
      return
    }

    setIsCreatingIntent(true)
    setError(null)
    setClientSecret(null)

    try {
      const payload: CheckoutDonationInput = {
        amount: amountInCents,
        email,
        tier: selectedTier.id,
      }

      const res = await fetch('/api/v1/checkout/donation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error?.message ?? 'Failed to create payment')
      }

      setClientSecret(data.data.clientSecret)
      setIntentAmount(amountInCents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsCreatingIntent(false)
    }
  }, [selectedTier, selectedTierId, customDollarAmount, email])

  useEffect(() => {
    if (!selectedTier || selectedTierId === 'custom') {
      if (selectedTierId === 'custom' && customDollarAmount && email) {
        const dollarAmount = parseFloat(customDollarAmount)
        if (!isNaN(dollarAmount) && dollarAmount > 0) {
          createPaymentIntent()
        }
      }
      return
    }

    if (selectedTierId && email && selectedTierId !== 'custom') {
      createPaymentIntent()
    }
  }, [selectedTierId])

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setCustomDollarAmount(value)
    if (value && email) {
      const timeoutId = setTimeout(() => createPaymentIntent(), 500)
      return () => clearTimeout(timeoutId)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleTierSelect = (tierId: string) => {
    setSelectedTierId(tierId)
    setClientSecret(null)
    setError(null)
    if (tierId !== 'custom') {
      setCustomDollarAmount('')
    }
  }

  const stripeAppearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563EB',
      colorBackground: '#ffffff',
      colorText: '#1F2937',
      colorDanger: '#DC2626',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  }

  if (showSuccess && intentAmount > 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-brand-warm to-white">
        <div className="container mx-auto max-w-lg px-4 py-16">
          <SuccessMessage amount={intentAmount} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-warm to-white">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900">Make a Difference Today</h1>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Your donation helps us provide peer support, crisis intervention, and care navigation to those who need it most — completely anonymously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {DONATION_TIERS.map((tier) => {
            const isSelected = selectedTierId === tier.id
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => handleTierSelect(tier.id)}
                className={`text-left rounded-xl border-2 p-6 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:ring-offset-2 ${
                  isSelected
                    ? 'border-brand-primary bg-brand-primary/5 shadow-md'
                    : 'border-neutral-200 bg-white hover:border-brand-primary/30 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`rounded-full p-3 ${isSelected ? 'bg-brand-primary/10' : 'bg-neutral-100'}`}>
                    {tier.icon}
                  </div>
                  {isSelected && (
                    <svg className="h-5 w-5 text-brand-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{tier.name}</h3>
                <p className="mt-1 text-2xl font-bold text-brand-primary">{tier.displayAmount}</p>
                <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{tier.description}</p>
              </button>
            )
          })}
        </div>

        {selectedTierId === 'custom' && (
          <div className="mb-6">
            <label htmlFor="custom-amount" className="block text-sm font-medium text-neutral-700 mb-2">
              Enter your donation amount
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">$</span>
              <input
                id="custom-amount"
                type="number"
                min="1"
                step="1"
                placeholder="0.00"
                value={customDollarAmount}
                onChange={handleCustomAmountChange}
                className="w-full pl-8 pr-4 py-3 text-lg border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
              />
            </div>
          </div>
        )}

        <Card className="max-w-xl mx-auto mb-6">
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email address <span className="text-semantic-error">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={handleEmailChange}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors"
              />
              <p className="mt-1.5 text-xs text-neutral-500">Required for your donation receipt</p>
            </div>

            {isCreatingIntent && (
              <div className="flex items-center justify-center py-8 space-x-3">
                <svg className="animate-spin h-5 w-5 text-brand-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span className="text-neutral-600">Preparing secure payment...</span>
              </div>
            )}

            {error && !isCreatingIntent && (
              <div className="rounded-lg bg-semantic-error/10 border border-semantic-error/20 p-4">
                <p className="text-sm text-semantic-error">{error}</p>
              </div>
            )}

            {!isCreatingIntent && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: stripeAppearance,
                }}
              >
                <DonationForm
                  clientSecret={clientSecret}
                  amount={intentAmount}
                  tier={selectedTier?.id ?? 'custom'}
                />
              </Elements>
            )}
          </div>
        </Card>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-neutral-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secured by Stripe
          </div>
        </div>
      </div>
    </main>
  )
}