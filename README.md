<h1 align="center">
  Delft Static Site Generator
</h1>

## 💫 About

Since 2017, when TU Delft celebrated its 175th anniversary, the university has been raising the profile of its academic heritage by systematically curating its collections, initiating research projects and organising on-campus presentations in collaboration with students and academic staff.

This website provides access to the different facets of the academic heritage team of TU Delft Library: digital editions of exhibitions, (digitised) items from the special collections and research output.

## 🚀 Developing locally

1.  **Dependancies**

    [Node V17](https://nodejs.org/docs/latest-v17.x/api/)

    If using [Node Version Manager](https://github.com/nvm-sh/nvm) to handle your node versions run from root folder:

    ```sh
    nvm use 17
    ```

2.  **Start developing.**

    From the route of the project install the latest project dependancies and start the development server.

    ```sh
    yarn && yarn start
    ```

3.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    \_Note: You'll also see a second link: `http://localhost:8000/___graphql`. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql).

## 🧐 Directories?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package.json
    ├── README.md
    └── yarn.lock

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

2.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

4.  **`.prettierrc`**: This is a configuration file for [Prettier](https://prettier.io/). Prettier is a tool to help keep the formatting of your code consistent.

5.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

6.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

7.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process. This is where the bulk of the custom logic for building the content folder is located.

8.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

9.  **`LICENSE`**: This software is licensed under the MIT license.

10. **`yarn.lock`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(Never change this file directly and always make sure you commit any changes to this).**

11. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

12. **`README.md`**: A text file containing useful reference information about your project.

## Debugging

1.  **Dependancies**

    Issues with the build process with appear in your terminal window

    When pulling down a branch it is recommended that you always rebuild your project dependances with yarn

    ```sh
    yarn
    ```

2.  **Clearing your cache**

    Gatsby will create a cache locally of your project which from time to time may require a refresh. If you are having issues try to clear this cache using

    ```sh
    gatsby clean
    ```

## 💫 Deploy

    Run auto linting on your code to conform to the project standards

    ```sh
    yarn format
    ```

    Building the project. It is recommended you confirm the build is running and passing before any pushes to the project repository.

    ```sh
    yarn build
    ```

Once you have a running build push to the project repo and open a pull request. Netlify will automatically build a preview of your branch and the details are availible on the pull request.
Master branch is automatically deployed to the live site.

## Useful links

[Gatsby Readme](./README.gatsby.md)

[UX Wireframe](https://www.figma.com/file/emiQTuM5feCweZT4soUY4MJg/Wires?node-id=0:1)

[Demo site](https://delft-static-site-generator.netlify.com/)

[Changelog](https://github.com/digirati-co-uk/delft-static-site-generator/issues)
