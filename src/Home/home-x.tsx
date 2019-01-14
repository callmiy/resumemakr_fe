import React from "react";

import { Modal, Button, Grid, Label, Icon, Popup } from "semantic-ui-react";

import { ApolloError, MutationUpdaterFn } from "apollo-client";
import dateFormat from "date-fns/format";
import { Formik, FastField, FormikProps, FormikErrors } from "formik";
import * as Yup from "yup";
import lodashIsEmpty from "lodash/isEmpty";

import {
  HomeContainer,
  InputLabel,
  HomeMain,
  Titles,
  CtrlLabelText,
  DeleteResumeSuccess,
  FormField
} from "./home-styles";

import {
  ResumeTitles,
  ResumeTitlesVariables,
  DeleteResume,
  ResumeTitles_listResumes_edges_node,
  CreateResumeInput
} from "../graphql/apollo-gql";

import { AppModal, CircularLabel } from "../styles/mixins";
import { makeResumeRoute } from "../routing";
import { Props } from "./home";
import Loading from "../Loading";
import Header from "../Header";
import RESUME_TITLES_QUERY from "../graphql/resume-titles.query";
import { initialFormValues } from "../ResumeForm/resume-form";
import { Mode as PreviewMode } from "../Preview/preview";

const validationSchema = Yup.object<CreateResumeInput>().shape({
  title: Yup.string()
    .required()
    .min(2),
  description: Yup.string()
});

interface State {
  openModal?: boolean;
  title: string;
  graphQlError?: ApolloError;
  deleteError?: {
    id: string;
    errors: string[];
  };
  deletedResume?: string;
  deletingResume?: string;
  confirmDeleteId?: string;
  formErrors?: FormikErrors<CreateResumeInput>;
}

export class Home extends React.Component<Props, State> {
  state: State = {
    title: ""
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
        <Modal.Header>Create new resume</Modal.Header>

        <Formik<CreateResumeInput>
          validationSchema={validationSchema}
          onSubmit={() => null}
          initialValues={{ title: "", description: "" }}
          render={formikProps => {
            const { formErrors } = this.state;
            const titleError = (formErrors && formErrors.title) || "";

            return (
              <>
                <Modal.Content>
                  <Modal.Description>
                    <FormField className={`field ${titleError ? "error" : ""}`}>
                      <InputLabel htmlFor="resume-title">
                        Title e.g. name of company to send to
                      </InputLabel>

                      <FastField
                        component={"input"}
                        id="resume-title"
                        name="title"
                      />

                      {titleError && <div>{titleError}</div>}
                    </FormField>

                    <FormField className="field" style={{ marginTop: "15px" }}>
                      <InputLabel htmlFor="resume-description">
                        Description{" "}
                        <span style={{ opacity: 0.6 }}>(optional)</span>
                      </InputLabel>

                      <FastField
                        component={"textarea"}
                        id="resume-description"
                        name="description"
                      />
                    </FormField>
                  </Modal.Description>
                </Modal.Content>

                <Modal.Actions>
                  <Button
                    type="button"
                    negative={true}
                    icon="remove"
                    labelPosition="right"
                    content="No"
                    onClick={() => {
                      this.setState({ openModal: false });
                    }}
                  />

                  <Button
                    type="button"
                    positive={true}
                    icon="checkmark"
                    labelPosition="right"
                    content="Yes"
                    onClick={() => this.createResume(formikProps)}
                  />
                </Modal.Actions>
              </>
            );
          }}
        />
      </AppModal>
    );
  };

  private renderTitles = () => {
    const { listResumes } = this.props;

    if (!listResumes) {
      return null;
    }

    const { edges } = listResumes;

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
                  <CircularLabel
                    color="blue"
                    onClick={() => this.goToResume(title)}
                  >
                    <Icon name="pencil" />
                  </CircularLabel>

                  <CircularLabel
                    color="green"
                    onClick={() => this.downloadResume(title)}
                  >
                    <Icon name="cloud download" />
                  </CircularLabel>

                  <CircularLabel
                    color="red"
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
                  </CircularLabel>
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
  }: ResumeTitles_listResumes_edges_node) => {
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
  }: ResumeTitles_listResumes_edges_node) => {
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

  private createResume = async ({
    values,
    validateForm
  }: FormikProps<CreateResumeInput>) => {
    this.setState({ formErrors: undefined });

    const errors = await validateForm(values);

    if (!lodashIsEmpty(errors)) {
      this.setState({ formErrors: errors });

      return;
    }

    const { createResumeTitle } = this.props;

    if (!createResumeTitle) {
      return;
    }

    const input = { ...initialFormValues, ...values };

    try {
      const result = await createResumeTitle({
        variables: {
          input
        }
      });

      if (!result) {
        return;
      }

      const { data } = result;

      if (!data) {
        return;
      }

      const { createResume } = data;

      if (!createResume) {
        return;
      }

      const { resume } = createResume;

      if (!resume) {
        return;
      }

      this.goToResume(resume.title);
    } catch (error) {
      this.setState({ graphQlError: error });
    }
  };

  private goToResume = (title: string) =>
    this.props.history.push(makeResumeRoute(title));

  private downloadResume = (title: string) =>
    this.props.history.push(
      makeResumeRoute(title, "") + "#" + PreviewMode.preview
    );

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
      query: RESUME_TITLES_QUERY,

      variables: {
        howMany: 10
      }
    });

    if (!readData) {
      return;
    }

    const { listResumes } = readData;

    if (!listResumes) {
      return;
    }

    const { edges } = listResumes;

    if (!edges) {
      return;
    }

    cache.writeQuery<ResumeTitles, ResumeTitlesVariables>({
      query: RESUME_TITLES_QUERY,

      variables: {
        howMany: 10
      },

      data: {
        listResumes: {
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
