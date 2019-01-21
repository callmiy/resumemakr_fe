import React from "react";
import { RouteComponentProps } from "react-router-dom";

import ResumeForm from "../ResumeForm";
import { DownloadBtn, Container } from "./resume-styles";
import { AppMain1, ToolTip } from "../styles/mixins";
import Preview from "../Preview";
import { Mode as PreviewMode } from "../Preview/preview";
import { ResumePathHash } from "../routing";
import Header from "../Header";

interface Props extends RouteComponentProps<{ title: string }> {}

export class Resume extends React.Component<Props> {
  render() {
    const {
      location: { hash }
    } = this.props;

    return (
      <Container>
        {hash.startsWith(ResumePathHash.edit) && (
          <>
            <Header
              rightMenuItems={[
                <DownloadBtn key="1" onClick={this.download}>
                  <ToolTip>Download your resume</ToolTip>

                  <span>Download</span>
                </DownloadBtn>
              ]}
            />

            <AppMain1>
              <div className="side-bar">.</div>

              <div className="main-container">
                <ResumeForm />
              </div>
            </AppMain1>
          </>
        )}

        {hash.startsWith(ResumePathHash.preview) && (
          <Preview mode={PreviewMode.download} />
        )}
      </Container>
    );
  }

  private download = () => {
    const { history } = this.props;

    history.push(this.getPathName() + ResumePathHash.preview);
  };

  private getPathName = () => {
    const {
      location: { pathname }
    } = this.props;

    return pathname;
  };
}

export default Resume;
