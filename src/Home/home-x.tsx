import React from "react";
import { Modal, Button, Grid, Label, Icon } from "semantic-ui-react";
import { ApolloError } from "apollo-client";
import dateFormat from "date-fns/format";

import { HomeContainer, InputLabel, HomeMain, Titles } from "./home-styles";
import { AppModal } from "../styles/mixins";
import { makeResumeRoute } from "../routing";
import { Props } from "./home";
import Loading from "../Loading";
import Header from "../Header";

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
        <Header />

        <HomeMain>
          {error && <div>{error.message}</div>}

          {resumes && resumes.edges && !resumes.edges.length && (
            <div onClick={this.openModal}> You have no resumes</div>
          )}

          {this.renderTitles()}

          <div className="new" onClick={this.openModal}>
            <span>+</span>
          </div>
        </HomeMain>

        {this.renderModal()}
      </HomeContainer>
    );
  }

  private renderModal = () => {
    return (
      <AppModal open={this.state.open}>
        <Modal.Header>
          Enter resume title e.g name of company to send to
        </Modal.Header>

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
              this.setState({ open: false, resumeTitle: "" });
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

  private renderTitles = () => {
    const { resumes } = this.props;

    if (!resumes) {
      return null;
    }

    const { edges } = resumes;

    if (!edges) {
      return null;
    }

    return (
      <Titles>
        <div className="header">My resumes</div>

        <Grid reversed="computer" columns={3}>
          <Grid.Row className="row-header">
            <Grid.Column className="controls">Controls</Grid.Column>

            <Grid.Column>Last modified</Grid.Column>

            <Grid.Column className="title">Title</Grid.Column>
          </Grid.Row>

          {edges.map(edge => {
            if (!edge) {
              return null;
            }

            const { node } = edge;

            if (!node) {
              return null;
            }

            const { id, title, updatedAt } = node;

            return (
              <Grid.Row key={id}>
                <Grid.Column className="controls">
                  <Label
                    color="blue"
                    circular={true}
                    onClick={() => this.goToResume(title)}
                  >
                    <Icon name="pencil" />
                  </Label>

                  <Label
                    color="green"
                    circular={true}
                    onClick={() => this.goToResume(title)}
                  >
                    <Icon name="cloud download" />
                  </Label>

                  <Label
                    color="red"
                    circular={true}
                    onClick={() => this.goToResume(title)}
                  >
                    <Icon name="delete" />
                  </Label>
                </Grid.Column>

                <Grid.Column onClick={() => this.goToResume(title)}>
                  {dateFormat(updatedAt, "Do MMM, YYYY H:mm A")}
                </Grid.Column>

                <Grid.Column
                  className="clickable"
                  onClick={() => this.goToResume(title)}
                >
                  {title}
                </Grid.Column>
              </Grid.Row>
            );
          })}
        </Grid>
      </Titles>
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
