import React from "react";

export function wrapped<T>(
  Component: React.ComponentClass<T> | React.FunctionComponent<T>
) {
  return function withClassNameInner(props: T) {
    return <Component {...props} />;
  };
}
