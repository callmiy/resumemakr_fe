import React from "react";

import { Modal, Button, Label, Icon, Popup } from "semantic-ui-react";
import { ApolloError, MutationUpdaterFn } from "apollo-client";
import dateFormat from "date-fns/format";
import { Formik, FastField, FormikProps, FormikErrors } from "formik";
import * as Yup from "yup";
import lodashIsEmpty from "lodash/isEmpty";
import "styled-components/macro";

import { FormField, HomeContainer } from "./home-styles";

import {
  ResumeTitles,
  ResumeTitlesVariables,
  DeleteResume,
  ResumeTitles_listResumes_edges_node,
  CreateResumeInput
} from "../graphql/apollo-gql";

import { AppModal, CircularLabel, AppMain1 } from "../styles/mixins";
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

enum Action {
  createResume = "CreateResume",
  cloneResume = "CloneResume"
}

const emptyVal = { title: "", description: "" };

interface State {
  openModal?: boolean;
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
  state: State = {};

  deleteTriggerRefs: { id?: undefined | HTMLElement } = {};
  initialValues = emptyVal;
  action = Action.createResume;
  idToClone = "0";
  titleToClone = "";

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

        <AppMain1>
          <div className="main-content">
            {error && <div>{error.message}</div>}

            {this.renderTitles()}
          </div>

          <div className="new" onClick={this.openModalForCreate}>
            <span>+</span>
          </div>
        </AppMain1>

        {this.renderModal()}
      </HomeContainer>
    );
  }

  private renderModal = () => {
    return (
      <AppModal open={this.state.openModal}>
        <Modal.Header>
          {this.action === Action.createResume
            ? "Create new resume"
            : `Clone from: "${this.titleToClone}"?`}
        </Modal.Header>

        <Formik<CreateResumeInput>
          validationSchema={validationSchema}
          onSubmit={() => null}
          initialValues={this.initialValues}
          render={formikProps => {
            const { formErrors } = this.state;
            const titleError = (formErrors && formErrors.title) || "";

            return (
              <>
                <Modal.Content>
                  <Modal.Description>
                    <FormField className={`field ${titleError ? "error" : ""}`}>
                      <label htmlFor="resume-title">
                        Title e.g. name of company to send to
                      </label>

                      <FastField
                        component={"input"}
                        id="resume-title"
                        name="title"
                      />

                      {titleError && <div>{titleError}</div>}
                    </FormField>

                    <FormField className="field" style={{ marginTop: "15px" }}>
                      <label htmlFor="resume-description">
                        Description{" "}
                        <span style={{ opacity: 0.6 }}>(optional)</span>
                      </label>

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

    const edges = listResumes && listResumes.edges;

    if (!edges) {
      return null;
    }

    if (!edges.length) {
      return <div onClick={this.openModalForCreate}>You have no resumes</div>;
    }

    const { deletedResume } = this.state;

    return (
      <div className="titles">
        <div className="header">
          <div>My resumes</div>

          {deletedResume && (
            <div
              className="deleted-resume-success"
              onClick={this.resetDeletedResume}
            >
              <div>
                <Label horizontal={true}>Dismiss</Label>
                <span
                  css={`
                    font-weight: bolder;
                  `}
                >
                  {deletedResume}
                </span>
                deleted successfully
              </div>
            </div>
          )}
        </div>

        <div className="columns">
          <div className="row header">
            <div className="title">Title</div>

            <div className="modified-date">Last modified</div>

            <div className="controls">Controls</div>
          </div>

          {edges.map(edge => {
            const node = edge && edge.node;

            if (!node) {
              return null;
            }

            const { id, title, updatedAt, description } = node;
            const { deletingResume } = this.state;

            return (
              <div className="row" key={id} data-testid={`${title} row`}>
                {deletingResume === id && (
                  <Loading data-testid={`deleting ${title}`} />
                )}

                <div className="controls">
                  <CircularLabel
                    color="teal"
                    onClick={() => {
                      this.initialValues = {
                        title,
                        description: description || ""
                      };

                      this.idToClone = id;
                      this.titleToClone = title;
                      this.action = Action.cloneResume;
                      this.openModal();
                    }}
                  >
                    <Icon name="copy outline" />
                  </CircularLabel>

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

                    <span
                      className="control-label-text"
                      ref={this.setConfirmDeleteTriggerRef(id)}
                    >
                      {`delete ${title}`}
                    </span>

                    {this.renderConfirmDelete(node)}

                    {this.renderDeleteError(node)}
                  </CircularLabel>
                </div>

                <div
                  className="clickable title"
                  onClick={() => this.goToResume(title)}
                >
                  {title}
                </div>

                <div
                  className="column modified-date"
                  onClick={() => this.goToResume(title)}
                >
                  {dateFormat(updatedAt, "Do MMM, YYYY H:mm A")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  private renderDeleteError = ({
    id,
    title
  }: ResumeTitles_listResumes_edges_node) => {
    const { deleteError } = this.state;

    if (!(deleteError && deleteError.id === id)) {
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
        Sure to delete:
        <span
          css={`
            font-weight: bolder;
            margin-left: 5px;
            word-break: break-all;
          `}
        >
          {title}?
        </span>
        <div
          css={`
            display: flex;
            justify-content: space-between;
            margin-top: 5px;
          `}
        >
          <Button
            data-testid={`yes to delete ${title}`}
            color="red"
            onClick={evt => {
              evt.stopPropagation();
              this.handleConfirmDeletePopup();
              this.deleteResume(id);
            }}
          >
            Yes
          </Button>

          <Button
            data-testid={`no to delete ${title}`}
            color="blue"
            content="No"
            onClick={evt => {
              evt.stopPropagation();
              this.handleConfirmDeletePopup();
            }}
          />
        </div>
      </Popup>
    );
  };

  private handleConfirmDeletePopup = () => {
    this.setState({
      confirmDeleteId: undefined
    });
  };

  private openModal = () => {
    this.setState({ openModal: true, formErrors: undefined });
  };

  private openModalForCreate = () => {
    this.initialValues = emptyVal;
    this.action = Action.createResume;
    this.openModal();
  };

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

    const { createResume, cloneResume } = this.props;

    let input;
    // tslint:disable-next-line:no-any
    let fun: any;
    let path;

    if (this.action === Action.createResume) {
      input = { ...initialFormValues, ...values };
      fun = createResume;
      path = "createResume";
    } else {
      input = { ...values, id: this.idToClone };
      fun = cloneResume;
      path = "cloneResume";
    }

    try {
      const result = await fun({
        variables: {
          input
        }
      });

      const resume =
        result && result.data && result.data[path] && result.data[path].resume;

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

    const result = await deleteResume({
      variables: {
        input: { id }
      },

      update: this.updateAfterDelete
    });

    const resume =
      result &&
      result.data &&
      result.data.deleteResume &&
      result.data.deleteResume.resume;

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
