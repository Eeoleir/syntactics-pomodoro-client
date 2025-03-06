import { motion } from "motion/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function InvalidSessionDialog() {
  const router = useRouter();
  const translations = useTranslations('components.force-login-dialog')

  return (
    <div className="absolute w-screen h-screen top-0 left-0 bg-black/50 z-50 flex justify-center items-center">
      <motion.div
        initial={{scale: 0.8, opacity:0}}
        animate={{scale: 1, opacity: 1}}
        className="p-8 border-zinc-800 border rounded-md bg-zinc-950 flex flex-col w-[450px]"
      >
        <div className="flex flex-col space-y-1">
          <h4 className="text-white text-base font-semibold">{translations('header')}</h4>
          <p className="text-white text-sm">{translations('subheader')}</p>
        </div>
        <div className="flex flex-row justify-end mt-5">
          <Button onClick={() => {router.push('/login')}} className="col-span-1 dark:text-white" variant="outline">{translations('buttons.continue.text')}</Button>
        </div>
      </motion.div>
    </div>
  )
}
