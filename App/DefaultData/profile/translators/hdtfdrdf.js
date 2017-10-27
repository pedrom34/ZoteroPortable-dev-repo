{
	"translatorID": "6ca678ba-d83d-4bcc-a8a1-a765143bfa04",
	"label": "hdtfdrdf",
	"creator": "ezrtqz",
	"target": "",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"inRepository": true,
	"translatorType": 4,
	"browserSupport": "g",
	"lastUpdated": "2017-02-10 14:18:13"
}

function detectWeb(doc, url) {
var namespace = doc.documentElement.namespaceURI;
var nsResolver = namespace ? function(prefix) {
if (prefix == "x" ) return namespace; else return null;
} : null;
var XPath1 = "//td[1]"
var XPath2 = "//td[2]"
var myXPathObject = doc.evaluate(XPath1, doc, nsResolver, XPathResult.ANY_TYPE, null);
var myXPathObject2 = doc.evaluate(XPath2, doc, nsResolver, XPathResult.ANY_TYPE, null);

var items = new Object();
var headers;
var contents;

while (headers = myXPathObject.iterateNext()) {
contents = myXPathObject2.iterateNext().textContent;
items[headers.textContent]=contents;
}
var x = items['Title:']
x = x.replace(/\n/g,"")
Zotero.debug(x); 
}