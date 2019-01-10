import * as Yup from "yup";

export interface LanguageVal {
  description: string;
  ratingDescription?: string;
}

export const defaultVal: LanguageVal = {
  description: "Spanish",
  ratingDescription: "C1"
};

export const emptyVal: LanguageVal = {
  description: "",
  ratingDescription: ""
};

export const validationSchema = Yup.object<LanguageVal>().shape({
  description: Yup.string()
    .required()
    .min(2),
  ratingDescription: Yup.string()
});
