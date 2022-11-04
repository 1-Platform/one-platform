import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  TextInput,
} from '@patternfly/react-core';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import gqlClient from 'common/utils/gqlClient';
import { yupResolver } from '@hookform/resolvers/yup';
import TrashIcon from '@patternfly/react-icons/dist/esm/icons/trash-icon';
import { deleteAppDatabase } from 'common/utils/gql-queries/delete-app-database';
import { ProjectContext } from 'common/context/ProjectContext';

interface DeleteDBInput {
  dbname: string;
}

interface DeleteDBProps {
  dbname: string;
  appUniqueId: string;
  appId: string;
}

const DeleteDBForm = ( {
  dbname,
  appUniqueId,
  appId
}: DeleteDBProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [ isDeletingDB, setIsDeletingDB ] = useState<boolean>( false );
  const { forceRefresh: forceRefreshApp } = useContext(ProjectContext);
  const deleteFormSchema = yup.object().shape({
    dbname: yup
      .string()
      .required()
      .matches(
        new RegExp(dbname),
        `dbname must match the following: ${dbname}`
      ),
  } );
  let history = useHistory();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteDBInput>({
    mode: 'onBlur',
    resolver: yupResolver(deleteFormSchema),
  });

  const handleModalToggle = () => {
    setIsModalOpen( ( isModalOpen ) => !isModalOpen );
    setIsDeletingDB( false );
  };

  const showConfirmation = (db: DeleteDBInput) => {
    setIsModalOpen(true);
  };
  const DeleteDBInstance = () => {
    setIsDeletingDB(true);
    gqlClient({
      query: deleteAppDatabase,
      variables: {
        databaseName: dbname,
        id: appUniqueId,
      },
    })
      .then( ( res: any ) => {
        setIsModalOpen( false );
        setIsDeletingDB( false );
        if ( res?.errors ) {
          throw res.errors;
        }
        window.OpNotification?.success({
          subject: `Database ${dbname} deleted successfully!`,
        });
        history.push( `/${ appId }/couchdb` );
        forceRefreshApp( res.data.deleteAppDatabase );
      })
      .catch((err: any) => {
        window.OpNotification?.danger({
          subject: 'An error occurred when deleting the Database.',
          body: err[0].message,
        });
        console.error(err);
      });
  };

  return (
    <>
      <Form onSubmit={handleSubmit(showConfirmation)}>
        <FormGroup
          label={`Please type "${dbname}" to confirm`}
          fieldId="delete-app"
          helperText="Please type the DB name to cofirm database delete"
          helperTextInvalid={errors.dbname?.message}
          validated={errors.dbname ? 'error' : 'default'}
        >
          <Controller
            name="dbname"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                id="delete-app"
                aria-describedby="delete-app-helper"
                validated={
                  errors.dbname || dbname !== field.value
                    ? 'error'
                    : 'default'
                }
                placeholder="Enter database name here..."
              />
            )}
          />
        </FormGroup>
        <ActionGroup>
          <Button
            variant="danger"
            icon={<TrashIcon />}
            type="submit"
            iconPosition="left"
          >
            Delete
          </Button>
        </ActionGroup>
      </Form>
      <Modal
        variant={ModalVariant.small}
        title={`Are you sure to delete ${dbname}?`}
        titleIconVariant="danger"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button
            key="confirm"
            variant="danger"
            onClick={DeleteDBInstance}
            isLoading={isDeletingDB}
          >
            Yes, Delete
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>,
        ]}
      >
        You are deleting the Database from CouchDB, this operation will delete
        all data permanently.
      </Modal>
    </>
  );
};
export default DeleteDBForm;
