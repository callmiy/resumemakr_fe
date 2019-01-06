import React from "react";
import { Modal, Button, Input } from "semantic-ui-react";

import { HomeContainer } from "./home-styles";
import { AppModal } from "../styles/mixins";
import { makeResumeRoute } from "../routing";
import { Props } from "./home";

interface State {
  open?: boolean;
  resumeTitle: string;
}

export class Home extends React.Component<Props, State> {
  state: State = { resumeTitle: "" };

  render() {
    return (
      <HomeContainer>
        {this.renderModal()}

        <div className="new" onClick={this.openModal}>
          <span>+</span>
        </div>
      </HomeContainer>
    );
  }

  private renderModal = () => {
    return (
      <AppModal open={this.state.open}>
        <Modal.Header>Enter resume title e.g Amazon DE</Modal.Header>

        <Modal.Content>
          <Modal.Description>
            <div>
              <Input name="resume-title" onChange={this.onChange} />
            </div>
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
            onClick={this.goToResume}
          />
        </Modal.Actions>
      </AppModal>
    );
  };

  private openModal = () => this.setState({ open: true });

  private onChange = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ resumeTitle: evt.currentTarget.value });
  };

  private goToResume = () => {
    const { resumeTitle } = this.state;

    if (!resumeTitle) {
      this.setState({ open: false });
      return;
    }

    const { history, setCurrentResumeTitle } = this.props;

    if (setCurrentResumeTitle) {
      setCurrentResumeTitle({
        variables: {
          title: resumeTitle
        }
      });
    }

    history.push(makeResumeRoute(resumeTitle));
  };
}

export default Home;
