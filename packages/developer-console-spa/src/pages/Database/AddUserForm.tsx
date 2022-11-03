import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  Label,
  LabelGroup,
  TextInput,
} from '@patternfly/react-core';
import gqlClient from 'common/utils/gqlClient';
import { getUsersBy, manageAppDatabase } from 'common/utils/gql-queries';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useState } from 'react';

interface IUserInput {
  user: string;
  permission: string;
}
type AddUserProps = {
  setIsAddUserFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  admin: boolean;
  db: any;
  appId: string;
  forceRefreshApp: React.FC;
};

const appSchema = yup.object().shape({
  user: yup.string().trim().required(),
  permission: yup.string(),
});

const AddUserForm = ( {
  db,
  admin,
  appId,
  setIsAddUserFormOpen,
  forceRefreshApp
}: AddUserProps ) => {
  const [isAddingDB, setIsAddingDB] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<IUserInput>({
    mode: 'onBlur',
    resolver: yupResolver(appSchema),
    defaultValues: {
      user: '',
      permission: '',
    },
  });

  function handleModalClose() {
    /* Reset the form */
    reset();
    setIsAddUserFormOpen( false );
    setIsAddingDB(false);
  }

  const getUserInfo = (uid: string) => {
    return gqlClient({
      query: getUsersBy,
      variables: { uid },
    }).then((res: any) => {
      return res.data.getUsersBy[0].rhatUUID;
    });
  };

  const submitForm = async (values: IUserInput) => {
    setIsAddingDB(true);
    const rhatUUID = await getUserInfo(values.user);
    db.permissions[`${admin ? 'admins' : 'users'}`].push(
      `user:${rhatUUID}`
    );
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
          subject: 'Member permission added successfully!',
        });
        forceRefreshApp(res.data.manageAppDatabase);
        handleModalClose();
      })
      .catch((err: any) => {
        window.OpNotification?.danger({
          subject: 'An error occurred when updating member permissions',
          body: err[0].message,
        });
      });
  };
  const getPermissionField = (isAdmin: boolean) => {
    let labels = (
      <Label color="blue" isTruncated name="permission">
        Read
      </Label>
    );
    if (isAdmin) {
      labels = (
        <LabelGroup>
          <Label color="blue">Read</Label>
          <Label color="blue">Write</Label>
        </LabelGroup>
      );
    }

    return labels;
  };

  return (
    <>
      <Form
        noValidate={false}
        onSubmit={handleSubmit(submitForm)}
        onReset={handleModalClose}
      >
        <FormGroup
          label="Enter Kerberos name for the member"
          isRequired
          fieldId="user"
          helperText="Please provide Kerberos name for the member"
          helperTextInvalid={errors.user?.message}
          validated={errors.user ? 'error' : 'default'}
        >
          <Controller
            name="user"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                type="text"
                id="user"
                aria-describedby="user-helper"
                validated={errors.user ? 'error' : 'default'}
                placeholder="Enter Kerberos name for the member"
              />
            )}
          />
        </FormGroup>
        <FormGroup
          label="Permission"
          fieldId="permission"
          helperTextInvalid={errors.permission?.message}
          validated={errors.permission ? 'error' : 'default'}
        >
          <Controller
            name="permission"
            control={control}
            render={({ field }) => getPermissionField(admin)}
          />
        </FormGroup>
        <ActionGroup>
          <Button
            variant="primary"
            type="submit"
            isLoading={isAddingDB}
            isDisabled={!isValid}
          >
            Add {admin ? 'Admin' : 'Member'}
          </Button>
          <Button variant="link" type="reset">
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    </>
  );
};
export default AddUserForm;
