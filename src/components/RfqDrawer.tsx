import { useState, useEffect, useRef } from 'react'
import {
  useRfqCart,
  type ClayFinish,
  type RFQUnit,
  type RFQApplication,
  type Incoterm,
  type PortOfLoading,
  type RFQLineItem,
  calculateCartMetrics,
  calculateItemPieces,
  buildWhatsAppRfqPayload,
  buildMailtoRfqPayload,
} from '../data/rfqState'
import { CONTACT } from '../data/contact'
import { PATTERNS, PATTERN_IDS, type PatternId } from '../data/patterns'

const FINISHES: { id: ClayFinish; label: string; bg: string }[] = [
  { id: 'clay', label: 'Natural Clay', bg: '#b4552c' },
  { id: 'charcoal', label: 'Charcoal Fired', bg: '#2b2623' },
  { id: 'sand', label: 'Sand Buff', bg: '#cbb69d' },
  { id: 'ochre', label: 'Golden Ochre', bg: '#be8746' },
]

const APPLICATIONS: { id: RFQApplication; label: string }[] = [
  { id: 'facade', label: 'Exterior Facade' },
  { id: 'screen', label: 'Brise-Soleil Screen' },
  { id: 'partition', label: 'Interior Partition' },
  { id: 'cladding', label: 'Wall Cladding' },
  { id: 'other', label: 'Custom / Other' },
]

const INCOTERMS: Incoterm[] = ['FOB', 'CIF', 'CFR', 'EXW']

export function RfqDrawer() {
  const {
    isOpen,
    items,
    specifier,
    closeDrawer,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    updateSpecifier,
  } = useRfqCart()

  const drawerRef = useRef<HTMLDivElement>(null)
  const [touched, setTouched] = useState(false)
  const [copied, setCopied] = useState(false)
  const [quickPattern, setQuickPattern] = useState<PatternId>('star')

  const metrics = calculateCartMetrics(items)

  // Validation
  const errors = {
    name: !specifier.name.trim() ? 'Please provide your name or title.' : '',
    email: !specifier.email.trim()
      ? 'Please provide your email address.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(specifier.email)
      ? 'Please enter a valid email address.'
      : '',
    country: !specifier.countryOrPort.trim() ? 'Please specify target country or destination port.' : '',
  }

  const isValid = !errors.name && !errors.email && !errors.country

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeDrawer()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeDrawer])

  const handleQuickAdd = (patternId: PatternId) => {
    const pattern = PATTERNS[patternId]
    addItem({
      productSlug: patternId,
      productName: `${pattern.label} Jali Screen`,
      patternId: patternId,
      finish: 'clay',
      quantity: 500,
      unit: 'pieces',
      application: 'screen',
    })
  }

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!isValid) return

    const payload = buildWhatsAppRfqPayload(items, specifier)
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${payload}`, '_blank')
  }

  const handleEmailSubmit = (e: React.MouseEvent) => {
    e.preventDefault()
    setTouched(true)
    if (!isValid) return

    const mailtoUrl = buildMailtoRfqPayload(items, specifier)
    window.location.href = mailtoUrl
  }

  const handleCopyPayload = () => {
    const payload = decodeURIComponent(buildWhatsAppRfqPayload(items, specifier))
    navigator.clipboard.writeText(payload).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-kiln/80 backdrop-blur-sm transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Multi-Product Architectural RFQ Drawer"
        className="relative z-10 flex h-full w-full max-w-2xl flex-col border-l border-kiln-3 bg-kiln-2 text-bone shadow-2xl transition-transform"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-kiln-3 bg-kiln px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-bone" style={{ fontStretch: '112%' }}>
                Architectural RFQ Drawer
              </h2>
              <span className="border border-ember/40 bg-kiln-2 px-2.5 py-0.5 text-xs text-ember">
                {items.length} {items.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>
            <p className="t-body mt-0.5 text-xs text-bone-dim">
              Direct factory specification quote via WhatsApp and official export proforma draft.
            </p>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            className="border border-kiln-3 bg-kiln-2 px-3 py-1.5 text-xs text-bone-dim transition-colors hover:border-ember hover:text-bone"
            aria-label="Close RFQ Drawer"
          >
            Esc / Close ?
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: Cart Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="t-spec text-xs font-semibold text-bone-dim tracking-wider">
                1. SELECTED PRODUCTS & QUANTITIES
              </h3>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-bone-dim hover:text-ember transition-colors"
                >
                  Clear All ({items.length})
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="border border-dashed border-kiln-3 bg-kiln p-6 text-center">
                <p className="text-sm text-bone-dim">Your RFQ cart is currently empty.</p>
                <p className="mt-1 text-xs text-bone-dim">
                  Add products below or configure walls from the Packing Calculator.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {(['star', 'circle', 'arrow', 'amber'] as PatternId[]).map((pId) => (
                    <button
                      key={pId}
                      type="button"
                      onClick={() => handleQuickAdd(pId)}
                      className="border border-kiln-3 bg-kiln-2 px-3 py-1.5 text-xs text-bone hover:border-ember hover:text-ember"
                    >
                      + Add {PATTERNS[pId].label} (500 pcs)
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <LineItemCard
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => updateItem(item.id, updates)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}

                {/* Quick Add Dropdown */}
                <div className="flex items-center gap-2 border border-kiln-3 bg-kiln p-3">
                  <span className="t-spec text-xs text-bone-dim shrink-0">ADD ANOTHER PRODUCT:</span>
                  <select
                    value={quickPattern}
                    onChange={(e) => setQuickPattern(e.target.value as PatternId)}
                    className="flex-1 border border-kiln-3 bg-kiln-2 px-2.5 py-1 text-xs text-bone focus:border-ember focus:outline-none"
                  >
                    {PATTERN_IDS.map((id) => (
                      <option key={id} value={id}>
                        {PATTERNS[id].label} Jali Screen
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(quickPattern)}
                    className="bg-bone px-3 py-1 text-xs font-semibold text-kiln hover:bg-white"
                  >
                    + Add to RFQ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Live Metrics Summary */}
          {items.length > 0 && (
            <div className="grid grid-cols-3 gap-3 border border-kiln-3 bg-kiln p-4">
              <div>
                <p className="t-spec text-[10px] text-bone-dim">TOTAL BLOCKS</p>
                <p className="text-base font-semibold text-bone">{metrics.totalPieces.toLocaleString()}</p>
              </div>
              <div>
                <p className="t-spec text-[10px] text-bone-dim">EST. PALLETS</p>
                <p className="text-base font-semibold text-bone">{metrics.pallets} Pallets</p>
              </div>
              <div>
                <p className="t-spec text-[10px] text-bone-dim">GROSS WEIGHT</p>
                <p className="text-base font-semibold text-ember">~{metrics.grossWeightMT} MT</p>
              </div>
            </div>
          )}

          {/* SECTION 2: Specifier Information Form */}
          <form onSubmit={handleWhatsAppSubmit} className="space-y-4 pt-2">
            <h3 className="t-spec text-xs font-semibold text-bone-dim tracking-wider">
              2. SPECIFIER DETAILS & SHIPPING TERMS
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="t-spec block text-xs text-bone-dim mb-1">
                  YOUR NAME / SPECIFIER *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ar. Sameer Mehta"
                  value={specifier.name}
                  onChange={(e) => updateSpecifier({ name: e.target.value })}
                  className={`w-full border bg-kiln px-3 py-2 text-xs text-bone placeholder-bone-dim/40 focus:outline-none ${
                    touched && errors.name ? 'border-ember' : 'border-kiln-3 focus:border-ember'
                  }`}
                />
                {touched && errors.name && (
                  <p className="mt-1 text-[11px] text-ember">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="t-spec block text-xs text-bone-dim mb-1">
                  WORK EMAIL *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@architecturefirm.com"
                  value={specifier.email}
                  onChange={(e) => updateSpecifier({ email: e.target.value })}
                  className={`w-full border bg-kiln px-3 py-2 text-xs text-bone placeholder-bone-dim/40 focus:outline-none ${
                    touched && errors.email ? 'border-ember' : 'border-kiln-3 focus:border-ember'
                  }`}
                />
                {touched && errors.email && (
                  <p className="mt-1 text-[11px] text-ember">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="t-spec block text-xs text-bone-dim mb-1">
                  PRACTICE / FIRM NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. Studio Morphogenesis"
                  value={specifier.company}
                  onChange={(e) => updateSpecifier({ company: e.target.value })}
                  className="w-full border border-kiln-3 bg-kiln px-3 py-2 text-xs text-bone placeholder-bone-dim/40 focus:border-ember focus:outline-none"
                />
              </div>

              <div>
                <label className="t-spec block text-xs text-bone-dim mb-1">
                  PHONE / WHATSAPP NUMBER
                </label>
                <input
                  type="tel"
                  placeholder="+971 50 123 4567 / +1 415 ..."
                  value={specifier.phone}
                  onChange={(e) => updateSpecifier({ phone: e.target.value })}
                  className="w-full border border-kiln-3 bg-kiln px-3 py-2 text-xs text-bone placeholder-bone-dim/40 focus:border-ember focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="t-spec block text-xs text-bone-dim mb-1">
                  DESTINATION PORT / COUNTRY *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jebel Ali / Dubai, UAE"
                  value={specifier.countryOrPort}
                  onChange={(e) => updateSpecifier({ countryOrPort: e.target.value })}
                  className={`w-full border bg-kiln px-3 py-2 text-xs text-bone placeholder-bone-dim/40 focus:outline-none ${
                    touched && errors.country ? 'border-ember' : 'border-kiln-3 focus:border-ember'
                  }`}
                />
                {touched && errors.country && (
                  <p className="mt-1 text-[11px] text-ember">{errors.country}</p>
                )}
              </div>

              <div>
                <label className="t-spec block text-xs text-bone-dim mb-1">
                  TRADE TERMS (INCOTERMS)
                </label>
                <select
                  value={specifier.incoterm}
                  onChange={(e) => updateSpecifier({ incoterm: e.target.value as Incoterm })}
                  className="w-full border border-kiln-3 bg-kiln px-3 py-2 text-xs text-bone focus:border-ember focus:outline-none"
                >
                  {INCOTERMS.map((term) => (
                    <option key={term} value={term}>
                      {term} (International Trade)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="t-spec block text-xs text-bone-dim mb-1">
                  PORT OF LOADING
                </label>
                <select
                  value={specifier.portOfLoading}
                  onChange={(e) => updateSpecifier({ portOfLoading: e.target.value as PortOfLoading })}
                  className="w-full border border-kiln-3 bg-kiln px-3 py-2 text-xs text-bone focus:border-ember focus:outline-none"
                >
                  <option value="Mundra">Mundra Port (INMUN, 27 MT limit)</option>
                  <option value="Nhava Sheva">Nhava Sheva (INNSA, 21.5 MT limit)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="t-spec block text-xs text-bone-dim mb-1">
                PROJECT TIMELINE / DELIVERY WINDOW
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs">
                {['Immediate (< 30 days)', '1-3 months', '3-6 months', 'Planning / Concept'].map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => updateSpecifier({ projectTimeline: time })}
                    className={`border px-2 py-1.5 text-center transition-colors ${
                      specifier.projectTimeline === time
                        ? 'border-ember bg-kiln text-bone'
                        : 'border-kiln-3 bg-kiln text-bone-dim hover:text-bone'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="t-spec block text-xs text-bone-dim mb-1">
                ARCHITECTURAL SPECIFICATIONS & CUSTOM CUTTING NOTES
              </label>
              <textarea
                rows={3}
                placeholder="Include elevation drawings link, corner mitre cuts, mortar joint preferences (8mm / dry-stack), or special test requirements."
                value={specifier.notes}
                onChange={(e) => updateSpecifier({ notes: e.target.value })}
                className="w-full border border-kiln-3 bg-kiln px-3 py-2 text-xs text-bone placeholder-bone-dim/40 focus:border-ember focus:outline-none"
              />
            </div>

            {/* Actions Bar */}
            <div className="space-y-3 pt-3 border-t border-kiln-3">
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-600 px-4 py-3 text-center text-xs font-bold text-white transition-colors"
                  style={{ fontStretch: '108%' }}
                >
                  SEND RFQ VIA WHATSAPP (INSTANT QUOTE) &rarr;
                </button>

                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  className="flex-1 border border-bone/60 bg-kiln hover:bg-kiln-2 px-4 py-3 text-center text-xs font-semibold text-bone transition-colors"
                  style={{ fontStretch: '108%' }}
                >
                  SEND RFQ VIA EMAIL (OFFICIAL PROFORMA)
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-bone-dim pt-1">
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="underline hover:text-bone"
                >
                  {copied ? '? Copied formatted RFQ to clipboard!' : 'Copy formatted RFQ text to clipboard'}
                </button>
                <span>Direct response within 2-4 business hours</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function LineItemCard({
  item,
  onUpdate,
  onRemove,
}: {
  item: RFQLineItem
  onUpdate: (updates: Partial<RFQLineItem>) => void
  onRemove: () => void
}) {
  const pieces = item.estimatedPieces || calculateItemPieces(item.quantity, item.unit)

  return (
    <div className="border border-kiln-3 bg-kiln p-4 transition-colors hover:border-bone-dim/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-sm text-bone">{item.productName}</h4>
          <p className="text-[11px] text-bone-dim">Standard 203.2 x 203.2 mm Module</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-bone-dim hover:text-ember"
          aria-label={`Remove ${item.productName}`}
        >
          ? Remove
        </button>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {/* Quantity & Unit */}
        <div>
          <label className="t-spec block text-[10px] text-bone-dim mb-1">QUANTITY & UNIT</label>
          <div className="flex items-center border border-kiln-3 bg-kiln-2">
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => onUpdate({ quantity: Math.max(1, Number(e.target.value)) })}
              className="w-full bg-transparent px-2.5 py-1.5 text-xs text-bone focus:outline-none"
            />
            <select
              value={item.unit}
              onChange={(e) => onUpdate({ unit: e.target.value as RFQUnit })}
              className="border-l border-kiln-3 bg-kiln px-2 py-1.5 text-[11px] text-bone-dim focus:outline-none"
            >
              <option value="pieces">pcs</option>
              <option value="sqft">sq.ft</option>
              <option value="sqm">sq.m</option>
            </select>
          </div>
          {item.unit !== 'pieces' && (
            <p className="t-spec mt-1 text-[10px] text-bone-dim">˜ {pieces.toLocaleString()} blocks (+5% res)</p>
          )}
        </div>

        {/* Finish Selector */}
        <div>
          <label className="t-spec block text-[10px] text-bone-dim mb-1">CLAY FINISH</label>
          <select
            value={item.finish}
            onChange={(e) => onUpdate({ finish: e.target.value as ClayFinish })}
            className="w-full border border-kiln-3 bg-kiln-2 px-2.5 py-1.5 text-xs text-bone focus:outline-none"
          >
            {FINISHES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Application Selector */}
        <div>
          <label className="t-spec block text-[10px] text-bone-dim mb-1">APPLICATION</label>
          <select
            value={item.application}
            onChange={(e) => onUpdate({ application: e.target.value as RFQApplication })}
            className="w-full border border-kiln-3 bg-kiln-2 px-2.5 py-1.5 text-xs text-bone focus:outline-none"
          >
            {APPLICATIONS.map((app) => (
              <option key={app.id} value={app.id}>
                {app.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {item.customNotes && (
        <p className="mt-2 text-[11px] text-bone-dim/90 italic bg-kiln-2/70 p-1.5 border border-kiln-3">
          {item.customNotes}
        </p>
      )}
    </div>
  )
}
