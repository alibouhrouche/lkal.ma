import { Separator } from "@/components/ui/separator";
import { Logo } from "../logo";
import { SiGithub, SiInstagram, SiX } from "@icons-pack/react-simple-icons";


const Footer = () => {
  return (
    <footer className="mt-20 dark bg-background border-t">
      <div className="max-w-screen-xl mx-auto py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6 xl:px-0">
        <div className="col-span-full xl:col-span-2">
          <Logo />

          <p className="mt-4 text-muted-foreground">
            <span className="text">The best whiteboarding tool for remote teams.</span>
          </p>
        </div>
      </div>
      <Separator />
      <div className="max-w-screen-xl mx-auto py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
        {/* Copyright */}
        <span className="text text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Lkalma By {" "}
          <a className="underline" href="https://iev.digital" target="_blank">
            IEV Digital Ltd
          </a>. Crafted By <a className="underline" href="https://ali.js.org" target="_blank">
            Ali Bouhrouche
          </a>
          . All rights reserved.
        </span>

        <div className="flex items-center gap-5 text-muted-foreground">
          <a href="https://x.com/lkalma_app" target="_blank">
            <SiX className="h-5 w-5" />
          </a>
          <a href="https://www.instagram.com/lkal.ma" target="_blank">
            <SiInstagram className="h-5 w-5" />
          </a>
          <a href="https://github.com/alibouhrouche/lkal.ma" target="_blank">
            <SiGithub className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
