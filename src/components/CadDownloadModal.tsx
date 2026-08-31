import { useState, useEffect, useRef } from 'react'
import {
  ASTM_STANDARDS,
  TECHNICAL_SPECS,
  CAD_PACKAGES,
  SEAPORT_SPECS,
  PALLET_SPECS,
  type CadPackageItem,
  generateDxfContent,
  generateObjContent,
  generateBimManifest,
  generateTdsDocument,
  triggerFileDownload,
} from '../data/astmSpecs'
import { PATTERNS, PATTERN_IDS, type PatternId } from '../data/patterns'

type TabType = 'specs' | 'cad' | 'logistics'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialPattern?: PatternId
}

export function CadDownloadModal({ isOpen, onClose, initialPattern = 'star' }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [activeTab, setActiveTab] = useState<TabType>('specs')
  const [selectedPattern, setSelectedPattern] = useState<PatternId>(initialPattern)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadedList, setDownloadedList] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    } else if (!isOpen && dialog.open) {
      dialog.close()
      document.body.style.overflow = ''
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleDownload = (pkg: CadPackageItem) => {
    setDownloadingId(pkg.id)
    const patternLabel = PATTERNS[selectedPattern]?.label || 'Star'

    setTimeout(() => {
      try {
        if (pkg.extension === '.dxf') {
          const content = generateDxfContent(patternLabel)
          triggerFileDownload(`Jaydeep_Terracotta_Jali_${patternLabel}_2D_CAD.dxf`, content, 'application/dxf')
        } else if (pkg.extension === '.obj') {
          const content = generateObjContent(patternLabel)
          triggerFileDownload(`Jaydeep_Terracotta_Jali_${patternLabel}_3D_Mesh.obj`, content, 'text/plain')
        } else if (pkg.extension === '.rvt') {
          const content = generateBimManifest(patternLabel)
          triggerFileDownload(`Jaydeep_Terracotta_Jali_${patternLabel}_BIM_Properties.json`, content, 'application/json')
        } else if (pkg.extension === '.pdf') {
          const content = generateTdsDocument()
          triggerFileDownload(`Jaydeep_Terracotta_Jali_ASTM_C652_TDS_Certificate.txt`, content, 'text/plain')
        } else if (pkg.extension === '.zip') {
          const manifest = JSON.stringify(
            {
              package: 'Jaydeep Exports 4K PBR Material Suite',
              pattern: patternLabel,
              maps: [
                'Albedo_Diffuse_4K.png',
                'Roughness_4K.png',
                'Normal_OpenGL_4K.png',
                'Normal_DirectX_4K.png',
                'AmbientOcclusion_4K.png',
                'Displacement_Height_4K.png',
              ],
              material: 'Natural Kiln-Fired Alluvial Clay (Unsealed Matte)',
              specifications: 'ASTM C652 Grade SW Certified',
            },
            null,
            2,
          )
          triggerFileDownload(`Jaydeep_Terracotta_Jali_${patternLabel}_PBR_Manifest.json`, manifest, 'application/json')
        }
        setDownloadedList((prev) => ({ ...prev, [pkg.id]: true }))
      } catch (err) {
        console.error('Download trigger failed:', err)
      } finally {
        setDownloadingId(null)
      }
    }, 450)
  }

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
      className="fixed inset-0 z-50 m-auto max-h-[92vh] w-[min(94vw,62rem)] overflow-hidden border border-kiln-3 bg-kiln-2 p-0 text-bone shadow-2xl backdrop:bg-kiln/85 backdrop:backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cad-modal-title"
      aria-describedby="cad-modal-desc"
    >
      <div className="flex max-h-[92vh] flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-kiln-3 bg-kiln px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 id="cad-modal-title" className="text-xl font-bold text-bone" style={{ fontStretch: '112%' }}>
                ASTM C652 Spec Sheet & CAD/BIM Suite
              </h2>
              <span className="border border-ember/40 bg-kiln-2 px-2 py-0.5 text-xs text-ember">
                Grade SW • Type HBX
              </span>
            </div>
            <p id="cad-modal-desc" className="t-body mt-1 text-xs text-bone-dim">
              Certified architectural laboratory test data, CAD details, Revit BIM families, and export packing specifications.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="border border-kiln-3 bg-kiln-2 px-3 py-1.5 text-xs text-bone-dim transition-colors hover:border-ember hover:text-bone"
            aria-label="Close modal dialog"
          >
            Esc / Close ?
          </button>
        </div>

        {/* Tab Navigation & Pattern Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-kiln-3 bg-kiln px-6 py-2.5">
          <div className="flex items-center gap-1 border border-kiln-3 bg-kiln-2 p-0.5 text-xs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'specs'}
              onClick={() => setActiveTab('specs')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                activeTab === 'specs' ? 'bg-bone text-kiln' : 'text-bone-dim hover:text-bone'
              }`}
            >
              1. ASTM Engineering Data
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'cad'}
              onClick={() => setActiveTab('cad')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                activeTab === 'cad' ? 'bg-bone text-kiln' : 'text-bone-dim hover:text-bone'
              }`}
            >
              2. CAD & BIM Download Hub ({CAD_PACKAGES.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'logistics'}
              onClick={() => setActiveTab('logistics')}
              className={`px-3 py-1.5 font-medium transition-colors ${
                activeTab === 'logistics' ? 'bg-bone text-kiln' : 'text-bone-dim hover:text-bone'
              }`}
            >
              3. Seaport Logistics & Pallets
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="pattern-modal-select" className="t-spec text-[11px] text-bone-dim">
              ACTIVE PATTERN:
            </label>
            <select
              id="pattern-modal-select"
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value as PatternId)}
              className="border border-kiln-3 bg-kiln-2 px-2.5 py-1 text-xs text-bone focus:border-ember focus:outline-none"
            >
              {PATTERN_IDS.map((id) => (
                <option key={id} value={id}>
                  {PATTERNS[id].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: ASTM Engineering Data */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              {/* Standard Authority Badges */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {ASTM_STANDARDS.map((std) => (
                  <div key={std.code} className="border border-kiln-3 bg-kiln p-3">
                    <span className="t-spec text-xs text-ember">{std.authority} STANDARD</span>
                    <h4 className="mt-1 font-semibold text-sm text-bone">{std.code}</h4>
                    <p className="mt-1 text-[11px] text-bone-dim leading-relaxed">{std.description}</p>
                  </div>
                ))}
              </div>

              {/* Engineering Specs Table */}
              <div className="border border-kiln-3 bg-kiln">
                <div className="border-b border-kiln-3 px-4 py-3">
                  <h3 className="font-semibold text-sm text-bone" style={{ fontStretch: '108%' }}>
                    Certified Laboratory Physical & Mechanical Performance (ASTM C67 / C652 Testing)
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-kiln-3 bg-kiln-2 text-bone-dim font-medium">
                      <tr>
                        <th className="px-4 py-2.5">ENGINEERING PROPERTY</th>
                        <th className="px-4 py-2.5">TEST METHOD</th>
                        <th className="px-4 py-2.5">TESTED VALUE</th>
                        <th className="px-4 py-2.5">ASTM REQUIREMENT</th>
                        <th className="px-4 py-2.5 text-right">COMPLIANCE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-kiln-3">
                      {TECHNICAL_SPECS.map((spec) => (
                        <tr key={spec.property} className="hover:bg-kiln-2/60">
                          <td className="px-4 py-3 font-medium text-bone">
                            {spec.property}
                            <p className="mt-0.5 text-[11px] text-bone-dim font-normal">{spec.description}</p>
                          </td>
                          <td className="px-4 py-3 text-bone-dim font-mono">{spec.standard}</td>
                          <td className="px-4 py-3 font-semibold text-bone">{spec.testedValue}</td>
                          <td className="px-4 py-3 text-bone-dim">{spec.requirement}</td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`inline-block px-2 py-0.5 text-[10px] font-semibold ${
                                spec.status === 'EXCEEDS'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                                  : spec.status === 'CERTIFIED'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-700/50'
                                  : 'bg-kiln-3 text-bone border border-kiln-3'
                              }`}
                            >
                              {spec.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QC Certification Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 border border-kiln-3 bg-kiln p-4 text-xs text-bone-dim">
                <div>
                  <p className="font-semibold text-bone">National Potteries Quality Control Laboratory (Morbi)</p>
                  <p className="mt-0.5">Certificates conform to ASTM C652 Grade SW & European CE EN 771-1.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const content = generateTdsDocument()
                    triggerFileDownload('Jaydeep_Terracotta_Jali_ASTM_C652_TDS_Certificate.txt', content, 'text/plain')
                  }}
                  className="bg-bone px-3.5 py-1.5 font-medium text-kiln hover:bg-white"
                >
                  Download Certified Lab Report (TXT/PDF) &darr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CAD & BIM Download Hub */}
          {activeTab === 'cad' && (
            <div className="space-y-6">
              <div className="border border-kiln-3 bg-kiln p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-sm text-bone">
                      Download Architectural Packages for {PATTERNS[selectedPattern].label} Pattern
                    </h3>
                    <p className="mt-1 text-xs text-bone-dim">
                      Select individual file formats below or download the comprehensive specifier bundle.
                    </p>
                  </div>
                  <span className="text-xs text-bone-dim">
                    Standard 203.2 x 203.2 x 75 mm module
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {CAD_PACKAGES.map((pkg) => {
                  const isDownloading = downloadingId === pkg.id
                  const isDownloaded = downloadedList[pkg.id]

                  return (
                    <div
                      key={pkg.id}
                      className="flex flex-col justify-between border border-kiln-3 bg-kiln p-5 transition-colors hover:border-bone-dim/40"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="t-spec text-[11px] text-ember font-mono">{pkg.category}</span>
                          <span className="t-spec text-xs text-bone-dim">{pkg.fileSize}</span>
                        </div>

                        <h4 className="mt-2 text-base font-semibold text-bone" style={{ fontStretch: '108%' }}>
                          {pkg.title}
                        </h4>

                        <p className="mt-1.5 text-xs text-bone-dim leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="mt-3 border-t border-kiln-3 pt-3">
                          <p className="t-spec text-[10px] text-bone-dim mb-1">INCLUDED ASSETS:</p>
                          <ul className="space-y-1 text-xs text-bone">
                            {pkg.includes.map((inc, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="text-ember">•</span>
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-kiln-3">
                        <button
                          type="button"
                          onClick={() => handleDownload(pkg)}
                          disabled={isDownloading}
                          className={`w-full py-2 px-3 text-xs font-semibold transition-all ${
                            isDownloaded
                              ? 'border border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                              : 'bg-bone text-kiln hover:bg-white'
                          }`}
                        >
                          {isDownloading
                            ? 'Generating Package Manifest...'
                            : isDownloaded
                            ? `? Downloaded ${pkg.extension.toUpperCase()} Package (Click to Re-download)`
                            : `Download ${pkg.extension.toUpperCase()} Package (${pkg.fileSize}) &darr;`}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Seaport Logistics & Pallets */}
          {activeTab === 'logistics' && (
            <div className="space-y-6">
              {/* Pallet Stacking Standard */}
              <div className="border border-kiln-3 bg-kiln p-5">
                <div className="flex items-center justify-between border-b border-kiln-3 pb-3">
                  <div>
                    <span className="t-spec text-xs text-ember">EXPORT PACKAGING SPECIFICATION</span>
                    <h3 className="mt-1 text-base font-semibold text-bone">{PALLET_SPECS.type}</h3>
                  </div>
                  <span className="border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-1 text-xs text-emerald-300">
                    IPPC Certified HT Stamp
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="t-spec text-[11px] text-bone-dim">PALLET DIMENSIONS</p>
                    <p className="mt-1 font-semibold text-sm text-bone">{PALLET_SPECS.dimensionsMm}</p>
                    <p className="text-[10px] text-bone-dim">Width x Length x Height</p>
                  </div>

                  <div>
                    <p className="t-spec text-[11px] text-bone-dim">BLOCKS PER PALLET</p>
                    <p className="mt-1 font-semibold text-sm text-bone">{PALLET_SPECS.blocksPerPallet} units</p>
                    <p className="text-[10px] text-bone-dim">Stacked in interlocking courses</p>
                  </div>

                  <div>
                    <p className="t-spec text-[11px] text-bone-dim">GROSS WEIGHT / PALLET</p>
                    <p className="mt-1 font-semibold text-sm text-bone">~1,465 kg (1.465 MT)</p>
                    <p className="text-[10px] text-bone-dim">Includes {PALLET_SPECS.tareWeightKg} kg tare wood</p>
                  </div>

                  <div>
                    <p className="t-spec text-[11px] text-bone-dim">PROTECTIVE BARRIER</p>
                    <p className="mt-1 font-semibold text-sm text-bone">120µ Polyethylene</p>
                    <p className="text-[10px] text-bone-dim">UV shrink-wrap + PET straps</p>
                  </div>
                </div>

                <p className="mt-4 text-xs text-bone-dim leading-relaxed border-t border-kiln-3 pt-3">
                  {PALLET_SPECS.packaging}
                </p>
              </div>

              {/* Seaport Logistics Matrix */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Mundra Port */}
                <div className="border border-kiln-3 bg-kiln p-5">
                  <div className="flex items-center justify-between border-b border-kiln-3 pb-3">
                    <div>
                      <span className="t-spec text-xs text-emerald-400">RECOMMENDED PORT OF LOADING</span>
                      <h4 className="mt-1 text-lg font-bold text-bone">{SEAPORT_SPECS.mundra.name}</h4>
                    </div>
                    <span className="font-mono text-sm font-bold text-ember">{SEAPORT_SPECS.mundra.code}</span>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-bone-dim">Road Transit from Morbi:</span>
                      <span className="font-semibold text-bone">{SEAPORT_SPECS.mundra.transitFromMorbi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bone-dim">Max 20ft Container Payload:</span>
                      <span className="font-semibold text-emerald-400">{SEAPORT_SPECS.mundra.maxGrossContainerPayloadMT} MT (Highest)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bone-dim">Max Pallets / 20ft FCL:</span>
                      <span className="font-semibold text-bone">{SEAPORT_SPECS.mundra.palletLoadingMax}</span>
                    </div>
                    <div className="border-t border-kiln-3 pt-2">
                      <span className="text-bone-dim block mb-1">Liner Rotations:</span>
                      <p className="text-bone leading-relaxed">{SEAPORT_SPECS.mundra.linerServices}</p>
                    </div>
                  </div>
                </div>

                {/* Nhava Sheva (JNPT) */}
                <div className="border border-kiln-3 bg-kiln p-5">
                  <div className="flex items-center justify-between border-b border-kiln-3 pb-3">
                    <div>
                      <span className="t-spec text-xs text-bone-dim">SECONDARY PORT OF LOADING</span>
                      <h4 className="mt-1 text-lg font-bold text-bone">{SEAPORT_SPECS.nhavaSheva.name}</h4>
                    </div>
                    <span className="font-mono text-sm font-bold text-bone-dim">{SEAPORT_SPECS.nhavaSheva.code}</span>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-bone-dim">Road Transit from Morbi:</span>
                      <span className="font-semibold text-bone">{SEAPORT_SPECS.nhavaSheva.transitFromMorbi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bone-dim">Max 20ft Container Payload:</span>
                      <span className="font-semibold text-amber-400">{SEAPORT_SPECS.nhavaSheva.maxGrossContainerPayloadMT} MT (Statutory)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-bone-dim">Max Pallets / 20ft FCL:</span>
                      <span className="font-semibold text-bone">{SEAPORT_SPECS.nhavaSheva.palletLoadingMax}</span>
                    </div>
                    <div className="border-t border-kiln-3 pt-2">
                      <span className="text-bone-dim block mb-1">Liner Rotations:</span>
                      <p className="text-bone leading-relaxed">{SEAPORT_SPECS.nhavaSheva.linerServices}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-kiln-3 bg-kiln px-6 py-3 text-xs text-bone-dim">
          <span>Jaydeep Exports • National Potteries (Est. 1967)</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-bone px-4 py-1.5 font-medium text-kiln hover:bg-white"
            >
              Done / Return to Site
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
