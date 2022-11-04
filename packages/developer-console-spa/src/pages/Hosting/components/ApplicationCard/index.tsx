import {
  Card,
  CardActions,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownToggle,
  Text,
  Title,
} from '@patternfly/react-core';
import { ProjectContext } from 'common/context/ProjectContext';
import { useContext, useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './styles.css';

interface IApplicationCardProps {
  application: any;
}

export default function ApplicationCard({
  application,
}: IApplicationCardProps) {
  const { projectId } = useContext(ProjectContext);
  const [isDropdownOpen, toggleDropdown] = useReducer((state) => !state, false);

  const history = useHistory();

  const navigateToApp = () => {
    history.push('/' + projectId + '/hosting/' + application.name);
  };

  const openContextMenu = (event: any) => {
    event.preventDefault();
    toggleDropdown();
  };

  const dropdownItems = [
    <DropdownItem
      key="view-app"
      href={application.path}
      target="_blank"
      rel="noreferer"
      className="pf-u-link-color"
    >
      <ion-icon
        class="pf-u-mr-sm"
        name="open-outline"
      ></ion-icon>
      View App
    </DropdownItem>,
    <DropdownSeparator key="separator" />,
    <DropdownItem
      key="manage-app"
      component={
        <Link to={'/' + projectId + '/hosting/' + application.name}>
          <ion-icon
            class="pf-u-mr-sm"
            name="settings-outline"
          ></ion-icon>
          Manage App
        </Link>
      }
    />,
    <DropdownItem
      key="delete-app"
      className="pf-u-danger-color-100"
      component={
        <Link
          to={'/' + projectId + '/hosting/' + application.name + '?action=delete'}
        >
          <ion-icon
            class="pf-u-mr-sm"
            name="trash-outline"
          ></ion-icon>
          Delete App
        </Link>
      }
    />,
  ];

  return (
    <Card
      key={application.name}
      className="opdcAppCard"
      isRounded
      isFullHeight
      isSelectable
      onClick={navigateToApp}
      onContextMenu={openContextMenu}
    >
      <CardHeader>
        <Title headingLevel="h1">{application.name}</Title>
        <CardActions onClick={(event) => event.stopPropagation()}>
          <Dropdown
            isOpen={isDropdownOpen}
            toggle={
              <DropdownToggle
                onToggle={toggleDropdown}
                toggleIndicator={null}
                className="pf-u-px-xs"
              />
            }
            isPlain
            dropdownItems={dropdownItems}
            position={'right'}
          />
        </CardActions>
      </CardHeader>
      <CardBody className="opdcAppCardBody">
        <Text>
          Path: <strong>{application.path ?? 'N/A'}</strong>
        </Text>
      </CardBody>
    </Card>
  );
}
