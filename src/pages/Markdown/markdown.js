import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../../components/Layout/layout';
import GithubLink from '../../components/GithubLink/GithubLink';
import substituteSpecialLinks, { getPageLanguage } from '../../utils';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';
import { Illustration } from '../../components/Illustration/Illustration';

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

  const getPageMetaData = () => {
    const stringToSearch =
      data.markdownRemark && data.markdownRemark.html
        ? data.markdownRemark.html
        : '';
    const [_, href] = stringToSearch.match(/src="(.*?)"/) || [];
    const description =
      data.markdownRemark &&
      data.markdownRemark.frontmatter &&
      data.markdownRemark.description
        ? data.markdownRemark.description
        : null;
    const meta = {
      image: href,
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
    Illustration: props => (
      <Illustration {...props} pageLanguage={pageLanguage} />
    ),
    h1: (props, children) => {
      return (
        <h1
          id={props.children.toLowerCase().replace(/ /g, '-')}
          {...children}
          {...props}
        />
      );
    },
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
  console.log(toc);

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
                  <div className="boxtitle">{author}</div>
                </div>
                <div className="block info cutcorners w-4 h-4 ">
                  <div className="boxtitle">Table of Contents</div>
                  <ul>
                    {toc.items.map(item => {
                      return (
                        <li style={{ padding: '3px' }}>
                          <a href={item.url} key={item.url}>
                            {item.title}
                            {item.items ? (
                              <ul style={{ paddingLeft: '10px' }}>
                                {item.items.map(subitem => (
                                  <li style={{ padding: '3px' }}>
                                    <a href={subitem.url} key={item.url}>
                                      {subitem.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </a>
                          <br />
                        </li>
                      );
                    })}
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
      tableOfContents(
        pathToSlugField: "frontmatter.path"
        maxDepth: 2
        heading: "Table of Contents"
      )
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
        author
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
