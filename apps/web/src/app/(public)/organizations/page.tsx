'use client'

import { useState } from 'react'
import { Building2, Calendar, Users, Heart, CheckCircle2 } from 'lucide-react'
import { Button, Card } from '@hips/ui'
import { OrgInquirySchema } from '@hips/types'

const EVENT_TYPE_LABELS: Record<string, string> = {
  WORKSHOP: 'Workshop',
  HALF_DAY: 'Half Day',
  FULL_DAY: 'Full Day',
  RETREAT: 'Retreat',
  SPEAKING: 'Speaking Engagement',
}

type FormData = {
  orgName: string
  contactEmail: string
  ein: string
  isNonprofit: boolean
  eventType: string
  preferredDate: string
  headcount: string
  notes: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

const INITIAL_FORM: FormData = {
  orgName: '',
  contactEmail: '',
  ein: '',
  isNonprofit: false,
  eventType: '',
  preferredDate: '',
  headcount: '',
  notes: '',
}

export default function OrganizationsPage() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function validate(): boolean {
    const errs: FormErrors = {}

    if (!form.orgName.trim()) {
      errs.orgName = 'Organization name is required'
    }

    if (!form.contactEmail.trim()) {
      errs.contactEmail = 'Contact email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      errs.contactEmail = 'Please enter a valid email address'
    }

    if (!form.eventType) {
      errs.eventType = 'Please select an event type'
    }

    if (form.headcount && (isNaN(Number(form.headcount)) || Number(form.headcount) < 1 || Number(form.headcount) > 1000)) {
      errs.headcount = 'Headcount must be between 1 and 1000'
    }

    if (form.notes && form.notes.length > 2000) {
      errs.notes = 'Notes cannot exceed 2000 characters'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleChange(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    setSubmitError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError(null)

    const payload = {
      orgName: form.orgName.trim(),
      contactEmail: form.contactEmail.trim(),
      ein: form.ein.trim() || undefined,
      isNonprofit: form.isNonprofit,
      eventType: form.eventType,
      preferredDate: form.preferredDate ? new Date(form.preferredDate).toISOString() : undefined,
      headcount: form.headcount ? Number(form.headcount) : undefined,
      notes: form.notes.trim() || undefined,
    }

    const parsed = OrgInquirySchema.safeParse(payload)
    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      setSubmitError(`${issue.path.join('.')}: ${issue.message}`)
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/v1/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error?.message || `Request failed with status ${res.status}`)
      }

      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-warm">
        <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-16 w-16 text-semantic-success" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-brand-deep">Thank you for your inquiry!</h1>
          <p className="mt-4 text-lg text-neutral-600">
            We've received your organization inquiry and will be in touch within 1–2 business days.
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            A confirmation has been sent to <strong>{form.contactEmail}</strong>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-warm">
      {/* Hero section */}
      <div className="bg-brand-deep py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-4xl font-bold text-white text-center">Bring HIPS to your organization</h1>
          <p className="mt-4 text-lg text-white/80 text-center max-w-2xl mx-auto">
            Equip your team with peer support, crisis skills, and mental wellness tools — tailored to your organization's needs.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white border border-neutral-200 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-brand-warm flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-brand-deep" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-neutral-900">Customized Workshops</h3>
            <p className="mt-2 text-sm text-neutral-600">Sessions tailored to your team's size, schedule, and mental wellness goals.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white border border-neutral-200 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-brand-warm flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-brand-deep" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-neutral-900">Confidential & Anonymous</h3>
            <p className="mt-2 text-sm text-neutral-600">Safe spaces where your team can share openly without fear of exposure.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white border border-neutral-200 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-brand-warm flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-brand-deep" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-neutral-900">Real Support Networks</h3>
            <p className="mt-2 text-sm text-neutral-600">Build lasting peer connections that extend beyond a single session.</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <Card.Content>
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">Organizational Inquiry</h2>
            <p className="text-sm text-neutral-600 mb-8">Tell us about your organization and we'll be in touch.</p>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Organization name */}
              <div>
                <label htmlFor="orgName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Organization name <span className="text-semantic-error" aria-hidden="true">*</span>
                </label>
                <input
                  id="orgName"
                  type="text"
                  value={form.orgName}
                  onChange={e => handleChange('orgName', e.target.value)}
                  placeholder="Acme Community Center"
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 disabled:opacity-50"
                  aria-required="true"
                  aria-invalid={!!errors.orgName}
                  aria-describedby={errors.orgName ? 'orgName-error' : undefined}
                  disabled={submitting}
                  maxLength={200}
                />
                {errors.orgName && (
                  <p id="orgName-error" className="mt-1.5 text-sm text-semantic-error" role="alert">{errors.orgName}</p>
                )}
              </div>

              {/* Contact email */}
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Contact email <span className="text-semantic-error" aria-hidden="true">*</span>
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={e => handleChange('contactEmail', e.target.value)}
                  placeholder="contact@organization.org"
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 disabled:opacity-50"
                  aria-required="true"
                  aria-invalid={!!errors.contactEmail}
                  aria-describedby={errors.contactEmail ? 'contactEmail-error' : undefined}
                  disabled={submitting}
                />
                {errors.contactEmail && (
                  <p id="contactEmail-error" className="mt-1.5 text-sm text-semantic-error" role="alert">{errors.contactEmail}</p>
                )}
              </div>

              {/* EIN */}
              <div>
                <label htmlFor="ein" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  EIN <span className="text-neutral-400 text-xs">(optional)</span>
                </label>
                <input
                  id="ein"
                  type="text"
                  value={form.ein}
                  onChange={e => handleChange('ein', e.target.value)}
                  placeholder="12-3456789"
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 disabled:opacity-50"
                  disabled={submitting}
                  maxLength={20}
                />
              </div>

              {/* Nonprofit checkbox */}
              <div className="flex items-start gap-3">
                <input
                  id="isNonprofit"
                  type="checkbox"
                  checked={form.isNonprofit}
                  onChange={e => handleChange('isNonprofit', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary/30"
                  disabled={submitting}
                />
                <label htmlFor="isNonprofit" className="text-sm text-neutral-700">
                  We are a nonprofit organization
                </label>
              </div>

              {/* Event type */}
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Event type <span className="text-semantic-error" aria-hidden="true">*</span>
                </label>
                <select
                  id="eventType"
                  value={form.eventType}
                  onChange={e => handleChange('eventType', e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm text-neutral-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 disabled:opacity-50"
                  aria-required="true"
                  aria-invalid={!!errors.eventType}
                  aria-describedby={errors.eventType ? 'eventType-error' : undefined}
                  disabled={submitting}
                >
                  <option value="">Select an event type</option>
                  {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {errors.eventType && (
                  <p id="eventType-error" className="mt-1.5 text-sm text-semantic-error" role="alert">{errors.eventType}</p>
                )}
              </div>

              {/* Preferred date */}
              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Preferred date <span className="text-neutral-400 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" aria-hidden="true" />
                  <input
                    id="preferredDate"
                    type="date"
                    value={form.preferredDate}
                    onChange={e => handleChange('preferredDate', e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 pl-10 pr-4 py-2.5 text-sm text-neutral-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 disabled:opacity-50"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Headcount */}
              <div>
                <label htmlFor="headcount" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Expected headcount <span className="text-neutral-400 text-xs">(optional)</span>
                </label>
                <input
                  id="headcount"
                  type="number"
                  value={form.headcount}
                  onChange={e => handleChange('headcount', e.target.value)}
                  placeholder="25"
                  min="1"
                  max="1000"
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 disabled:opacity-50"
                  aria-invalid={!!errors.headcount}
                  aria-describedby={errors.headcount ? 'headcount-error' : undefined}
                  disabled={submitting}
                />
                {errors.headcount && (
                  <p id="headcount-error" className="mt-1.5 text-sm text-semantic-error" role="alert">{errors.headcount}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Additional notes <span className="text-neutral-400 text-xs">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                  placeholder="Tell us more about your organization's needs, timeline, or any specific topics you'd like to cover..."
                  rows={4}
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/30 resize-y disabled:opacity-50"
                  aria-invalid={!!errors.notes}
                  aria-describedby={errors.notes ? 'notes-error' : 'notes-count'}
                  disabled={submitting}
                  maxLength={2000}
                />
                <div className="flex justify-between items-center mt-1.5">
                  {errors.notes ? (
                    <p id="notes-error" className="text-sm text-semantic-error" role="alert">{errors.notes}</p>
                  ) : <span />}
                  <span id="notes-count" className="text-xs text-neutral-400">
                    {form.notes.length}/2000
                  </span>
                </div>
              </div>

              {/* Submit error */}
              {submitError && (
                <div className="rounded-lg bg-semantic-error/10 border border-semantic-error/20 p-4" role="alert">
                  <p className="text-sm text-semantic-error">{submitError}</p>
                </div>
              )}

              {/* Submit */}
              <Button type="submit" size="lg" loading={submitting} className="w-full">
                Submit Inquiry
              </Button>
            </form>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}