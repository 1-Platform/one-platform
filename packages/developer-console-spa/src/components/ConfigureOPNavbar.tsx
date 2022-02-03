import { useCallback, useMemo, useState } from "react";

import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Title,
  Text,
  Divider,
} from "@patternfly/react-core";

import { ConsoleCodeBlock } from "./ConsoleCodeBlock";

import ssiDefaultImage from "assets/images/ssi_default.png";
import ssiFeedbackImage from "assets/images/ssi_feedback.png";
import ssiNavOnlyImage from "assets/images/ssi_nav_only.png";

import styles from "./ConfigureOPCBase.module.css";

const OPC_BASE_SCRIPT = `opcBase.configure({
    apiBasePath: "",
    subscriptionsPath: "",
    keycloakUrl: "",
    keycloakClientId: "",
    keycloakRealm: "",
  })`;

enum Themes {
  Full = "full-ssi",
  NavOnly = "nav-only",
  FeedbackOnly = "feedback-only",
}

function ConfigureOPNavbar(props: any) {
  const [theme, setTheme] = useState<Themes>(Themes.Full);

  const themes = [
    { name: "Full Template", image: ssiDefaultImage, key: Themes.Full },
    { name: "Top Nav only", image: ssiNavOnlyImage, key: Themes.NavOnly },
    {
      name: "Feedback only",
      image: ssiFeedbackImage,
      key: Themes.FeedbackOnly,
    },
  ];

  /**
   * Memo hook for umd scripts to be imported for respective theme
   */
  const scriptTemplate = useMemo(() => {
    let script = `<script src="https://unpkg.com/@one-platform/opc-base@latest/dist/umd/opc-base.js"></script>
<script src="https://unpkg.com/@one-platform/opc-base@latest/dist/umd/opc-provider.js"></script>`;

    if (theme === Themes.Full || theme === Themes.NavOnly)
      script += `
<script src="https://unpkg.com/@one-platform/opc-nav@latest/dist/opc-nav.js"></script>
<script src="https://unpkg.com/@one-platform/opc-menu-drawer@latest/dist/opc-menu-drawer.js"></script>
<script src="https://unpkg.com/@one-platform/opc-notification-drawer@latest/dist/opc-notification-drawer.js"></script>`;

    if (theme === Themes.Full || theme === Themes.FeedbackOnly)
      script += `
<script src="https://unpkg.com/@one-platform/opc-feedback@latest/dist/opc-feedback.js"></script>`;

    script += `

<script>
  ${OPC_BASE_SCRIPT}
</script>`;

    return script;
  }, [theme]);

  /**
   * Memo hook for es modules to to be imported for respective theme
   */
  const esModuleToBeInstalledTemplate = useMemo(() => {
    let npmInstallationCommands = `npm install @one-platform/opc-base`;

    if (theme === Themes.Full || theme === Themes.NavOnly)
      npmInstallationCommands += `
npm install @one-platform/opc-nav
npm install @one-platform/opc-notification-drawer
npm install @one-platform/opc-menu-drawer`;

    if (theme === Themes.Full || theme === Themes.FeedbackOnly)
      npmInstallationCommands += `
npm install @one-platform/opc-feedback`;

    return npmInstallationCommands;
  }, [theme]);

  const esModuleToBeImportedTemplate = useMemo(() => {
    let importOrder = `import opcBase from '@one-platform/opc-base';
import '@one-platform/opc-base/dist/opc-provider'`;

    if (theme === Themes.Full || theme === Themes.NavOnly)
      importOrder += `
import '@one-platform/opc-nav';
import '@one-platform/opc-menu-drawer';
import '@one-platform/opc-notification-drawer';`;

    if (theme === Themes.Full || theme === Themes.FeedbackOnly)
      importOrder += `
import '@one-platform/opc-feedback';`;

    importOrder += `

${OPC_BASE_SCRIPT}`;

    return importOrder;
  }, [theme]);

  /**
   * memo hook for respective html template to be added for the theme
   */
  const htmlTemplate = useMemo(() => {
    let html = `<opc-provider><nav-only><feedback-only>\n</opc-provider>`;

    html = html.replace(
      "<nav-only>",
      theme === Themes.Full || theme === Themes.NavOnly
        ? `
  <opc-nav></opc-nav>
  <opc-menu-drawer></opc-menu-drawer>
  <opc-notification-drawer></opc-notification-drawer>`
        : ""
    );
    html = html.replace(
      "<feedback-only>",
      theme === Themes.Full || theme === Themes.FeedbackOnly
        ? `
  <opc-feedback></opc-feedback>`
        : ""
    );

    return html;
  }, [theme]);

  const handleThemeChange = useCallback((theme: Themes) => {
    setTheme(theme);
  }, []);

  return (
    <Stack hasGutter>
      <StackItem>
        <Card isRounded>
          <CardBody>
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h1">Configure OP Navbar</Title>
              </StackItem>
              <StackItem>
                <Grid hasGutter>
                  <GridItem span={12}>
                    <Text>
                      <span className={styles["text-bold"]}>Step 1: </span>
                      Choose a style for the OP Navbar
                    </Text>
                  </GridItem>
                  {themes.map(({ name, image, key }) => (
                    <GridItem span={6} key={key}>
                      <Stack>
                        <StackItem>
                          <img
                            id={key}
                            src={image}
                            alt={name}
                            aria-label={name}
                            className={styles["ssi-theme--image"]}
                            onClick={() => handleThemeChange(key)}
                            active-theme={key === theme ? key : undefined}
                            tabIndex={0}
                          />
                        </StackItem>
                        <StackItem style={{ textAlign: "center" }}>
                          <Text>{name}</Text>
                        </StackItem>
                      </Stack>
                    </GridItem>
                  ))}
                </Grid>
              </StackItem>
              <StackItem>
                <Divider />
              </StackItem>
              <StackItem>
                <Stack hasGutter>
                  <StackItem>
                    <ConsoleCodeBlock
                      title="Script"
                      subTitle={
                        <span>
                          <span className={styles["text-bold"]}>Step 2: </span>
                          Include scripts in your web application via
                          &lt;script&gt;
                        </span>
                      }
                    >
                      {scriptTemplate}
                    </ConsoleCodeBlock>
                  </StackItem>
                  <StackItem>
                    <ConsoleCodeBlock
                      subTitle={
                        <span>
                          <span className={styles["text-bold"]}>Step 3: </span>
                          Add these in your html root
                        </span>
                      }
                    >
                      {htmlTemplate}
                    </ConsoleCodeBlock>
                  </StackItem>
                </Stack>
              </StackItem>
              <StackItem>
                <Divider />
              </StackItem>
              <StackItem>
                <Stack hasGutter>
                  <StackItem>
                    <ConsoleCodeBlock
                      title="ES Module"
                      subTitle={
                        <span>
                          <span className={styles["text-bold"]}>Step 2: </span>
                          Run these commands in your shell to install npm module
                        </span>
                      }
                    >
                      {esModuleToBeInstalledTemplate}
                    </ConsoleCodeBlock>
                  </StackItem>
                  <StackItem>
                    <ConsoleCodeBlock
                      subTitle={
                        <span>
                          <span className={styles["text-bold"]}>Step 3: </span>
                          Import the components in your root file and configure
                          opcBase
                        </span>
                      }
                    >
                      {esModuleToBeImportedTemplate}
                    </ConsoleCodeBlock>
                  </StackItem>
                  <StackItem>
                    <ConsoleCodeBlock
                      subTitle={
                        <span>
                          <span className={styles["text-bold"]}>Step 4: </span>
                          Add these in your html root
                        </span>
                      }
                    >
                      {htmlTemplate}
                    </ConsoleCodeBlock>
                  </StackItem>
                </Stack>
              </StackItem>
            </Stack>
          </CardBody>
        </Card>
      </StackItem>
      <StackItem>
        <Card isRounded>
          <CardBody>
            <Title headingLevel="h1">FAQs</Title>
          </CardBody>
        </Card>
      </StackItem>
    </Stack>
  );
}

export default ConfigureOPNavbar;
