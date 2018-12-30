import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render } from "react-testing-library";

import ResumeForm from ".";
import { FormValues, Experience } from "./resume-form";
import { fillField, createFile, uploadFile } from "../test_utils";

it("filling the form", () => {
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

  const values: FormValues = {
    phone: "01348999",
    first_name: "First",
    last_name: "Last",
    date_of_birth: "1995-01-30",
    address: "Employee 1 address",
    email: "employee1@agency.com",
    experiences,
    profession: "Employee 1 profession",
    photo: null
  };

  const { debug, getByLabelText } = render(<ResumeForm />);

  uploadFile(getByLabelText("Upload Photo"), file);
  fillField(getByLabelText("First name"), values.first_name);
  fillField(getByLabelText("Last name"), values.last_name);
  fillField(getByLabelText(/Date of birth/), values.date_of_birth);
  fillField(getByLabelText("Profession"), values.profession);
  fillField(getByLabelText("Address"), values.address);
  fillField(getByLabelText("Email"), values.email);

  fillField(getByLabelText(/Line 1/), values.experiences[0].line1);
  fillField(getByLabelText(/Line 2/), values.experiences[0].line2);
  fillField(getByLabelText("Date from"), values.experiences[0].from_date);
  fillField(getByLabelText(/Date to/), values.experiences[0].to_date as string);

  fillField(
    getByLabelText("Experience 1 text"),
    values.experiences[0].texts[0]
  );

  // debug();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
