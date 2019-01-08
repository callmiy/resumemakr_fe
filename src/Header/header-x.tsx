import React from "react";
import { Input, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import { LOGIN_URL, ROOT_URL } from "../routing";
import { Container } from "./header-styles";

export class Header extends React.Component<{}, {}> {
  state = { activeItem: "home" };

  render() {
    const { activeItem } = this.state;

    return (
      <Container>
        <Menu secondary={true}>
          <Menu.Item
            as={NavLink}
            to={ROOT_URL}
            className="logo"
            name="home"
            active={activeItem === "home"}
            onClick={this.handleItemClick}
          />

          <Menu.Menu position="right">
            <Menu.Item>
              <Input icon="search" placeholder="Search..." />
            </Menu.Item>

            <Menu.Item
              as={NavLink}
              to={LOGIN_URL}
              name="logout"
              active={activeItem === "logout"}
              onClick={this.handleItemClick}
            />
          </Menu.Menu>
        </Menu>
      </Container>
    );
  }

  private handleItemClick = () => 1;
}

export default Header;
