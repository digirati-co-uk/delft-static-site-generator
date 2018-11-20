import React from 'react';
import { graphql } from "gatsby";

import Layout from '../components/Layout/layout';
import substituteSpecialLinks from '../utils';

const FrontPage = ({ data }) => (
  <Layout>
      <div
        className="article-main"
        dangerouslySetInnerHTML={{ 
          __html: substituteSpecialLinks(data.markdownRemark.html) 
        }}
      />
  </Layout>
)

export default FrontPage

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`