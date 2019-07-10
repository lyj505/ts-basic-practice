import React, { ReactNode } from 'react';

export interface Config {
  web: {
    linkHost: string;
  };
  siteName: string;
}

type Props = {
  config: Config;
  children?: ReactNode;
  style?: string;
};

export default class BaseEmail extends React.Component<Props> {
  render() {
    const { config, style } = this.props;
    return (
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          {style ? <style dangerouslySetInnerHTML={{ __html: style }} /> : null}
        </head>
        <body>
          <table>
            <tbody>
              <tr>
                <td style={{ paddingRight: '10px' }}>
                  <img
                    src={`${config.web.linkHost}/assets/email-logo.png`}
                    alt=""
                  />
                </td>
                <td>
                  <h1>{config.siteName}</h1>
                </td>
              </tr>
            </tbody>
          </table>
          <hr />
          {this.props.children}
        </body>
      </html>
    );
  }
}
