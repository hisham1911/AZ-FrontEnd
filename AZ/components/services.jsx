import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, Microscope, Users, Shield, Wrench, Award } from "lucide-react"
import Link from "next/link"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren } from "@/components/animations/stagger-children"

export default function Services() {
  const services = [
    {
      icon: <FileCheck className="h-10 w-10 text-blue-600" />,
      title: "Quality Assurance & Controls",
      description: "Comprehensive testing including UT, MT, PT, VT, and welders' qualification.",
    },
    {
      icon: <Microscope className="h-10 w-10 text-blue-600" />,
      title: "Non-Destructive Testing",
      description: "Advanced NDT services for critical infrastructure and industrial applications.",
    },
    {
      icon: <Wrench className="h-10 w-10 text-blue-600" />,
      title: "Field/Industrial Inspection",
      description: "Pipeline welding inspection, wall thickness measurement, and equipment inspection.",
    },
    {
      icon: <Shield className="h-10 w-10 text-blue-600" />,
      title: "Specialized Services",
      description: "Rope access inspection, tank integrity inspections, and mechanical testing.",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-600" />,
      title: "Technical Training",
      description: "Customized training courses for engineers and technicians in various disciplines.",
    },
    {
      icon: <Award className="h-10 w-10 text-blue-600" />,
      title: "Certifications & Standards",
      description: "Services compliant with international standards and certifications.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <FadeIn className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            AZ INTERNATIONAL provides a comprehensive range of engineering and technical services to meet the diverse
            needs of our clients across various industries.
          </p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-2">
                <div className="mb-4">{service.icon}</div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link
                  href="/services"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm group flex items-center"
                >
                  Learn more{" "}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </CardContent>
            </Card>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
