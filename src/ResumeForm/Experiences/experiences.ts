import * as Yup from "yup";

export interface ExperienceVal {
  line1: string;
  line2: string;
  from_date: string;
  to_date?: string;
  texts: string[];
}

export const emptyVals = {
  line1: "",
  line2: "",
  from_date: "",
  to_date: "",
  texts: []
};

export const validationSchema = Yup.object<ExperienceVal>().shape({
  line1: Yup.string()
    .required()
    .min(2),
  line2: Yup.string()
    .required()
    .min(2),
  from_date: Yup.string()
    .required()
    .min(2),
  to_date: Yup.string()
    .required()
    .min(2),
  texts: Yup.array<string>()
    .required()
    .min(1)
});

export const defaultVal: ExperienceVal = {
  line1: "IT Manager",
  line2: "Apple, New York City, NY",
  from_date: "2015-03-31",
  to_date: "2016-03-05",
  texts: [
    "Supervised the IT team in creating mobile apps providing the best user experience for Apple's customers all over the world.",

    "Developed, reviewed, and tested innovative and visionary new applications using emerging technologies.",

    "Guided talent that provides technical support and training while working in partnership with the business team."
  ]
};
