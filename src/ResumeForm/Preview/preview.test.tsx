import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render } from "react-testing-library";

import Preview from ".";
import { PersonalInfoVal } from "../PersonalInfo/personal-info";
import { ExperienceVal } from "../Experiences/experiences";
import { EducationVal } from "../Education/education";
import { FormValues } from "../resume-form";
import { SkillVal } from "../Skills/skills";
import { createFile } from "../../test_utils";

it("renders form preview", () => {
  const photo = createFile("kanmii.jpg", 12345, "image/jpeg");

  const personalInfoOthers = {
    first_name: "Kanmii",
    last_name: "Ademii",
    email: "a@b.com",
    phone: "010388736633",
    address: "67 Williams Butler street\nKings Plaza",
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
    from_date: "2014-03-03",
    to_date: "2015-04-25"
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

  const values: FormValues = {
    personalInfo,
    experiences: [experience],
    education: [education],
    skills: [skill]
  };

  const { debug, getByText, getByAltText } = render(
    <Preview values={values} />
  );

  expect(
    getByAltText(`${personalInfo.first_name} ${personalInfo.last_name} photo`)
  ).toBeInTheDocument();

  for (const exp of Object.values(expOthers)
    .concat(Object.values(personalInfoOthers))
    .concat(Object.values(education))
    .concat(experience.achievements)
    .concat([skill.description])
    .concat(skill.achievements)) {
    expect(getByText(exp)).toBeInTheDocument();
  }

  debug();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
