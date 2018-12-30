import React, { createRef } from "react";
import { FieldProps } from "formik";
import { Icon, Button } from "semantic-ui-react";
import classnames from "classnames";

import "./photo-field.scss";
import { FormValues } from "../ResumeForm/resume-form";
interface Props extends FieldProps<FormValues> {
  removeFilePreview?: () => void;
}

interface Preview extends File {
  preview: string;
}

interface State {
  file?: Preview;
  touched?: boolean;
}

export class PhotoField extends React.Component<Props, State> {
  state: State = {};
  inputRef = createRef<HTMLInputElement>();

  componentWillUnmount() {
    this.removeFilePreview();
  }

  render() {
    const { file: photoFile } = this.state;

    return <>{(photoFile && this.renderThumb()) || this.renderFileChooser()}</>;
  }

  renderThumb = () => {
    const { file: photoFile, touched: photoTouched } = this.state;

    if (!photoFile) {
      return null;
    }

    const { name, preview } = photoFile;

    return (
      <div
        key={name}
        className={classnames("photo-field", {
          touched: photoTouched
        })}
        data-testid="photo-preview"
        onMouseEnter={this.touch}
        onClick={this.touch}
        onMouseLeave={this.unTouch}
      >
        {photoTouched && (
          <div
            className="photo-field_overlay"
            data-testid="photo-field_overlay"
          />
        )}

        <div className="photo-field_inner">
          <img className="photo-field_img" src={preview} alt={name} />

          {photoTouched && (
            <div
              className="photo-field_edit-btns"
              data-testid="photo-field_edit-btns"
            >
              {this.renderFileInput("Change photo")}

              <Button
                type="button"
                onClick={evt => {
                  evt.stopPropagation();
                  this.removeFilePreview();
                  this.setState({ touched: false, file: undefined });
                }}
              >
                <Icon name="delete" /> Remove
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  private renderFileChooser = () => {
    return (
      <div className="photo-field select" data-testid="photo-select">
        <>
          <div className="icon-wrapper">
            <Icon name="camera" />
          </div>

          <div className="photo-field_label">
            {this.renderFileInput("Upload Photo")}
          </div>
        </>
      </div>
    );
  };

  private renderFileInput = (label: string) => {
    const {
      field: { name: fieldName }
    } = this.props;

    return (
      <>
        <label htmlFor={fieldName}>
          <Icon name="upload" /> {label}
        </label>
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
    this.setState({ touched: true });
  };

  private unTouch = () => {
    this.setState({ touched: false });
  };

  private handleFileUpload = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const file = (evt.currentTarget.files || [])[0];
    if (!file) {
      return;
    }

    this.removeFilePreview();

    this.props.form.setFieldValue(this.props.field.name, file);

    this.setState({
      file: { ...file, preview: URL.createObjectURL(file) }
    });
  };

  private removeFilePreview = () => {
    (this.props.removeFilePreview || noOp)();

    const { file } = this.state;

    if (!file) {
      return;
    }

    URL.revokeObjectURL(file.preview);
  };
}

export default PhotoField;

function noOp() {
  return null;
}
