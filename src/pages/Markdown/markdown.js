import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../../components/Layout/layout';
import GithubLink from '../../components/GithubLink/GithubLink';
import substituteSpecialLinks, { getPageLanguage } from '../../utils';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';
import { Illustration } from '../../components/Illustration/Illustration';

const articlePageTransform = (html) =>
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

  let title = '-';
  let author = '-';
  if (data.markdownRemark.frontmatter) {
    title = data.markdownRemark.frontmatter.title || '-';
    author = data.markdownRemark.frontmatter.author || '-';
  }
  const content = data.markdownRemark
    ? articlePageTransform(
        substituteSpecialLinks(
          data.markdownRemark.html,
          pageContext,
          data.allMarkdownRemark
        )
      )
    : '';

  const getPageMetaData = () => {
    const image =
      data.markdownRemark &&
      data.markdownRemark.frontmatter &&
      data.markdownRemark.frontmatter.image
        ? data.markdownRemark.frontmatter.image
        : null;
    const stringToSearch =
      data.markdownRemark && data.markdownRemark.html
        ? data.markdownRemark.html
        : '';
    const [_, href] = stringToSearch.match(/src="(.*?)"/) || [];
    const description =
      data.markdownRemark &&
      data.markdownRemark.frontmatter &&
      data.markdownRemark.frontmatter.title
        ? data.markdownRemark.frontmatter.title
        : null;
    const meta = {
      image: image ? image : href,
      description: description,
    };
    return meta;
  };

  const mdx =
    data &&
    data.allMdx &&
    data.allMdx.nodes &&
    data.allMdx.nodes[0] &&
    data.allMdx.nodes[0].body
      ? data.allMdx.nodes[0].body
      : null;

  const toc =
    data &&
    data.allMdx &&
    data.allMdx.nodes &&
    data.allMdx.nodes[0] &&
    data.allMdx.nodes[0].tableOfContents
      ? data.allMdx.nodes[0].tableOfContents
      : null;

  const shortcodes = {
    Illustration: (props) => (
      <Illustration {...props} pageLanguage={pageLanguage} />
    ),

    h1: (props, children) => (
      <h1
        id={props.children.toLowerCase().replace(/ /g, '-')}
        {...children}
        {...props}
      />
    ),
    h2: (props, children) => (
      <h2
        id={props.children.toLowerCase().replace(/ /g, '-')}
        {...children}
        {...props}
      />
    ),
    h3: (props, children) => (
      <h3
        id={props.children.toLowerCase().replace(/ /g, '-')}
        {...children}
        {...props}
      />
    ),
  };

  return (
    <Layout language={pageLanguage} path={path} meta={getPageMetaData()}>
      {content.isPublication ? (
        <MDXProvider components={shortcodes}>
          <main>
            <div className="blocks blocks--auto-height">
              <aside className="w-4">
                <div className="block title cutcorners w-4 h-4 title--pomegranate">
                  <div className="boxtitle">Article</div>
                  <div className="maintitle">
                    {title}
                    <GithubLink href={path} />
                  </div>
                  <div className="caption">{author}</div>
                </div>
                <div className="block info cutcorners w-4 h-4 ">
                  <div className="caption">Table of Contents</div>
                  <ul>
                    {toc.items
                      ? toc.items.map((item) => {
                          return (
                            <li style={{ padding: '3px' }} key={item.url}>
                              <a href={item.url}>{item.title}</a>

                              {item.items ? (
                                <ul style={{ paddingLeft: '10px' }}>
                                  {item.items.map((subitem) => (
                                    <li
                                      style={{ padding: '3px' }}
                                      key={subitem.url}
                                    >
                                      <a href={subitem.url}>{subitem.title}</a>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                              <br />
                            </li>
                          );
                        })
                      : null}
                  </ul>
                </div>
              </aside>
              <article className="markdown-article w-8">
                <div className="w-7">
                  <MDXRenderer>{mdx}</MDXRenderer>
                </div>
              </article>
            </div>
          </main>
        </MDXProvider>
      ) : (
        <main dangerouslySetInnerHTML={{ __html: content.html }} />
      )}
    </Layout>
  );
};

Markdown.propTypes = {
  pageContext: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  '*': PropTypes.string,
};

export default Markdown;

export const pageQuery = graphql`
  query ($path: String!) {
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
        image
      }
    }
    allMdx(filter: { frontmatter: { path: { eq: $path } } }) {
      nodes {
        body
        tableOfContents(maxDepth: 2)
        frontmatter {
          author
          date
          path
          title
        }
      }
    }
  }
`;
