import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      price: 0,
      description: "For individuals just getting started",
      features: ["Basic features", "1 user", "100 MB storage", "Email support"],
      notIncluded: ["Advanced features", "Team collaboration", "Priority support"],
      popular: false,
    },
    {
      name: "Pro",
      price: 10,
      description: "Perfect for professionals and small teams",
      features: ["All Free features", "Advanced features", "5 users", "1 GB storage", "Priority email support"],
      notIncluded: ["24/7 phone support", "Custom integrations"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: 20,
      description: "For large teams and organizations",
      features: [
        "All Pro features",
        "Unlimited users",
        "10 GB storage",
        "24/7 phone support",
        "Custom integrations",
        "Dedicated account manager",
      ],
      notIncluded: [],
      popular: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h1>
      <p className="text-xl text-center text-muted-foreground mb-12">
        Select the perfect plan for your needs and start enjoying our services today.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`flex flex-col ${tier.popular ? "border-primary shadow-lg scale-105" : ""
              } transition-all duration-200 hover:shadow-xl`}
          >
            <CardHeader>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-4xl font-bold mb-4">
                ${tier.price}
                <span className="text-xl font-normal text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
                {tier.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-center text-muted-foreground">
                    <X className="h-5 w-5 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                {tier.price === 0 ? "Sign Up" : "Go to Stripe"}
              </Button>
            </CardFooter>
            {tier.popular && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-sm font-semibold py-1 px-3 rounded-bl-lg rounded-tr-lg">
                Popular
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

