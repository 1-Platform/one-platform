import {
  Card,
  CardBody,
  StackItem,
  Button,
  CardTitle,
  Flex,
  FlexItem,
  Modal,
} from '@patternfly/react-core';
import { useParams } from 'react-router-dom';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import EditIcon from '@patternfly/react-icons/dist/esm/icons/edit-icon';
import UsersTable from './UsersTable';
import { useContext, useState } from 'react';
import AddUserForm from './AddUserForm';
import { AppContext } from 'context/AppContext';
import DeleteDBForm from './DeleteDBForm';

interface ParamType {
  dbname: string;
}

function UpdateCouchDBConfig(props: any) {
  const { app, forceRefreshApp } = useContext(AppContext);
  const [isAddUserModalOpen, setIsAddUserFormOpen] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  let { dbname } = useParams<ParamType>();

  const handleModalClose = () => {
    setIsAddUserFormOpen(false);
  };

  const openAdminUserForm = () => {
    setIsAddingAdmin(true);
    setIsAddUserFormOpen(true);
  };
  const openMemberUserForm = () => {
    setIsAddingAdmin(false);
    setIsAddUserFormOpen(true);
  };

  const db = app.database?.databases.filter((db: any) => db.name === dbname)[0];
  return (
    <>
      <StackItem>
        <Card isRounded isFlat>
          <div className="memberCard-heading--padding">
            <Flex>
              <FlexItem className="dbname-heading--fontSize">
                {dbname} <EditIcon />
              </FlexItem>
              <FlexItem align={{ default: 'alignRight' }}>
                <Button variant="link">
                  Open Fauxton GUI &nbsp; <ExternalLinkAltIcon />
                </Button>
              </FlexItem>
            </Flex>
            <br />
            <Flex>
              <FlexItem>
                <strong>Admin</strong>
              </FlexItem>
              <FlexItem align={{ default: 'alignRight' }}>
                <Button variant="link" onClick={openAdminUserForm}>
                  Add New Admin
                </Button>
              </FlexItem>
            </Flex>
          </div>
          <UsersTable
            admin={ true }
            db={ db }
            appId={ app.id }
            forceRefreshApp={forceRefreshApp}
          />
        </Card>
      </StackItem>
      <StackItem>
        <Card isRounded isFlat>
          <div className="memberCard-heading--padding">
            <Flex>
              <FlexItem>
                <strong>Members</strong>
              </FlexItem>
              <FlexItem align={{ default: 'alignRight' }}>
                <Button variant="link" onClick={openMemberUserForm}>
                  Add New Member
                </Button>
              </FlexItem>
            </Flex>
          </div>
          <UsersTable
            admin={ false }
            db={ db }
            appId={ app.id }
            forceRefreshApp={forceRefreshApp}
          />
        </Card>
      </StackItem>
      <StackItem>
        <Card
          isRounded
          isFlat
          style={{
            border: '1px solid var(--pf-global--danger-color--100)',
            overflow: 'hidden',
          }}
        >
          <CardTitle className="">Danger Zone</CardTitle>
          <CardBody>
            To Delete{' '}
            <strong>
              <em>{dbname}</em>
            </strong>{' '}
            database, Please enter the name in below input field.
            <br />
            <br />
            <DeleteDBForm dbname={dbname} appUniqueId={app.id} appId={app.appId}/>
          </CardBody>
        </Card>
      </StackItem>
      {isAddUserModalOpen && (
        <Modal
          variant="small"
          title={`Add new ${isAddingAdmin ? 'Admin' : 'Member'}`}
          isOpen={isAddUserModalOpen}
          onClose={handleModalClose}
          showClose={true}
        >
          <AddUserForm
            setIsAddUserFormOpen={setIsAddUserFormOpen}
            admin={isAddingAdmin}
            db={db}
            appId={app.id}
            forceRefreshApp={forceRefreshApp}
          />
        </Modal>
      )}
    </>
  );
}

export default UpdateCouchDBConfig;
