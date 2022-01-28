import { FormEvent, useCallback, useState } from 'react';
import { Button, Checkbox, Grid, GridItem } from '@patternfly/react-core';
import { App } from 'pages/HomePage/types';

interface Props {
  apps?: App[];
  onSubmit?: (apps: Record<string, App>) => void;
  filteredApps?: Record<string, App> | null;
}

export const AppListCard = ({ apps, onSubmit, filteredApps }: Props): JSX.Element => {
  const [selectedApps, setSelectedApps] = useState(filteredApps);

  const onAppCheckboxChange = useCallback(
    (app: App) => {
      const appsSelected = { ...selectedApps };
      if (appsSelected?.[app.id]) {
        delete appsSelected[app.id];
      } else {
        appsSelected[app.id] = app;
      }
      setSelectedApps(appsSelected);
    },
    [selectedApps]
  );

  const onApplyFilter = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (onSubmit && selectedApps) onSubmit(selectedApps);
  };

  return (
    <form onSubmit={onApplyFilter}>
      <Grid hasGutter>
        {apps?.map((app, index) => (
          <GridItem key={app.id} span={4}>
            <Checkbox
              id={`${app.id}-${index}`}
              name={`${app.id}-${index}`}
              style={{ whiteSpace: 'nowrap' }}
              label={app.name}
              isChecked={Boolean(selectedApps?.[app.id])}
              onChange={() => onAppCheckboxChange(app)}
              className="capitalize"
            />
          </GridItem>
        ))}
        <GridItem span={12}>
          <Button type="submit">Apply</Button>
        </GridItem>
      </Grid>
    </form>
  );
};

AppListCard.defaultProps = {
  apps: [],
  onSubmit: null,
  filteredApps: {},
};
