import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMedMutualCalendarWebpartProps {
  description: string;
  userId: string;
  context: WebPartContext;
  componentToggler: boolean;
  textFileUrl: string;
}
