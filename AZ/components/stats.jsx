import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, Building, Clock } from "lucide-react"
import { CountUp } from "@/components/animations/count-up"
import { FadeIn } from "@/components/animations/fade-in"

export default function Stats() {
  const stats = [
    {
      icon: <Clock className="h-10 w-10 text-blue-600" />,
      value: 12,
      label: "Years of Experience",
      suffix: "+",
    },
    {
      icon: <Building className="h-10 w-10 text-blue-600" />,
      value: 150,
      label: "Projects Completed",
      suffix: "+",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-600" />,
      value: 50,
      label: "Expert Engineers",
      suffix: "+",
    },
    {
      icon: <Award className="h-10 w-10 text-blue-600" />,
      value: 25,
      label: "Industry Certifications",
      suffix: "+",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Achievements</h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <FadeIn key={index} delay={index * 100} direction="up">
              <Card className="text-center hover:shadow-md transition-shadow border-t-4 border-blue-600">
                <CardContent className="pt-6">
                  <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                    {stat.icon}
                  </div>
                  <h3 className="text-4xl font-bold mb-2 text-gray-800">
                    <CountUp end={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} />
                  </h3>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
