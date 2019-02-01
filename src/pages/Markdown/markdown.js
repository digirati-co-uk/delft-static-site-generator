import React from 'react';
import { graphql } from "gatsby";
import Layout from '../../components/Layout/layout';
import substituteSpecialLinks from '../../utils';

const articlePageTransform = html => {
  return html.match(/<h2>Table of Contents<\/h2>/) 
    ? {
      toc:  html.match(/<h2>Table of Contents<\/h2>\n<ul>((?:\s|\S)+?)<\/ul>/)[1], 
      html: html.replace(/<h2>Table of Contents<\/h2>\n<ul>((?:\s|\S)+?)<\/ul>/, ''),
    }
    : {html};
};
  
const Markdown = ({ pageContext, data }) => {
  const content = data.markdownRemark 
    ? articlePageTransform(
        substituteSpecialLinks(data.markdownRemark.html, pageContext)
    )
    : '';
  const { title, author } = data.markdownRemark.frontmatter;
  return (
    <Layout>
      { content.hasOwnProperty('toc') ? (
        <main>
          <div className="blocks blocks--auto-height">
            <aside className="w-4">
              <div className="block title cutcorners w-4 h-4 title--pomegranate">
                <div className="boxtitle">Article</div>
                <div className="maintitle">{title}</div>
                <div className="boxtitle">{author}</div>
              </div>
              <div className="block info cutcorners w-4 h-4 ">
                <div className="boxtitle">Table of Contents</div>
                <ol dangerouslySetInnerHTML={{__html:content.toc}}></ol>
              </div>
            </aside>
            <article 
              className="w-8"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end'
              }}
            >
              <div
                className="w-7"
                dangerouslySetInnerHTML={{__html:content.html}}
              >

              </div>
            </article>
          </div>
        </main>
      ) : (
        <main dangerouslySetInnerHTML={{__html:content.html}}/>
      )}
    </Layout>
  );
};

export default Markdown;

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        author
      }
    }
  }
`