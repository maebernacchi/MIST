// BASED ON SOURCE: https://gist.github.com/stolinski/2d9545e19dd67bda64143cb1aae04ac0
import React from 'react';
import {GlobalContextProvider} from './global-context';
import {FontGlobals} from './globals-fonts';
import {FunBarDimensions} from './globals-funbar-dimensions';
import {PopupContextProvider} from './globals-popup_canvas-dimensions';
import {MenuContextProvider} from './globals-menu-dimensions';
import {NodeContextProvider} from './globals-nodes-dimensions';
import {MenuContextProvider1} from './globals-menu-dimensions1';
import UserContextProvider from '../../pages/components/Contexts/UserContext';
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
	  /* I do not know why but adding UserContextProvider here for 
	  the second time (the first time being in the index.js
	  allows the children components to use the UserContext*/
	  <UserContextProvider />,
      <GlobalContextProvider key={0} {...props}/>,
      <FontGlobals key={1} {...props}/>,
      <FunBarDimensions key={2} {...props}/>,
      <PopupContextProvider key={3} {...props}/>,
      <MenuContextProvider key={4} {...props}/>,
      <NodeContextProvider key={5} {...props}/>,
      <MenuContextProvider1 key={6} {...props}/>,
    ]}
    >
      {props.children}
    </ProviderComposer>
  );
}

export { ContextProvider };
