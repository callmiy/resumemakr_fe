import React, { createRef } from "react";
import { RouteComponentProps } from "react-router-dom";
import lodashIsEqual from "lodash/isEqual";

import ResumeForm from "../ResumeForm";
import { FormValues } from "../ResumeForm/resume-form";
import { Container, AppMain, DownloadBtn } from "./resume-styles";
import { AppHeader, ToolTip } from "../styles/mixins";
import Preview from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview";
import { FORM_VALUES_KEY } from "../constants";

interface Props extends RouteComponentProps<{}> {}

enum Hash {
  edit = "#edit",
  preview = "#preview"
}

interface State {
  values?: FormValues;
}

export class Resume extends React.Component<Props, State> {
  form = createRef<ResumeForm>();

  constructor(props: Props) {
    super(props);

    this.state = {
      values: this.hydrate()
    };
  }

  componentDidUpdate() {
    const hydrated = this.hydrate();

    if (!hydrated) {
      return;
    }

    const isEqual = lodashIsEqual(hydrated, this.state.values);

    if (!isEqual) {
      this.setState({ values: hydrated });
    }
  }

  render() {
    const { values } = this.state;

    const {
      location: { hash }
    } = this.props;

    return (
      <Container>
        {hash !== Hash.preview && (
          <>
            <AppHeader>
              <DownloadBtn onClick={this.download}>
                <ToolTip>Download your resume</ToolTip>

                <span>Download</span>
              </DownloadBtn>
            </AppHeader>

            <AppMain>
              <div className="side-bar">Side bar</div>

              <div className="main-container">
                <div className="main">
                  <ResumeForm ref={this.form} initialValues={values} />
                </div>
              </div>
            </AppMain>
          </>
        )}

        {hash === Hash.preview && values && (
          <div className="main-container preview">
            <Preview mode={PreviewMode.download} values={values} />
          </div>
        )}
      </Container>
    );
  }

  private download = () => {
    const {
      history,
      location: { pathname }
    } = this.props;

    history.push(pathname + Hash.preview);
  };

  private hydrate = (): FormValues | undefined => {
    const st = localStorage.getItem(FORM_VALUES_KEY);
    return (st && JSON.parse(st)) || undefined;
  };
}

export default Resume;
