import React, { createRef } from "react";
import { FieldProps } from "formik";
import { Icon } from "semantic-ui-react";
import styled, { css } from "styled-components";

import { FormValues } from "../ResumeForm/resume-form";
import { noOp } from "../utils";
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

const Main = styled.div`
  width: 170px;
  height: 170px;
  margin: 0 auto;
`;

const FileChooser = styled(Main)`
  border: 4px dashed #d2d2d2;
`;

const Thumb = styled(Main)`
  background-image: ${({ url }: { url: string }) => `url(${url})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
`;

const EditorContainer = styled.div`
  opacity: 1;
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.2s linear;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 1.5rem;
  display: flex;
`;

const BtnPhoto = css`
  cursor: pointer;
  width: 150px;
  margin: 0 auto;
  border: 2px solid #fff;
  border-radius: 2px;
  box-sizing: border-box;
  text-align: center;
  padding: 6px 12px;
  transition: border-color 0.2s linear;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 1.5rem;
  color: #fff;
`;

const ChangePhoto = styled.label`
  ${BtnPhoto}
  display: block;
  margin-bottom: 10px;
`;

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
            <div className="icon-wrapper">
              <Icon name="camera" />
            </div>

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
