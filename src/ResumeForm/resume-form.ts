import * as Yup from "yup";

import {
  Experience,
  validationSchema as expSchema,
  defaultVal as experience
} from "./Experiences/experiences";

import {
  PersonalInfo,
  defaultVal as personalInfo,
  validationSchema as piSchema
} from "./PersonalInfo/personal-info";

export interface FormValues {
  personalInfo: PersonalInfo;
  experiences: Experience[];
}

export const initialFormValues: FormValues = {
  personalInfo,
  experiences: [experience]
};

export const validationSchema = Yup.object<FormValues>().shape({
  personalInfo: piSchema,
  experiences: Yup.array<Experience>().of<Experience>(expSchema)
});
