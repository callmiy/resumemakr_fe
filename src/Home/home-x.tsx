import React from "react";
import { Modal, Button, Grid, Label, Icon, Popup } from "semantic-ui-react";
import { ApolloError, MutationUpdaterFn } from "apollo-client";
import dateFormat from "date-fns/format";

import {
  HomeContainer,
  InputLabel,
  HomeMain,
  Titles,
  CtrlLabelText,
  DeleteResumeSuccess
} from "./home-styles";

import { AppModal } from "../styles/mixins";
import { makeResumeRoute } from "../routing";
import { Props } from "./home";
import Loading from "../Loading";
import Header from "../Header";
import {
  ResumeTitles,
  ResumeTitlesVariables,
  DeleteResume,
  ResumeTitles_resumes_edges_node
} from "../graphql/apollo-gql";
import resumeTitles from "../graphql/resume-titles.query";

interface State {
  openModal?: boolean;
  resumeTitle: string;
  graphQlError?: ApolloError;
  deleteError?: {
    id: string;
    errors: string[];
  };
  deletedResume?: string;
  deletingResume?: string;
  confirmDeleteId?: string;
}

export class Home extends React.Component<Props, State> {
  state: State = {
    resumeTitle: ""
  };

  deleteTriggerRefs: { id?: undefined | HTMLElement } = {};

  render() {
    const { loading, error } = this.props;

    if (loading) {
      return (
        <HomeContainer>
          <Header />
          <Loading data-testid="loading resume titles" />
        </HomeContainer>
      );
    }

    return (
      <HomeContainer>
        <Header />

        <HomeMain>
          {error && <div>{error.message}</div>}

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
      <AppModal open={this.state.openModal}>
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
              this.setState({ openModal: false, resumeTitle: "" });
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

    if (!edges.length) {
      return <div onClick={this.openModal}>You have no resumes</div>;
    }

    const { deletedResume } = this.state;

    return (
      <Titles>
        <div className="header">
          <div>My resumes</div>

          {deletedResume && (
            <DeleteResumeSuccess onClick={this.resetDeletedResume}>
              <div>
                <Label style={{ cursor: "pointer" }} horizontal={true}>
                  Dismiss
                </Label>

                <span>{deletedResume} deleted successfully</span>
              </div>
            </DeleteResumeSuccess>
          )}
        </div>

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
            const { deletingResume } = this.state;

            return (
              <Grid.Row key={id} data-testid={`${title} row`}>
                {deletingResume === id && (
                  <Loading data-testid={`deleting ${title}`} />
                )}

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
                    style={{ position: "relative" }}
                    color="red"
                    circular={true}
                    onClick={() => {
                      this.setState({ confirmDeleteId: id });
                    }}
                  >
                    <Icon name="delete" />

                    <CtrlLabelText ref={this.setConfirmDeleteTriggerRef(id)}>
                      delete {title}
                    </CtrlLabelText>

                    {this.renderConfirmDelete(node)}

                    {this.renderDeleteError(node)}
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

  private renderDeleteError = ({
    id,
    title
  }: ResumeTitles_resumes_edges_node) => {
    const { deleteError } = this.state;

    if (!deleteError) {
      return null;
    }

    if (deleteError.id !== id) {
      return null;
    }

    return (
      <Popup
        context={this.deleteTriggerRefs[id]}
        position="top center"
        verticalOffset={10}
        open={deleteError.id === id}
        onClose={this.handleDeleteErrorPopup}
      >
        <div style={{ color: "red" }}>
          {deleteError.errors.map((t, index) => (
            <div key={index}>{t}</div>
          ))}
        </div>
      </Popup>
    );
  };

  private renderConfirmDelete = ({
    id,
    title
  }: ResumeTitles_resumes_edges_node) => {
    const { confirmDeleteId } = this.state;

    if (confirmDeleteId !== id) {
      return null;
    }

    return (
      <Popup
        context={this.deleteTriggerRefs[id]}
        position="top center"
        verticalOffset={10}
        open={confirmDeleteId === id}
        onClose={this.handleConfirmDeletePopup}
      >
        <div>Sure to delete {title}</div>

        <Grid divided={true} columns="equal">
          <Grid.Column>
            <Button
              data-testid={`yes to delete ${title}`}
              color="red"
              fluid={true}
              onClick={evt => {
                evt.stopPropagation();
                this.handleConfirmDeletePopup();
                this.deleteResume(id);
              }}
            >
              Yes
            </Button>
          </Grid.Column>

          <Grid.Column>
            <Button
              data-testid={`no to delete ${title}`}
              color="blue"
              content="No"
              fluid={true}
              onClick={evt => {
                evt.stopPropagation();
                this.handleConfirmDeletePopup();
              }}
            />
          </Grid.Column>
        </Grid>
      </Popup>
    );
  };

  private handleConfirmDeletePopup = () => {
    this.setState({
      confirmDeleteId: undefined
    });
  };

  private openModal = () => this.setState({ openModal: true });

  private onChange = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({ resumeTitle: evt.currentTarget.value });
  };

  private createResume = async () => {
    const { resumeTitle = "" } = this.state;
    const title = resumeTitle.trim();

    if (!title) {
      this.setState({ openModal: false });
      return;
    }

    const { setCurrentResumeTitle, createResumeTitle } = this.props;

    if (!createResumeTitle) {
      return;
    }

    try {
      const result = await createResumeTitle({
        variables: {
          input: { title }
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

  private deleteResume = async (id: string) => {
    const { deleteResume } = this.props;

    if (!deleteResume) {
      this.setState({
        deleteError: {
          id,
          errors: ["Something is wrong:", "unable to delete resume"]
        }
      });
      return;
    }

    if (!deleteResume) {
      return;
    }

    const result = await deleteResume({
      variables: {
        input: { id }
      },

      update: this.updateAfterDelete
    });

    if (!result) {
      return;
    }

    const { data } = result;

    if (!data) {
      return;
    }

    const { deleteResume: deletedResume } = data;

    if (!deletedResume) {
      return;
    }

    const { resume } = deletedResume;

    if (!resume) {
      return;
    }

    this.setState({ deletingResume: id }, () => {
      this.setState({ deletedResume: resume.title, deletingResume: undefined });
    });

    setTimeout(() => {
      this.setState({ deletedResume: undefined });
    }, 7000);
  };

  private handleDeleteErrorPopup = () => {
    this.setState({ deleteError: undefined });
  };

  private resetDeletedResume = () => {
    this.setState({ deletedResume: undefined });
  };

  private updateAfterDelete: MutationUpdaterFn<DeleteResume> = (
    cache,
    { data: newData }
  ) => {
    if (!newData) {
      return;
    }

    const { deleteResume: resumeToBeRemoved } = newData;

    if (!resumeToBeRemoved) {
      return;
    }

    const resumeToBeRemovedId =
      (resumeToBeRemoved.resume && resumeToBeRemoved.resume.id) || "";

    const readData = cache.readQuery<ResumeTitles, ResumeTitlesVariables>({
      query: resumeTitles,

      variables: {
        howMany: 10
      }
    });

    if (!readData) {
      return;
    }

    const { resumes } = readData;

    if (!resumes) {
      return;
    }

    const { edges } = resumes;

    if (!edges) {
      return;
    }

    cache.writeQuery<ResumeTitles, ResumeTitlesVariables>({
      query: resumeTitles,

      variables: {
        howMany: 10
      },

      data: {
        resumes: {
          edges: edges.filter(e => {
            return e && e.node && e.node.id !== resumeToBeRemovedId;
          }),

          __typename: "ResumeConnection"
        }
      }
    });
  };

  private setConfirmDeleteTriggerRef = (id: string) => (ref: HTMLElement) => {
    this.deleteTriggerRefs[id] = ref;
  };
}

export default Home;
