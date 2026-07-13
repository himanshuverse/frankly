import { Hero } from "@/components/hero"
import { LiveFeedbackDemo } from "@/components/live-feedback-demo"
import { Navbar } from "@/components/navbar"

const page = () => {
  return (
    <>
      <Navbar/>
      <div className="flex-1">
        <Hero/>
        <LiveFeedbackDemo/>
      </div>
    </>
  )
}

export default page