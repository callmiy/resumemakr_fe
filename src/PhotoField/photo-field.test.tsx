import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, wait, fireEvent } from "react-testing-library";

import PhotoField from ".";
import { createFile, uploadFile } from "../test_utils";

it("behaves correctly", async () => {
  // tslint:disable-next-line:no-any
  const PhotoField1 = PhotoField as any;
  const file = createFile("dog.jpg", 1234, "image/jpeg");
  const name = "photo";
  const mockSetFieldValue = jest.fn();
  const mockRemoveFilePreview = jest.fn();

  const { getByTestId, queryByTestId, getByText, unmount } = render(
    <PhotoField1
      field={{ name }}
      form={{
        setFieldValue: mockSetFieldValue
      }}
      removeFilePreview={mockRemoveFilePreview}
    />
  );

  expect(getByTestId("photo-select")).toBeInTheDocument();
  expect(queryByTestId("photo-preview")).not.toBeInTheDocument();

  uploadFile(getByTestId(`photo-input-${name}`), file);

  await wait(() => expect(mockSetFieldValue).toBeCalledWith(name, file));
  expect(queryByTestId("photo-select")).not.toBeInTheDocument();
  const $preview = getByTestId("photo-preview");

  // MOUSE AND CLICK EVENTS
  expect($preview.classList).not.toContain("touched");
  expect(queryByTestId("photo-field_overlay")).not.toBeInTheDocument();
  expect(queryByTestId("photo-field_edit-btns")).not.toBeInTheDocument();

  // MOUSE ENTER
  fireEvent.mouseEnter($preview);
  expect($preview.classList).toContain("touched");
  expect(getByTestId("photo-field_overlay")).toBeInTheDocument();
  expect(getByTestId("photo-field_edit-btns")).toBeInTheDocument();

  // MOUSE LEAVE
  fireEvent.mouseLeave($preview);
  expect($preview.classList).not.toContain("touched");
  expect(queryByTestId("photo-field_overlay")).not.toBeInTheDocument();
  expect(queryByTestId("photo-field_edit-btns")).not.toBeInTheDocument();

  // MOUSE CLICK
  fireEvent.click($preview);
  expect($preview.classList).toContain("touched");
  expect(getByTestId("photo-field_overlay")).toBeInTheDocument();
  expect(getByTestId("photo-field_edit-btns")).toBeInTheDocument();

  // CHANGING PHOTO
  fireEvent.mouseEnter($preview);
  fireEvent.click(getByText("Remove"));
  expect(getByTestId("photo-select")).toBeInTheDocument();
  expect(queryByTestId("photo-preview")).not.toBeInTheDocument();

  // WE RE UPLOAD THE FILE TO TEST componentWillUnmount
  uploadFile(getByTestId(`photo-input-${name}`), file);
  await wait(() => expect(unmount()).toBe(true));
  const [calledFile] = mockRemoveFilePreview.mock.calls[0];
  expect(file).not.toHaveProperty("preview");
  expect(calledFile).toHaveProperty("preview");
});

it("does not set field value if no file selected", async () => {
  // tslint:disable-next-line:no-any
  const PhotoField1 = PhotoField as any;
  const name = "photo";
  const mockSetFieldValue = jest.fn();

  const { getByTestId, queryByTestId } = render(
    <PhotoField1
      field={{ name }}
      form={{
        setFieldValue: mockSetFieldValue
      }}
    />
  );

  expect(getByTestId("photo-select")).toBeInTheDocument();
  expect(queryByTestId("photo-preview")).not.toBeInTheDocument();

  uploadFile(getByTestId(`photo-input-${name}`));
  await wait(() => expect(mockSetFieldValue).not.toBeCalled());
});
