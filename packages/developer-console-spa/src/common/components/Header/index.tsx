import {
  Flex,
  FlexItem,
  Stack,
  StackItem,
  Title,
  Dropdown,
  DropdownToggle,
  Menu,
  MenuInput,
  TextInput,
  Divider,
  MenuContent,
  MenuList,
  MenuItem,
  MenuFooter,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { useContext, useMemo, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProjectContext } from 'common/context/ProjectContext';
import { HeaderContext } from 'common/context/HeaderContext';
import useMyProjectsAPI from 'common/hooks/useMyProjectsAPI';
import styles from './styles.module.css';

export default function Header () {
  const { projectId, loading, project, navigateToProject } = useContext(ProjectContext);
  const { pageTitle, links } = useContext(HeaderContext);
  const { projects } = useMyProjectsAPI();
  const [dropDownState, toggleDropDownState] = useReducer(
    (state) => !state,
    false
  );
  const [input, setInput] = useState('');

  const onSelect = (_: any, selectedId?: string | number) => {
    if (selectedId && typeof selectedId === 'string') {
      navigateToProject(selectedId);
    }
  };

  const menuListItems = useMemo(() => {
    if (loading) {
      return [
        <MenuItem isDisabled key="loading">
          Loading...
        </MenuItem>,
      ];
    }

    if (!projects ?? projects.length === 0) {
      return [];
    }
    const filteredProjects = projects.filter(
      (item) =>
        !input ||
        item.name.toLowerCase().includes(input.toString().toLowerCase())
      ).sort((prev, next) => {
        if (prev.projectId === projectId) {
          return -1;
        }
        if (next.projectId === projectId) {
          return 1;
        }
        return prev.name < next.name ? 0 : 1;
      });
    if (input && filteredProjects.length === 0) {
      return [
        <MenuItem isDisabled key="no result">
          No results found
        </MenuItem>,
      ];
    }

    const selectedProject = filteredProjects?.[0]?.projectId === projectId ? filteredProjects[0] : undefined;

    return [
      ...(selectedProject ? [
        <MenuItem
          key={selectedProject.projectId}
          itemId={selectedProject.projectId}
          title={selectedProject.name}
        >
          {selectedProject.name}
        </MenuItem>,
        <Divider key='divider' />
      ] : []),
      ...filteredProjects.slice(1).map((currentValue) => (
        <MenuItem
          key={currentValue.projectId}
          itemId={currentValue.projectId}
          title={currentValue.name}
        >
          {currentValue.name}
        </MenuItem>
      )),
    ];
  }, [projectId, projects, input, loading]);

  const dropDownPanel = (
    <>
      <Menu
        isPlain
        isScrollable
        activeItemId={projectId}
        selected={projectId}
        onSelect={onSelect}
      >
        <MenuInput>
          <TextInput
            value={input}
            aria-label="Filter menu items"
            iconVariant="search"
            type="search"
            onChange={setInput}
          />
        </MenuInput>
        <Divider />
        <MenuContent>
          <MenuList>{menuListItems}</MenuList>
        </MenuContent>
        <MenuFooter>
          <Link to="/">View all Projects</Link>
        </MenuFooter>
      </Menu>
    </>
  );

  const breadcrumbs = pageTitle.map(({ title, path }, index) => {
    return (
      <span key={index}>
        <Link to={path ?? '#'}>{title}</Link>
      </span>
    );
  });

  return (
    <>
      <header className={styles['opdcHeader']}>
        <Stack>
          <StackItem>
            <Split>
              <SplitItem>
                <Dropdown
                  isPlain
                  isText
                  className={styles['opdcDropDown']}
                  toggle={
                    <DropdownToggle
                      className={styles['opdcDropDownToggle']}
                      isPlain
                      onToggle={toggleDropDownState}
                    >
                      {loading ? (
                        'Loading...'
                      ) : (
                        <span className="pf-u-font-weight-bold">
                          {project.name}
                        </span>
                      )}
                    </DropdownToggle>
                  }
                  isOpen={dropDownState}
                >
                  {dropDownPanel}
                </Dropdown>
              </SplitItem>
              <SplitItem className="pf-u-ml-auto">
                <Link to="#" className="pf-u-font-weight-bold">
                  Go to docs
                </Link>
              </SplitItem>
            </Split>
          </StackItem>

          {breadcrumbs.length !== 0 && (
            <StackItem>
              <Flex>
                <FlexItem>
                  <Title
                    className={styles['opdcHeaderTitle']}
                    headingLevel="h1"
                  >
                    {breadcrumbs}
                  </Title>
                </FlexItem>
                {links?.length > 0 && (
                  <FlexItem align={{ default: 'alignRight' }}>{links}</FlexItem>
                )}
              </Flex>
            </StackItem>
          )}
        </Stack>
      </header>
    </>
  );
}
