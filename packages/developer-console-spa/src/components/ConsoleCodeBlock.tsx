import { ReactNode, useCallback } from "react";
import {
  CodeBlock,
  Stack,
  StackItem,
  Title,
  CodeBlockCode,
  Tooltip,
  Button,
} from "@patternfly/react-core";

import styles from "./consoleCodeBlock.module.css";

interface Props {
  title?: string;
  subTitle: ReactNode;
  children?: string;
}

export const ConsoleCodeBlock = ({ title, subTitle, children }: Props) => {
  const handleClipboardCopy = useCallback(() => {
    if (typeof children === "string" || typeof children === "number") {
      navigator.clipboard.writeText(children);

      const timer = setTimeout(() => {
        clearInterval(timer);
      }, 2000);
    }
  }, [children]);

  return (
    <Stack hasGutter className={styles["code-block--container"]}>
      {title && (
        <StackItem>
          <Title headingLevel="h6">{title}</Title>
        </StackItem>
      )}
      <StackItem>{subTitle}</StackItem>
      <StackItem>
        <CodeBlock className={styles["code-block"]}>
          <CodeBlockCode
            id="code-content"
            className={styles["code-block--content"]}
          >
            {children}
            <div className={styles["code-block--btn-container"]}>
              <Tooltip trigger="click" content={<div>Copied.</div>}>
                <Button
                  id="copy-button"
                  aria-label="Copy to clipboard"
                  onClick={handleClipboardCopy}
                  variant="plain"
                  className={styles["code-block--copy-btn"]}
                >
                  <ion-icon name="clipboard-outline"></ion-icon>
                </Button>
              </Tooltip>
            </div>
          </CodeBlockCode>
        </CodeBlock>
      </StackItem>
    </Stack>
  );
};
