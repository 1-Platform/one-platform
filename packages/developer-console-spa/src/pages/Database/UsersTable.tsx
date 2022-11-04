import { Button, Label, LabelGroup, Modal, ModalVariant } from '@patternfly/react-core';
import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { TimesIcon } from '@patternfly/react-icons';
import React, { Key, useEffect, useState } from 'react';
import Loader from 'common/components/Loader';
import gqlClient from 'common/utils/gqlClient';
import { manageAppDatabase } from 'common/utils/gql-queries';

interface UsersTableProps {
  admin: boolean;
  db: any;
  appId: string;
  forceRefreshApp: React.FC;
}

const UsersTable = ( { admin, db, appId, forceRefreshApp }: UsersTableProps) => {
  const [ isUserDataLoading, setIsUserDataLoading ] = useState(true);
  const [ columns ] = useState(['Name', 'Permission', 'Action']);
  const [ rows, setRows ] = useState( [ [] ] as any[][] );
  const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
  const [ isRemovingUser, setIsRemovingUser ] = useState<boolean>( false );
  const [ rhatUUIDtoDel, setRhatUUIDtoDel ] = useState<string>( '' );

  useEffect(() => {
    const queries = getUserQueries(admin, db);
    const joinedQuery = queries.join();
    fetch(process.env.REACT_APP_API_GATEWAY, {
      method: `POST`,
      headers: {
        Authorization: `Bearer ${window.OpAuthHelper.jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: `query{${joinedQuery}}` }),
    })
      .then((res: any) => res.json())
      .then( ( res: any ) => {
        let memberRows = [[]] as any[][];
        if ( !res.errors ) {
          memberRows = getMemberRows(res, admin, db);
        }
        else {
          window.OpNotification?.danger({
            subject: 'An error occurred when getting user details',
            body: res.errors[0].message,
          });
        }
        setIsUserDataLoading(false);
        setRows(memberRows);
      });
  }, [admin, db]);

  const handleModalToggle = () => {
    setIsModalOpen( ( isModalOpen ) => !isModalOpen );
    setIsRemovingUser( false );
  };

  const removeUsers = ( user: string ) => {
    setRhatUUIDtoDel( user );
    setIsModalOpen(true);
  }

  /**
   *
   * Remove Admins/Users from the database permissions
   */
  const doRemoveUsers = () => {
    setIsRemovingUser(true);
    const permissions = admin ? db.permissions.admins : db.permissions.users;
    const index = permissions.findIndex( ( item: any ) => item.indexOf( rhatUUIDtoDel ) > 0 );
    permissions.splice( index, 1 );
    gqlClient({
        query: manageAppDatabase,
        variables: {
          id: appId,
          databaseName: db.name,
          permissions: db.permissions,
        },
      })
        .then( ( res: any ) => {
          if ( res?.errors ) {
            throw res.errors;
          }
          window.OpNotification?.success({
            subject: 'Member permission deleted successfully!',
          });
          forceRefreshApp( res.data.manageAppDatabase );
          setIsModalOpen( false );
          setIsRemovingUser( false );
        })
        .catch((err: any) => {
          window.OpNotification?.danger({
            subject: 'An error occurred when deleting member permissions',
            body: err[0].message,
          } );
          setIsRemovingUser( false );
        });
  }
  /**
   * @param admin whether to use the admins
   * @param db database details
   * @returns UserQueries
   */
  const getUserQueries = (admin: boolean, db: Project.Database ) => {
    const users = admin
      ? db.permissions.admins
      : db.permissions.users;
    return users
      .filter(admin => admin.startsWith('user:'))
      .map((admin, index) => {
        const rhatUUID = admin.slice(5, admin.length);
        return `
        admin${index}:getUsersBy(rhatUUID:"${rhatUUID}") {
          cn
          rhatUUID
        }
      `;
      });
  };
  /**
   * @param res response from userData fetch request
   * @param admin props of the component
   * @param db database details
   * @returns memberRows
   */
  const getMemberRows = ( res: any, admin: boolean, db: Project.Database ) => {
    const users = admin
      ? db.permissions.admins
      : db.permissions.users;
    const userMap = Object.values(res.data).map((userData: any) => userData[0]);
    return users.map(admin => {
      const matchedUsers = userMap.find(user => {
        return user.rhatUUID === admin.slice(5, admin.length);
      });
      if (matchedUsers) {
        return [matchedUsers.cn, '', matchedUsers.rhatUUID];
      } else {
        return [admin, '', admin];
      }
    });
  };

  const getLabelOrAction = (
    cell: string,
    cellIndex: number,
    admin: boolean
  ) => {
    if (cellIndex === 1) {
      let labels = (
        <Label color="blue" isTruncated name="permission">
          Read
        </Label>
      );
      if (admin) {
        labels = (
          <LabelGroup name="permission">
            <Label color="blue">Read</Label>
            <Label color="blue">Write</Label>
          </LabelGroup>
        );
      }
      return labels;
    } else if (cellIndex === 2) {
      return (
        <Button variant="link"
          onClick={ () => { removeUsers( cell ); } }
          icon={ <TimesIcon /> }
        ></Button>
      );
    } else {
      return cell;
    }
  };

  return (
    <>
      {isUserDataLoading ? (
        <Loader />
      ) : (
        <TableComposable aria-label="Simple table" variant={'compact'}>
          <Thead>
            <Tr>
              {columns.map((column, columnIndex) => (
                <Th key={columnIndex}>{column}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row: string[], rowIndex: Key | null | undefined) => (
              <Tr key={rowIndex}>
                {row.map((cell: string, cellIndex: number) => (
                  <Td
                    key={`${rowIndex}_${cellIndex}`}
                    dataLabel={columns[cellIndex]}
                  >
                    { getLabelOrAction(cell, cellIndex, admin) }
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      ) }
      <Modal
        variant={ModalVariant.small}
        title={`Are you sure to remove the user?`}
        titleIconVariant="danger"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button
            key="confirm"
            variant="danger"
            isLoading={ isRemovingUser }
            onClick={doRemoveUsers}
          >
            Yes, Remove
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>,
        ]}
      >
        You are removing the user from the Database, this operation will restrict the user from accessing the selected database.
      </Modal>
    </>
  );
};
export default UsersTable;
