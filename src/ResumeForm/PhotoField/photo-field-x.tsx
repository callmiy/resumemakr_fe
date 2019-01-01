import React, { createRef } from "react";
import { FieldProps } from "formik";
import { Icon, Modal, Button } from "semantic-ui-react";

import { noOp } from "../../utils";
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
  file?: File;
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
    fileState: FileState.clean
  };

  inputRef = createRef<HTMLInputElement>();

  componentDidMount() {
    this.setPreview(this.props.field.value);
  }

  componentDidUpdate() {
    this.setInitialFile();
  }

  componentWillUnmount() {
    this.removePreview();
    (this.props.removeFilePreview || noOp)();
  }

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
    const { file, fileState, url } = this.state;

    if (!(file && url)) {
      return null;
    }

    return (
      <Thumb
        url={url}
        key={file.name}
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
              this.setState({ fileState: FileState.deleted });
              this.removePreview();
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

    this.removePreview();
    this.setPreview(file);
    this.props.form.setFieldValue(this.props.field.name, file);
  };

  private setPreview = (file: File | null) => {
    if (!file) {
      return;
    }

    this.setState({
      file,
      url: URL.createObjectURL(file),
      fileState: FileState.previewing
    });
  };

  private removePreview = () => {
    const { url } = this.state;

    this.setState({
      file: undefined,
      url: undefined
    });

    if (!url) {
      return;
    }

    URL.revokeObjectURL(url);
  };

  private setInitialFile = () => {
    const { fileState } = this.state;

    if (fileState !== FileState.clean) {
      return;
    }

    const value = this.props.field.value as File | null;
    if (!value) {
      return;
    }

    const { file } = this.state;

    if (file === value) {
      return;
    }

    this.setPreview(value);
  };
}

export default PhotoField;
