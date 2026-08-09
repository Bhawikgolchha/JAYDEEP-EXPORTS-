import { useId, useState } from 'react'
import { CONTACT, addressOneLine, primaryEmail, telHref, waHref } from '../data/contact'
import { CoverageCalc } from '../components/CoverageCalc'
import { PRODUCTS } from '../data/products'

// The form composes a mail draft rather than posting to a server, because there is no
// server. That is an honest limitation and it still works from every device.

export function Enquire() {
  const uid = useId()
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
      `Country: ${country}`,
      product && `Product: ${product}`,
      qty && `Quantity: ${qty}`,
      note && `\n${note}`,
    ]
      .filter(Boolean)
      .join('\n')

    window.location.href = `mailto:${primaryEmail}?subject=${encodeURIComponent(
      'Enquiry from the Jaydeep Exports site',
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <section id="enquire" className="px-4 pb-24 sm:px-6 md:pb-32">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="t-display max-w-[16ch] text-[clamp(2.2rem,7vw,4.5rem)]">
          Tell us the wall.
        </h2>
        <p className="t-body mt-4 text-base">
          Pattern, quantity and the port you want it delivered to are enough to start. If you
          are not sure of the pattern yet, send the elevation.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* content-start, or the grid rows stretch to match the taller right column
              and the fields drift apart down the page */}
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
                label="Country or port"
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
                  className="border border-kiln-3 bg-kiln-2 px-3 py-2.5 text-bone"
                >
                  <option value="">Not decided yet</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.slug} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <Text
                id={`${uid}-q`}
                label="Approximate quantity"
                value={qty}
                onChange={setQty}
                placeholder=""
              />
            </Row>

            <div className="flex flex-col gap-2">
              <label htmlFor={`${uid}-m`} className="t-spec text-xs text-bone-dim">
                ANYTHING ELSE
              </label>
              <textarea
                id={`${uid}-m`}
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border border-kiln-3 bg-kiln-2 px-3 py-2.5 text-bone"
              />
            </div>

            <div>
              <button type="submit" className="cta inline-flex w-fit">
                Enquire
              </button>
              <p className="mt-3 text-sm text-bone-dim">
                Opens a message to {primaryEmail} with these details filled in. Nothing is
                sent until you send it.
              </p>
            </div>
          </form>

          <div className="grid content-start gap-8">
            <ContactBlock />
            <CoverageCalc />
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactBlock() {
  return (
    <div className="border border-kiln-3 p-5">
      <p className="text-xl" style={{ fontStretch: '110%' }}>
        {CONTACT.person}
      </p>

      <ul className="mt-3 grid gap-1.5 text-lg">
        {CONTACT.phones.map((p) => (
          <li key={p}>
            <a href={telHref(p)} className="underline underline-offset-4">
              {p}
            </a>
          </li>
        ))}
        {CONTACT.emails.map((e) => (
          <li key={e} className="break-all text-base">
            <a href={`mailto:${e}`} className="underline underline-offset-4">
              {e}
            </a>
          </li>
        ))}
      </ul>

      {/* deliberately not a second pill. the form's submit is the one primary action on
          this page, and two indigo buttons side by side would split it. */}
      <p className="mt-1.5 text-lg">
        <a href={waHref} className="underline underline-offset-4">
          WhatsApp
        </a>
      </p>

      <address className="mt-5 not-italic text-sm leading-relaxed text-bone-dim">
        {CONTACT.address.lines.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
        <span className="block">
          {CONTACT.address.city} {CONTACT.address.postalCode}, {CONTACT.address.region},{' '}
          {CONTACT.address.country}
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
      {/* label above the input, always. never a placeholder standing in for one. */}
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
        className={`border bg-kiln-2 px-3 py-2.5 text-bone ${
          error ? 'border-ember' : 'border-kiln-3'
        }`}
      />
      {error && (
        <p id={`${id}-err`} className="text-sm text-ember">
          {error}
        </p>
      )}
    </div>
  )
}
