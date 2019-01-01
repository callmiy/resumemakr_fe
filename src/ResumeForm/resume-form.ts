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

import {
  Edu,
  validationSchema as edSchema,
  defaultVal as education
} from "./Education/education";

import {
  AdditionalSkill,
  defaultValue as additionSkill,
  validationSchema as addSkillSchema
} from "./AdditionalSkills/additional-skills";

import {
  Lang,
  defaultVal as lang,
  validationSchema as langSchema
} from "./Languages/languages";

export interface FormValues {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Edu[];
  additionalSkills: AdditionalSkill[];
  languages: Lang[];
}

export const initialFormValues: FormValues = {
  personalInfo,
  experiences: [experience],
  education: [education],
  additionalSkills: [additionSkill],
  languages: [lang]
};

export const validationSchema = Yup.object<FormValues>().shape({
  personalInfo: piSchema,
  experiences: Yup.array<Experience>().of<Experience>(expSchema),
  education: Yup.array<Edu>().of<Edu>(edSchema),
  additionalSkills: Yup.array<AdditionalSkill>().of<AdditionalSkill>(
    addSkillSchema
  ),
  languages: Yup.array<Lang>().of<Lang>(langSchema)
});

// sections by string key
export enum Section {
  personalInfo = "Personal Information",
  experiences = "Experiences",
  education = "Education",
  addSkills = "Additional Skills",
  langs = "Languages",
  hobbies = "Hobbies",
  skills = "Skills Summary"
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
