/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  docs: [
    {
      label: 'Docusaurus 主题魔改',
      type: 'category',
      link: {
        type: 'doc',
        id: 'docusaurus/docusaurus-guides',
      },
      items: [
        'docusaurus/docusaurus-config',
        'docusaurus/docusaurus-style',
        'docusaurus/docusaurus-component',
        'docusaurus/docusaurus-plugin',
        'docusaurus/docusaurus-search',
        'docusaurus/docusaurus-comment',
        'docusaurus/docusaurus-deploy',
      ],
    },
  ],
};
