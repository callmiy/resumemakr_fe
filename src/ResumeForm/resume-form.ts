export interface FormValues {
  first_name: string;
  last_name: string;
  profession: string;
  photo: File | null;
  address: string;
  email: string;
  date_of_birth: string;
  experience: Experience[];
}

export interface Experience {
  line1: string;
  line2: string;
  from_date: string;
  to_date?: string;
  texts: string[];
}

export const initialFormValues: FormValues = {
  first_name: "",
  last_name: "",
  profession: "",
  photo: null,
  address: "",
  email: "",
  date_of_birth: "",
  experience: [
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
