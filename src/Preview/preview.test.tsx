import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render } from "react-testing-library";

import { createFile } from "../test_utils";
import Preview from ".";
import { Mode } from "./preview";
import { PersonalInfoVal } from "../ResumeForm/PersonalInfo/personal-info";
import { ExperienceVal } from "../ResumeForm/Experiences/experiences";
import { EducationVal } from "../ResumeForm/Education/education";
import { FormValues } from "../ResumeForm/resume-form";
import { SkillVal } from "../ResumeForm/Skills/skills";
import { AdditionalSkillVal } from "../ResumeForm/AdditionalSkills/additional-skills";
import { HobbyVal } from "../ResumeForm/Hobbies/hobbies";
import { LanguageVal } from "../ResumeForm/Languages/languages";

it("renders form preview", () => {
  const photo = createFile("kanmii.jpg", 12345, "image/jpeg");

  const personalInfoOthers = {
    first_name: "Kanmii",
    last_name: "Ademii",
    email: "a@b.com",
    phone: "010388736633",
    address: "67 Williams Butler street Kings Plaza",
    date_of_birth: "2015-06-12",
    profession: "IT manager"
  };

  const personalInfo: PersonalInfoVal = {
    ...personalInfoOthers,
    photo
  };

  const expOthers = {
    position: "Account Manager",
    companyName: "Union Bank PLC",
    from_date: "03/2014",
    to_date: "04/2015"
  };

  const experience: ExperienceVal = {
    ...expOthers,
    achievements: [
      "Took the company to the highest level",
      "Trained 6000 company employees"
    ]
  };

  const education: EducationVal = {
    school: "Community college",
    course: "Psychoanalysis"
  };

  const skill: SkillVal = {
    description: "App development",
    achievements: ["Built 1000 apps", "Saved my company money"]
  };

  const additionalSkill: AdditionalSkillVal = {
    description: "Adobe photoshop"
  };

  const hobbies: HobbyVal[] = ["Singing", "Swimming", "dancing"];

  const language: LanguageVal = {
    description: "English",
    ratingDescription: "fluent"
  };

  const values: FormValues = {
    personalInfo,
    experiences: [experience],
    education: [education],
    skills: [skill],
    additionalSkills: [additionalSkill],
    hobbies,
    languages: [language]
  };

  const { getByText, getByAltText } = render(
    <Preview values={values} mode={Mode.download} />
  );

  expect(
    getByAltText(`${personalInfo.first_name} ${personalInfo.last_name} photo`)
  ).toBeInTheDocument();

  for (const exp of Object.values(expOthers)
    .concat(Object.values(language))
    .concat(Object.values(additionalSkill))
    .concat(Object.values(personalInfoOthers))
    .concat(Object.values(education))
    .concat(experience.achievements)
    .concat([skill.description])
    .concat(skill.achievements)
    .concat(hobbies)) {
    expect(getByText(new RegExp(exp, "i"))).toBeInTheDocument();
  }

  // debug();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
