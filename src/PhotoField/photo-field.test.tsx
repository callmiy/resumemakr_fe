import React from "react";
import "jest-dom/extend-expect";
import "react-testing-library/cleanup-after-each";
import { render, wait, fireEvent } from "react-testing-library";

import PhotoField from ".";
import { createFile, uploadFile } from "../test_utils";

it("changes to preview on file select", async () => {
  const { ui } = setUp();
  const { getByLabelText, getByTestId, queryByTestId } = render(ui);

  expect(getByTestId("photo-select")).toBeInTheDocument();
  expect(queryByTestId("photo-preview")).not.toBeInTheDocument();

  uploadFile(
    getByLabelText("Upload Photo"),
    createFile("dog.jpg", 1234, "image/jpeg")
  );

  expect(queryByTestId("photo-select")).not.toBeInTheDocument();
});

it("toggles edit buttons on mouse move on preview", () => {
  const { ui } = setUp();
  const { getByLabelText, getByTestId, queryByTestId } = render(ui);

  uploadFile(
    getByLabelText("Upload Photo"),
    createFile("dog.jpg", 1234, "image/jpeg")
  );

  expect(queryByTestId("photo-field_overlay")).not.toBeInTheDocument();
  expect(queryByTestId("photo-field_edit-btns")).not.toBeInTheDocument();

  const $preview = getByTestId("photo-preview");
  expect($preview.classList).not.toContain("touched");

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
});

it("shows edit buttons when preview clicked", () => {
  const { ui } = setUp();
  const { getByLabelText, getByTestId, queryByTestId } = render(ui);

  uploadFile(
    getByLabelText("Upload Photo"),
    createFile("dog.jpg", 1234, "image/jpeg")
  );

  expect(queryByTestId("photo-field_overlay")).not.toBeInTheDocument();
  expect(queryByTestId("photo-field_edit-btns")).not.toBeInTheDocument();

  const $preview = getByTestId("photo-preview");
  expect($preview.classList).not.toContain("touched");

  fireEvent.click($preview);
  expect($preview.classList).toContain("touched");
  expect(getByTestId("photo-field_overlay")).toBeInTheDocument();
  expect(getByTestId("photo-field_edit-btns")).toBeInTheDocument();
});

it("deletes photo", () => {
  const { ui, mockRemoveFilePreview } = setUp();
  const { getByLabelText, getByTestId, getByText, queryByTestId } = render(ui);

  uploadFile(
    getByLabelText("Upload Photo"),
    createFile("dog.jpg", 1234, "image/jpeg")
  );

  expect(mockRemoveFilePreview.mock.calls.length).toBe(1);

  fireEvent.mouseEnter(getByTestId("photo-preview"));
  fireEvent.click(getByText("Remove"));
  expect(mockRemoveFilePreview.mock.calls.length).toBe(2);
  expect(queryByTestId("photo-preview")).not.toBeInTheDocument();
});

it("changes photo", () => {
  const { mockSetFieldValue, ui, fieldName } = setUp();
  const { getByLabelText, getByTestId } = render(ui);

  const file1 = createFile("dog.jpg", 1234, "image/jpeg");
  const file2 = createFile("cat.jpg", 2345, "image/jpeg");
  uploadFile(getByLabelText("Upload Photo"), file1);
  expect(mockSetFieldValue.mock.calls[0]).toEqual([fieldName, file1]);

  fireEvent.mouseEnter(getByTestId("photo-preview"));
  uploadFile(getByLabelText("Change photo"), file2);
  expect(mockSetFieldValue.mock.calls[1]).toEqual([fieldName, file2]);
});

it("cleans up in unmount", async () => {
  const { mockRemoveFilePreview, ui } = setUp();
  const { unmount } = render(ui);

  await wait(() => expect(unmount()).toBe(true));
  expect(mockRemoveFilePreview.mock.calls.length).toBe(1);
});

it("does not set field value if no file selected", async () => {
  const { mockSetFieldValue, ui } = setUp();

  const { getByLabelText } = render(ui);

  uploadFile(getByLabelText("Upload Photo"));
  expect(mockSetFieldValue).not.toBeCalled();
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
////////////////////////// HELPER FUNCTIONS ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function setUp(fieldName: string = "photo") {
  // tslint:disable-next-line:no-any
  const PhotoField1 = PhotoField as any;
  const mockSetFieldValue = jest.fn();
  const mockRemoveFilePreview = jest.fn();

  return {
    ui: (
      <PhotoField1
        field={{ name: fieldName }}
        form={{
          setFieldValue: mockSetFieldValue
        }}
        removeFilePreview={mockRemoveFilePreview}
      />
    ),
    mockSetFieldValue,
    mockRemoveFilePreview,
    fieldName
  };
}
