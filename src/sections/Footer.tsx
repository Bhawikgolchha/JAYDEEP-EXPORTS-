import { CONTACT, addressOneLine, telHref, primaryPhone, primaryEmail } from '../data/contact'

export function Footer() {
  return (
    <footer className="border-t border-kiln-3 px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-[1400px] gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-base" style={{ fontStretch: '116%', fontWeight: 700 }}>
            Jaydeep Exports
          </p>
          <p className="t-spec mt-1 text-xs text-bone-dim" style={{ letterSpacing: '0.16em' }}>
            TERRACOTTA JALI AND CLAY BRICK
          </p>
          <p className="mt-3 text-sm text-bone-dim">
            Manufactured by {CONTACT.works.name}, {CONTACT.works.since}.
          </p>
        </div>

        <address className="not-italic text-sm leading-relaxed text-bone-dim">
          {addressOneLine}
        </address>

        <ul className="grid gap-1.5 text-sm">
          <li>
            <a href={telHref(primaryPhone)} className="underline underline-offset-4">
              {primaryPhone}
            </a>
          </li>
          <li className="break-all">
            <a href={`mailto:${primaryEmail}`} className="underline underline-offset-4">
              {primaryEmail}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
