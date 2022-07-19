module.exports = {
  siteMetadata: {
    title: 'TU Delft Academic Heritage',
    twitterHandle: '@tudelftlibrary',
    url: 'https://erfgoed.tudelft.nl/',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content`,
        name: 'markdown-pages',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        tableOfContents: {
          heading: null,
          maxDepth: 2,
        },
        plugins: [
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: { icon: false },
          },
          'gatsby-remark-numbered-footnotes',
          {
            resolve: 'gatsby-remark-toc',
            options: {
              include: [
                `content/**/publications/*.md`, // an include glob to match against
              ],
            },
          },
          {
            resolve: `gatsby-remark-images`,
          },
          `gatsby-remark-lazy-load`,
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/tu-delft-logo-svg-vector.svg', // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
      },
    },
    // You can have multiple instances of this plugin to create indexes with
    // different names or engines. For example, multi-lingual sites could create
    // an index for each language.
    {
      resolve: `gatsby-plugin-typesense`,
      options: {
        rootDir: `${__dirname}/public`, // Required
        collectionSchema: {
          // Required
          name: 'pages_v1',
          query_languages: ['nl', 'en'],
          fields: [
            {
              name: 'title',
              type: 'string',
              optional: true,
              facet: true,
            },
            {
              name: 'about',
              type: 'string[]',
              optional: true,
              facet: true,
            },
            {
              name: 'content',
              type: 'string[]',
              optional: true,
              facet: true,
            },
            {
              name: 'image',
              type: 'string',
              optional: true,
              facet: true,
            },
            {
              name: 'type',
              type: 'string',
              optional: true,
              facet: true,
            },
            {
              name: 'author',
              type: 'string',
              optional: true,
              facet: true,
            },
            {
              name: 'date',
              type: 'string',
              optional: true,
              facet: true,
            },
            {
              name: 'page_path', // Required
              type: 'string',
            },
            {
              name: 'page_priority_score', // Required
              type: 'int32',
            },
          ],
          default_sorting_field: 'page_priority_score', // Required
        },
        server: {
          // Required
          apiKey: 'wL2mqHbUfa5hlr6k6DG9HcEqqKdRgeCD',
          nodes: [
            {
              host: '63flhve71t2un5xgp-1.a1.typesense.net',
              port: '443',
              protocol: 'https',
            },
          ],
        },
      },
    },
  ],
};
