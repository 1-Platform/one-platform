import { Card, Dropdown, KebabToggle, Title } from '@patternfly/react-core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

interface IProjectCardProps {
  project: any;
  dropdownItems: any[];
}

function ProjectCard ({ project, dropdownItems }: IProjectCardProps) {
  const [dropDownState, setDropdownState] = useState( false );

  return (
    <>
      <Card isRounded className="project-card" isFullHeight>
        <section className="project-card--body">
          <Link to={project.projectId}><Title headingLevel='h2'>{ project.name }</Title></Link>
          <p className="project-card--body__description">{ project.description }</p>
        </section>
        <aside className="project-card--dropdown">
          <Dropdown
            toggle={ <KebabToggle onToggle={ () => setDropdownState( !dropDownState) } /> }
            isOpen={ dropDownState }
            isPlain
            dropdownItems={ dropdownItems }
            position={ 'right' }
          />
        </aside>
      </Card>
    </>
  );
}

export default ProjectCard;
