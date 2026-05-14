'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Card, Button } from '@hips/ui'
import { authFetch } from '@/lib/api-client'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

type PackageTier = '4_SESSION' | '8_SESSION'

interface ServiceDetails {
  id: string
  name: string
  standardPrice: number
  category: string
  description: string
}

interface CheckoutState {
  service: ServiceDetails | null
  packageTier: PackageTier
  discountCode: string
  clientSecret: string | null
  amount: number
  currency: string
  paymentIntentId: string | null
  loadingService: boolean
  loadingSession: boolean
  error: string | null
}

type ApiResponse<T> = {
  data: T | null
  error: { message: string } | null
}

const TIER_OPTIONS: { value: PackageTier; label: string; multiplier: number }[] = [
  { value: '4_SESSION', label: '4-Session Package', multiplier: 4 },
  { value: '8_SESSION', label: '8-Session Package', multiplier: 8 },
]

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setPaymentError(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?session_booked=true`,
      },
    })

    if (error) {
      setPaymentError(error.message ?? 'Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {paymentError && (
        <p className="mt-4 text-sm text-semantic-error" role="alert">
          {paymentError}
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isProcessing}
        disabled={!stripe || !elements}
        className="mt-6 w-full"
      >
        {isProcessing ? 'Processing...' : 'Complete Payment'}
      </Button>
    </form>
  )
}

function CheckoutPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const serviceId = searchParams.get('serviceId')

  const [state, setState] = useState<CheckoutState>({
    service: null,
    packageTier: '4_SESSION',
    discountCode: '',
    clientSecret: null,
    amount: 0,
    currency: 'usd',
    paymentIntentId: null,
    loadingService: false,
    loadingSession: false,
    error: null,
  })

  const fetchService = useCallback(async (id: string) => {
    setState(s => ({ ...s, loadingService: true, error: null }))
    try {
      const res = await fetch(`/api/v1/services/${id}`)
      const data = await res.json() as ApiResponse<ServiceDetails>
      if (!res.ok) {
        setState(s => ({ ...s, error: data?.error?.message ?? 'Failed to load service', loadingService: false }))
        return
      }
      setState(s => ({ ...s, service: data.data, loadingService: false }))
    } catch {
      setState(s => ({ ...s, error: 'Failed to load service', loadingService: false }))
    }
  }, [])

  const createCheckoutSession = useCallback(async () => {
    if (!serviceId) return
    setState(s => ({ ...s, loadingSession: true, error: null, clientSecret: null }))
    try {
      const res = await authFetch('/api/v1/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          discountCode: state.discountCode || undefined,
          packageTier: state.packageTier,
        }),
      })
      const data = await res.json() as ApiResponse<{
        clientSecret: string
        amount: number
        currency: string
        paymentIntentId: string
      }>
      if (!res.ok) {
        setState(s => ({
          ...s,
          error: data?.error?.message ?? 'Failed to create checkout session',
          loadingSession: false,
        }))
        return
      }
      setState(s => ({
        ...s,
        clientSecret: data.data?.clientSecret ?? null,
        amount: data.data?.amount ?? 0,
        currency: data.data?.currency ?? 'usd',
        paymentIntentId: data.data?.paymentIntentId ?? null,
        loadingSession: false,
      }))
    } catch {
      setState(s => ({ ...s, error: 'Failed to create checkout session', loadingSession: false }))
    }
  }, [serviceId, state.discountCode, state.packageTier])

  useEffect(() => {
    if (serviceId) {
      fetchService(serviceId)
    }
  }, [serviceId, fetchService])

  useEffect(() => {
    if (serviceId && !state.loadingService && !state.loadingSession) {
      createCheckoutSession()
    }
  }, [serviceId, state.packageTier, state.discountCode, state.loadingService])

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  const selectedTier = TIER_OPTIONS.find(t => t.value === state.packageTier) ?? TIER_OPTIONS[0]
  const displayPrice = state.service
    ? state.service.standardPrice * 100 * selectedTier.multiplier
    : 0

  if (!serviceId) {
    return (
      <div className="min-h-screen bg-brand-warm">
        <div className="max-w-xl mx-auto py-16 px-4">
          <Card>
            <Card.Content className="text-center py-16">
              <div className="flex justify-center mb-4">
                <svg className="h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75m3.75h3.75v3.75m-3.75-3.75v3.75H9m6-3.75V6.75m3.75 6.75H15M6 9v9.75m0-9.75H4.5a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5H9" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-neutral-900">No service selected</h2>
              <p className="mt-2 text-sm text-neutral-600">
                Please select a service from the catalog to continue checkout.
              </p>
              <Button
                variant="primary"
                className="mt-6"
                onClick={() => router.push('/services')}
              >
                Browse Services
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    )
  }

  if (state.loadingService) {
    return (
      <div className="min-h-screen bg-brand-warm flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-neutral-600 text-sm">Loading checkout...</p>
        </div>
      </div>
    )
  }

  if (state.error && !state.service) {
    return (
      <div className="min-h-screen bg-brand-warm">
        <div className="max-w-xl mx-auto py-16 px-4">
          <Card>
            <Card.Content className="text-center py-16">
              <p className="text-semantic-error font-medium">{state.error}</p>
              <Button variant="secondary" className="mt-4" onClick={() => router.push('/services')}>
                Back to Services
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    )
  }

  const stripeOptions = state.clientSecret
    ? {
        clientSecret: state.clientSecret,
        appearance: {
          theme: 'stripe' as const,
          variables: {
            colorPrimary: '#2D5A8A',
            colorBackground: '#ffffff',
            colorText: '#1a1a1a',
            colorDanger: '#dc2626',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
      }
    : {}

  return (
    <div className="min-h-screen bg-brand-warm">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-brand-deep">Checkout</h1>

        {state.service && (
          <div className="mt-6">
            <Card>
              <Card.Content>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">{state.service.name}</h2>
                    <p className="mt-1 text-sm text-neutral-600">{state.service.description}</p>
                    <span className="mt-2 inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                      {state.service.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-brand-deep">
                      {formatPrice(state.service.standardPrice * 100)}
                    </p>
                    <p className="text-sm text-neutral-500">per session</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        )}

        <div className="mt-6 space-y-6">
          <Card>
            <Card.Content>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Select Package</h3>
              <div className="space-y-3">
                {TIER_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                      state.packageTier === option.value
                        ? 'border-brand-primary bg-brand-primary/5'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="packageTier"
                        value={option.value}
                        checked={state.packageTier === option.value}
                        onChange={() => setState(s => ({ ...s, packageTier: option.value }))}
                        className="sr-only"
                      />
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          state.packageTier === option.value ? 'border-brand-primary' : 'border-neutral-300'
                        }`}
                      >
                        {state.packageTier === option.value && (
                          <div className="h-2.5 w-2.5 rounded-full bg-brand-primary" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-neutral-900">{option.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-brand-deep">
                      {formatPrice(state.service ? state.service.standardPrice * 100 * option.multiplier : 0)}
                    </span>
                  </label>
                ))}
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <h3 className="text-base font-semibold text-neutral-900 mb-4">Discount Code</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={state.discountCode}
                  onChange={(e) => setState(s => ({ ...s, discountCode: e.target.value.toUpperCase() }))}
                  placeholder="Enter code"
                  className="flex-1 rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                />
                <Button
                  variant="secondary"
                  size="md"
                  onClick={createCheckoutSession}
                  loading={state.loadingSession}
                  disabled={!state.discountCode}
                >
                  Apply
                </Button>
              </div>
              {state.loadingSession && (
                <p className="mt-2 text-sm text-neutral-500">Verifying code...</p>
              )}
            </Card.Content>
          </Card>

          {state.error && (
            <div className="rounded-lg bg-semantic-error/10 p-4">
              <p className="text-sm text-semantic-error font-medium">{state.error}</p>
            </div>
          )}

          <Card>
            <Card.Content>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-neutral-900">Payment</h3>
                <span className="text-2xl font-bold text-brand-deep">{formatPrice(state.amount || displayPrice)}</span>
              </div>

              {state.loadingSession ? (
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin h-6 w-6 text-brand-primary" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : state.clientSecret ? (
                <Elements stripe={stripePromise} options={stripeOptions}>
                  <CheckoutForm />
                </Elements>
              ) : state.error ? (
                <div className="text-center py-8">
                  <p className="text-sm text-semantic-error">{state.error}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                    onClick={createCheckoutSession}
                  >
                    Try Again
                  </Button>
                </div>
              ) : null}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-warm flex items-center justify-center">
        <p className="text-neutral-600 text-sm">Loading checkout...</p>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  )
}
