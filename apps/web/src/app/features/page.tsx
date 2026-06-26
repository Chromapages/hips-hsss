import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, EyeOff, Shield, Key } from 'lucide-react'
import { Navbar } from '@/components/polish/Navbar'

const FeaturesPage = () => {
  return (
    <main id="main" tabIndex={-1} className="min-h-screen bg-bg text-text-primary selection:bg-primary/30 pb-20">
      <Navbar />

      <div className="max-w-[800px] mx-auto px-6 pt-12 md:pt-20">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors mb-8 group"
          aria-label="Back to Homepage"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Homepage
        </Link>

        {/* Title */}
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-6">
          Security & Anonymity Features
        </h1>
        <p className="text-lg text-text-muted mb-16 font-body leading-relaxed">
          The H.I.P.S. Foundation is built on hard-anonymity protocols. We ensure your data, identity, and interactions are cryptographically and architecturally protected.
        </p>

        {/* Sections */}
        <div className="space-y-20">
          {/* Identity Vault Section */}
          <section id="identity-vault" className="scroll-mt-24 border-t border-border pt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-primary">Identity Vault</h2>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-text-muted font-body leading-relaxed mb-4">
                Our Identity Vault architecture isolates personally identifiable information (PII) entirely from the main application servers. When you request a session, your credentials are verification-gated and never logged or associated with your chat history.
              </p>
              <p className="text-text-muted font-body leading-relaxed">
                By separating user databases from interaction pipelines, we guarantee that even in the event of an infrastructure breach, there is no mapping that links your real identity to your peer support activity.
              </p>
            </div>
          </section>

          {/* Avatar Privacy Section */}
          <section id="avatar-native" className="scroll-mt-24 border-t border-border pt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-primary">Avatar Privacy</h2>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-text-muted font-body leading-relaxed mb-4">
                To remove social barriers and camera fatigue, all communication within HSSS is video-free. Participants are represented by customizable, neutral abstract avatars that represent emotional expressions dynamically without revealing physical characteristics.
              </p>
              <p className="text-text-muted font-body leading-relaxed">
                This camera-free interaction format ensures that you remain completely unseen, letting you focus entirely on your mental health and peer support without concern for styling or facial tracking.
              </p>
            </div>
          </section>

          {/* Safety Engine Section */}
          <section id="safety-engine" className="scroll-mt-24 border-t border-border pt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-primary">Safety Engine</h2>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-text-muted font-body leading-relaxed mb-4">
                Our safety framework acts as a real-time monitor during peer support group sessions. A human facilitator is present inside every room to guarantee a supportive, constructive space.
              </p>
              <p className="text-text-muted font-body leading-relaxed">
                The safety engine scans session analytics and flags policy violations—such as hate speech, doxxing, or self-harm triggers—without tracking individual participant identities, maintaining absolute privacy for everyone.
              </p>
            </div>
          </section>

          {/* Hard Anonymity Section */}
          <section id="hard-anonymity" className="scroll-mt-24 border-t border-border pt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-primary">Hard Anonymity</h2>
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-text-muted font-body leading-relaxed mb-4">
                HSSS session tokens utilize ephemeral key cryptography. Every time you connect, a unique peer token is generated that expires automatically when the session terminates.
              </p>
              <p className="text-text-muted font-body leading-relaxed">
                These tokens have zero linkage to your IP address or session history. IP headers are stripped at the proxy level, preventing any cross-session device matching or footprint tracking.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default FeaturesPage
