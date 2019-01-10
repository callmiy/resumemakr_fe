import * as Yup from "yup";

import { CreateSkillInput } from "../graphql/apollo-gql";

export const defaultVal: CreateSkillInput[] = [
  {
    description: "Programming and App Development",
    achievements: [
      "Developed and built 20+ mobile apps and 30+ websites providing exceptional user experience.",
      "Named BCD M&E’s “Top Programmer of The Year” for three consecutive years 2009-2011.",
      "15+ years experience in C, C++, Cocoa, and Objective-C.",
      "C Certified Professional Programmer (2006), C++ Certified Professional Programmer (2009)."
    ]
  },

  {
    description: "Leadership",
    achievements: [
      "8+ years experience in team management (teams of 10-50 colleagues) and project coordination.",
      "Designed and implemented a new IT management model with Apple’s New York Branch, increasing the quarterly productivity by 33% and resulting in increase in employee satisfaction.",
      "Trained and mentored 50+ junior developers for certification exams (88% success rate)."
    ]
  },

  {
    description: "Business Management",
    achievements: [
      "Coordinated 20+ projects with a budget over $200,000.",
      "Optimized procurement processes to reduce BCD M&E’s annual costs by 27%.",
      "Successfully cooperated with sales and marketing teams on new business strategies which helped increase Apple New York’s sales volume by 23%."
    ]
  }
];

export const emptyVals: CreateSkillInput[] = [
  {
    description: "",
    achievements: []
  }
];

export const validationSchema = Yup.object<CreateSkillInput>().shape({
  description: Yup.string()
    .required()
    .min(2),
  achievements: Yup.array<string>()
    .required()
    .min(1)
});
