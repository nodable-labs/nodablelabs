import{r as a,j as r,f as ve,U as ge,O as pe,C as be}from"./index-u5d1d1cK.js";import{k as me,D as xe,u as Te,p as L,g as k,o as Ie,P as w,d as T,f as K,b as he,e as we,h as P,R as Re}from"./index-DHBZfd8W.js";var j="rovingFocusGroup.onEntryFocus",Ce={bubbles:!1,cancelable:!0},C="RovingFocusGroup",[N,z,Fe]=me(C),[ye,U]=xe(C,[Fe]),[Ee,Se]=ye(C),B=a.forwardRef((e,t)=>r.jsx(N.Provider,{scope:e.__scopeRovingFocusGroup,children:r.jsx(N.Slot,{scope:e.__scopeRovingFocusGroup,children:r.jsx(je,{...e,ref:t})})}));B.displayName=C;var je=a.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:n,orientation:o,loop:u=!1,dir:f,currentTabStopId:s,defaultCurrentTabStopId:g,onCurrentTabStopIdChange:p,onEntryFocus:i,preventScrollOnEntryFocus:l=!1,...c}=e,b=a.useRef(null),R=Te(t,b),d=L(f),[I=null,F]=k({prop:s,defaultProp:g,onChange:p}),[m,x]=a.useState(!1),y=Ie(i),ie=z(n),E=a.useRef(!1),[ce,G]=a.useState(0);return a.useEffect(()=>{const v=b.current;if(v)return v.addEventListener(j,y),()=>v.removeEventListener(j,y)},[y]),r.jsx(Ee,{scope:n,orientation:o,dir:d,loop:u,currentTabStopId:I,onItemFocus:a.useCallback(v=>F(v),[F]),onItemShiftTab:a.useCallback(()=>x(!0),[]),onFocusableItemAdd:a.useCallback(()=>G(v=>v+1),[]),onFocusableItemRemove:a.useCallback(()=>G(v=>v-1),[]),children:r.jsx(w.div,{tabIndex:m||ce===0?-1:0,"data-orientation":o,...c,ref:R,style:{outline:"none",...e.style},onMouseDown:T(e.onMouseDown,()=>{E.current=!0}),onFocus:T(e.onFocus,v=>{const ue=!E.current;if(v.target===v.currentTarget&&ue&&!m){const O=new CustomEvent(j,Ce);if(v.currentTarget.dispatchEvent(O),!O.defaultPrevented){const S=ie().filter(h=>h.focusable),le=S.find(h=>h.active),de=S.find(h=>h.id===I),fe=[le,de,...S].filter(Boolean).map(h=>h.ref.current);Y(fe,l)}}E.current=!1}),onBlur:T(e.onBlur,()=>x(!1))})})}),V="RovingFocusGroupItem",$=a.forwardRef((e,t)=>{const{__scopeRovingFocusGroup:n,focusable:o=!0,active:u=!1,tabStopId:f,...s}=e,g=K(),p=f||g,i=Se(V,n),l=i.currentTabStopId===p,c=z(n),{onFocusableItemAdd:b,onFocusableItemRemove:R}=i;return a.useEffect(()=>{if(o)return b(),()=>R()},[o,b,R]),r.jsx(N.ItemSlot,{scope:n,id:p,focusable:o,active:u,children:r.jsx(w.span,{tabIndex:l?0:-1,"data-orientation":i.orientation,...s,ref:t,onMouseDown:T(e.onMouseDown,d=>{o?i.onItemFocus(p):d.preventDefault()}),onFocus:T(e.onFocus,()=>i.onItemFocus(p)),onKeyDown:T(e.onKeyDown,d=>{if(d.key==="Tab"&&d.shiftKey){i.onItemShiftTab();return}if(d.target!==d.currentTarget)return;const I=_e(d,i.orientation,i.dir);if(I!==void 0){if(d.metaKey||d.ctrlKey||d.altKey||d.shiftKey)return;d.preventDefault();let m=c().filter(x=>x.focusable).map(x=>x.ref.current);if(I==="last")m.reverse();else if(I==="prev"||I==="next"){I==="prev"&&m.reverse();const x=m.indexOf(d.currentTarget);m=i.loop?Pe(m,x+1):m.slice(x+1)}setTimeout(()=>Y(m))}})})})});$.displayName=V;var Ne={ArrowLeft:"prev",ArrowUp:"prev",ArrowRight:"next",ArrowDown:"next",PageUp:"first",Home:"first",PageDown:"last",End:"last"};function Ae(e,t){return t!=="rtl"?e:e==="ArrowLeft"?"ArrowRight":e==="ArrowRight"?"ArrowLeft":e}function _e(e,t,n){const o=Ae(e.key,n);if(!(t==="vertical"&&["ArrowLeft","ArrowRight"].includes(o))&&!(t==="horizontal"&&["ArrowUp","ArrowDown"].includes(o)))return Ne[o]}function Y(e,t=!1){const n=document.activeElement;for(const o of e)if(o===n||(o.focus({preventScroll:t}),document.activeElement!==n))return}function Pe(e,t){return e.map((n,o)=>e[(t+o)%e.length])}var De=B,Me=$,D="Tabs",[Ge,Be]=he(D,[U]),H=U(),[Oe,M]=Ge(D),q=a.forwardRef((e,t)=>{const{__scopeTabs:n,value:o,onValueChange:u,defaultValue:f,orientation:s="horizontal",dir:g,activationMode:p="automatic",...i}=e,l=L(g),[c,b]=k({prop:o,onChange:u,defaultProp:f});return r.jsx(Oe,{scope:n,baseId:K(),value:c,onValueChange:b,orientation:s,dir:l,activationMode:p,children:r.jsx(w.div,{dir:l,"data-orientation":s,...i,ref:t})})});q.displayName=D;var J="TabsList",Q=a.forwardRef((e,t)=>{const{__scopeTabs:n,loop:o=!0,...u}=e,f=M(J,n),s=H(n);return r.jsx(De,{asChild:!0,...s,orientation:f.orientation,dir:f.dir,loop:o,children:r.jsx(w.div,{role:"tablist","aria-orientation":f.orientation,...u,ref:t})})});Q.displayName=J;var W="TabsTrigger",X=a.forwardRef((e,t)=>{const{__scopeTabs:n,value:o,disabled:u=!1,...f}=e,s=M(W,n),g=H(n),p=te(s.baseId,o),i=oe(s.baseId,o),l=o===s.value;return r.jsx(Me,{asChild:!0,...g,focusable:!u,active:l,children:r.jsx(w.button,{type:"button",role:"tab","aria-selected":l,"aria-controls":i,"data-state":l?"active":"inactive","data-disabled":u?"":void 0,disabled:u,id:p,...f,ref:t,onMouseDown:T(e.onMouseDown,c=>{!u&&c.button===0&&c.ctrlKey===!1?s.onValueChange(o):c.preventDefault()}),onKeyDown:T(e.onKeyDown,c=>{[" ","Enter"].includes(c.key)&&s.onValueChange(o)}),onFocus:T(e.onFocus,()=>{const c=s.activationMode!=="manual";!l&&!u&&c&&s.onValueChange(o)})})})});X.displayName=W;var Z="TabsContent",ee=a.forwardRef((e,t)=>{const{__scopeTabs:n,value:o,forceMount:u,children:f,...s}=e,g=M(Z,n),p=te(g.baseId,o),i=oe(g.baseId,o),l=o===g.value,c=a.useRef(l);return a.useEffect(()=>{const b=requestAnimationFrame(()=>c.current=!1);return()=>cancelAnimationFrame(b)},[]),r.jsx(we,{present:u||l,children:({present:b})=>r.jsx(w.div,{"data-state":l?"active":"inactive","data-orientation":g.orientation,role:"tabpanel","aria-labelledby":p,hidden:!b,id:i,tabIndex:0,...s,ref:t,style:{...e.style,animationDuration:c.current?"0s":void 0},children:b&&f})})});ee.displayName=Z;function te(e,t){return`${e}-trigger-${t}`}function oe(e,t){return`${e}-content-${t}`}var Le=q,ne=Q,re=X,ae=ee;const ke=Le,se=a.forwardRef(({className:e,...t},n)=>r.jsx(ne,{ref:n,className:P("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",e),...t}));se.displayName=ne.displayName;const A=a.forwardRef(({className:e,...t},n)=>r.jsx(re,{ref:n,className:P("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",e),...t}));A.displayName=re.displayName;const _=a.forwardRef(({className:e,...t},n)=>r.jsx(ae,{ref:n,className:P("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",e),...t}));_.displayName=ae.displayName;function Ve(){const{organization:e,isLoaded:t}=ve(),n=[{title:"Account Status",value:"Active"}];return r.jsx(Re,{topMetrics:n,hideKnowledgeSearch:!0,children:r.jsx("div",{className:"container max-w-screen-2xl mx-auto px-4",children:r.jsxs(ke,{defaultValue:"profile",className:"w-full",children:[r.jsxs(se,{className:"mb-4",children:[r.jsx(A,{value:"profile",children:"User Profile"}),r.jsx(A,{value:"organization",children:"Organization"})]}),r.jsx(_,{value:"profile",children:r.jsx(ge,{appearance:{elements:{rootBox:"w-full",card:"glass-panel shadow-xl"}}})}),r.jsx(_,{value:"organization",children:t?e?r.jsx(pe,{appearance:{elements:{rootBox:"w-full",card:"glass-panel shadow-xl",organizationSwitcherTrigger:"hidden",organizationPreview:"hidden"}},routing:"virtual"}):r.jsx(be,{appearance:{elements:{rootBox:"w-full",card:"glass-panel shadow-xl"}}}):r.jsx("div",{children:"Loading..."})})]})})})}export{Ve as default};