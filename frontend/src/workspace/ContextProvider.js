// BASED ON SOURCE: https://gist.github.com/stolinski/2d9545e19dd67bda64143cb1aae04ac0
import React from 'react';
import {GlobalContextProvider} from './global-context';
import {FontGlobals} from './globals-fonts';
import {FunBarDimensions} from './globals-funbar-dimensions';
import {PopupContextProvider} from './globals-popup_canvas-dimensions';
import {MenuContextProvider} from './globals-menu-dimensions';
import {NodeContextProvider} from './globals-nodes-dimensions';
import {MenuContextProvider1} from './globals-menu-dimensions1';

function ProviderComposer({ contexts, children }) {
  return contexts.reduceRight(
    (kids, parent) =>
      React.cloneElement(parent, {
        children: kids,
      }),
    children
  );
}

function ContextProvider(props) {
  return (
    <ProviderComposer
      contexts={[
      <GlobalContextProvider {...props}/>,
      <FontGlobals {...props}/>,
      <FunBarDimensions {...props}/>,
      <PopupContextProvider {...props}/>,
      <MenuContextProvider {...props}/>,
      <NodeContextProvider {...props}/>,
      <MenuContextProvider1 {...props}/>,
    ]}
    >
      {props.children}
    </ProviderComposer>
  );
}

export { ContextProvider };