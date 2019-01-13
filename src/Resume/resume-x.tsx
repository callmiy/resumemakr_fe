import React from "react";
import { RouteComponentProps } from "react-router-dom";

import ResumeForm from "../ResumeForm";
import { DownloadBtn, Container } from "./resume-styles";
import { AppMain, ToolTip } from "../styles/mixins";
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

            <AppMain>
              <div className="side-bar">Side bar</div>

              <div className="main-container">
                <div className="main">
                  <ResumeForm />
                </div>
              </div>
            </AppMain>
          </>
        )}

        {hash.startsWith(ResumePathHash.preview) && (
          <div className="main-container preview">
            <Preview mode={PreviewMode.download} />
          </div>
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
