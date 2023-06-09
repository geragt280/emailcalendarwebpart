import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'MedMutualCalendarWebpartWebPartStrings';
import MedMutualCalendarWebpart from './components/MedMutualCalendarWebpart';
import { IMedMutualCalendarWebpartProps } from './components/IMedMutualCalendarWebpartProps';

export interface IMedMutualCalendarWebpartWebPartProps {
  description: string;
  userId: string;
  componentToggler: boolean;
  textFileUrl: string;
}

export default class MedMutualCalendarWebpartWebPart extends BaseClientSideWebPart<IMedMutualCalendarWebpartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMedMutualCalendarWebpartProps> = React.createElement(
      MedMutualCalendarWebpart,
      {
        description: this.properties.description,
        userId: this.properties.userId,
        context: this.context,
        componentToggler: this.properties.componentToggler,
        textFileUrl: this.properties.textFileUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then(message => {
      // this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('userId', {
                  label: 'User ID'
                }),
                PropertyPaneTextField('textFileUrl', {
                  label: 'Categories File Url'
                }),
                PropertyPaneToggle('componentToggler',{
                  label:'Webpart Type',
                  offText:'Calender',
                  onText:'Events',
                  checked:false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
