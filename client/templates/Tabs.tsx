// @flow
import * as React from 'react';
import _ from 'lodash';
import { callProp } from 'react-updaters';

export type OptionValue = string | number | boolean | null;
export type Options = { value: OptionValue; label: React.ReactNode }[];

type Props = {
  tabs: Options;
  value: OptionValue;
  onChange: (value: OptionValue) => unknown;
  disabledTabs?: OptionValue[];
  className?: string | null;
};

export default class Tabs extends React.PureComponent<Props> {
  onChange = (tab: OptionValue, e: Event) => {
    e.preventDefault();
    this.props.onChange(tab);
  };

  doNothingCallback = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const { tabs, value: activeTab, disabledTabs } = this.props;
    const className = this.props.className || 'nav nav-tabs';

    return (
      <ul className={className} role="navigation">
        {tabs.map((option, index) => {
          const tab = option.value;
          const label = option.label;

          const isDisabled = disabledTabs && disabledTabs.indexOf(tab) !== -1;

          let tabClassName = '';
          if (activeTab === tab) {
            tabClassName = 'active';
          } else if (isDisabled) {
            tabClassName = 'disabled';
          }

          return (
            <li key={JSON.stringify(tab)} className="nav-item" data-tab={tab}>
              <a
                href={`#tab${index}`}
                onClick={
                  isDisabled ? null : callProp(this, 'onChange', tab, true)
                }
                className={`nav-link ${tabClassName}`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}
