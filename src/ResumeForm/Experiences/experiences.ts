import * as Yup from "yup";

export interface ExperienceVal {
  position: string;
  companyName: string;
  from_date: string;
  to_date?: string;
  achievements: string[];
}

export const emptyVals = {
  position: "",
  companyName: "",
  from_date: "",
  to_date: "",
  achievements: []
};

export const validationSchema = Yup.object<ExperienceVal>().shape({
  position: Yup.string()
    .required()
    .min(2),
  companyName: Yup.string()
    .required()
    .min(2),
  from_date: Yup.string()
    .required()
    .min(2),
  to_date: Yup.string()
    .required()
    .min(2),
  achievements: Yup.array<string>()
    .required()
    .min(1)
});

export const defaultVal: ExperienceVal = {
  position: "IT Manager",
  companyName: "Apple, New York City, NY",
  from_date: "2015-03-31",
  to_date: "2016-03-05",
  achievements: [
    "Supervised the IT team in creating mobile apps providing the best user experience for Apple's customers all over the world.",

    "Developed, reviewed, and tested innovative and visionary new applications using emerging technologies.",

    "Guided talent that provides technical support and training while working in partnership with the business team."
  ]
};
