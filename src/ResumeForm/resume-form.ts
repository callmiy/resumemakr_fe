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

// sections by string key
export enum Section {
  personalInfo = "Personal Information",
  experiences = "Experiences",
  education = "Education",
  addSkills = "Additional Skills"
}

export const [sectionsList, sectionsLen]: [Section[], number] = (function() {
  const keys = Object.values(Section);

  return [keys, keys.length] as [Section[], number];
})();

export const toSection = (current: Section, to: "next" | "prev") => {
  const currentIndex = sectionsList.indexOf(current);
  let lift = 0;

  if (to === "next") {
    lift = 1;
  } else if (to === "prev") {
    lift = currentIndex > 0 ? -1 : 0;
  }

  return sectionsList[(currentIndex + lift) % sectionsLen];
};

export const lastSectionIndex = sectionsLen - 1;
