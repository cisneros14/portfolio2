<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #333;
            max-width: 960px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 20px;
          }
          p {
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            font-size: 14px;
          }
          th {
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #ddd;
            background-color: #f9f9f9;
          }
          td {
            padding: 10px;
            border-bottom: 1px solid #eee;
          }
          tr:hover td {
            background-color: #f5f5f5;
          }
          a {
            color: #2563eb;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .count {
            float: right;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>
          This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs.
          It is used by search engines to index the content of this website.
        </p>
        <table>
          <thead>
            <tr>
              <th width="60%">URL</th>
              <th width="15%">Priority</th>
              <th width="15%">Change Freq.</th>
              <th width="10%">Last Modified</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                </td>
                <td><xsl:value-of select="sitemap:priority"/></td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td><xsl:value-of select="concat(substring(sitemap:lastmod,0,11),concat(' ', substring(sitemap:lastmod,12,5)))"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
