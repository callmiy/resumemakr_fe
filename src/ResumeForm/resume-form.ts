import * as Yup from "yup";

import {
  ExperienceVal,
  validationSchema as expSchema,
  defaultVal as experience
} from "../Experiences/experiences";

import {
  PersonalInfoVal,
  defaultVal as personalInfo,
  validationSchema as piSchema
} from "../PersonalInfo/personal-info";

import {
  EducationVal,
  validationSchema as edSchema,
  defaultVal as education
} from "../Education/education";

import {
  AdditionalSkillVal,
  defaultValue as additionSkill,
  validationSchema as addSkillSchema
} from "../AdditionalSkills/additional-skills";

import {
  LanguageVal,
  defaultVal as lang,
  validationSchema as langSchema
} from "../Languages/languages";

import {
  SkillVal,
  defaultVal as skills,
  validationSchema as skillsSchema
} from "../Skills/skills";

import { HobbyVal, defaultVal as hobby } from "../Hobbies/hobbies";

export interface FormValues {
  personalInfo: PersonalInfoVal;
  experiences: ExperienceVal[];
  education: EducationVal[];
  additionalSkills?: AdditionalSkillVal[];
  languages?: LanguageVal[];
  hobbies?: HobbyVal[];
  skills: SkillVal[];
}

export const initialFormValues: FormValues = {
  personalInfo,
  experiences: [experience],
  education: [education],
  additionalSkills: [additionSkill],
  languages: [lang],
  hobbies: [hobby],
  skills
};

export const validationSchema = Yup.object<FormValues>().shape({
  personalInfo: piSchema,
  experiences: Yup.array<ExperienceVal>()
    .of<ExperienceVal>(expSchema)
    .required(),
  education: Yup.array<EducationVal>()
    .of<EducationVal>(edSchema)
    .required(),
  skills: Yup.array<SkillVal>()
    .of<SkillVal>(skillsSchema)
    .required(),
  additionalSkills: Yup.array<AdditionalSkillVal>().of<AdditionalSkillVal>(
    addSkillSchema
  ),
  languages: Yup.array<LanguageVal>().of<LanguageVal>(langSchema),
  hobbies: Yup.array<HobbyVal>()
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
