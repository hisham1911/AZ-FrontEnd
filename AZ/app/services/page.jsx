import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { StaggerChildren } from "@/components/animations/stagger-children"

export default function ServicesPage() {
  const serviceCategories = [
    {
      id: "quality",
      name: "Quality Assurance & Controls",
      services: [
        "Ultrasonic Testing (UT)",
        "Magnetic Particle Testing (MT)",
        "Dye Penetrant Testing (PT)",
        "Visual Inspection (VT)",
        "Welders' inspection & qualification",
        "Coating/Painting Inspection",
      ],
    },
    {
      id: "field",
      name: "Field/Industrial Inspection",
      services: [
        "Pipeline welding inspection (land & marine)",
        "On-stream wall thickness measurement",
        "Pipe mill surveillance",
        "Refinery and plant equipment inspection",
        "Turnaround inspection services",
      ],
    },
    {
      id: "specialized",
      name: "Specialized Services",
      services: [
        "Vendor inspection",
        "Pre-commissioning testing",
        "Weld engineering and inspection",
        "Laboratory analysis & mechanical testing",
        "Mining and metallurgical analysis",
        "Rope Access Inspection (LEEA-certified)",
        "Tank integrity inspections (API Standard 653)",
        "Surface replication for early creep void detection",
        "Portable alloy analysis (PMI)",
      ],
    },
    {
      id: "training",
      name: "Technical Training Services",
      services: [
        "Customized technical training courses",
        "Lectures and group discussions",
        "Case studies & practical exercises",
        "Pre/post-tests and quizzes",
        "Educational videos",
        "Requalification in NDT techniques",
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <FadeIn>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Services</h1>

        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12 text-center">
          AZ INTERNATIONAL provides comprehensive inspection, testing, and training services adhering to the highest
          international standards.
        </p>
      </FadeIn>

      <FadeIn delay={200}>
        <Tabs defaultValue="quality" className="max-w-5xl mx-auto">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            {serviceCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {serviceCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-6">
              <FadeIn>
                <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
              </FadeIn>

              <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.services.map((service, index) => (
                  <Card
                    key={index}
                    className="border-l-4 border-blue-600 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{service}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </StaggerChildren>
            </TabsContent>
          ))}
        </Tabs>
      </FadeIn>
    </div>
  )
}
