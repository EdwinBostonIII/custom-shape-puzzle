import { Gift, ShieldCheck, Truck, Timer, Sparkle, Lock, ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PUZZLE_TIERS, getEstimatedDeliveryDate, PRIVACY_PROMISE, QUALITY_GUARANTEE, CAPSULE_CONFIG } from '@/lib/constants'
import { FAQSection } from './FAQSection'
import { 
  RecentActivityToast, 
  CustomerRatings, 
  TestimonialCarousel, 
  TrustBadges,
  LiveViewers,
  DeliveryCountdown
} from './TrustSignals'
import { OccasionCountdown } from './OccasionCountdown'
import { UrgencyBanner, FloatingUrgency } from './UrgencyBanner'
import { CustomerReviews } from './CustomerReviews'
import { ReturnPolicyModal, MiniGuarantee } from './ReturnPolicyModal'

interface HomePageProps {
  onStart: () => void
}

// Get the minimum price for "From $X" display
const startingPrice = Math.min(...PUZZLE_TIERS.map(t => t.price))

export function HomePage({ onStart }: HomePageProps) {
  const estimatedDelivery = getEstimatedDeliveryDate()

  return (
    <div className="min-h-screen bg-cream relative">
      {/* Urgency Banner - Research shows urgency increases conversions by 332% */}
      <UrgencyBanner />
      
      {/* Floating urgency indicator for holiday deadlines */}
      <FloatingUrgency />
      
      {/* Social Proof Toast - Real-time activity */}
      <RecentActivityToast />
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-cream/80 border-b border-stone/50" aria-label="Main navigation">
        <div className="px-6 py-4 md:px-12">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <h1 className="text-2xl font-bold text-charcoal font-display">
              Interlock
            </h1>
            <div className="flex items-center gap-4">
              <span className="hidden sm:flex items-center gap-1.5 text-sm text-charcoal/60" aria-label="Privacy guaranteed">
                <Lock size={14} weight="fill" aria-hidden="true" />
                Your story stays private
              </span>
              <Button size="sm" className="rounded-full ripple-effect" onClick={onStart} aria-label={`Create your puzzle, starting from $${startingPrice}`}>
                Create Yours – From ${startingPrice}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="px-6 py-16 md:px-12 lg:px-24" role="main">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section with Price Transparency */}
          <div className="mb-20 text-center md:mb-28 relative">
            {/* Organic blob background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-20">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path fill="rgba(224, 122, 95, 0.3)" d="M47.3,-57.8C59.6,-45.6,67.3,-29.2,69.8,-12.2C72.3,4.8,69.6,22.3,61.1,36.8C52.6,51.3,38.3,62.8,21.8,68.4C5.3,74,-13.3,73.7,-29.2,67.2C-45.1,60.7,-58.3,48,-65.8,32.8C-73.3,17.6,-75.1,-0.1,-70.8,-16.2C-66.5,-32.3,-56.1,-46.8,-42.8,-58.8C-29.5,-70.8,-14.8,-80.3,1.3,-81.9C17.4,-83.5,34.9,-70,47.3,-57.8Z" transform="translate(100 100)" />
              </svg>
            </div>

            <div className="mb-6 relative z-10">
              {/* Price Badge - Prominent */}
              <Badge className="mb-6 text-lg px-6 py-2 bg-terracotta text-white border-0 shadow-lg font-display">
                From ${startingPrice} · Free Shipping
              </Badge>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6 leading-tight font-display tracking-display font-semibold"
              >
                A puzzle that tells your story—without showing your face.
              </h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg md:text-xl text-charcoal/80 leading-relaxed mb-3 font-body">
              Choose shapes that mean something. Add hints only you'd know. Solve it together.
            </p>

            {/* Estimated Delivery - Per Master List */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Badge className="text-sm px-4 py-2 bg-sage/20 text-charcoal border border-sage/30 font-body">
                <Timer size={16} weight="bold" className="mr-2 text-sage" />
                Arrives by {estimatedDelivery}
              </Badge>
            </div>

            {/* Customer Ratings - Social Proof */}
            <div className="mt-6">
              <CustomerRatings className="justify-center" />
            </div>

            {/* Live Viewers - Urgency Signal */}
            <div className="mt-4">
              <LiveViewers className="justify-center" />
            </div>

            {/* Single CTA Button */}
            <div className="mt-10">
              <Button
                size="lg"
                className="text-lg px-10 py-7 rounded-full shadow-xl ripple-effect"
                onClick={onStart}
                aria-label="Start creating your custom puzzle"
              >
                <Sparkle size={24} weight="fill" className="mr-2" />
                Create Your Puzzle
              </Button>
            </div>
          </div>

          {/* Trust Indicators - Enhanced per Master List */}
          <section className="mb-20" aria-labelledby="trust-heading">
            <h2 id="trust-heading" className="sr-only">Why Choose Interlock</h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto" role="list">
              <li className="text-center space-y-3 p-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center" aria-hidden="true">
                  <Gift size={24} weight="fill" className="text-terracotta" />
                </div>
                <div>
                  <p className="font-bold text-charcoal font-display">Handcrafted</p>
                  <p className="text-sm text-charcoal/60">Baltic birch, laser-cut</p>
                </div>
              </li>
              <li className="text-center space-y-3 p-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center" aria-hidden="true">
                  <Truck size={24} weight="fill" className="text-sage" />
                </div>
                <div>
                  <p className="font-bold text-charcoal font-display">Free Shipping</p>
                  <p className="text-sm text-charcoal/60">Anywhere in the US</p>
                </div>
              </li>
              <li className="text-center space-y-3 p-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center" aria-hidden="true">
                  <ShieldCheck size={24} weight="fill" className="text-terracotta" />
                </div>
                <div>
                  <p className="font-bold text-charcoal font-display">30-Day Guarantee</p>
                  <p className="text-sm text-charcoal/60">Love it or we fix it</p>
                </div>
              </li>
              <li className="text-center space-y-3 p-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center" aria-hidden="true">
                  <Timer size={24} weight="fill" className="text-sage" />
                </div>
                <div>
                  <p className="font-bold text-charcoal font-display">2-Week Delivery</p>
                  <p className="text-sm text-charcoal/60">Made to order</p>
                </div>
              </li>
            </ul>
          </section>

          {/* Why Interlock - Differentiation Section per Master List */}
          <section className="mb-20" aria-labelledby="why-heading">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 id="why-heading" className="text-3xl md:text-4xl font-bold text-charcoal mb-4 font-display tracking-display">
                Not Another Photo Puzzle
              </h2>
              <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
                Most puzzle gifts sit in a closet. Ours become a shared experience—a conversation piece that captures what makes you, you.
              </p>
            </div>

            <ul className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" role="list">
              <li>
                <Card className="border-2 border-stone p-6 text-center h-full">
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-4xl" aria-hidden="true">✨</div>
                    <h3 className="text-xl font-bold text-charcoal font-display">
                      Shapes With Meaning
                    </h3>
                    <p className="text-charcoal/70">
                      Pick from 70+ silhouettes. A fox for adventure. A moon for late nights. Each piece holds a secret only you know.
                    </p>
                  </CardContent>
                </Card>
              </li>

              <li>
                <Card className="border-2 border-stone p-6 text-center h-full">
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-4xl" aria-hidden="true">💭</div>
                    <h3 className="text-xl font-bold text-charcoal font-display">
                      Hint Cards, Not Photos
                    </h3>
                    <p className="text-charcoal/70">
                      Skip the reference picture. Instead, get custom hints that spark memories: "Where we first said I love you."
                    </p>
                  </CardContent>
                </Card>
              </li>

              <li>
                <Card className="border-2 border-stone p-6 text-center h-full">
                  <CardContent className="pt-6 space-y-4">
                    <div className="text-4xl" aria-hidden="true">🪵</div>
                    <h3 className="text-xl font-bold text-charcoal font-display">
                      Heirloom Quality
                    </h3>
                    <p className="text-charcoal/70">
                      3mm Baltic birch, precision laser-cut. Hand-finished with care. A keepsake that gets better with every solve.
                    </p>
                  </CardContent>
                </Card>
              </li>
            </ul>
          </section>

          {/* Occasion Countdown - Holiday/Gift Targeting */}
          <div className="mb-20 max-w-2xl mx-auto">
            <OccasionCountdown variant="compact" />
          </div>

          {/* Anniversary Capsule - New Subscription Upsell */}
          <div className="mb-20">
            <Card className="border-2 border-terracotta/20 bg-gradient-to-br from-terracotta/5 to-sage/5 max-w-4xl mx-auto overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0 w-24 h-24 rounded-full bg-terracotta/10 flex items-center justify-center text-4xl">
                    📦
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block mb-2">
                      <Badge className="bg-terracotta/10 text-terracotta border-terracotta/20 text-xs">NEW</Badge>
                    </div>
                    <h3 className="text-2xl font-bold text-charcoal mb-2 font-display">
                      Anniversary Capsule
                    </h3>
                    <p className="text-charcoal/70 mb-4">
                      Every year, receive a mini puzzle with new memories from the past year. Keep your story growing.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <span className="text-sm text-charcoal/60">
                        <span className="font-bold text-charcoal">${CAPSULE_CONFIG.annualPrice}/year</span> · Free first year on orders ${CAPSULE_CONFIG.freeThreshold}+
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Testimonials - Carousel */}
          <div className="mb-20 max-w-3xl mx-auto">
            <Card className="border-2 border-sage/30 bg-sage/5 shadow-sage">
              <CardContent className="p-8 md:p-10">
                <TestimonialCarousel />
              </CardContent>
            </Card>
          </div>

          {/* Full Customer Reviews Section - Research: Reviews increase conversion by 270% */}
          <div className="mb-20">
            <CustomerReviews />
          </div>

          {/* Return Policy Visibility - Research: 67% check policy before buying */}
          <div className="mb-20 max-w-2xl mx-auto">
            <ReturnPolicyModal />
          </div>

          {/* How It Works - Simple 4-Step Process */}
          <div className="mb-20">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4 font-display tracking-display">
                Four Steps to Your Perfect Puzzle
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { step: '1', title: 'Choose Size', desc: '100 to 1,000 pieces', icon: '📐' },
                { step: '2', title: 'Pick Shapes', desc: 'Select meaningful silhouettes', icon: '✨' },
                { step: '3', title: 'Add Hints', desc: 'Create memory prompts', icon: '💭' },
                { step: '4', title: 'Receive', desc: 'Ships in ~2 weeks', icon: '📦' },
              ].map((item) => (
                <div key={item.step} className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-terracotta uppercase tracking-wide">Step {item.step}</div>
                  <h3 className="font-bold text-charcoal font-display">{item.title}</h3>
                  <p className="text-sm text-charcoal/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Promise - Per investor feedback on privacy risk */}
          <div className="mb-12 max-w-3xl mx-auto">
            <Card className="border border-charcoal/10 bg-charcoal/[0.02]">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center">
                    <Lock size={20} weight="fill" className="text-charcoal/70" />
                  </div>
                  <div>
                    <h3 className="font-bold text-charcoal mb-1 font-display">{PRIVACY_PROMISE.headline}</h3>
                    <p className="text-sm text-charcoal/60">{PRIVACY_PROMISE.subhead}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Badges - Research shows 17% conversion lift */}
          <div className="mb-20">
            <TrustBadges className="max-w-4xl mx-auto" />
          </div>

          {/* Final CTA */}
          <div className="text-center py-12 px-8 bg-terracotta/5 rounded-3xl max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-charcoal mb-4 font-display">
              Ready to create something meaningful?
            </h2>
            <p className="text-charcoal/70 mb-6">
              From ${startingPrice} · Free shipping · Arrives by {estimatedDelivery}
            </p>
            <Button
              size="lg"
              className="text-lg px-10 py-6 rounded-full shadow-xl ripple-effect"
              onClick={onStart}
            >
              Start Creating <ArrowRight size={20} weight="bold" className="ml-2" />
            </Button>
          </div>

        </div>
      </main>

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <div className="py-12 text-center text-base text-charcoal/60 bg-cream border-t border-stone/30">
        <p className="font-light mb-2">Handcrafted with care · Ships within 2 weeks · Free shipping in the US</p>
        <p className="text-sm text-charcoal/40">© 2025 Interlock. Made with ❤️ in the USA</p>
      </div>
    </div>
  )
}
