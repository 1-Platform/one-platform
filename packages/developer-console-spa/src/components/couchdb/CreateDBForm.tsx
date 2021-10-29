import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import gqlClient from '../../utils/gqlClient';
import { createAppDatabase } from '../../utils/gql-queries';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Dispatch, SetStateAction, useState, useContext } from 'react';
import { AppContext } from 'context/AppContext';
interface IDBInput {
  dbname: string;
  description: string;
  appId: string;
}
const appSchema = yup.object().shape({
  dbname: yup.string().required(),
  description: yup.string(),
});

interface CreateDBProps {
  isCreateDBFormOpen?: boolean;
  appId: string;
  appUniqueId: string;
  setIsCreateDBFormOpen: Dispatch<SetStateAction<boolean>>;
}

const CreateDBForm = ( {
  isCreateDBFormOpen,
  appId,
  appUniqueId,
  setIsCreateDBFormOpen
}: CreateDBProps ) => {
  const [ isCreatingDB, setIsCreatingDB ] = useState<boolean>( false );
  const { forceRefreshApp } = useContext(AppContext);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<IDBInput>({
    mode: 'onBlur',
    resolver: yupResolver(appSchema),
    defaultValues: {
      dbname: '',
      description: '',
    },
  });

  function handleModalClose() {
    /* Reset the form */
    reset();
    setIsCreateDBFormOpen(false);
  }

  function submitForm(db: IDBInput) {
    setIsCreatingDB(true);
    gqlClient({
      query: createAppDatabase,
      variables: {
        databaseName: db.dbname,
        id: appUniqueId,
        description: db.description,
      },
    })
      .then((res: any) => {
        setIsCreatingDB(false);
        if (res?.data?.createAppDatabase) {
          window.OpNotification?.success({
            subject: `Database ${db.dbname} created successfully!`,
          } );
          setIsCreateDBFormOpen(false);
          forceRefreshApp(res.data.createAppDatabase);
        }
        if (res?.errors) {
          window.OpNotification?.danger({
            subject: 'An error occurred when creating the Database.',
            body: res.errors[0].message,
          });
        }
      })
      .catch((err: any) => {
        window.OpNotification?.danger({
          subject: 'An error occurred when creating the Database.',
          body: 'Please try again later.',
        });
        console.error(err);
      });
  }

  return (
    <>
      <Form
        noValidate={false}
        onSubmit={handleSubmit(submitForm)}
        onReset={handleModalClose}
      >
        <FormGroup
          label="Enter database name"
          isRequired
          fieldId="db-name"
          helperText="Please provide a name for your app"
          helperTextInvalid={errors.dbname?.message}
          validated={errors.dbname ? 'error' : 'default'}
        >
          <Controller
            name="dbname"
            control={control}
            render={({ field }) => (
              <TextInput
                {...field}
                type="text"
                id="app-name"
                aria-describedby="app-name-helper"
                validated={errors.dbname ? 'error' : 'default'}
                placeholder="Enter app name here..."
              />
            )}
          />
        </FormGroup>
        <FormGroup
          label="Database Description"
          fieldId="app-desc"
          helperText="Please provide a brief description of your database"
          helperTextInvalid={errors.description?.message}
          validated={errors.description ? 'error' : 'default'}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                id="app-desc"
                aria-describedby="app-desc-helper"
                validated={errors.description ? 'error' : 'default'}
                placeholder="Enter database description here..."
              />
            )}
          />
        </FormGroup>

        <ActionGroup>
          <Button
            variant="primary"
            type="submit"
            isDisabled={!isValid}
            isLoading={isCreatingDB}
          >
            Create Instance
          </Button>
          <Button variant="link" type="reset">
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    </>
  );
};
export default CreateDBForm;
