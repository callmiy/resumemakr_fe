import React, { createRef } from "react";
import { FieldProps } from "formik";
import { Icon, Modal, Button } from "semantic-ui-react";

import {
  FileChooser,
  Thumb,
  EditorContainer,
  ChangePhoto,
  UploadPhotoIconWrap,
  InputFile,
  ConfirmDeleteModal
} from "./photo-field-styles";
interface Props<Values> extends FieldProps<Values> {
  removeFilePreview?: () => void;
}
interface State {
  url?: string;
  fileState: FileState;
  open?: boolean;
}

enum FileState {
  previewing = "previewing",
  clean = "clean",
  touched = "touched",
  deleted = "deleted"
}

export class PhotoField<Values> extends React.Component<Props<Values>, State> {
  state: State = {
    fileState: FileState.clean,
    url: this.props.field.value
  };

  inputRef = createRef<HTMLInputElement>();

  render() {
    const { fileState } = this.state;

    return (
      <>
        {(fileState === FileState.previewing ||
          fileState === FileState.touched) &&
          this.renderThumb()}

        {(fileState === FileState.clean || fileState === FileState.deleted) && (
          <FileChooser>
            <UploadPhotoIconWrap>
              <Icon name="camera" />
            </UploadPhotoIconWrap>

            {this.renderFileInput("Upload Photo")}
          </FileChooser>
        )}

        {this.renderModal()}
      </>
    );
  }

  renderThumb = () => {
    const { fileState, url } = this.state;

    if (!url) {
      return null;
    }

    return (
      <Thumb
        url={url}
        data-testid="photo-preview"
        onClick={this.touch}
        onMouseLeave={this.unTouch}
        onMouseEnter={this.touch}
      >
        {fileState === FileState.touched && (
          <EditorContainer data-testid="edit-btns">
            {this.renderFileInput("Change photo")}

            <ChangePhoto
              onClick={evt => {
                evt.stopPropagation();
                this.setState({ open: true });
              }}
            >
              <Icon name="delete" /> Remove
            </ChangePhoto>
          </EditorContainer>
        )}
      </Thumb>
    );
  };

  private renderFileInput = (label: string) => {
    const {
      field: { name: fieldName }
    } = this.props;

    return (
      <>
        <ChangePhoto htmlFor={fieldName}>
          <Icon name="upload" /> {label}
        </ChangePhoto>

        <InputFile
          ref={this.inputRef}
          name={fieldName}
          id={fieldName}
          onChange={this.handleFileUpload}
        />
      </>
    );
  };

  private renderModal = () => {
    return (
      <ConfirmDeleteModal open={this.state.open}>
        <Modal.Header>Removing photo</Modal.Header>

        <Modal.Content>
          <Modal.Description>
            <div>Do you really want to remove photo?</div>
          </Modal.Description>
        </Modal.Content>

        <Modal.Actions>
          <Button
            positive={true}
            icon="remove"
            labelPosition="right"
            content="No"
            onClick={() => {
              this.setState({ open: false });
            }}
          />

          <Button
            negative={true}
            icon="checkmark"
            labelPosition="right"
            content="Yes"
            onClick={() => {
              this.setState({ fileState: FileState.deleted, url: undefined });
              this.setState({ open: false });
            }}
          />
        </Modal.Actions>
      </ConfirmDeleteModal>
    );
  };

  private touch = () => {
    this.setState({ fileState: FileState.touched });
  };

  private unTouch = () => {
    this.setState({ fileState: FileState.previewing });
  };

  private handleFileUpload = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const file = (evt.currentTarget.files || [])[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const url = reader.result as string;
      this.setState({ url, fileState: FileState.previewing });
      this.props.form.setFieldValue(this.props.field.name, url);
    };

    reader.readAsDataURL(file);
  };
}

export default PhotoField;
