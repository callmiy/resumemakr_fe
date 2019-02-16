import React, { useRef, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { BerechtigungHaupanwendung } from "../styles/mixins";
import Header from "../Header";
import { LOGIN_URL, SIGN_UP_URL } from "../routing";
import { Merkmale, Container, Flipper, timeout } from "./auth";

export function Auth(merkmale: Merkmale) {
  const { component: Component, ...others } = merkmale;
  const {
    match: {
      params: { auth }
    },
    location: { key }
  } = others;

  const mainRef = useRef<HTMLDivElement>(null);
  const isReRender = useRef(false);
  const flipClassNames = useRef(
    (function() {
      if (auth === LOGIN_URL) {
        return {
          [LOGIN_URL]: "front",
          [SIGN_UP_URL]: "back"
        };
      }

      return {
        [LOGIN_URL]: "back",
        [SIGN_UP_URL]: "front"
      };
    })()
  );

  useEffect(function setIsReRender() {
    isReRender.current = true;
  }, []);

  return (
    <Container>
      <Header />
      <BerechtigungHaupanwendung ref={mainRef}>
        <div className="flip-container">
          <TransitionGroup key={key} component={null}>
            <CSSTransition
              in={true}
              timeout={isReRender.current ? timeout : 0}
              classNames="flip"
              appear={isReRender.current}
              unmountOnExit={true}
            >
              <Flipper>
                <Component
                  {...others}
                  mainRef={mainRef}
                  flipClassName={
                    flipClassNames.current[auth] +
                    (isReRender.current ? " animating" : "")
                  }
                />
              </Flipper>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </BerechtigungHaupanwendung>
    </Container>
  );
}

export default Auth;
