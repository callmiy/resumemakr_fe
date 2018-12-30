import React, { createRef } from "react";
import { FieldProps } from "formik";
import { Icon } from "semantic-ui-react";

import { FormValues } from "../ResumeForm/resume-form";
import { noOp } from "../utils";
import {
  FileChooser,
  Thumb,
  EditorContainer,
  ChangePhoto,
  UploadPhotoIconWrap
} from "./photo-field-styles";
interface Props extends FieldProps<FormValues> {
  removeFilePreview?: () => void;
}
interface State {
  file?: File;
  url?: string;
  fileState: FileState;
}

enum FileState {
  previewing = "previewing",
  clean = "clean",
  touched = "touched",
  deleted = "deleted"
}

export class PhotoField extends React.Component<Props, State> {
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
                this.setState({ fileState: FileState.deleted });
                this.removePreview();
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

        <input
          type="file"
          accept="image/*"
          className="visually-hidden"
          ref={this.inputRef}
          name={fieldName}
          id={fieldName}
          onChange={this.handleFileUpload}
        />
      </>
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
    (this.props.removeFilePreview || noOp)();
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
