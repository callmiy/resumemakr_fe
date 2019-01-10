import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render } from "react-testing-library";

import {
  EducationInput,
  CreateExperienceInput,
  PersonalInfoInput,
  CreateSkillInput,
  RatedInput
} from "../graphql/apollo-gql";

import Preview from ".";
import { Mode } from "./preview";
import { HobbyVal } from "../Hobbies/hobbies";

it("renders form preview", () => {
  const personalInfoOthers = {
    firstName: "Kanmii",
    lastName: "Ademii",
    email: "a@b.com",
    phone: "010388736633",
    address: "67 Williams Butler street Kings Plaza",
    dateOfBirth: "2015-06-12",
    profession: "IT manager"
  };

  const personalInfo: PersonalInfoInput = {
    ...personalInfoOthers,
    photo: "photo"
  };

  const expOthers = {
    position: "Account Manager",
    companyName: "Union Bank PLC",
    fromDate: "03/2014",
    toDate: "04/2015"
  };

  const experience: CreateExperienceInput = {
    ...expOthers,
    achievements: [
      "Took the company to the highest level",
      "Trained 6000 company employees"
    ]
  };

  const education: EducationInput = {
    school: "Community college",
    course: "Psychoanalysis",
    fromDate: "06/2017"
  };

  const skill: CreateSkillInput = {
    description: "App development",
    achievements: ["Built 1000 apps", "Saved my company money"]
  };

  const additionalSkill: RatedInput = {
    description: "Adobe photoshop"
  };

  const hobbies: HobbyVal[] = ["Singing", "Swimming", "dancing"];

  const language: RatedInput = {
    description: "English",
    level: "fluent"
  };

  const values = {
    personalInfo,
    experiences: [experience],
    education: [education],
    skills: [skill],
    additionalSkills: [additionalSkill],
    hobbies,
    languages: [language]
  };

  const { getByText, getByTestId } = render(
    <Preview values={values} mode={Mode.download} />
  );

  expect(
    getByTestId(`${personalInfo.firstName} ${personalInfo.lastName} photo`)
  ).toBeInTheDocument();

  for (const exp of Object.values(expOthers)
    .concat(Object.values(language))
    .concat(Object.values(additionalSkill))
    .concat(Object.values(personalInfoOthers))
    .concat(Object.values(education))
    .concat(experience.achievements as string[])
    .concat([skill.description])
    .concat(skill.achievements as string[])
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
