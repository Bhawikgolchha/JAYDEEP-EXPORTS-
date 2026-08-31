// Global RFQ State and Cart Store for Multi-Product Architectural Specifiers
import { useSyncExternalStore } from 'react'
import type { PatternId } from './patterns'
import { CONTACT } from './contact'

export type ClayFinish = 'clay' | 'charcoal' | 'sand' | 'ochre'
export type RFQUnit = 'pieces' | 'sqft' | 'sqm'
export type RFQApplication = 'facade' | 'screen' | 'partition' | 'cladding' | 'other'
export type Incoterm = 'FOB' | 'CIF' | 'CFR' | 'EXW'
export type PortOfLoading = 'Mundra' | 'Nhava Sheva'

export interface RFQLineItem {
  id: string
  productSlug: string
  productName: string
  patternId?: PatternId
  finish: ClayFinish
  quantity: number
  unit: RFQUnit
  application: RFQApplication
  customNotes?: string
  estimatedPieces?: number
}

export interface SpecifierInfo {
  name: string
  company: string
  email: string
  phone: string
  countryOrPort: string
  incoterm: Incoterm
  portOfLoading: PortOfLoading
  projectTimeline: string
  notes: string
}

export interface RFQState {
  isOpen: boolean
  items: RFQLineItem[]
  specifier: SpecifierInfo
}

const STORAGE_KEY = 'jaydeep_rfq_cart_v1'

const DEFAULT_SPECIFIER: SpecifierInfo = {
  name: '',
  company: '',
  email: '',
  phone: '',
  countryOrPort: '',
  incoterm: 'FOB',
  portOfLoading: 'Mundra',
  projectTimeline: '1-3 months',
  notes: '',
}

function loadInitialState(): RFQState {
  if (typeof window === 'undefined') {
    return { isOpen: false, items: [], specifier: DEFAULT_SPECIFIER }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        isOpen: false,
        items: Array.isArray(parsed.items) ? parsed.items : [],
        specifier: { ...DEFAULT_SPECIFIER, ...parsed.specifier },
      }
    }
  } catch (e) {
    console.warn('Failed to load RFQ cart from localStorage', e)
  }
  return { isOpen: false, items: [], specifier: DEFAULT_SPECIFIER }
}

let currentState: RFQState = loadInitialState()
const listeners = new Set<() => void>()

function emitChange() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: currentState.items, specifier: currentState.specifier }),
      )
    } catch (e) {
      console.warn('Failed to persist RFQ cart', e)
    }
  }
  listeners.forEach((listener) => listener())
}

export const rfqStore = {
  getSnapshot(): RFQState {
    return currentState
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  openDrawer() {
    currentState = { ...currentState, isOpen: true }
    emitChange()
  },

  closeDrawer() {
    currentState = { ...currentState, isOpen: false }
    emitChange()
  },

  toggleDrawer() {
    currentState = { ...currentState, isOpen: !currentState.isOpen }
    emitChange()
  },

  addItem(item: Omit<RFQLineItem, 'id'> & { id?: string }) {
    const id = item.id || `item_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const calculatedPieces = calculateItemPieces(item.quantity, item.unit)
    const newItem: RFQLineItem = {
      ...item,
      id,
      estimatedPieces: calculatedPieces,
    }
    currentState = {
      ...currentState,
      isOpen: true,
      items: [...currentState.items, newItem],
    }
    emitChange()
  },

  updateItem(id: string, updates: Partial<RFQLineItem>) {
    currentState = {
      ...currentState,
      items: currentState.items.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, ...updates }
        updated.estimatedPieces = calculateItemPieces(updated.quantity, updated.unit)
        return updated
      }),
    }
    emitChange()
  },

  removeItem(id: string) {
    currentState = {
      ...currentState,
      items: currentState.items.filter((i) => i.id !== id),
    }
    emitChange()
  },

  clearCart() {
    currentState = { ...currentState, items: [] }
    emitChange()
  },

  updateSpecifier(updates: Partial<SpecifierInfo>) {
    currentState = {
      ...currentState,
      specifier: { ...currentState.specifier, ...updates },
    }
    emitChange()
  },
}

export function useRfqCart() {
  const state = useSyncExternalStore(rfqStore.subscribe, rfqStore.getSnapshot, () => ({
    isOpen: false,
    items: [],
    specifier: DEFAULT_SPECIFIER,
  }))
  return {
    ...state,
    openDrawer: rfqStore.openDrawer,
    closeDrawer: rfqStore.closeDrawer,
    toggleDrawer: rfqStore.toggleDrawer,
    addItem: rfqStore.addItem,
    updateItem: rfqStore.updateItem,
    removeItem: rfqStore.removeItem,
    clearCart: rfqStore.clearCart,
    updateSpecifier: rfqStore.updateSpecifier,
  }
}

/**
 * Converts sqft / sqm to standard 8x8 in (203.2 mm) module block count.
 */
export function calculateItemPieces(quantity: number, unit: RFQUnit): number {
  if (!quantity || quantity <= 0) return 0
  if (unit === 'pieces') return Math.round(quantity)
  if (unit === 'sqft') {
    // 1 block is 8" x 8" = 64 sq inches = 0.4444 sq ft
    // Blocks needed per sqft = 1 / 0.4444 = 2.25 blocks/sqft
    return Math.ceil(quantity * 2.25 * 1.05) // includes +5% reserve
  }
  if (unit === 'sqm') {
    // 1 block is 0.2032 x 0.2032 m = 0.04129 sqm
    // Blocks needed per sqm = 24.22 blocks/sqm
    return Math.ceil(quantity * 24.22 * 1.05) // includes +5% reserve
  }
  return Math.round(quantity)
}

/**
 * Calculates total pieces, pallets, and gross MT for a set of RFQ line items.
 */
export function calculateCartMetrics(items: RFQLineItem[]) {
  const totalPieces = items.reduce((sum, item) => sum + (item.estimatedPieces || calculateItemPieces(item.quantity, item.unit)), 0)
  const pallets = Math.ceil(totalPieces / 450)
  const netWeightKg = totalPieces * 3.2
  const grossWeightKg = netWeightKg + (pallets * 25)
  const grossWeightMT = grossWeightKg / 1000
  return {
    totalPieces,
    pallets,
    netWeightKg,
    grossWeightKg,
    grossWeightMT: Number(grossWeightMT.toFixed(2)),
  }
}

/**
 * Generates structured, professional WhatsApp inquiry text.
 */
export function buildWhatsAppRfqPayload(items: RFQLineItem[], specifier: SpecifierInfo): string {
  const metrics = calculateCartMetrics(items)
  const portName = specifier.portOfLoading === 'Mundra' ? 'Mundra Port (INMUN)' : 'Nhava Sheva (INNSA)'

  let text = `*ARCHITECTURAL EXPORT RFQ — JAYDEEP EXPORTS*\n`
  text += `----------------------------------------\n`
  text += `*SPECIFIER DETAILS*\n`
  text += `• Name: ${specifier.name || 'Architect/Specifier'}\n`
  if (specifier.company) text += `• Firm/Company: ${specifier.company}\n`
  if (specifier.email) text += `• Email: ${specifier.email}\n`
  if (specifier.phone) text += `• Phone: ${specifier.phone}\n`
  text += `• Destination: ${specifier.countryOrPort || '[Please specify target port]'}\n`
  text += `• Trade Terms: ${specifier.incoterm} | Port of Loading: ${portName}\n`
  text += `• Project Timeline: ${specifier.projectTimeline}\n\n`

  text += `*ITEMIZED PRODUCT SCHEDULE (${items.length} ${items.length === 1 ? 'item' : 'items'})*\n`
  if (items.length === 0) {
    text += `(No items selected in cart — general specification enquiry)\n`
  } else {
    items.forEach((item, idx) => {
      const pieces = item.estimatedPieces || calculateItemPieces(item.quantity, item.unit)
      text += `${idx + 1}. *${item.productName}*\n`
      text += `   - Finish: ${item.finish.toUpperCase()} | App: ${item.application}\n`
      text += `   - Qty: ${item.quantity} ${item.unit} (~${pieces.toLocaleString()} blocks)\n`
      if (item.customNotes) text += `   - Notes: ${item.customNotes}\n`
    })
  }

  text += `\n*ESTIMATED LOGISTICS SUMMARY*\n`
  text += `• Total Estimated Blocks: ${metrics.totalPieces.toLocaleString()}\n`
  text += `• Pallets (ISPM-15 HT): ${metrics.pallets} Pallets (450 blocks/pallet)\n`
  text += `• Gross Shipping Weight: ~${metrics.grossWeightMT} MT\n`

  if (specifier.notes) {
    text += `\n*SPECIAL ARCHITECTURAL REQUIREMENTS*\n${specifier.notes}\n`
  }

  text += `----------------------------------------\n`
  text += `Please provide an official export quotation with FOB/CIF ocean freight rates.`

  return encodeURIComponent(text)
}

/**
 * Generates RFC-compliant mailto URL.
 */
export function buildMailtoRfqPayload(items: RFQLineItem[], specifier: SpecifierInfo): string {
  const metrics = calculateCartMetrics(items)
  const portName = specifier.portOfLoading === 'Mundra' ? 'Mundra Port (INMUN)' : 'Nhava Sheva (INNSA)'

  const subject = `Export RFQ: ${specifier.name || 'Architect'} - ${specifier.countryOrPort || 'Export Destination'} (${items.length} items)`

  let body = `Dear Gautam Bhansali / Jaydeep Exports Team,\n\n`
  body += `I would like to request an official export quotation for the following architectural terracotta specifications:\n\n`
  body += `SPECIFIER & PROJECT DETAILS\n`
  body += `--------------------------------------------------\n`
  body += `Name               : ${specifier.name}\n`
  body += `Company/Practice   : ${specifier.company || 'N/A'}\n`
  body += `Email              : ${specifier.email}\n`
  body += `Phone/WhatsApp     : ${specifier.phone || 'N/A'}\n`
  body += `Destination Country: ${specifier.countryOrPort}\n`
  body += `Incoterms          : ${specifier.incoterm}\n`
  body += `Port of Loading    : ${portName}\n`
  body += `Timeline           : ${specifier.projectTimeline}\n\n`

  body += `ITEMIZED PRODUCT SCHEDULE\n`
  body += `--------------------------------------------------\n`
  if (items.length === 0) {
    body += `General specification enquiry.\n`
  } else {
    items.forEach((item, idx) => {
      const pieces = item.estimatedPieces || calculateItemPieces(item.quantity, item.unit)
      body += `${idx + 1}. Product: ${item.productName}\n`
      body += `   Finish: ${item.finish.toUpperCase()} | Application: ${item.application}\n`
      body += `   Specification Quantity: ${item.quantity} ${item.unit} (~${pieces.toLocaleString()} blocks)\n`
      if (item.customNotes) body += `   Notes: ${item.customNotes}\n`
      body += `\n`
    })
  }

  body += `ESTIMATED SHIPPING METRICS\n`
  body += `--------------------------------------------------\n`
  body += `Total Estimated Blocks : ${metrics.totalPieces.toLocaleString()}\n`
  body += `Estimated Pallets      : ${metrics.pallets} (450 blocks per ISPM-15 pallet)\n`
  body += `Gross Weight (inc tare): ~${metrics.grossWeightMT} MT\n\n`

  if (specifier.notes) {
    body += `ADDITIONAL REQUIREMENTS & DRAWING ATTACHMENTS\n`
    body += `--------------------------------------------------\n`
    body += `${specifier.notes}\n\n`
  }

  body += `Please reply with product availability, lead time, and FOB/CIF freight breakdown.\n\n`
  body += `Kind regards,\n${specifier.name}`

  return `mailto:${CONTACT.emails[0]}?cc=${CONTACT.emails[1]}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
