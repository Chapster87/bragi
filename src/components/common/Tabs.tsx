import React, { Children, ReactNode, useState } from 'react';

interface TabsProps {
  children: ReactNode;
  className?: string;
  defaultTab?: number;
  active?: boolean;
  changeTab?: (index: number) => void;
}

export function Tabs(props: TabsProps) {
  console.log('Tabs', props);
  const [defaultTab, setDefaultTab] = useState(props.defaultTab ? props.defaultTab : 0);

  function updateTab(index: number) {
    setDefaultTab(index);
  }

  return (
    <div className={`tabs ${props.className ? props.className : ''}`}>
      {Children.map(props.children, (child) => {
        if (React.isValidElement<{ defaultTab?: number }>(child)) {
          return React.cloneElement(child, { defaultTab: defaultTab, changeTab: updateTab } as TabsProps);
        }
      })}
    </div>
  );
}

export function TabsHeader(props: TabsProps) {
  console.log('TabsHeader', props);
  const defaultTab = props.defaultTab ? props.defaultTab : 0;

  function changeTab(index: number) {
    if (props.changeTab) {
      props.changeTab(index);
    }
  }

  return (
    <div className={`tabs-header ${props.className ? props.className : ''}`}>
      {Children.map(props.children, (child, index) => {
        if (React.isValidElement<{ active?: boolean }>(child)) {
          return React.cloneElement(child, { active: index === defaultTab && true, changeTab: () => changeTab(index) });
        }
      })}
    </div>
  );
}

export function Tab(props: TabsProps) {
  console.log('Tab', props);
  return (
    <button className={`tab${props.active ? ' active' : ''} ${props.className ? props.className : ''}`} type="button" onClick={props.active ? undefined : props.changeTab}>
      {props.children}
    </button>
  );
}

export function TabsBody(props: TabsProps) {
  console.log('TabsBody', props);
  const defaultTab = props.defaultTab ? props.defaultTab : 0;
  return (
    <div className={`tabs-body ${props.className ? props.className : ''}`}>
      {Children.map(props.children, (child, index) => {
        if (React.isValidElement<{ active?: boolean }>(child)) {
          return React.cloneElement(child, { active: index ===  defaultTab && true });
        }
      })}
    </div>
  );
}

export function TabPanel(props: TabsProps) {
  console.log('TabPanel', props);
  return (
    <div className={`tab-panel${props.active ? ' block active' : ' hidden'} ${props.className && props.className}`}>
      {props.children}
    </div>
  );
}