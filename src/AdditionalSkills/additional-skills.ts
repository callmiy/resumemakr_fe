import * as Yup from "yup";

export interface AdditionalSkillVal {
  description: string;
  ratingDescription?: string;
}

export const defaultValue: AdditionalSkillVal = {
  description: "Adobe Photoshop",
  ratingDescription: "Excellent"
};

export const emptyValue: AdditionalSkillVal = {
  description: "",
  ratingDescription: ""
};

export const validationSchema = Yup.object<AdditionalSkillVal>().shape({
  description: Yup.string()
    .required()
    .min(2),
  ratingDescription: Yup.string()
});
