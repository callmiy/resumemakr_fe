import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, fireEvent } from "react-testing-library";

import ResumeForm from ".";
import { FormValues } from "./resume-form";
import { PersonalInfo } from "./PersonalInfo/personal-info";
import { Experience } from "./Experiences/experiences";
import { createFile } from "../test_utils";

it("navigates", () => {
  const file = createFile("dog.jpg", 1234, "image/jpeg");

  const experiences: Experience[] = [
    {
      line1: "Exp 1 line1",
      line2: "Exp 1 line2",
      from_date: "2015-01-01",
      to_date: "2016-02-02",
      texts: ["Exp 1 text 1"]
    }
  ];
  const personalInfo: PersonalInfo = {
    phone: "01348999",
    first_name: "First",
    last_name: "Last",
    date_of_birth: "1995-01-30",
    address: "Employee 1 address",
    email: "employee1@agency.com",
    profession: "Employee 1 profession",
    photo: file
  };

  const values: FormValues = {
    experiences,
    personalInfo
  };

  const { debug, getByTestId, queryByTestId, getByText, queryByText } = render(
    <ResumeForm initialValues={values} />
  );

  expect(getByTestId("personal-info-section")).toBeInTheDocument();
  expect(queryByTestId("experiences-section")).not.toBeInTheDocument();
  expect(queryByText(/Previous resume section /)).not.toBeInTheDocument();

  /**
   * NAVIGATION
   * 0. Personal Info
   * 1. Experiences
   * 2. Education
   * 3. Additional Skills
   */

  /**
   * When she clicks on the next button
   */
  let $next = getByText(/Next resume section experiences/i);
  fireEvent.click($next);

  /**
   * She sees that the personal info section is gone from page
   */
  expect(queryByTestId("personal-info-section")).not.toBeInTheDocument();

  /**
   * And education section is gone from page
   */
  expect(queryByTestId("education-section")).not.toBeInTheDocument();

  /**
   * And experience section is loaded
   */
  expect(getByTestId("experiences-section")).toBeInTheDocument();

  /**
   * And she sees the previous button which when hovered points to
   * personal info section
   */

  expect(
    getByText(/Previous resume section personal information/i)
  ).toBeInTheDocument();

  /**
   * And that additional skills section has not been loaded
   */
  expect(queryByTestId("additional-skills-section")).not.toBeInTheDocument();

  /**
   * And the next button when hovered points to education section
   */
  $next = getByText(/Next resume section education/i);

  /**
   * When she clicks on next button
   */
  fireEvent.click($next);

  /**
   * She sees that the experience section is gone from page
   */
  expect(queryByTestId("experiences-section")).not.toBeInTheDocument();

  /**
   * And education section is loaded
   */
  expect(getByTestId("education-section")).toBeInTheDocument();

  /**
   * And the previous button no longer points to personal information section
   */
  expect(
    queryByText(/Previous resume section personal information/i)
  ).not.toBeInTheDocument();

  /**
   * And that the previous button now points to experiences section
   */
  expect(getByText(/Previous resume section experiences/i)).toBeInTheDocument();

  /**
   * And that next button points to additional skills section
   */

  $next = getByText(/Next resume section additional skills/i);

  /**
   * When she clicks on the next button
   */
  fireEvent.click($next);

  /**
   * She sees that education section is gone from page
   */
  expect(queryByTestId("education-section")).not.toBeInTheDocument();

  /**
   * And that additional skills section is now loaded unto the page
   */

  expect(getByTestId("additional-skills-section")).toBeInTheDocument();

  /**
   * And that the previous button no longer points experiences sections
   */
  expect(
    queryByText(/Previous resume section experiences/i)
  ).not.toBeInTheDocument();

  /**
   * And that the previous button now points to education section
   */
  expect(getByText(/Previous resume section education/i)).toBeInTheDocument();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
