import React from "react";
import { Input, Menu, Icon, Label, Dropdown } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import { LOGIN_URL, ROOT_URL } from "../routing";
import { Container } from "./header-styles";
import { Props } from "./header";

export class Header extends React.Component<Props, {}> {
  state = { activeItem: "home" };

  render() {
    const { activeItem } = this.state;
    const { leftMenuItems = [], rightMenuItems = [], user } = this.props;

    return (
      <Container>
        <Menu secondary={true}>
          <Menu.Item
            as={NavLink}
            to={ROOT_URL}
            className="logo"
            name="home"
            active={activeItem === "home"}
          />

          {leftMenuItems.map(l => l)}

          <Menu.Menu position="right">
            {rightMenuItems.map(r => r)}

            {user && (
              <Menu.Item>
                <Input icon="search" placeholder="Search..." />
              </Menu.Item>
            )}

            <Dropdown
              item={true}
              icon={
                <Label circular={true}>
                  <Icon name="user" />
                </Label>
              }
              simple={true}
            >
              <Dropdown.Menu>
                {user && (
                  <>
                    <Dropdown.Divider />

                    <Dropdown.Item as={NavLink} to={LOGIN_URL}>
                      Logout
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        </Menu>
      </Container>
    );
  }
}

export default Header;
