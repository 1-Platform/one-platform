type NotificationTemplate = {
  name: string;
  description: string;
  subject: string;
  body: string;
  templateEngine: TemplateEngine;
  dataMap: [ TemplateDataMap ];
  templateType: TemplateType;
  owners: [string]
  isEnabled: boolean;

  templateID: string;

  createdOn: Date;
  createdBy: string;
  updatedOn: Date;
  updatedBy: string;
}

type NotificationTemplatePayload = {
  subject: string;
  body: string;
  to: EmailRecipient[];
  cc: EmailRecipient[];
  bcc: EmailRecipient[];
  data: any;
}

type TemplateDataMap = {
  key: string
  value: any
}

declare const enum TemplateEngine {
  TWIG = 'TWIG',
  HBS = 'HBS',
  NJK = 'NJK'
}

declare const enum TemplateType {
  EMAIL = 'EMAIL',
  BANNER = 'BANNER',
  PUSH = 'PUSH'
}
