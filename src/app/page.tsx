import { Hero } from "@/components/hero"
import { Navbar } from "@/components/navbar"

const page = () => {
  return (
    <>
      <Navbar/>
      <div className="flex-1">
        <Hero/>
      </div>
    </>
  )
}

export default page