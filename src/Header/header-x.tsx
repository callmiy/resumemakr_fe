import React, { useState } from "react";
import {
  Input,
  Menu,
  Icon,
  Label,
  Dropdown,
  Responsive
} from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import { LOGIN_URL, ROOT_URL, SIGN_UP_URL } from "../routing";
import { Container } from "./header-styles";
import { Props } from "./header";

export function Header(merkmale: Props) {
  const [aktiveArtikel] = useState("home");

  const {
    leftMenuItems = [],
    rightMenuItems = [],
    user,
    location: { pathname },
    updateLocalUser,
    history
  } = merkmale;

  let homeLinkProps = {};
  if (user && pathname !== ROOT_URL) {
    homeLinkProps = { as: NavLink, to: ROOT_URL };
  } else {
    homeLinkProps = { as: "span" };
  }

  function suchen() {
    if (!user) {
      return null;
    }

    return (
      <Menu.Item>
        <Responsive
          minWidth={Responsive.onlyTablet.minWidth}
          as={Input}
          icon="search"
          placeholder="Search..."
        />
        {/* <Input icon="search" placeholder="Search..." /> */}
      </Menu.Item>
    );
  }

  return (
    <Container>
      <Menu secondary={true}>
        <Menu.Item
          {...homeLinkProps}
          className="logo"
          name="home"
          active={aktiveArtikel === "home"}
        />

        {leftMenuItems.map(l => l)}

        <Menu.Menu position="right">
          {rightMenuItems.map(r => r)}

          {user && suchen()}

          <Dropdown
            item={true}
            icon={
              <Label circular={true}>
                <Icon name="user" />
              </Label>
            }
            simple={true}
            style={{ marginRight: 0, paddingRight: "5px" }}
          >
            <Dropdown.Menu>
              {user && (
                <>
                  <Dropdown.Divider />

                  <Dropdown.Item
                    as={NavLink}
                    to={LOGIN_URL}
                    onClick={async evt => {
                      evt.preventDefault();

                      if (updateLocalUser) {
                        await updateLocalUser({
                          variables: {
                            user: null
                          }
                        });
                      }

                      history.replace(LOGIN_URL);
                    }}
                  >
                    Logout
                  </Dropdown.Item>
                </>
              )}

              {pathname === LOGIN_URL && (
                <Dropdown.Item as={NavLink} to={SIGN_UP_URL}>
                  Sign up
                </Dropdown.Item>
              )}

              {pathname === SIGN_UP_URL && (
                <Dropdown.Item as={NavLink} to={LOGIN_URL}>
                  Login
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    </Container>
  );
}

export default Header;
