import React from 'react';
import { graphql } from "gatsby";
import Layout from '../../components/Layout/layout';
import substituteSpecialLinks from '../../utils';

const Markdown = ({ pageContext, data }) => (
  <Layout>
    <div
      className="article-main"
      dangerouslySetInnerHTML={{ 
        __html: data.markdownRemark 
          ? substituteSpecialLinks(data.markdownRemark.html, pageContext)
          : ''
      }}
    />
  </Layout>
);

export default Markdown;

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