import * as Yup from "yup";

export interface EducationVal {
  school: string;
  course: string;
  from_date?: string;
  to_date?: string;
  achievements?: string[];
}

export const emptyVal: EducationVal = {
  school: "",
  course: "",
  from_date: "",
  to_date: "",
  achievements: []
};

export const defaultVal: EducationVal = {
  school: "The City College of New York, New York City, NY",
  course: "MS in Computer Science, Distinction",
  from_date: "02/2013",
  to_date: "03/2015",
  achievements: ["Graduated summer cum laude", "President of student union"]
};

export const validationSchema = Yup.object<EducationVal>().shape({
  school: Yup.string()
    .required()
    .min(5),
  course: Yup.string()
    .required()
    .min(5),
  from_date: Yup.string(),
  to_date: Yup.string(),
  achievements: Yup.array<string>()
});
