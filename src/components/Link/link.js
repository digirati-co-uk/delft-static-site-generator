import React from 'react';
import { Link as GatsbyLink } from "gatsby";

const isDocumentation = window.location.pathname.startsWith('/docs');
let Link = null;
if (isDocumentation) {
    Link = ({ children, to, ...other }) => (
        <a href={to} {...other}>
        {children}
        </a>
    );
} else {
    Link = require('gatsby').Link;
}
// let Link = ({ children, to, ...other }) => {
  

//   // Use Gatsby Link for internal links, and <a> for others
//   if (!isDocumentation) {
//     return (
//       <GatsbyLink to={to} {...other}>
//         {children}
//       </GatsbyLink>
//     )
//   }
//   return (
//     <a href={to} {...other}>
//       {children}
//     </a>
//   )
// }

export default Link