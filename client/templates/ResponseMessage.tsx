import React from 'react';
import { Response } from '../../common/types';

interface Props {
  response: Response;
}

export default class ResponseMessage extends React.PureComponent<Props> {
  render() {
    const { response } = this.props;

    return (
      <div className={`alert alert-${response.success ? 'success' : 'danger'}`}>
        {response.messages.map(message => (
          <div key={(message || '').toString()}>{message}</div>
        ))}
      </div>
    );
  }
}
