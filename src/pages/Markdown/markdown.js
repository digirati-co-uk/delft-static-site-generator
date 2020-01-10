import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../../components/Layout/layout';
import GithubLink from '../../components/GithubLink/GithubLink';
import substituteSpecialLinks, { getPageLanguage } from '../../utils';

const articlePageTransform = html =>
  html.match(/<h2>Table of Contents<\/h2>/)
    ? {
        toc: html.match(
          /<h2>Table of Contents<\/h2>\n<ul>((?:\s|\S)+?)<\/ul>/
        )[1],
        html: html.replace(
          /<h2>Table of Contents<\/h2>\n<ul>((?:\s|\S)+?)<\/ul>/,
          ''
        ),
        isPublication: true,
      }
    : { html };

const Markdown = ({ pageContext, data, path }) => {
  const pageLanguage = getPageLanguage(path);
  const { title, author } = data.markdownRemark
    ? data.markdownRemark.frontmatter
    : { author: '-', title: '-' };
  const content = data.markdownRemark
    ? articlePageTransform(
        substituteSpecialLinks(
          data.markdownRemark.html,
          pageContext,
          data.allMarkdownRemark
        )
      )
    : '';

  return (
    <Layout language={pageLanguage} path={path}>
      {content.isPublication ? (
        <main>
          <div className="blocks blocks--auto-height">
            <aside className="w-4">
              <div className="block title cutcorners w-4 h-4 title--pomegranate">
                <div className="boxtitle">Article</div>
                <div className="maintitle">
                  {title}
                  <GithubLink href={path} />
                </div>
                <div className="boxtitle">{author}</div>
              </div>
              <div className="block info cutcorners w-4 h-4 ">
                <div className="boxtitle">Table of Contents</div>
                <ol dangerouslySetInnerHTML={{ __html: content.toc }} />
              </div>
            </aside>
            <article className="markdown-article w-8">
              <div
                className="w-7"
                dangerouslySetInnerHTML={{ __html: content.html }}
              />
            </article>
          </div>
        </main>
      ) : (
        <main dangerouslySetInnerHTML={{ __html: content.html }} />
      )}
    </Layout>
  );
};

Markdown.propTypes = {
  pageContext: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  '*': PropTypes.string.isRequired,
};

export default Markdown;

export const pageQuery = graphql`
  query($path: String!) {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            author
            title
            path
          }
        }
      }
    }
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
`;
