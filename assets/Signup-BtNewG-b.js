import{y as Re,r as L,ax as Xe,a as Ie,u as Te,b as Pe,j as n,ay as Ne,az as Ue,aA as Me,aB as we,aC as Se,aD as ke,aE as Oe,aF as Ce,aG as De,aH as Fe,aI as ze,aJ as qe}from"./index-Bz9dCBA6.js";const Ee=()=>{const e=Re.c(115),[h,_e]=L.useState(!1),f=Xe(),t=Ie(),c=Te(),{loading:o,error:u,isAuthenticated:m,user:p}=Pe(Ge);let R;e[0]===Symbol.for("react.memo_cache_sentinel")?(R={email:"",password:"",role:"CUSTOMER"},e[0]=R):R=e[0];const[a,Ae]=L.useState(R);let X;e[1]===Symbol.for("react.memo_cache_sentinel")?(X={username:"",email:"",password:""},e[1]=X):X=e[1];const[s,Le]=L.useState(X);let I;e[2]!==t||e[3]!==f.pathname?(I=()=>{f.pathname==="/signup"&&_e(!0),t(Ne())},e[2]=t,e[3]=f.pathname,e[4]=I):I=e[4];let T;e[5]!==t||e[6]!==f?(T=[f,t],e[5]=t,e[6]=f,e[7]=T):T=e[7],L.useEffect(I,T);let P;e[8]!==m||e[9]!==c||e[10]!==p?.role?(P=()=>{m&&(p?.role==="STAFF"?c("/staff-dashboard"):p?.role==="ADMIN"?c("/admin-dashboard"):c("/"))},e[8]=m,e[9]=c,e[10]=p?.role,e[11]=P):P=e[11];let U;e[12]!==m||e[13]!==c||e[14]!==p?(U=[m,p,c],e[12]=m,e[13]=c,e[14]=p,e[15]=U):U=e[15],L.useEffect(P,U);let M;e[16]!==t?(M=r=>{t(Ne()),_e(r)},e[16]=t,e[17]=M):M=e[17];const d=M;let O;e[18]!==a?(O=r=>Ae({...a,[r.target.name]:r.target.value}),e[18]=a,e[19]=O):O=e[19];const i=O;let q;e[20]!==s?(q=r=>Le({...s,[r.target.name]:r.target.value}),e[20]=s,e[21]=q):q=e[21];const l=q;let G;e[22]!==t||e[23]!==a?(G=r=>{r.preventDefault(),t(Ue(a))},e[22]=t,e[23]=a,e[24]=G):G=e[24];const xe=G;let $;e[25]!==t||e[26]!==s?($=r=>{r.preventDefault(),t(Me(s))},e[25]=t,e[26]=s,e[27]=$):$=e[27];const be=$;let B;e[28]===Symbol.for("react.memo_cache_sentinel")?(B=n.jsx("style",{children:`
        .auth-page-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 100px);
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('/image_2.jpg') no-repeat center center/cover;
          padding: 20px;
        }

        .auth-container {
          background-color: #fff;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 15px 20px rgba(0,0,0,0.2);
          position: relative;
          overflow: hidden;
          width: 900px;
          max-width: 100%;
          min-height: 580px;
        }

        .auth-form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
        }

        .sign-in-container {
          left: 0;
          width: 50%;
          z-index: 2;
        }

        .auth-container.right-panel-active .sign-in-container {
          transform: translateX(100%);
        }

        .sign-up-container {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }

        .auth-container.right-panel-active .sign-up-container {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: show 0.6s;
        }

        @keyframes show {
          0%, 49.99% { opacity: 0; z-index: 1; }
          50%, 100% { opacity: 1; z-index: 5; }
        }

        .auth-overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.6s ease-in-out;
          z-index: 100;
        }

        .auth-container.right-panel-active .auth-overlay-container {
          transform: translateX(-100%);
        }

        .auth-overlay {
          background: #d82b2b;
          background: linear-gradient(135deg, #ff416c, #ba1c1c);
          background-repeat: no-repeat;
          background-size: cover;
          background-position: 0 0;
          color: #ffffff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }

        .auth-container.right-panel-active .auth-overlay {
          transform: translateX(50%);
        }

        .auth-overlay-panel {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          text-align: center;
          top: 0;
          height: 100%;
          width: 50%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }

        .auth-overlay-left {
          transform: translateX(-20%);
        }

        .auth-container.right-panel-active .auth-overlay-left {
          transform: translateX(0);
        }

        .auth-overlay-right {
          right: 0;
          transform: translateX(0);
        }

        .auth-container.right-panel-active .auth-overlay-right {
          transform: translateX(20%);
        }

        .auth-form {
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 50px;
          height: 100%;
          text-align: center;
        }

        .auth-title {
          font-weight: 800;
          margin: 0 0 10px;
          color: #222;
          font-family: inherit;
        }

        .overlay-title {
          font-weight: 800;
          margin: 0 0 15px;
          color: #fff;
          font-family: inherit;
          font-size: 2rem;
        }

        .social-container {
          margin: 15px 0;
        }

        .social-container a {
          border: 1px solid #DDDDDD;
          border-radius: 50%;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          margin: 0 8px;
          height: 40px;
          width: 40px;
          color: #333;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-container a:hover {
          background-color: #d82b2b;
          color: white;
          border-color: #d82b2b;
          transform: scale(1.1);
        }

        .auth-span {
          font-size: 13px;
          color: #777;
          margin-bottom: 15px;
        }

        .auth-input-group {
          position: relative;
          margin: 8px 0;
          width: 100%;
        }

        .auth-input {
          background-color: #f6f6f6;
          border: 1px solid #eee;
          padding: 14px 15px 14px 45px;
          width: 100%;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        .auth-input:focus {
          background-color: #fff;
          border-color: #d82b2b;
          box-shadow: 0 0 8px rgba(216, 43, 43, 0.2);
        }

        .select-input {
          cursor: pointer;
          appearance: none;
        }

        .auth-icon {
          position: absolute;
          left: 17px;
          top: 50%;
          transform: translateY(-50%);
          color: #aaa;
          transition: color 0.3s ease;
        }

        .auth-input-group:focus-within .auth-icon {
          color: #d82b2b;
        }

        .forgot-password {
          color: #555;
          font-size: 13px;
          text-decoration: none;
          margin: 15px 0;
          transition: color 0.3s ease;
        }

        .forgot-password:hover {
          color: #d82b2b;
          text-decoration: underline;
        }

        .auth-btn {
          border-radius: 25px;
          border: 1px solid #d82b2b;
          background-color: #d82b2b;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          padding: 12px 45px;
          letter-spacing: 1px;
          text-transform: uppercase;
          transition: transform 80ms ease-in, background-color 0.3s ease;
          cursor: pointer;
          margin-top: 15px;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0px 4px 6px rgba(216, 43, 43, 0.3));
        }

        .auth-btn:hover:not(:disabled) {
            background-color: #ba1c1c;
        }

        .auth-btn:active:not(:disabled) {
          transform: scale(0.95);
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-btn.ghost {
          background-color: transparent;
          border-color: #ffffff;
          filter: none;
        }
        
        .auth-btn.ghost:hover {
          background-color: #fff;
          color: #d82b2b;
        }

        .auth-p {
          font-size: 15px;
          font-weight: 300;
          line-height: 22px;
          letter-spacing: 0.5px;
          margin: 15px 0 30px;
        }

        .error-message {
          background-color: #ffe6e6;
          color: #d82b2b;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 15px;
          width: 100%;
          border-left: 4px solid #d82b2b;
        }

        .loading-spinner {
          animation: spin 1.2s linear infinite;
          margin-right: 8px;
          font-size: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .auth-container {
            min-height: 650px;
            display: flex;
            flex-direction: column;
            width: 100%;
          }
          .auth-form {
              padding: 0 30px;
          }
        }
      `}),e[28]=B):B=e[28];const ve=`auth-container ${h?"right-panel-active":""}`;let H;e[29]===Symbol.for("react.memo_cache_sentinel")?(H=n.jsx("h1",{className:"auth-title",children:"Create Account"}),e[29]=H):H=e[29];let J;e[30]===Symbol.for("react.memo_cache_sentinel")?(J=n.jsx("a",{href:"#facebook",onClick:$e,className:"social",children:n.jsx(we,{})}),e[30]=J):J=e[30];let W;e[31]===Symbol.for("react.memo_cache_sentinel")?(W=n.jsx("a",{href:"#google",onClick:Be,className:"social",children:n.jsx(Se,{})}),e[31]=W):W=e[31];let Y,K;e[32]===Symbol.for("react.memo_cache_sentinel")?(Y=n.jsxs("div",{className:"social-container",children:[J,W,n.jsx("a",{href:"#github",onClick:He,className:"social",children:n.jsx(ke,{})})]}),K=n.jsx("span",{className:"auth-span",children:"or use your email for registration"}),e[32]=Y,e[33]=K):(Y=e[32],K=e[33]);let Q;e[34]===Symbol.for("react.memo_cache_sentinel")?(Q=n.jsx(Oe,{className:"auth-icon"}),e[34]=Q):Q=e[34];let g;e[35]!==l||e[36]!==s.username?(g=n.jsxs("div",{className:"auth-input-group",children:[Q,n.jsx("input",{type:"text",name:"username",className:"auth-input",placeholder:"Username",required:!0,value:s.username,onChange:l})]}),e[35]=l,e[36]=s.username,e[37]=g):g=e[37];let V;e[38]===Symbol.for("react.memo_cache_sentinel")?(V=n.jsx(Ce,{className:"auth-icon"}),e[38]=V):V=e[38];let x;e[39]!==l||e[40]!==s.email?(x=n.jsxs("div",{className:"auth-input-group",children:[V,n.jsx("input",{type:"email",name:"email",className:"auth-input",placeholder:"Email",required:!0,value:s.email,onChange:l})]}),e[39]=l,e[40]=s.email,e[41]=x):x=e[41];let Z;e[42]===Symbol.for("react.memo_cache_sentinel")?(Z=n.jsx(De,{className:"auth-icon"}),e[42]=Z):Z=e[42];let b;e[43]!==l||e[44]!==s.password?(b=n.jsxs("div",{className:"auth-input-group",children:[Z,n.jsx("input",{type:"password",name:"password",className:"auth-input",placeholder:"Password",required:!0,value:s.password,onChange:l})]}),e[43]=l,e[44]=s.password,e[45]=b):b=e[45];let v;e[46]!==u||e[47]!==h?(v=u&&h&&n.jsxs("div",{className:"error-message",children:[n.jsx(Fe,{})," ",u]}),e[46]=u,e[47]=h,e[48]=v):v=e[48];let y;e[49]!==o?(y=o&&n.jsx(ze,{className:"loading-spinner"}),e[49]=o,e[50]=y):y=e[50];const ye=o?"Registering...":"Sign Up";let j;e[51]!==o||e[52]!==y||e[53]!==ye?(j=n.jsxs("button",{type:"submit",className:"auth-btn",disabled:o,children:[y,ye]}),e[51]=o,e[52]=y,e[53]=ye,e[54]=j):j=e[54];let _;e[55]!==be||e[56]!==g||e[57]!==x||e[58]!==b||e[59]!==v||e[60]!==j?(_=n.jsx("div",{className:"auth-form-container sign-up-container",children:n.jsxs("form",{className:"auth-form",onSubmit:be,children:[H,Y,K,g,x,b,v,j]})}),e[55]=be,e[56]=g,e[57]=x,e[58]=b,e[59]=v,e[60]=j,e[61]=_):_=e[61];let ee;e[62]===Symbol.for("react.memo_cache_sentinel")?(ee=n.jsx("h1",{className:"auth-title",children:"Sign In"}),e[62]=ee):ee=e[62];let ne;e[63]===Symbol.for("react.memo_cache_sentinel")?(ne=n.jsx("a",{href:"#facebook",onClick:Je,className:"social",children:n.jsx(we,{})}),e[63]=ne):ne=e[63];let te;e[64]===Symbol.for("react.memo_cache_sentinel")?(te=n.jsx("a",{href:"#google",onClick:We,className:"social",children:n.jsx(Se,{})}),e[64]=te):te=e[64];let ae,se;e[65]===Symbol.for("react.memo_cache_sentinel")?(ae=n.jsxs("div",{className:"social-container",children:[ne,te,n.jsx("a",{href:"#github",onClick:Ye,className:"social",children:n.jsx(ke,{})})]}),se=n.jsx("span",{className:"auth-span",children:"or use your account"}),e[65]=ae,e[66]=se):(ae=e[65],se=e[66]);let oe;e[67]===Symbol.for("react.memo_cache_sentinel")?(oe=n.jsx(Ce,{className:"auth-icon"}),e[67]=oe):oe=e[67];let N;e[68]!==i||e[69]!==a.email?(N=n.jsxs("div",{className:"auth-input-group",children:[oe,n.jsx("input",{type:"email",name:"email",className:"auth-input",placeholder:"Email",required:!0,value:a.email,onChange:i})]}),e[68]=i,e[69]=a.email,e[70]=N):N=e[70];let re;e[71]===Symbol.for("react.memo_cache_sentinel")?(re=n.jsx(qe,{className:"auth-icon"}),e[71]=re):re=e[71];let ie,le,ce;e[72]===Symbol.for("react.memo_cache_sentinel")?(ie=n.jsx("option",{value:"CUSTOMER",children:"Customer"}),le=n.jsx("option",{value:"STAFF",children:"Staff"}),ce=n.jsx("option",{value:"ADMIN",children:"Admin"}),e[72]=ie,e[73]=le,e[74]=ce):(ie=e[72],le=e[73],ce=e[74]);let w;e[75]!==i||e[76]!==a.role?(w=n.jsxs("div",{className:"auth-input-group",children:[re,n.jsxs("select",{name:"role",className:"auth-input select-input",value:a.role,onChange:i,children:[ie,le,ce]})]}),e[75]=i,e[76]=a.role,e[77]=w):w=e[77];let ue;e[78]===Symbol.for("react.memo_cache_sentinel")?(ue=n.jsx(De,{className:"auth-icon"}),e[78]=ue):ue=e[78];let S;e[79]!==i||e[80]!==a.password?(S=n.jsxs("div",{className:"auth-input-group",children:[ue,n.jsx("input",{type:"password",name:"password",className:"auth-input",placeholder:"Password",required:!0,value:a.password,onChange:i})]}),e[79]=i,e[80]=a.password,e[81]=S):S=e[81];let he;e[82]===Symbol.for("react.memo_cache_sentinel")?(he=n.jsx("a",{href:"#forgot",onClick:Ke,className:"forgot-password",children:"Forgot your password?"}),e[82]=he):he=e[82];let k;e[83]!==u||e[84]!==h?(k=u&&!h&&n.jsxs("div",{className:"error-message",children:[n.jsx(Fe,{})," ",u]}),e[83]=u,e[84]=h,e[85]=k):k=e[85];let C;e[86]!==o?(C=o&&n.jsx(ze,{className:"loading-spinner"}),e[86]=o,e[87]=C):C=e[87];const je=o?"Logging In...":"Log In";let D;e[88]!==o||e[89]!==C||e[90]!==je?(D=n.jsxs("button",{type:"submit",className:"auth-btn",disabled:o,children:[C,je]}),e[88]=o,e[89]=C,e[90]=je,e[91]=D):D=e[91];let F;e[92]!==xe||e[93]!==N||e[94]!==w||e[95]!==S||e[96]!==k||e[97]!==D?(F=n.jsx("div",{className:"auth-form-container sign-in-container",children:n.jsxs("form",{className:"auth-form",onSubmit:xe,children:[ee,ae,se,N,w,S,he,k,D]})}),e[92]=xe,e[93]=N,e[94]=w,e[95]=S,e[96]=k,e[97]=D,e[98]=F):F=e[98];let pe,fe;e[99]===Symbol.for("react.memo_cache_sentinel")?(pe=n.jsx("h1",{className:"overlay-title",children:"Welcome Back!"}),fe=n.jsx("p",{className:"auth-p",children:"To keep connected with us please login with your personal info"}),e[99]=pe,e[100]=fe):(pe=e[99],fe=e[100]);let z;e[101]!==d?(z=n.jsxs("div",{className:"auth-overlay-panel auth-overlay-left",children:[pe,fe,n.jsx("button",{type:"button",className:"auth-btn ghost",onClick:()=>d(!1),children:"Sign In"})]}),e[101]=d,e[102]=z):z=e[102];let me,de;e[103]===Symbol.for("react.memo_cache_sentinel")?(me=n.jsx("h1",{className:"overlay-title",children:"Hello, Friend!"}),de=n.jsx("p",{className:"auth-p",children:"Enter your personal details and start your journey with us"}),e[103]=me,e[104]=de):(me=e[103],de=e[104]);let E;e[105]!==d?(E=n.jsxs("div",{className:"auth-overlay-panel auth-overlay-right",children:[me,de,n.jsx("button",{type:"button",className:"auth-btn ghost",onClick:()=>d(!0),children:"Sign Up"})]}),e[105]=d,e[106]=E):E=e[106];let A;e[107]!==z||e[108]!==E?(A=n.jsx("div",{className:"auth-overlay-container",children:n.jsxs("div",{className:"auth-overlay",children:[z,E]})}),e[107]=z,e[108]=E,e[109]=A):A=e[109];let ge;return e[110]!==ve||e[111]!==_||e[112]!==F||e[113]!==A?(ge=n.jsxs(n.Fragment,{children:[B,n.jsx("div",{className:"auth-page-wrapper",children:n.jsxs("div",{className:ve,children:[_,F,A]})})]}),e[110]=ve,e[111]=_,e[112]=F,e[113]=A,e[114]=ge):ge=e[114],ge};function Ge(e){return e.user}function $e(e){return e.preventDefault()}function Be(e){return e.preventDefault()}function He(e){return e.preventDefault()}function Je(e){return e.preventDefault()}function We(e){return e.preventDefault()}function Ye(e){return e.preventDefault()}function Ke(e){return e.preventDefault()}const Ve=Object.freeze(Object.defineProperty({__proto__:null,default:Ee},Symbol.toStringTag,{value:"Module"})),Ze=Object.freeze(Object.defineProperty({__proto__:null,default:Ee},Symbol.toStringTag,{value:"Module"}));export{Ve as L,Ze as S};
