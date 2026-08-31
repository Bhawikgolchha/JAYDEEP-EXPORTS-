// Everything here is transcribed from the company business card. Nothing is inferred.
//
// Note on the second email address: `jaydeepexporrts` carries a double r. That is what
// is printed on the card, so that is what ships. If it is a misprint, change it here and
// nowhere else.

export const CONTACT = {
  person: 'Gautam Bhansali',
  phones: ['+91 84602 12807', '+91 92277 38035'],
  emails: ['jaydeepexporrts@gmail.com', 'nationalpotteries1967@gmail.com'],
  /** digits only, no plus or spaces */
  whatsapp: '918460212807',
  address: {
    lines: ['C-10, Parshwanath Complex 2', 'Opp. Kuber Cinema, 8-A National Highway'],
    city: 'Morbi',
    postalCode: '363 642',
    region: 'Gujarat',
    country: 'India',
  },
  /** the manufacturing arm named on the card */
  works: { name: 'National Potteries', since: 1967 },
}

/** as printed on the card, under "Mfg & Suppliers of" */
export const SUPPLIES = [
  'Clay roofing',
  'Decorative tiles',
  'Terracotta jali blocks',
  'Terracotta wall cladding bricks',
  'Ceramic and vitrified tiles',
  'Sanitary ware',
]

export const primaryPhone = CONTACT.phones[0]
export const primaryEmail = CONTACT.emails[0]

export function telHref(v: string) {
  return `tel:${v.replace(/[^\d+]/g, '')}`
}

export const waHref = `https://wa.me/${CONTACT.whatsapp}`

export const addressOneLine = [
  ...CONTACT.address.lines,
  `${CONTACT.address.city} ${CONTACT.address.postalCode}`,
  `${CONTACT.address.region}, ${CONTACT.address.country}`,
].join(', ')

// Re-export RFQ state types & helpers for convenience
export * from './rfqState'
