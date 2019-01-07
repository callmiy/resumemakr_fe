import React, { FunctionComponent, ComponentClass } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "react-apollo";
import { Router } from "react-router-dom";
import { createMemoryHistory, History } from "history";
import { fireEvent } from "react-testing-library";

export function makeClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new ApolloLink()
  });
}

interface HistoryProps {
  push?: (path: string) => void;
  replace?: (path: string) => void;
  resumeBuilderPath?: string;
}

const defaultHistoryProps: HistoryProps = {
  push: jest.fn(),
  replace: jest.fn()
};

export function makeHistory(params: HistoryProps = defaultHistoryProps) {
  const history = createMemoryHistory({
    initialEntries: [params.resumeBuilderPath || "/"]
  });

  return { ...history, ...params };
}

export function renderWithRouter<TProps>(
  Ui: FunctionComponent<TProps> | ComponentClass<TProps>,
  historyProps?: HistoryProps
) {
  const history = makeHistory(historyProps) as History;

  return {
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
    Ui: (props: Exclude<TProps, "history" | "location" | "match">) => {
      return (
        <Router history={history}>
          <Ui history={history} {...props} />
        </Router>
      );
    }
  };
}

export function renderWithApollo<TProps>(
  Ui: FunctionComponent<TProps> | ComponentClass<TProps>
) {
  const client = makeClient();

  return {
    client,
    Ui: (props: TProps) => (
      <ApolloProvider client={client}>
        <Ui client={client} {...props} />
      </ApolloProvider>
    )
  };
}

export function fillField(element: Element, value: string) {
  fireEvent.change(element, {
    target: { value }
  });
}

/**
 * ## Example
 *  createFile('dog.jpg', 1234, 'image/jpeg')
 * @param fileName
 * @param size
 * @param type
 */
export function createFile(fileName: string, size: number, type: string) {
  const file = new File([], fileName, { type });

  Object.defineProperty(file, "size", {
    get() {
      return size;
    }
  });

  return file;
}

export function uploadFile($input: HTMLElement, file?: File) {
  Object.defineProperty($input, "files", {
    value: (file && [file]) || []
  });

  fireEvent.change($input);
}
