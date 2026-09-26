const fs=require('fs');
global.React={createRef:()=>({current:null})};
global.window={__resources:{}};
class DCLogic{constructor(props){this.props=props||{};} setState(u){const n=typeof u==='function'?u(this.state):u; this.state={...this.state,...n};}}
global.DCLogic=DCLogic;
const src=fs.readFileSync('logic.js','utf8')+'\nmodule.exports=Component;';
const m={exports:{}}; new Function('module','exports','React','window','DCLogic',src)(m,m.exports,global.React,global.window,DCLogic);
const C=m.exports;
function vals(state){const c=new C({}); c.state={...c.state,...state}; return c.renderVals();}
const out={};
for(const lang of ['ca','es']){
  out[lang]={ind:vals({lang}), grp:vals({lang,roomType:'grupal'}), T:new C({}).T[lang], planNames:new C({}).planNames[lang], faqs:new C({}).faqsData[lang]};
}
fs.writeFileSync('vals.json',JSON.stringify(out,null,1));
console.log(Object.keys(out.ca.ind).join(' '));
