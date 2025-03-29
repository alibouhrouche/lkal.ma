import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { PlusIcon } from "lucide-react";

const faq = [
  {
    question: "Can I use lkal.ma without an account?",
    answer:
      "Yes! You can start drawing right away without signing up.",
  },
  {
    question: "What happens after the free 30-day sync trial?",
    answer:
      "You can still use lkal.ma for free, but your data won't sync across devices unless you subscribe to a Pro plan.",
  },
  {
    question: "How does the AI generation feature work?",
    answer:
      "Using Pollinations.ai, you can generate images and text directly in lkal.ma, making it easy to create visuals, mind maps, or creative writing on the fly.",
  },
  {
    question: "Can I invite others to collaborate?",
    answer:
      "Yes! You can share a link to your board with anyone, and they can join you in real time.",
  },
  {
    question: "How does offline mode work?",
    answer:
      "Any changes you make offline are saved locally and sync automatically when you reconnect.",
  },
  {
    question: "Is AI generation available offline?",
    answer:
      "No, AI generation requires an internet connection. However, you can still use all other features offline.",
  },
  {
    question: "What if I don't want to store my data in the cloud?",
    answer:
      "You can use lkal.ma locally without cloud storage. Plus, you can export your boards anytime.",
  },
  {
    question: "Is there a mobile version?",
    answer:
      "lkal.ma works in the browser on all devices, with a dedicated mobile-friendly interface.",
  },
  {
    question: "What makes this different from other whiteboard apps?",
    answer:
      "Unlike other tools, we offer seamless offline sync, an infinite canvas, and a privacy-focused approach, ensuring your ideas remain yours.",
  },
];

const FAQ = () => {
  return (
    <div id="faq" className="w-full max-w-screen-xl mx-auto py-20 px-6">
      <h2 className="md:text-center text-4xl md:text-5xl !leading-[1.15] font-bold tracking-tighter">
        Frequently Asked Questions
      </h2>
      <p className="mt-1.5 md:text-center text-lg text-muted-foreground">
        Quick answers to common questions about our products and services.
      </p>

      <Accordion
        type="single"
        collapsible
          className="mt-8 space-y-4 gap-4"
      >
        {faq.map(({ question, answer }, index) => (
          <AccordionItem
            key={question}
            value={`question-${index}`}
            className="bg-accent py-1 px-4 rounded-xl border-none !mt-0 !mb-4 break-inside-avoid"
          >
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger
                className={cn(
                  "flex flex-1 items-center justify-between py-4 font-semibold tracking-tight transition-all hover:underline [&[data-state=open]>svg]:rotate-45",
                  "text-start text-lg"
                )}
              >
                {question}
                <PlusIcon className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200" />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="text-[15px]">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
