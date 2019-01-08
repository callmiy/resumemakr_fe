import React from "react";
import { Modal, Button } from "semantic-ui-react";
import { ApolloError } from "apollo-client";

import { HomeContainer, InputLabel, HomeMain } from "./home-styles";
import { AppModal } from "../styles/mixins";
import { makeResumeRoute } from "../routing";
import { Props } from "./home";
import Loading from "../Loading";
import { ResumeTitlesFrag_edges } from "../graphql/apollo-gql";

interface State {
  open?: boolean;
  resumeTitle: string;
  graphQlError?: ApolloError;
}

export class Home extends React.Component<Props, State> {
  state: State = { resumeTitle: "" };

  render() {
    const { loading, error, resumes } = this.props;

    if (loading) {
      return (
        <HomeContainer>
          <Loading data-testid="loading resume titles" />
        </HomeContainer>
      );
    }

    return (
      <HomeContainer>
        <HomeMain>
          {error && <div>{error.message}</div>}

          {resumes && resumes.edges && !resumes.edges.length && (
            <div onClick={this.openModal}> You have no resumes</div>
          )}

          {resumes && resumes.edges && this.renderTitles(resumes.edges)}
        </HomeMain>

        <div className="new" onClick={this.openModal}>
          <span>+</span>
        </div>

        {this.renderModal()}
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
            onClick={this.createResume}
          />
        </Modal.Actions>
      </AppModal>
    );
  };

  private renderTitles = (edges: Array<ResumeTitlesFrag_edges | null>) => {
    return (
      <ul>
        {edges.map(edge => {
          if (!edge) {
            return null;
          }

          const { node } = edge;

          if (!node) {
            return null;
          }

          const { id, title } = node;

          return (
            <li key={id} onClick={() => this.goToResume(title)}>
              {title}
            </li>
          );
        })}
      </ul>
    );
  };

  private openModal = () => this.setState({ open: true });

  private onChange = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ resumeTitle: evt.currentTarget.value });
  };

  private createResume = async () => {
    const { resumeTitle } = this.state;

    if (!resumeTitle) {
      this.setState({ open: false });
      return;
    }

    const { setCurrentResumeTitle, createResumeTitle } = this.props;

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

      this.goToResume(resume.title);
    } catch (error) {
      this.setState({ graphQlError: error });
    }
  };

  private goToResume = (title: string) =>
    this.props.history.push(makeResumeRoute(title));
}

export default Home;
