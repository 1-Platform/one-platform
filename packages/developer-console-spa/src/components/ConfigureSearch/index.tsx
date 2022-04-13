import { StateMachineProvider } from 'little-state-machine';
import SearchWizardForm from './SearchWizardForm';


export default function ConfigureSearch () {
  return (
    <StateMachineProvider>
      <SearchWizardForm />
    </StateMachineProvider>
  );
}
