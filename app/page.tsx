"use client"
import Header from "@/components/subcomponents/header"
import Footer from "@/components/subcomponents/footer"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import Image from "next/image"
import kamot from '@/public/hand2.png';
import GooglePlay from '@/public/playstore.png';
import AppStore from '@/public/apple.png';
import Polka1 from '@/public/polkadots1.png';
import Polka2 from '@/public/polkadots2.png';
import iPad from '@/public/ipad.png';
import phone from '@/public/phone.png';
import turbo from '@/public/turbo.png';
import tools from '@/public/tools.png';
import electric from '@/public/electric.png';
import gift from '@/public/gift.png';


export default function Home() {
  useEffect(() => {
    const firstTimeUser = JSON.parse(localStorage.getItem("firstTimeUser") ?? "true")

    if (firstTimeUser) {
      localStorage.setItem("firstTimeUser", JSON.stringify(false))
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-x-hidden ">
      <Header />

      <section className="flex flex-col lg:flex-row w-full h-[100vh] pt-24 md:pt-32 lg:pt-40">

        <div className=" flex items-end w-full lg:w-1/2 order-2 lg:order-1 lg:pr-[4vw] xl:pr-[8vw] mb-8 lg:mb-0">
          <div className="relative">
            <div className="absolute  z-[-1] top-[0px] left-[90px]">
            <Image src={Polka1} alt="Polkadots" className="w-[281px] h-[351px]" />
            </div>
            <Image 
              src={kamot}
              alt="PomoSync App Illustration" 
              width={800}
              height={800} 
              priority
              className="w-[800px] h-auto"
                style={{
                  objectFit: "contain",
                }}/>
          </div>
          
        </div>

        
        <div className="relative flex items-center w-full lg:w-1/2 px-6 lg:px-0 order-1 lg:order-2 mb-10 pb-[100px] lg:mb-0">
          <Image src={Polka2} alt="Polkadots" layout="" className="w-[281px] h-[351px] absolute z-[-1] bottom-[10px] right-[-30px] opacity-0 md:opacity-100" />
          <div className="w-full lg:w-[90%] xl:w-[80%] 2xl:w-[70%] flex flex-col gap-4 md:gap-5">
            <div className="inline-flex items-center w-fit rounded-full border border-gray-700 px-2 py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm">
              <span className="mr-2 rounded-full bg-black px-2 py-[5px] text-xs font-medium text-white">New</span>
              Your Productivity Companion
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight min-w-0 flex-shrink-0">
              Master Your Time with the Ultimate Pomodoro Timer
            </h1>
            <p className="text-[#2A7523] text-sm sm:text-base md:text-lg lg:text-xl font-light">
              Escape the clutter and chaos--Whether you're tackling work, studying, or managing tasks, PomoSync helps
              you stay on track with focused work sessions and strategic breaks.
            </p>
            <div className="buttons flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 mt-2">
              <Button className="font-bold text-base sm:text-lg md:text-xl py-4 px-5 md:p-6 rounded-2xl md:rounded-3xl bg-white text-black border-[0.1em] border-[#84CC16] w-full sm:w-auto">
                Explore Features
              </Button>
              <Button className="font-bold text-base sm:text-lg md:text-xl py-4 px-5 md:p-6 rounded-2xl md:rounded-3xl bg-[#84CC16] text-white w-full sm:w-auto">
                Get App for free
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="relative w-full overflow-hidden">
        <div
          className="absolute inset-0 rounded-tl-[6vw] rounded-tr-[6vw] bg-gradient-to-b from-[#3BBC00] via-black to-black"
          style={{
            backgroundSize: "100% 100%",
            backgroundPosition: "0 0",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          }}
        ></div>

        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
          <h2 className="text-black opacity-50 text-xl md:text-2xl font-light tracking-widest mb-2 md:mb-4">INTRODUCING</h2>
          <h1 className="text-black opacity-50 text-5xl md:text-7xl lg:text-8xl font-bold mb-8 md:mb-12">PomoSync</h1>

          {/* Large responsive image */}
          <div className="w-full max-w-5xl mx-auto mt-4">
            <Image
              src={iPad}
              alt="PomoSync on iPad"
              width={1200}
              height={800}
              priority
              className="w-full h-auto"
              style={{
                objectFit: "contain",
              }}
            />
          </div>
        </div>

      </section>
      <section className="text-white bg-black px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="top flex flex-col md:flex-row pt-5">
            <div className="flex flex-col">
              <div className="inline-flex items-center w-fit rounded-full border border-gray-700 px- py-1.5 sm:px-2 sm:py-2 text-xs sm:text-sm">
                <span className="mr-2 rounded-full bg-white px-1.5 py-0.5 text-xs font-bold text-black">Our Features</span>
                made for your convenience
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight min-w-0 flex-shrink-0">Optimize Your Time, Maximize Your Focus.</h1>
            </div>
            <div className="flex items-center">
              <p className="text-[#37A52D]">
                Stay in control of your productivity with powerful tools designed for deep focus, seamless workflow, and smarter time management.
              </p>
            </div>
          </div>
          <div className="w-full bg-black text-white py-12 px-4 md:px-8 relative overflow-hidden">
            {/* Green accent dots */}
            <div className="absolute top-1/4 left-12 w-3 h-3 rounded-full bg-green-500 opacity-70"></div>
            <div className="absolute bottom-1/3 left-24 w-2 h-2 rounded-full bg-green-500 opacity-50"></div>
            <div className="absolute top-1/2 right-1/4 w-4 h-4 rounded-full bg-green-500 opacity-30"></div>
            <div className="absolute bottom-1/4 left-1/3 w-5 h-5 rounded-full bg-green-500 opacity-20"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-green-500 opacity-10"></div>

            <div className="content flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              <ul className="flex flex-wrap gap-8 lg:w-1/2">
                <li className="transition-transform hover:-translate-y-1 duration-300 w-full sm:w-[calc(50%-1rem)]">
                  <div className="bg-zinc-900 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4 shadow-lg">
                    <Image src={turbo} alt="" width={24} height={24} />
                  </div>
                  <h1 className="text-xl font-bold mb-2">Seamless Focus Sessions</h1>
                  <p className="text-gray-400 text-sm">
                    Customize your work and break intervals to match your productivity rhythm.
                  </p>
                </li>

                <li className="transition-transform hover:-translate-y-1 duration-300 w-full sm:w-[calc(50%-1rem)]">
                  <div className="bg-zinc-900 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4 shadow-lg">
                    <Image src={electric} alt="" width={24} height={24} />
                  </div>
                  <h1 className="text-xl font-bold mb-2">Seamless Focus Sessions</h1>
                  <p className="text-gray-400 text-sm">
                    Customize your work and break intervals to match your productivity rhythm.
                  </p>
                </li>

                <li className="transition-transform hover:-translate-y-1 duration-300 w-full sm:w-[calc(50%-1rem)]">
                  <div className="bg-zinc-900 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4 shadow-lg">
                    <Image src={tools} alt="" width={24} height={24} />
                  </div>
                  <h1 className="text-xl font-bold mb-2">Seamless Focus Sessions</h1>
                  <p className="text-gray-400 text-sm">
                    Customize your work and break intervals to match your productivity rhythm.
                  </p>
                </li>

                <li className="transition-transform hover:-translate-y-1 duration-300 w-full sm:w-[calc(50%-1rem)]">
                  <div className="bg-zinc-900 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4 shadow-lg">
                    <Image src={gift} alt="" width={24} height={24} />
                  </div>
                  <h1 className="text-xl font-bold mb-2">Seamless Focus Sessions</h1>
                  <p className="text-gray-400 text-sm">
                    Customize your work and break intervals to match your productivity rhythm.
                  </p>
                </li>

                <li className="transition-transform hover:-translate-y-1 duration-300 w-full sm:w-[calc(50%-1rem)] sm:mx-auto">
                  <div className="bg-zinc-900 p-4 rounded-lg w-14 h-14 flex items-center justify-center mb-4 shadow-lg">
                    <Image src={electric} alt="" width={24} height={24} />
                  </div>
                  <h1 className="text-xl font-bold mb-2">Seamless Focus Sessions</h1>
                  <p className="text-gray-400 text-sm">
                    Customize your work and break intervals to match your productivity rhythm.
                  </p>
                </li>
              </ul>

              <div className="lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0 relative">
                <Image
                  src={phone}
                  alt="phone"
                  width={1200}
                  height={1000}
                  className="object-contain z-10 scale-125 lg:scale-150 xl:scale-[1.75]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-black py-10 px-4">
        <div className="bg-gradient-to-r from-[#00BEC5] to-[#7FFF00] max-w-[82em] mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-8 rounded-2xl">
          {/* Left Side: Text Content */}
          <div className="max-w-lg text-black text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-[3rem] font-extrabold mb-2">Your Time, Your Rules</h1>
            <p className="text-md font-light">
              PomoSync isn't just a timer—it's a productivity companion designed to help you stay
              focused, energized, and efficient. Say goodbye to distractions and hello to deep work sessions.
            </p>
          </div>

          <div className="flex flex-col mt-auto sm:flex-row gap-4">
            <button className="bg-black text-white px-5 py-3 flex items-center gap-2 rounded-lg">
              <Image 
                src={GooglePlay}
                alt="Google Play"
                width={24}
                height={24}
                className="h-6"
              />

              <div className="text-left">
                <p className="text-xs">GET IT ON</p>
                <h1 className="text-base font-semibold">Google Play</h1>
              </div>
            </button>

            <button className="bg-black text-white px-5 py-3 flex items-center gap-2 rounded-lg">
            <Image 
                src={AppStore}
                alt="App Store"
                width={24}
                height={24}
                className="h-7"
              />
              <div className="text-left">
                <p className="text-xs">Download on the</p>
                <h1 className="text-base font-semibold">App Store</h1>
              </div>
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </main>

  )
}

