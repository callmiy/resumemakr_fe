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

  const { getByTestId, queryByTestId, getByText, queryByText } = render(
    <ResumeForm initialValues={values} />
  );

  expect(getByTestId("personal-info-section")).toBeInTheDocument();
  expect(queryByTestId("experiences-section")).not.toBeInTheDocument();
  expect(queryByText(/Previous resume section /)).not.toBeInTheDocument();

  // NAVIGATE FORWARD 1
  let $next = getByText(/Next resume section experiences/i);
  fireEvent.click($next);

  expect(queryByTestId("personal-info-section")).not.toBeInTheDocument();
  expect(queryByTestId("education-section")).not.toBeInTheDocument();
  expect(getByTestId("experiences-section")).toBeInTheDocument();
  expect(
    getByText(/Previous resume section personal information/i)
  ).toBeInTheDocument();

  // NAVIGATE FORWARD 2
  $next = getByText(/Next resume section education/i);
  fireEvent.click($next);

  expect(queryByTestId("personal-info-section")).not.toBeInTheDocument();
  expect(queryByTestId("experiences-section")).not.toBeInTheDocument();
  expect(getByTestId("education-section")).toBeInTheDocument();
  expect(
    queryByText(/Previous resume section personal information/i)
  ).not.toBeInTheDocument();
  expect(getByText(/Previous resume section experiences/i)).toBeInTheDocument();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
