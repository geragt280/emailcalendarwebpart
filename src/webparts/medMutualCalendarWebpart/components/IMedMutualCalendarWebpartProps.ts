import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMedMutualCalendarWebpartProps {
  description: string;
  listUrl: string;
  context: WebPartContext;
}
