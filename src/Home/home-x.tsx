import React from "react";
import { Modal, Button } from "semantic-ui-react";
import { ApolloError } from "apollo-client";

import { HomeContainer, InputLabel } from "./home-styles";
import { AppModal } from "../styles/mixins";
import { makeResumeRoute } from "../routing";
import { Props } from "./home";
import Loading from "../Loading";

interface State {
  open?: boolean;
  resumeTitle: string;
  graphQlError?: ApolloError;
}

export class Home extends React.Component<Props, State> {
  state: State = { resumeTitle: "" };

  render() {
    const { loading, error } = this.props;

    if (loading) {
      return (
        <HomeContainer>
          <Loading data-testid="loading resume titles" />
        </HomeContainer>
      );
    }

    return (
      <HomeContainer>
        {this.renderModal()}

        {error && <div>{error.message}</div>}

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
              <InputLabel htmlFor="resume-title">Enter resume title</InputLabel>

              <input
                id="resume-title"
                name="resume-title"
                onChange={this.onChange}
              />
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

  private goToResume = async () => {
    const { resumeTitle } = this.state;

    if (!resumeTitle) {
      this.setState({ open: false });
      return;
    }

    const { history, setCurrentResumeTitle, createResumeTitle } = this.props;

    if (!createResumeTitle) {
      return;
    }

    try {
      const result = await createResumeTitle({
        variables: {
          input: { title: resumeTitle }
        }
      });

      if (!result) {
        return;
      }

      const { data } = result;

      if (!data) {
        return;
      }

      const { resume: payload } = data;

      if (!payload) {
        return;
      }

      const { resume } = payload;

      if (!resume) {
        return;
      }

      if (setCurrentResumeTitle) {
        setCurrentResumeTitle({
          variables: {
            title: resume.title
          }
        });
      }

      history.push(makeResumeRoute(resume.title));
    } catch (error) {
      this.setState({ graphQlError: error });
    }
  };
}

export default Home;
