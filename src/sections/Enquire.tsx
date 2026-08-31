import { useId, useState } from 'react'
import { CONTACT, addressOneLine, primaryEmail, telHref, waHref, useRfqCart, rfqStore } from '../data/contact'
import { CoverageCalc } from '../components/CoverageCalc'
import { PRODUCTS } from '../data/products'
import { RfqDrawer } from '../components/RfqDrawer'

// The form composes a mail draft or WhatsApp message rather than posting to a server,
// because there is no server. That is an honest limitation and it still works from every device.

export function Enquire() {
  const uid = useId()
  const { openDrawer, items } = useRfqCart()
  const [touched, setTouched] = useState(false)
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [product, setProduct] = useState('')
  const [qty, setQty] = useState('')
  const [note, setNote] = useState('')

  const missing = { name: !name.trim(), country: !country.trim() }
  const invalid = missing.name || missing.country

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (invalid) return

    const body = [
      `Name: ${name}`,
      `Country/Destination Port: ${country}`,
      product && `Product: ${product}`,
      qty && `Quantity: ${qty}`,
      note && `\nNotes: ${note}`,
    ]
      .filter(Boolean)
      .join('\n')

    window.location.href = `mailto:${primaryEmail}?subject=${encodeURIComponent(
      `Export Enquiry from ${name} (${country})`,
    )}&body=${encodeURIComponent(body)}`
  }

  const handleLaunchRfqDrawer = () => {
    if (name || country) {
      rfqStore.updateSpecifier({
        name: name || rfqStore.getSnapshot().specifier.name,
        countryOrPort: country || rfqStore.getSnapshot().specifier.countryOrPort,
        notes: note || rfqStore.getSnapshot().specifier.notes,
      })
    }
    if (product) {
      const prod = PRODUCTS.find((p) => p.name === product)
      rfqStore.addItem({
        productSlug: prod?.slug || 'jali',
        productName: product,
        patternId: prod?.pattern,
        finish: 'clay',
        quantity: Number(qty) > 0 ? Number(qty) : 500,
        unit: 'pieces',
        application: 'screen',
      })
    }
    openDrawer()
  }

  return (
    <section id="enquire" className="px-4 pb-24 sm:px-6 md:pb-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-kiln-3 pb-8">
          <div>
            <h2 className="t-display max-w-[16ch] text-[clamp(2.2rem,7vw,4.5rem)]">
              Tell us the wall.
            </h2>
            <p className="t-body mt-4 text-base">
              Pattern, quantity and the seaport you want it delivered to are enough to start. If you
              are not sure of the pattern yet, send the elevation or use our interactive suite.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLaunchRfqDrawer}
              className="border border-ember bg-kiln px-4 py-2.5 text-xs font-semibold text-ember transition-colors hover:bg-ember hover:text-white"
              style={{ fontStretch: '108%' }}
            >
              LAUNCH MULTI-PRODUCT RFQ DRAWER {items.length > 0 && `(${items.length})`} &rarr;
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Form column */}
          <form onSubmit={submit} noValidate className="grid content-start gap-5">
            <Row>
              <Text
                id={`${uid}-n`}
                label="Your name"
                value={name}
                onChange={setName}
                error={touched && missing.name ? 'Add your name so we know who is asking.' : ''}
                autoComplete="name"
              />
              <Text
                id={`${uid}-c`}
                label="Country or port of discharge"
                value={country}
                onChange={setCountry}
                error={touched && missing.country ? 'Add a country or a port of discharge.' : ''}
                autoComplete="country-name"
              />
            </Row>

            <Row>
              <div className="flex flex-col gap-2">
                <label htmlFor={`${uid}-p`} className="t-spec text-xs text-bone-dim">
                  PATTERN OF INTEREST
                </label>
                <select
                  id={`${uid}-p`}
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="border border-kiln-3 bg-kiln-2 px-3 py-2.5 text-bone focus:border-ember focus:outline-none"
                >
                  <option value="">Not decided yet</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.slug} value={p.name}>
                      {p.name} ({p.kind === 'brick' ? 'Perforated Brick' : 'Jali Tile'})
                    </option>
                  ))}
                </select>
              </div>

              <Text
                id={`${uid}-q`}
                label="Approximate quantity (pcs or sq.ft)"
                value={qty}
                onChange={setQty}
                placeholder="e.g. 1,200 pcs or 550 sq.ft"
              />
            </Row>

            <div className="flex flex-col gap-2">
              <label htmlFor={`${uid}-m`} className="t-spec text-xs text-bone-dim">
                SPECIAL ARCHITECTURAL REQUIREMENTS / NOTES
              </label>
              <textarea
                id={`${uid}-m`}
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Details regarding wall elevation, corner cuts, dry-stacking, or CIF target port."
                className="border border-kiln-3 bg-kiln-2 px-3 py-2.5 text-bone placeholder-bone-dim/40 focus:border-ember focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" aria-label="Enquire" className="cta inline-flex w-fit">
                Enquire — Send Direct Email
              </button>

              <button
                type="button"
                onClick={handleLaunchRfqDrawer}
                className="border border-kiln-3 bg-kiln-2 px-5 py-3 text-xs font-semibold text-bone hover:border-ember transition-colors"
                style={{ fontStretch: '108%' }}
              >
                Configure Full RFQ Schedule &rarr;
              </button>
            </div>

            <p className="text-xs text-bone-dim">
              Direct email proforma dispatched to {primaryEmail}. Or use WhatsApp for immediate pricing.
            </p>
          </form>

          {/* Right Column: Contact info & Coverage Calculator */}
          <div className="grid content-start gap-8">
            <ContactBlock />
            <CoverageCalc />
          </div>
        </div>
      </div>

      {/* Multi-Product RFQ Drawer */}
      <RfqDrawer />
    </section>
  )
}

function ContactBlock() {
  return (
    <div className="border border-kiln-3 p-5 bg-kiln-2">
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-bone" style={{ fontStretch: '110%' }}>
          {CONTACT.person}
        </p>
        <span className="border border-ember/40 bg-kiln px-2 py-0.5 text-xs text-ember">
          Managing Partner
        </span>
      </div>

      <ul className="mt-3 grid gap-1.5 text-base">
        {CONTACT.phones.map((p) => (
          <li key={p}>
            <a href={telHref(p)} className="underline underline-offset-4 text-bone hover:text-ember">
              {p}
            </a>
          </li>
        ))}
        {CONTACT.emails.map((e) => (
          <li key={e} className="break-all text-sm">
            <a href={`mailto:${e}`} className="underline underline-offset-4 text-bone-dim hover:text-bone">
              {e}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-base font-medium">
        <a href={waHref} target="_blank" rel="noreferrer" className="text-emerald-400 underline underline-offset-4 hover:text-emerald-300">
          WhatsApp Direct: +{CONTACT.whatsapp} &rarr;
        </a>
      </p>

      <address className="mt-4 not-italic text-xs leading-relaxed text-bone-dim border-t border-kiln-3 pt-3">
        {CONTACT.address.lines.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
        <span className="block">
          {CONTACT.address.city} {CONTACT.address.postalCode}, {CONTACT.address.region},{' '}
          {CONTACT.address.country} (Works: {CONTACT.works.name}, Est. {CONTACT.works.since})
        </span>
      </address>

      <p className="sr-only">{addressOneLine}</p>
    </div>
  )
}

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-5 sm:grid-cols-2">{children}</div>
)

function Text({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  autoComplete?: string
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="t-spec text-xs text-bone-dim">
        {label.toUpperCase()}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`border bg-kiln-2 px-3 py-2.5 text-bone placeholder-bone-dim/40 focus:outline-none ${
          error ? 'border-ember' : 'border-kiln-3 focus:border-ember'
        }`}
      />
      {error && (
        <p id={`${id}-err`} className="text-xs text-ember">
          {error}
        </p>
      )}
    </div>
  )
}
