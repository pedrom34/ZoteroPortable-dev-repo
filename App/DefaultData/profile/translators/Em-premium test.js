{
	"translatorID": "6db28c88-d9bc-4920-82af-8217a7c9c8ac",
	"label": "Em-premium test",
	"creator": "Pierre Morlanne-Fendan",
	"target": "www.em-premium.com/article/[0-9]+",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "g",
	"lastUpdated": "2017-05-18 14:55:59"
}

function detectWeb(doc, url) {
  var namespace = doc.documentElement.namespaceURI;
  var nsResolver = namespace ? function(prefix) {
    if (prefix == "x" ) return namespace; else return null;
    } : null;
  var traiteXPath = "//meta[@name='DC.source']/@content";
  var traiteObject = doc.evaluate(traiteXPath, doc, nsResolver, XPathResult.ANY_TYPE, null).iterateNext().textContent;
  var traiteYN = traiteObject.indexOf("traites")
  Zotero.debug(traiteYN);
}