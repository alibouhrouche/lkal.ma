import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free Trial",
    price: 0,
    description:
      "Try all features for free with unlimited boards and real-time collaboration.",
    features: [
      "✅ Offline functionality",
      "✅ Real-time collaboration",
      "🚫 No cloud sync after 30 days",
    ],
    buttonText: "Get started for free",
  },
  {
    name: "Pro Plan",
    price: 29,
    isRecommended: true,
    description:
      "Unlock unlimited boards, cloud sync, and advanced features for your team.",
    features: [
      "✅ Unlimited boards & cloud sync",
      "✅ Priority access to new features",
      "✅ Secure team collaboration",
      "✅ Increased rate limits",
    ],
    buttonText: "Upgrade to Pro",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "Get custom pricing for your team with advanced features and support.",
    features: [
      "✅ Custom branding & white-labeling",
      "✅ Dedicated account manager",
      "✅ Advanced analytics & reporting",
    ],
    buttonText: "Contact us",
  },
];

const Pricing = () => {
  return (
    <div id="pricing" className="max-w-screen-lg mx-auto py-20 px-6">
      <h1 className="text-5xl font-bold text-center tracking-tight">Pricing</h1>
      <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 items-center gap-8 lg:gap-0">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative bg-accent/50 border p-7 rounded-xl lg:rounded-none lg:first:rounded-l-xl lg:last:rounded-r-xl",
              {
                "bg-background border-[2px] border-primary py-12 !rounded-xl":
                  plan.isPopular,
              }
            )}
          >
            {plan.isPopular && (
              <Badge className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2">
                Most Popular
              </Badge>
            )}
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p className="mt-2 text-4xl font-bold">{Number.isInteger(plan.price) ? `$${plan.price}` : plan.price}</p>
            <p className="mt-4 font-medium text-muted-foreground">
              {plan.description}
            </p>
            <Separator className="my-6" />
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  {/* <CircleCheck className="h-4 w-4 mt-1 text-green-600" /> */}
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.isPopular ? "default" : "outline"}
              size="lg"
              className="w-full mt-6 rounded-full"
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
