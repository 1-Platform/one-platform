import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  Modal,
  Tab,
  Tabs,
  TabTitleIcon,
  TabTitleText,
  TextInput,
} from '@patternfly/react-core';
import useQueryParams from 'common/hooks/useQueryParams';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface INewAppForm {
  onSubmit?: () => void;
  onCancel?: () => void;
}

export default function NewAppForm({ onSubmit, onCancel }: INewAppForm) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useQueryParams();
  const history = useHistory();

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const _closeModal = () => {
    searchParams.delete('action');
    history.push({ search: searchParams.toString() });
  };

  const handleSubmit = () => {
    /* TODO: call new App service */
    _closeModal();
    onSubmit?.();
  };

  const handleReset = () => {
    _closeModal();
    onCancel?.();
  };

  const newForm = (
    <>
      <Form
        className="pf-u-pt-lg"
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
        <FormGroup fieldId="name" label="Name" isRequired>
          <TextInput />
        </FormGroup>
        <FormGroup fieldId="name" label="Path" isRequired>
          <TextInput />
        </FormGroup>
        <ActionGroup>
          <Button type="submit" variant="primary">
            Create
          </Button>
          <Button type="reset" variant="plain">
            Cancel
          </Button>
        </ActionGroup>
      </Form>
    </>
  );

  return (
    <>
      <Modal
        variant="small"
        isOpen={isOpen}
        aria-label="Create New App"
        showClose={false}
      >
        <Tabs>
          <Tab
            title={
              <>
                <TabTitleIcon>
                  <ion-icon name="add-outline" />
                </TabTitleIcon>
                <TabTitleText className="pf-u-font-weight-bold">
                  New App
                </TabTitleText>
              </>
            }
            eventKey={0}
          >
            {newForm}
          </Tab>
          <Tab
            title={
              <>
                <TabTitleIcon>
                  <ion-icon name="link-outline" />
                </TabTitleIcon>
                <TabTitleText className="pf-u-font-weight-bold">
                  Link Existing App
                </TabTitleText>
              </>
            }
            eventKey={1}
          />
        </Tabs>
      </Modal>
    </>
  );
}
