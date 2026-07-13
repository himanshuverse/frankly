import { BentoFeatures } from "@/components/bento-features"
import { Footer } from "@/components/footer"
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
        <Footer/>
      </main>
    </>
  )
}

export default page