// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
(function() {
	"use strict";

	var HtmlElement = require("./html_element.js");
	var browser = require("./browser.js");
	var failFast = require("./fail_fast.js");

	describe("Home page", function() {
		if (browser.doesNotComputeStyles()) return;

		var WHITE = "rgb(255, 255, 255)";
		var DARK_GRAY = "rgb(89, 89, 89)";
		var GRAY = "rgb(229, 229, 229)";
		var DARKENED_GRAY = "rgb(217, 217, 217)";
		var MEDIUM_GRAY = "rgb(167, 169, 171)";

		var BACKGROUND_BLUE = "rgb(65, 169, 204)";
		var DARK_BLUE = "rgb(13, 87, 109)";
		var MEDIUM_BLUE = "rgb(0, 121, 156)";
		var DARKENED_MEDIUM_BLUE = "rgb(0, 111, 143)";

		var IOS_BROWSER_WIDTH = 980;
		var CORNER_ROUNDING = "2px";
		var BUTTON_DROP_SHADOW = " 0px 1px 0px 0px";

		var frame;
		var logo;
		var tagline;
		var drawingAreaArrow;
		var drawingArea;
		var clearButton;
		var footer;
		var joinUs;

		before(function(done) {
			frame = HtmlElement.fromHtml("<iframe width='1200px' height='1000px' src='/base/src/client/index.html'></iframe>");
			frame.toDomElement().addEventListener("load", function() {
				logo = getElement("logo");
				tagline = getElement("tagline");
				drawingArea = getElement("drawing-area");
				drawingAreaArrow = getElement("drawing-area-arrow");
				clearButton = getElement("clear-button");
				footer = getElement("footer");
				joinUs = getElement("join-us");

				done();
			});
			frame.appendSelfToBody();
		});

		after(function() {
			frame.remove();
		});

		function getElement(id) {
			return new HtmlElement(frame.toDomElement().contentDocument.getElementById(id));
		}

		it("has a blue background", function() {
			expect(backgroundColorOf(new HtmlElement(frame.toDomElement().contentDocument.body))).to.be(BACKGROUND_BLUE);
		});

		it("centers logo at top of page", function() {
			expect(isContentCenteredInPage(logo)).to.be(true);
			expect(elementPixelsFromTopOfPage(logo)).to.be(12);
			expect(fontSizeOf(logo)).to.be("22px");
			expect(textColorOf(logo)).to.be(WHITE);
		});

//		it("create iOS Safari failure", function() {
//			newElement('<div><p id="tagline">tagline</p><p id="footer">footer</p></div>');
//
//
//			var domElement = document.getElementById("tagline");
//			var boundingBox = domElement.getBoundingClientRect();     // comment this line out to make test pass
//
//
//			var style = window.getComputedStyle(domElement);
//			var fontSize = style.getPropertyValue("font-size");
//
//			expect(fontSize).to.be("14px");
//		});

		it("centers tagline directly below logo", function() {
			expect(isContentCenteredInPage(tagline)).to.be(true);
			expect(elementPixelsBelowElement(tagline, logo)).to.be(5);

			expect(fontSizeOf(tagline)).to.be("14px");
			expect(textColorOf(tagline)).to.be(DARK_BLUE);
		});

		it("centers drawing area below tagline", function() {
			var drawingAreaDom = drawingArea.toDomElement();

			expect(isElementCenteredInPage(drawingArea)).to.be(true);
			expect(elementPixelsBelowElement(drawingArea, tagline)).to.be(10);

			expect(elementWidthInPixels(drawingArea)).to.equal(IOS_BROWSER_WIDTH);
			expect(elementHeightInPixels(drawingArea)).to.equal(600);
			expect(backgroundColorOf(drawingArea)).to.equal(WHITE);
			expect(roundedCornersOf(drawingAreaDom)).to.be(CORNER_ROUNDING);
		});

		it("centers an arrow at top of drawing area", function() {
			expect(isElementCenteredInPage(drawingAreaArrow)).to.be(true);

			expect(elementPixelsOverlappingTopOfElement(drawingAreaArrow, drawingArea)).to.be(0);
			// TODO: haven't tested background image, position, or repeat

			expect(isElementBehindElement(drawingAreaArrow, drawingArea)).to.be(false);
		});

		it("positions clear screen button at top right of drawing area", function() {
			var clearButtonDom = clearButton.toDomElement();

			expect(elementPixelsOverlappingTopOfElement(clearButton, drawingArea)).to.be(15);
			expect(elementPixelsOverlappingRightOfElement(clearButton, drawingArea)).to.be(15);
			expect(isElementBehindElement(clearButton, drawingArea)).to.be(false);

			expect(textColorOf(clearButton)).to.be(DARK_GRAY);
			expect(backgroundColorOf(clearButton)).to.be(GRAY);
			expect(hasBorder(clearButtonDom)).to.be(false);

			expect(elementHeightInPixels(clearButton)).to.equal(30);
			expect(elementWidthInPixels(clearButton)).to.equal(70);
			expect(isTextVerticallyCentered(clearButton)).to.be(true);

			expect(roundedCornersOf(clearButtonDom)).to.be(CORNER_ROUNDING);
			expect(dropShadowOf(clearButtonDom)).to.be(MEDIUM_GRAY + BUTTON_DROP_SHADOW);

			expect(textIsUnderlined(clearButtonDom)).to.be(false);
			expect(textIsUppercase(clearButtonDom)).to.be(true);
		});

		it("darkens the 'clear' button when the user hovers over it", function() {
			applyClass(clearButton.toDomElement(), "_hover_", function() {
				expect(backgroundColorOf(clearButton)).to.be(DARKENED_GRAY);
			});
		});

		it("'clear' button appears to depress when user activates it", function() {
			applyClass(clearButton.toDomElement(), "_active_", function() {
				expect(elementPixelsOverlappingTopOfElement(clearButton, drawingArea)).to.be(16);
				expect(dropShadowOf(clearButton.toDomElement())).to.be("none");
			});
		});

		it("centers footer below the drawing area", function() {
			expect(isContentCenteredInPage(footer)).to.be(true);
			expect(elementPixelsBelowElement(footer, drawingArea)).to.be(13);

			expect(fontSizeOf(footer)).to.be("15px");
			expect(textColorOf(footer)).to.be(WHITE);
		});

		it("centers 'join us' button below footer", function() {
			var joinUsDom = joinUs.toDomElement();

			expect(isContentCenteredInPage(joinUs)).to.be(true);
			expect(elementPixelsBelowElement(joinUs, footer)).to.be(13);

			expect(textColorOf(joinUs)).to.be(WHITE);
			expect(backgroundColorOf(joinUs)).to.be(MEDIUM_BLUE);

			expect(elementHeightInPixels(joinUs)).to.equal(35);
			expect(elementWidthInPixels(joinUs)).to.equal(175);
			expect(isTextVerticallyCentered(joinUs)).to.be(true);

			expect(roundedCornersOf(joinUsDom)).to.be(CORNER_ROUNDING);
			expect(dropShadowOf(joinUsDom)).to.be(DARK_BLUE + BUTTON_DROP_SHADOW);

			expect(textIsUnderlined(joinUsDom)).to.be(false);
			expect(textIsUppercase(joinUsDom)).to.be(true);
		});

		it("darkens the 'join us' button when the user hovers over it", function() {
			applyClass(joinUs.toDomElement(), "_hover_", function() {
				expect(backgroundColorOf(joinUs)).to.be(DARKENED_MEDIUM_BLUE);
			});
		});

		it("'join us' button appears to depress when user activates it", function() {
			applyClass(joinUs.toDomElement(), "_active_", function() {
				expect(elementPixelsBelowElement(joinUs, footer)).to.be(14);
				expect(dropShadowOf(joinUs.toDomElement())).to.be("none");
			});
		});

		function isContentCenteredInPage(element) {
			if (!isElementCenteredInPage(element)) return false;

			var domElement = element.toDomElement();

			var style = window.getComputedStyle(domElement);
			var textAlign = style.getPropertyValue("text-align");

			return textAlign === "center";
		}

		function isElementCenteredInPage(element) {
			var frameBody = frame.toDomElement().contentDocument.body;

			var bodyStyle = frame.toDomElement().contentWindow.getComputedStyle(frameBody);
			var bodyLeftMarginWidth = pixelsToInt(bodyStyle.getPropertyValue("margin-left"));
			var bodyRightMarginWidth = pixelsToInt(bodyStyle.getPropertyValue("margin-right"));

			// We can't just base the document width on the frame width because that doesn't account for scroll bars.
			var bodyBoundingBox = frameBody.getBoundingClientRect();
			var documentLeft = bodyBoundingBox.left - bodyLeftMarginWidth;
			var documentRight = bodyBoundingBox.right + bodyRightMarginWidth;

			var elementBoundingBox = getBoundingBox(element.toDomElement());
			var elementLeft = elementBoundingBox.left;
			var elementRight = elementBoundingBox.right;

			var documentCenter = (documentRight - documentLeft) / 2;
			var elementCenter = elementLeft + ((elementRight - elementLeft) / 2);

//			console.log("*** CENTER: element width", elementBoundingBox.width);
//			console.log("documentLeft", documentLeft);
//			console.log("documentRight", documentRight);
//			console.log("elementLeft", elementLeft);
//			console.log("elementRight", elementRight);
//			console.log("documentCenter", documentCenter);
//			console.log("elementCenter", elementCenter);

			var offset = Math.abs(documentCenter - elementCenter);
			var success = (offset <= 0.5);

//			console.log(success ? "✔ SUCCESS" : "✘ FAILURE");

			return success;
		}

		function elementPixelsFromTopOfPage(element) {
			return getBoundingBox(element.toDomElement()).top;
		}

		function elementHeightInPixels(element) {
			return getBoundingBox(element.toDomElement()).height;
		}

		function elementWidthInPixels(element) {
			return getBoundingBox(element.toDomElement()).width;
		}

		function elementPixelsBelowElement(element, relativeToElement) {
			return Math.round(getBoundingBox(element.toDomElement()).top - getBoundingBox(relativeToElement.toDomElement()).bottom);
		}

		function elementPixelsOverlappingTopOfElement(element, relativeToElement) {
			return Math.round(getBoundingBox(element.toDomElement()).top - getBoundingBox(relativeToElement.toDomElement()).top);
		}

		function elementPixelsOverlappingRightOfElement(element, relativeToElement) {
			return Math.round(getBoundingBox(relativeToElement.toDomElement()).right - getBoundingBox(element.toDomElement()).right);
		}

		function isElementBehindElement(element, relativeToElement) {
			var elementZ = getZIndex(element);
			var relativeZ = getZIndex(relativeToElement);

			if (elementZ === relativeZ) return !isElementAfterElementInDomTree();
			else return (elementZ < relativeZ);

			function getZIndex(element) {
				var z = getComputedProperty(element.toDomElement(), "z-index");
				if (z === "auto") z = 0;
				return z;
			}

			function isElementAfterElementInDomTree() {
				var elementNode = element.toDomElement();
				var relativeNode = relativeToElement.toDomElement();
				var foundRelative = false;
				var elementAfterRelative = false;
				for (var child = elementNode.parentNode.firstChild; child !== null; child = child.nextSibling) {
					if (child === elementNode) {
						if (foundRelative) elementAfterRelative = true;
					}
					if (child === relativeNode) foundRelative = true;
				}
				failFast.unlessTrue(foundRelative, "can't yet compare elements that have same z-index and are not siblings");
				return elementAfterRelative;
			}


		}

		function isTextVerticallyCentered(element) {
			var elementHeight = getBoundingBox(element.toDomElement()).height;
			var lineHeight = getComputedProperty(element.toDomElement(), "line-height");

			return elementHeight + "px" === lineHeight;
		}

		function backgroundColorOf(element) {
			return getComputedProperty(element.toDomElement(), "background-color");
		}

		function fontSizeOf(element) {
			return getComputedProperty(element.toDomElement(), "font-size");
		}

		function textColorOf(element) {
			return getComputedProperty(element.toDomElement(), "color");
		}

		function hasBorder(domElement) {
			var top = getComputedProperty(domElement, "border-top-style");
			var right = getComputedProperty(domElement, "border-right-style");
			var bottom = getComputedProperty(domElement, "border-bottom-style");
			var left = getComputedProperty(domElement, "border-left-style");
			return !(top === "none" && right === "none" && bottom === "none" && left === "none");
		}

		function textIsUnderlined(domElement) {
			var style = getComputedProperty(domElement, "text-decoration");
			return style.indexOf("none") !== 0;
		}

		function textIsUppercase(domElement) {
			return getComputedProperty(domElement, "text-transform") === "uppercase";
		}

		function roundedCornersOf(domElement) {
			// We can't just look at border-radius because it returns "" on Firefox and IE 9
			var topLeft = getComputedProperty(domElement, "border-top-left-radius");
			var topRight = getComputedProperty(domElement, "border-top-right-radius");
			var bottomLeft = getComputedProperty(domElement, "border-bottom-left-radius");
			var bottomRight = getComputedProperty(domElement, "border-bottom-right-radius");

			if (topLeft === topRight && topLeft === bottomLeft && topLeft === bottomRight) return topLeft;
			else return topLeft + " " + topRight + " " + bottomRight + " " + bottomLeft;
		}

		function dropShadowOf(domElement) {
			var shadow = getComputedProperty(domElement, "box-shadow");

			// When there is no drop shadow, most browsers say 'none', but IE 9 gives a color and nothing else.
			// We handle that case here.
			if (shadow === "white") return "none";
			if (shadow.match(/^#[0-9a-f]{6}$/)) return "none";      // look for '#' followed by six hex digits

			// The standard value seems to be "rgb(r, g, b) Wpx Xpx Ypx Zpx",
			// but IE 9 gives us "Wpx Xpx Ypx Zpx #rrggbb". We need to normalize it.
			// BTW, we don't support multiple shadows yet
			var groups = shadow.match(/^([^#]+) #(..)(..)(..)/);   // get everything before the '#' and the r, g, b
			if (groups === null) return shadow;   // There was no '#', so we assume we're not on IE 9 and everything's fine

			var sizes = groups[1];
			var r = parseInt(groups[2], 16);
			var g = parseInt(groups[3], 16);
			var b = parseInt(groups[4], 16);
			return "rgb(" + r + ", " + g + ", " + b + ") " + sizes;
		}

		function getBoundingBox(domElement) {
			return domElement.getBoundingClientRect();
		}

		function getComputedProperty(domElement, propertyName) {
			var style = window.getComputedStyle(domElement);
			return style.getPropertyValue(propertyName);
		}

		function applyClass(domElement, className, fn) {
			var oldClassName = domElement.className;
			try {
				domElement.className += className;
				forceReflow(domElement);

				fn();
			}
			finally {
				domElement.className = oldClassName;
				forceReflow(domElement);
			}
		}

		function forceReflow(domElement) {
			var makeLintHappy = domElement.offsetHeight;
		}

		function pixelsToInt(pixels) {
			return parseInt(pixels, 10);
		}

	});

}());
