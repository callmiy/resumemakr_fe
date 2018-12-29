import React from "react";
import { FieldProps } from "formik";
import Dropzone from "react-dropzone";
import { Icon, Button } from "semantic-ui-react";
import classnames from "classnames";

import "./photo-field.scss";
import { FormValues } from "../ResumeForm/resume-form";

interface Props extends FieldProps<FormValues> {}

interface State {
  file?: File & { preview: string };
  touched?: boolean;
}

export class PhotoField extends React.Component<Props, State> {
  state: State = {};

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
        onMouseEnter={this.touch}
        onClick={this.touch}
        onMouseLeave={this.unTouch}
      >
        {photoTouched && <div className="photo-field_overlay" />}

        <div className="photo-field_inner">
          <img className="photo-field_img" src={preview} alt={name} />

          {photoTouched && (
            <div className="photo-field_edit-btns">
              <Button type="button">
                <Icon name="upload" /> Change photo
              </Button>

              <Button
                type="button"
                onClick={() => this.setState({ file: undefined })}
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
    const { field } = this.props;

    return (
      <Dropzone onDrop={this.onDrop} disableClick={true} accept="image/*">
        {({ getRootProps, getInputProps, isDragActive, open }) => {
          return (
            <div {...getRootProps()} className="photo-field file-select">
              <input
                {...getInputProps({
                  name: field.name,
                  multiple: false
                })}
              />

              <>
                <div className="icon-wrapper">
                  <Icon name="camera" />
                </div>

                <div className="photo-field_label">
                  <Button
                    type="button"
                    onClick={() => {
                      open();
                    }}
                  >
                    <Icon name="upload" />
                    Upload photo
                  </Button>
                  or drag and drop photo here
                </div>
              </>
            </div>
          );
        }}
      </Dropzone>
    );
  };

  private touch = () => {
    this.setState({ touched: true });
  };

  private unTouch = () => {
    this.setState({ touched: false });
  };

  private onDrop = (acceptedFiles: File[]) => {
    // do nothing if no files
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }

    this.props.form.setFieldValue("photo", file);
    this.setState({
      file: { ...file, preview: URL.createObjectURL(file) }
    });
  };
}

export default PhotoField;
