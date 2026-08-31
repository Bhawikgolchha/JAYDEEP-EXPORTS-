import { useSunDriver } from './hooks/useSun'
import { Grain } from './components/Grain'
import { ChapterCourses } from './components/ChapterCourses'
import { FiringLoader } from './components/FiringLoader'
import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Light } from './sections/Light'
import { Catalogue } from './sections/Catalogue'
import { PatternViewer } from './sections/PatternViewer'
import { Bricks } from './sections/Bricks'
import { Applications } from './sections/Applications'
import { Made } from './sections/Made'
import { Enquire } from './sections/Enquire'
import { Footer } from './sections/Footer'

export default function App() {
  useSunDriver()

  return (
    <>
      <FiringLoader />

      <a
        href="#catalogue"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-bone focus:px-4 focus:py-2 focus:text-kiln"
      >
        Skip to the catalogue
      </a>

      <Nav />
      <ChapterCourses />

      <main>
        <Hero />
        <Light />
        <Catalogue />
        <hr className="joint mx-auto max-w-[1400px]" />
        <PatternViewer />
        <Bricks />
        <hr className="joint mx-auto max-w-[1400px]" />
        <Applications />
        <Made />
        <Enquire />
      </main>

      <Footer />
      <Grain />
    </>
  )
}
