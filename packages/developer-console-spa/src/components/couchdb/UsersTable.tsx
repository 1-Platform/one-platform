import { Button, Label, LabelGroup } from '@patternfly/react-core';
import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { Key, useEffect, useState } from 'react';
import Loader from 'components/Loader';

interface UsersTableProps {
  admin: boolean;
  db: any;
}

/**
 *
 * @param props props of the component
 * @returns UserQueries
 */
const getUserQueries = (props: any) => {
  const users = props.admin
    ? props.db.permissions.admins
    : props.db.permissions.users;
  return users.map((admin: string, index: number) => {
    const rhatUUID = admin.slice(5, admin.length);
    if (admin.startsWith('user:')) {
      return `
                  admin${index}:getUsersBy(rhatUUID:"${rhatUUID}") {
                    cn
                    rhatUUID
                  }
                `;
    }
  });
};
/**
 *
 * @param res response from userData fetch request
 * @param props props of the component
 * @returns memberRows
 */
const getMemberRows = (res: any, props: any) => {
  const users = props.admin
    ? props.db.permissions.admins
    : props.db.permissions.users;
  const userMap = Object.values(res.data).map((userData: any) => userData[0]);
  return users.map((admin: string) => {
    const matchedUsers = userMap.find((user: any) => {
      return user.rhatUUID === admin.slice(5, admin.length);
    });
    if (matchedUsers) {
      return [matchedUsers.cn, '', ''];
    } else {
      return [admin, '', ''];
    }
  });
};

const UsersTable = (props: UsersTableProps) => {
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  const [columns] = useState(['Name', 'Permission', 'Action']);
  const [rows, setRows] = useState([[]]);

  useEffect(() => {
    const queries = getUserQueries(props);
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
      .then((res: any) => {
        const memberRows = getMemberRows(res, props);
        setIsUserDataLoading(false);
        setRows(memberRows);
      });
  }, [props.admin, props.db]);

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
        <Button variant="link" color={'red'} icon={<TimesIcon />}></Button>
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
                    {getLabelOrAction(cell, cellIndex, props.admin)}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      )}
    </>
  );
};
export default UsersTable;
