import * as Yup from "yup";

export interface FormValues {
  first_name: string;
  last_name: string;
  profession: string;
  phone: string;
  photo?: File | null;
  address: string;
  email: string;
  date_of_birth: string;
  experiences: Experience[];
}

export interface Experience {
  line1: string;
  line2: string;
  from_date: string;
  to_date?: string;
  texts: string[];
}

export const initialFormValues: FormValues = {
  first_name: "Christian",
  last_name: "Hybrid",
  profession: "IT Manager",
  phone: "202-555-0177",
  photo: null,
  address: `970 Drummond Street
  Newark, NJ 07102
  USA`,
  email: "christian.w.hybrid@gmail.com",
  date_of_birth: "",
  experiences: [
    {
      line1: "IT Manager",
      line2: "Apple, New York City, NY",
      from_date: "2015-03-31",
      to_date: "2016-03-05",
      texts: [
        "Supervised the IT team in creating mobile apps providing the best user experience for Apple's customers all over the world.",

        "Developed, reviewed, and tested innovative and visionary new applications using emerging technologies.",

        "Guided talent that provides technical support and training while working in partnership with the business team."
      ]
    }
  ]
};

export const emptyExperience = {
  line1: "",
  line2: "",
  from_date: "",
  to_date: "",
  texts: []
};

export const validationSchema = Yup.object<FormValues>().shape({
  phone: Yup.string()
    .required()
    .min(2),
  first_name: Yup.string()
    .required()
    .min(2),
  last_name: Yup.string()
    .required()
    .min(2),
  profession: Yup.string()
    .required()
    .min(2),
  address: Yup.string()
    .required()
    .min(2),
  email: Yup.string()
    .email()
    .required()
    .min(2),
  date_of_birth: Yup.string()
    .required()
    .min(2),
  experiences: Yup.array<Experience>().of<Experience>(
    Yup.object<Experience>().shape({
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
    })
  )
});
