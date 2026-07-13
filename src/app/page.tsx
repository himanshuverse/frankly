import { BentoFeatures } from "@/components/bento-features"
import { Hero } from "@/components/hero"
import { LiveFeedbackDemo } from "@/components/live-feedback-demo"
import { Navbar } from "@/components/navbar"

const page = () => {
  return (
    <>
      <Navbar/>
      <main className="flex-1">
        <Hero/>
        <LiveFeedbackDemo/>
        <BentoFeatures/>
      </main>
    </>
  )
}

export default page