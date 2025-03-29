import { Card, CardHeader } from "@/components/ui/card";
import {
  CloudAlert,
  FolderSync,
  InfinityIcon,
  RadioTower,
  ShieldUser,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: RadioTower,
    title: "Real-Time Collaboration",
    description:
      "Work with your team in real time, with instant updates and no lag.",
  },
  {
    icon: CloudAlert,
    title: "Offline-First",
    description:
      "No WiFi? No problem. Keep working, and your changes will sync automatically when you're back online.",
  },
  {
    icon: FolderSync,
    title: "Automatic Cloud Sync",
    description:
      "All your work is securely stored and accessible across devices—with Dexie Cloud sync during the free trial or with a Pro plan.",
  },
  {
    icon: ShieldUser,
    title: "No Login Required",
    description:
      "Start using the app immediately. No sign-up barriers—just start drawing."
  },
  {
    icon: InfinityIcon,
    title: "Infinite Canvas",
    description:
      "Expand your ideas without limits—sketch, write, and organize as freely as you need.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Creativity",
    description:
      "Instantly generate text and images using Pollinations.ai—perfect for brainstorming, storytelling, and ideation.",
  },
];

const Features = () => {
  return (
    <div id="features" className="max-w-screen-xl mx-auto w-full py-20 px-6">
      <h2 className="text-4xl md:text-5xl md:leading-[3.5rem] font-bold tracking-tight sm:max-w-xl sm:text-center sm:mx-auto">
        Features
      </h2>
      <div className="mt-14 w-full mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="flex flex-col border rounded-xl overflow-hidden shadow-none"
          >
            <CardHeader>
              <feature.icon />
              <h4 className="!mt-3 text-xl font-bold tracking-tight">
                {feature.title}
              </h4>
              <p className="mt-1 text-muted-foreground text-[17px]">
                {feature.description}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Features;
