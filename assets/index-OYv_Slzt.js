import{ag as Ct,ah as At,ai as h,aj as Ge,ak as _e,W as t,al as kt,P as He,a9 as d,am as zt,z as Mt,an as Pt,ao as Rt,ap as Vt,aq as Ot}from"./three.core-DF9gDMDL.js";import{G as Nt,O as Wt,C as Zt}from"./three.examples-B3IXmiTy.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const x of l.addedNodes)x.tagName==="LINK"&&x.rel==="modulepreload"&&i(x)}).observe(document,{childList:!0,subtree:!0});function n(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerPolicy&&(l.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?l.credentials="include":r.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(r){if(r.ep)return;r.ep=!0;const l=n(r);fetch(r.href,l)}})();const X=document.getElementById("damage-overlay");function Kt(){X.style.opacity="0.8",setTimeout(()=>{X.style.opacity="0",X.classList.add("fade-out"),setTimeout(()=>{X.classList.remove("fade-out")},1e3)},200)}const u=new Ct,p=new At,F=new h(u);p.load("assets/sounds/abadoned-pyramid-atmo-orchestral-and-drone-sad-mood-9237.mp3",e=>{F.setBuffer(e),F.setLoop(!0),F.setVolume(.1)});const $=new h(u);p.load("assets/sounds/scaryviolins-6829.mp3",e=>{$.setBuffer(e),$.setLoop(!0),$.setVolume(.8)});const G=new h(u);p.load("assets/sounds/shepard-effect-edit.mp3",e=>{G.setBuffer(e),G.setLoop(!0),G.setVolume(.6)});const ye=new h(u);p.load("assets/sounds/cringe-scare-47561.mp3",e=>{ye.setBuffer(e),ye.setVolume(.2)});const pe=new h(u);p.load("assets/sounds/zombie-bite-96528.mp3",e=>{pe.setBuffer(e),pe.setVolume(.5)});const ge=new h(u);p.load("assets/sounds/paper-245786.mp3",e=>{ge.setBuffer(e),ge.setVolume(.5)});const me=new h(u);p.load("assets/sounds/closing-metal-door-44280.mp3",e=>{me.setBuffer(e),me.setVolume(.5)});const we=new h(u);p.load("assets/sounds/door-close-79921.mp3",e=>{we.setBuffer(e),we.setVolume(.4)});const he=new h(u);p.load("assets/sounds/dropping-bag-95101.mp3",e=>{he.setBuffer(e),he.setVolume(.5)});const P=new h(u);p.load("assets/sounds/footsteps.mp3",e=>{P.setBuffer(e),P.setVolume(.4),P.setLoop(!0)});const L=new Ge(u);p.load("assets/sounds/zombie-1-22336.mp3",e=>{L.setBuffer(e),L.setLoop(!0),L.setRefDistance(20),L.setVolume(.3)});const z=new Ge(u);p.load("assets/sounds/fluorescent-lamp-flickering-17625.mp3",e=>{z.setBuffer(e),z.setRefDistance(3),z.setVolume(.9),z.setLoop(!0)});function Ft(e){e.add(u)}function $t(e){e.add(L)}function Gt(e){e.add(z),z.play()}function qe(){F.play()}function Ye(){F.stop()}function _t(){pe.play(),ye.play()}function Ht(){Ye(),$.play(),G.play(),L.play()}function qt(){$.stop(),G.stop(),L.stop(),_t(),qe()}function ce(){ge.play()}function Yt(){me.play()}function Xt(){we.play()}function Ut(){he.play()}function Jt(){P.isPlaying||P.play()}function Qt(){P.pause()}let a,f,Ae,ke,ze,ve,Me,_,O=!1,be=!1;const jt=2,Pe=document.getElementById("infected-bite");function eo(e,o,n,i="Run_InPlace"){o.load(e,r=>{a=r.scene,a.position.x=-19,a.position.z=1.5,$t(a),n.add(a),a.traverse(function(x){x.isMesh&&(x.castShadow=!0)});const l=r.animations;f=new _e(a),Ae=f.clipAction(l[0]),ke=f.clipAction(l[1]),ze=f.clipAction(l[2]),ve=f.clipAction(l[3]),Me=f.clipAction(l[4]),_=f.clipAction(l[5]),f.clipAction(l[6]),i==="Idle"?Ae.play():i==="Walk1_InPlace"?ke.play():i==="Walk2_InPlace"?ze.play():i==="Run_InPlace"?ve.play():i==="Attack"&&Me.play()})}function to(){ve.stop(),_.loop=kt,_.clampWhenFinished=!0,_.play()}function oo(e,o){if(!a||be)return;if(o.start.distanceTo(a.position)<2&&!O){qt(),to(),Kt(),O=!0;return}if(O){f&&(f.update(e),_.isRunning()||(O=!1,be=!0,console.log("Infected is dead"),Pe.style.visibility="visible",setTimeout(()=>{Pe.style.visibility="hidden"},5e3)));return}f&&f.update(e);const n=o.end,i=new t;i.subVectors(new t(n.x,a.position.y,n.z),a.position).normalize(),a.position.add(i.multiplyScalar(jt*e));const r=new t(n.x,a.position.y,n.z);a.lookAt(r)}function no(){f&&(f.stopAllAction(),f.uncacheRoot(a),f=null),a&&(a.traverse(e=>{e.isMesh&&(e.geometry.dispose(),e.material.isMaterial?e.material.dispose():Array.isArray(e.material)&&e.material.forEach(o=>o.dispose()))}),a.parent&&a.parent.remove(a),a=null),be=!1,O=!1}const io="2231",m=document.getElementById("code-input"),Re=document.getElementById("solved-code-text");function so(){m.innerText="",ao()}function ro(){return m.innerText===io?!0:(m.innerText.length===4&&(m.innerText=""),!1)}function lo(e){m.innerText.length<4&&(m.innerText+=e)}function Xe(e){e.key>="0"&&e.key<="9"&&lo(e.key),e.key==="Enter"&&(ro()?(console.log("Code accepted"),m.innerText="Correct!",Re.style.visibility="visible",Ao(),hn(),Ht(),setTimeout(()=>{Co(),m.innerText="",Re.style.visibility="hidden"},3e3)):(console.log("Code rejected"),m.innerText="Wrong!",setTimeout(()=>{m.innerText=""},1e3)))}function co(){document.addEventListener("keyup",Xe)}function ao(){document.removeEventListener("keyup",Xe)}let Ue=!1,M=!1,N=!1,U=!1,W=!1,Z=!1,K=!1;const fo=new d(new t(-7.55,0,-5.5),new t(-5,3,.5)),uo=new d(new t(-31,0,-28),new t(-29,3,-24)),Je=new d(new t(-37,0,0),new t(-33,3,3.5)),yo=new d(new t(-13,0,-60),new t(-10.5,3,-57)),po=new d(new t(-8,0,-10),new t(-5,3,-7.5)),go=new d(new t(-22,0,.6),new t(-19,3,3.5)),Qe=document.getElementById("door-text"),je=document.getElementById("corpse-text"),et=document.getElementById("file-text"),tt=document.getElementById("report-text"),ot=document.getElementById("charles-note-text"),nt=document.getElementById("code-text"),it=document.getElementById("door-exam"),st=document.getElementById("corpse-exam"),re=document.getElementById("corpse-timeline"),le=document.getElementById("report"),de=document.getElementById("charles-note"),R=document.getElementById("faded-screen");re.style.visibility="hidden";le.style.visibility="hidden";de.style.visibility="hidden";function mo(){M&&(Ue?(rt(),Yt(),se("reception"),M=!1):(Xt(),wo())),N&&(Ut(),bo()),W&&(re.style.visibility==="hidden"?(ce(),Io(),ct()):(lt(),dt())),Z&&(le.style.visibility==="hidden"?(ce(),Bo(),ut()):(at(),ft())),K&&(de.style.visibility==="hidden"?(ce(),Do(),gt()):(yt(),pt()))}function wo(){it.style.visibility="visible"}function ho(){it.style.visibility="hidden"}function vo(){Qe.style.visibility="visible"}function rt(){Qe.style.visibility="hidden"}function bo(){st.style.visibility="visible"}function xo(){st.style.visibility="hidden"}function To(){je.style.visibility="visible"}function Eo(){je.style.visibility="hidden"}function Io(){re.style.visibility="visible",R.style.visibility="visible"}function lt(){re.style.visibility="hidden",R.style.visibility="hidden"}function dt(){et.style.visibility="visible"}function ct(){et.style.visibility="hidden"}function Bo(){le.style.visibility="visible",R.style.visibility="visible"}function at(){le.style.visibility="hidden",R.style.visibility="hidden"}function ft(){tt.style.visibility="visible"}function ut(){tt.style.visibility="hidden"}function Do(){de.style.visibility="visible",R.style.visibility="visible"}function yt(){de.style.visibility="hidden",R.style.visibility="hidden"}function pt(){ot.style.visibility="visible"}function gt(){ot.style.visibility="hidden"}function Lo(){nt.style.visibility="visible"}function So(){nt.style.visibility="hidden"}function Co(){Je.makeEmpty()}function Ao(){Ue=!0}function ko(e){e.intersectsBox(fo)?M||(console.log("Entered the door trigger zone"),vo(),M=!0):M&&(console.log("Exited the door trigger zone"),rt(),ho(),M=!1),e.intersectsBox(uo)?N||(console.log("Entered the corpse trigger zone"),To(),N=!0):N&&(console.log("Exited the corpse trigger zone"),Eo(),xo(),N=!1),e.intersectsBox(Je)?U||(console.log("Entered the code trigger zone"),Lo(),co(),U=!0):U&&(console.log("Exited the code trigger zone"),So(),so(),U=!1),e.intersectsBox(yo)?W||(console.log("Entered the file trigger zone"),dt(),W=!0):W&&(console.log("Exited the file trigger zone"),ct(),lt(),W=!1),e.intersectsBox(po)?Z||(console.log("Entered the report trigger zone"),ft(),Z=!0):Z&&(console.log("Exited the report trigger zone"),ut(),at(),Z=!1),e.intersectsBox(go)?K||(console.log("Entered the Charles note trigger zone"),pt(),K=!0):K&&(console.log("Exited the Charles note trigger zone"),gt(),yt(),K=!1)}const S=new He(16777215,20);S.position.set(-8,2.4,-60);function zo(e){Gt(S),e.add(S)}function Ve(e){return Math.floor(Math.random()*e)}function Mo(){S.visible&&Ve(320)==1&&(S.visible=!1),S.visible||Ve(40)==1&&(S.visible=!0)}let I,Q,Oe;function Po(e,o,n,i=new t(0,0,-8),r=new t(0,0,0)){o.load(e,l=>{I=l.scene,I.scale.set(.6,.6,.6),I.position.set(i.x,i.y,i.z),I.rotation.set(r.x,r.y,r.z),n.add(I),I.traverse(function(Ce){Ce.isMesh&&(Ce.castShadow=!0)});const x=l.animations;Q=new _e(I),Oe=Q.clipAction(x[0]),Oe.play()})}function Ro(e){Q&&Q.update(e)}const mt=document.getElementById("blackscreen"),wt=document.getElementById("intro-text");function Vo(){mt.style.visibility="visible",wt.style.visibility="visible"}function Oo(){mt.style.visibility="hidden",wt.style.visibility="hidden"}function No(e){function o(n){window.removeEventListener("keydown",o),e&&e(n)}window.addEventListener("keydown",o)}const ht=document.getElementById("drawer1-text"),vt=document.getElementById("drawer2-text"),xe=document.getElementById("gooddrawer-text"),Te=document.getElementById("bad-text"),Ee=document.getElementById("good-text"),bt=document.getElementById("searched-text"),j=document.getElementById("useCard-text"),xt=document.getElementById("dontOpen-text"),Wo=document.getElementById("Open-text");let ee=!1,te=!1,Y=!1,oe=!1,ne=!1,Tt=!1,ae=!1,Et=!1,B;function Zo(){ee&&(y(ht),k(Te)),te&&(y(vt),k(Te)),Y&!ae?(y(xe),Tt=!0,k(Ee),ae=!0):Y&ae&Ee.style.visibility=="hidden"&&(y(xe),k(bt)),oe&&(y(j),k(xt)),ne&&(y(j),Et=!0)}function Ko(){ee|te&&y(Te),Y&&(y(Ee),y(bt)),oe&&y(xt),ne&&y(Wo)}function k(e){e.style.visibility="visible"}function y(e){e.style.visibility="hidden"}const Fo=new d(new t(3.3,0,4),new t(6.1,2.8,4.6)),$o=new d(new t(1.5,0,-2.5),new t(2.5,2,-1.5)),Go=new d(new t(-1.7,0,-1.75),new t(-.7,2,-.75)),_o=new d(new t(-.25,0,-1.5),new t(.75,2,-.5)),Ho=new d(new t(4.35,0,-4.6),new t(5.85,2,-4.2)),Ne=new d(new t(-5.5,0,-4.6),new t(-4,2,-4.2));function V(e,o,n,i){if(e.intersectsBox(o)){if(!n)return console.log("Entered the trigger zone"),k(i),!0}else if(n)return console.log("Exited the trigger zone"),y(i),Ko(),!1;return n}function qo(e,o,n){o.load(e,i=>{B=i.scene,B.scale.set(2.3,1.778,1),B.position.set(.2,.739,-.571),B.rotation.y+=Math.PI,n.add(B)})}function Yo(e){e.intersectsBox(Fo)&&se("exterior"),e.intersectsBox(Ne)&Et==!0&&se("corridor"),ee=V(e,$o,ee,ht),te=V(e,Go,te,vt),Y=V(e,_o,Y,xe),oe=V(e,Ho,oe,j),ne=V(e,Ne,ne,j),Tt&&B.position.z>-.9&&(B.position.z-=.01)}const C=document.getElementById("openDoor-text"),It=document.getElementById("closedDoor-text"),Bt=document.getElementById("zombieDoor-text");let Ie=!1,Be=!1,De=!1;function Xo(){Ie&&(E(C),ie(It)),De&&E(C),Be&&(E(C),ie(Bt))}function Dt(){E(C),E(It),E(Bt)}function ie(e){e.style.visibility="visible"}function E(e){e.style.visibility="hidden"}const Uo=new d(new t(1.25,-.05,-14.65),new t(1.75,2.05,-13.85)),Jo=new d(new t(3.35,-.05,-14),new t(3.85,2.05,-13.2)),Qo=new d(new t(3.35,-.05,-9.8),new t(3.85,2.05,-9)),jo=new d(new t(1.25,-.05,-8.7),new t(1.75,2.05,-7.9)),en=new d(new t(3.35,-.05,-5.1),new t(3.85,2.05,-4.3)),tn=new d(new t(3.35,-.05,1.094),new t(3.85,2.05,1.894)),on=new d(new t(3.35,-.05,7.5),new t(3.85,2.05,8.3)),nn=new d(new t(1.25,-.05,2.6),new t(1.75,2.05,3.4)),sn=new d(new t(1.25,-.05,7.5),new t(1.75,2.05,8.3)),rn=new d(new t(1.8,0,-16.5),new t(3.3,2.2,-16.1)),ln=[Uo,Jo,Qo,jo,en,tn,on];function We(e,o,n,i){if(e.intersectsBox(o)){if(!n)return console.log("Entered the trigger zone"),ie(i),!0}else if(n)return console.log("Exited the trigger zone"),E(i),Dt(),!1;return n}function dn(e,o,n,i){let r=!1;for(const l of o)if(e.intersectsBox(l))return n||(console.log("Entered the trigger zone"),ie(i)),!0;return n&!r&&(console.log("Exited the trigger zone"),E(i),Dt()),!1}function cn(e){e.intersectsBox(rn)&&se("reception"),Ie=dn(e,ln,Ie,C),Be=We(e,nn,Be,C),De=We(e,sn,De,C)}const an=new Ot,T=new zt,c=new Mt(70,window.innerWidth/window.innerHeight,.1,1e3);c.rotation.order="YXZ";const Lt=document.getElementById("container"),b=new Pt({antialias:!0});b.setPixelRatio(window.devicePixelRatio);b.setSize(window.innerWidth,window.innerHeight);b.setAnimationLoop(vn);b.shadowMap.enabled=!0;b.shadowMap.type=Rt;b.toneMapping=Vt;Lt.appendChild(b.domElement);const fn=80,Ze=1,Le=new Wt,s=new Zt(new t(0,.35,0),new t(0,1,0),.35),H=new He(16777215,.5),w=new t,v=new t;let q=!1;const g={},J=new Nt().setPath("/RAUG-Cahet-Codron/assets/models/");let D=!1,A="exterior",Se="exterior",Ke=!1;const fe=document.getElementById("loader"),ue=document.getElementById("blackscreen");document.addEventListener("keydown",e=>{g[e.code]=!0});document.addEventListener("keyup",e=>{g[e.code]=!1});Lt.addEventListener("mousedown",()=>{document.body.requestPointerLock()});document.body.addEventListener("mousemove",e=>{document.pointerLockElement===document.body&&(c.rotation.y-=e.movementX/500,c.rotation.x-=e.movementY/500)});document.addEventListener("keyup",e=>{e.code==="KeyE"&&mo()});window.addEventListener("resize",un);function un(){c.aspect=window.innerWidth/window.innerHeight,c.updateProjectionMatrix(),b.setSize(window.innerWidth,window.innerHeight)}function yn(){const e=Le.capsuleIntersect(s);q=!1,e&&(q=e.normal.y>0,q||w.addScaledVector(e.normal,-e.normal.dot(w)),e.depth>=1e-10&&s.translate(e.normal.multiplyScalar(e.depth)))}function pn(e){let o=Math.exp(-4*e)-1;q||(w.y-=fn*e,o*=.1),w.addScaledVector(w,o);const n=w.clone().multiplyScalar(e);s.translate(n),yn();let i=s.end.clone();i.y+=.8,c.position.copy(i),H.position.copy(s.end)}function Fe(){return c.getWorldDirection(v),v.y=0,v.normalize(),v}function $e(){return c.getWorldDirection(v),v.y=0,v.normalize(),v.cross(c.up),v}function gn(e){const o=e*(q?25:8);(g.KeyW||g.KeyS||g.KeyA||g.KeyD)&&!D?Jt():Qt(),g.KeyW&&!D&&w.add(Fe().multiplyScalar(o)),g.KeyS&&!D&&w.add(Fe().multiplyScalar(-o)),g.KeyA&&!D&&w.add($e().multiplyScalar(-o)),g.KeyD&&!D&&w.add($e().multiplyScalar(o)),g.KeyO&&(A==="reception"&&Zo(),A==="corridor"&&Xo())}function mn(){const e=new d().setFromPoints([s.start,s.end]);A==="exterior"&&ko(e),A==="reception"&&Yo(e),A==="corridor"&&cn(e)}function St(e){console.log("Loading room:",e),ue.style.visibility="visible",fe.style.visibility="visible",J.load(e,o=>{D=!0,no(),T.clear(),Le.clear(),T.add(o.scene),T.add(H),Le.fromGraphNode(o.scene),o.scene.traverse(n=>{n.isMesh&&(n.castShadow=!0,n.receiveShadow=!0,n.material.map&&(n.material.map.anisotropy=4))}),setTimeout(()=>{fe.style.visibility="hidden",ue.style.visibility="hidden",D=!1},3e3),Ye(),e=="exterior.glb"?(s.start.set(0,.35,0),s.end.set(0,1,0),c.position.copy(s.end),c.rotation.set(0,0,0),qe(),zo(T)):e==="reception.glb"?(Se==="exterior"?(s.start.set(5,.675,3),s.end.set(5,1.325,3),c.rotation.set(0,0,0)):(s.start.set(-4.7,.675,-4),s.end.set(-4.7,1.325,-4),c.rotation.set(0,180,0)),c.position.copy(s.end),H.position.copy(s.end),qo("drawer.glb",J,T)):e==="corridor.glb"&&(Se==="reception"?(s.start.set(2.2,.675,-15),s.end.set(2.2,1.325,-15),c.rotation.set(0,180,0)):(s.start.set(2.5,.675,8),s.end.set(2.5,1.325,8),c.rotation.set(0,0,0)),c.position.copy(s.end),H.position.copy(s.end),Po("idle-infected.glb",J,T,new t(-2,0,3.5),new t(0,180,0)))},o=>{console.log(o.loaded/o.total*100+"%")},o=>{console.error("An error occurred while loading the model:",o),fe.style.visibility="hidden",ue.style.visibility="hidden"})}function se(e){Se=A,A=e,St(e+".glb")}function wn(){c.position.y<=-25&&(s.start.set(0,.35,0),s.end.set(0,1,0),s.radius=.35,c.position.copy(s.end),c.rotation.set(0,0,0),H.position.copy(s.end))}function hn(){eo("moving-infected.glb",J,T)}Ft(c);Vo();Ke||No(()=>{Ke=!0,Oo(),St("exterior.glb")});function vn(){const e=Math.min(.05,an.getDelta())/Ze;for(let o=0;o<Ze;o++)oo(e,s),Ro(e),gn(e),pn(e),wn(),Mo(),mn();b.render(T,c)}
//# sourceMappingURL=index-OYv_Slzt.js.map