import Logo from "@/components/subcomponents/Logo"
import Link from "next/link"
import Image from "next/image"
import facebook from "@/public/Facebook.png"
import line from "@/public/Line.png"
import instagram from "@/public/Instagram.png"
import tiktok from "@/public/TikTok.png"
import whatsapp from "@/public/WhatsApp.png"
import Syntactics from "@/public/syntactics.png"

export default function Footer() {
  return (
    <footer className="w-full py-12 px-4 md:px-6 lg:px-8 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Social Media Section */}
          <div className="flex flex-col space-y-4">
            <Logo />
            <h2 className="text-MD font-semibold mt-4 mb-3">Stay Connected</h2>
            <ul className="flex items-center space-x-4">
              <li>
                <Link href="#" aria-label="Facebook">
                  <div className="hover:opacity-80 transition-opacity">
                    <Image src={facebook} alt="Facebook" width={24} height={24} />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="#" aria-label="Line">
                  <div className="hover:opacity-80 transition-opacity">
                    <Image src={line} alt="Line" width={24} height={24} />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="#" aria-label="Instagram">
                  <div className="hover:opacity-80 transition-opacity">
                    <Image src={instagram} alt="Instagram" width={24} height={24} />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="#" aria-label="TikTok">
                  <div className="hover:opacity-80 transition-opacity">
                    <Image src={tiktok} alt="TikTok" width={24} height={24} />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="#" aria-label="WhatsApp">
                  <div className="hover:opacity-80 transition-opacity">
                    <Image src={whatsapp} alt="WhatsApp" width={24} height={24} />
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Section */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground ">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground ">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground ">
                  Web Application
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground ">
                  Download App
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground ">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground ">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground ">
                  Syntactics
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground ">
                  Terms of Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground ">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground ">
                  Productivity Tips
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground ">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground ">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section - Optional */}
        <div className="mt-12 pt-8 border-t border-muted/20 flex justify-around mb-[5vw]">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PomoSync
          </p>
          <p className="flex items-center text-sm text-muted-foreground gap-2">Powered by <span><Image src={Syntactics} alt="syntactics" width={120} height={100} /> </span></p>
        </div>
      </div>
      <div className="absolute bottom-[-60%] left-0 text-[#1A3104] font-extrabold -z-9999 mx-auto text-[22rem] select-none">
  PomoSync
</div>


    </footer>
  )
}

