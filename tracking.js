! function(r) {
	var e = r.Shopify, // Shopify-object (indien beschikbaar) uit de globale scope
		o = {
			timestamp: Date.now(),
			errors: []
		}, // Object voor het verzamelen van trackinggegevens
		// 1. Unieke ID-generatie
		n = function() {
			for (var t = "", e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!&$./",
					r = e.length,
					o = 0; o < 24; o++) t += e.charAt(Math.floor(Math.random() * r));
			return t.split("").sort(function() {
				return .5 - Math.random()
			}).join("")
		},
		// 2. Functie om de querystring op te halen
		s = function() {
			return "" != r.location.search ? r.location.search : null
		},
		// 3. Functie om de referrer URL op te halen
		t = function() {
			return "" != r.document.referrer ? r.document.referrer : null
		},
		// 4. Functie om het pad van de URL op te halen
		a = function() {
			return r.location.pathname
		},
		// 5. Functie om de paginatitel op te halen
		i = function() {
			return r.document.title
		},
		// 6. Functie om de origin (domein) op te halen
		c = function() {
			return r.location.origin
		},
		// 7. Functie om de volledige URL op te halen
		u = function() {
			return r.location.origin + r.location.pathname
		},
		// 8. Module om UTM-parameters op te halen
		l = {
			getSource: function() {
				var t = s().split("source=");
				return t.length < 2 ? null : t[1].split("&")[0]
			},
			getCampaign: function() {
				var t = s().split("campaign=");
				return t.length < 2 ? null : t[1].split("&")[0]
			},
			getMedium: function() {
				var t = s().split("medium=");
				return t.length < 2 ? null : t[1].split("&")[0]
			},
			getContent: function() {
				var t = s().split("content=");
				return t.length < 2 ? null : t[1].split("&")[0]
			},
			getTerm: function() {
				var t = s().split("term=");
				return t.length < 2 ? null : t[1].split("&")[0]
			},
			getAllUtmParameters: function(t) {
				var e;
				return s() && ((e = this.getSource()) && (t.utmSource = e),
						(e = this.getCampaign()) && (t.utmCampaign = e),
						(e = this.getMedium()) && (t.utmMedium = e),
						(e = this.getContent()) && (t.utmContent = e),
						(e = this.getTerm()) && (t.utmTerm = e)),
					t
			}
		},
		// 9. Module om opslag in de browser te beheren (gebruikers-ID en sessie-ID)
		h = {
			checkForUniqueUserId: function() {
				var t = r.localStorage.getItem("pap_unique_user_id");
				return t || (t = n(), r.localStorage.setItem("pap_unique_user_id", t), t)
			},
			checkForSessionId: function() {
				var t = sessionStorage.tabId && "2" !== sessionStorage.closedLastTab ? sessionStorage.tabId : sessionStorage.tabId = n();
				return sessionStorage.closedLastTab = "2",
					r.addEventListener("unload", function() {
						sessionStorage.closedLastTab = "1"
					}),
					r.addEventListener("beforeunload", function() {
						sessionStorage.closedLastTab = "1"
					}),
					t
			},
			handleStorageTagging: function(t) {
				return t.userId = this.checkForUniqueUserId(),
					t.sessionId = this.checkForSessionId(),
					t
			}
		},
		// 10. Module om Shopify-pagina-gegevens op te halen
		d = {
			isShopifyPageWithMeta: function() {
				var t = a();
				return t.includes("/collections/") && "" != t.split("/collections/")[1] ? "collection" : !(!t.includes("/products/") || "" == t.split("/products/")[1]) && "product"
			},
			getShopifyPageDataManually: function(e) {
				try {
					var t = a();
					return r.isPostPurchase || t.includes("/checkouts/") && t.includes("/post-purchase") ? e.shopifyPageType = "post_purchase" : r.Shopify.checkout || t.includes("/checkouts/") && t.includes("thank_you") ? e.shopifyPageType = "thank_you" : "/" === t ? e.shopifyPageType = "home" : "/collections" === t || "/collections/" === t ? e.shopifyPageType = "collections - index" : t.includes("/collections/") && "" != t.split("/collections/")[1] ? (e.shopifyPageType = "collections", e.shopifyPageDetail = t.split("/collections/")[1], r.meta && r.meta.page && (e.shopifyPageCollectionId = r.meta.page.resourceId)) : t.includes("/products/") && "" != t.split("/products/")[1] ? (e.shopifyPageType = "product", e.shopifyPageDetail = t.split("/products/")[1], r.meta && r.meta.product && (e.shopifyPageProductId = r.meta.product.id)) : e.shopifyPageType = "other",
						e
				}
				catch (t) {
					return e
				}
			},
			getCheckoutInformation: function(t) {
				if (t = t || {}, e && (e.checkout || e.order)) {
					try {
						t.shopifyOrderCustomerId = e.order?.customer?.id || e?.checkout?.customer_id
					}
					catch (t) {}
					try {
						t.shopifyOrderCustomerLocale = e.checkout?.customer_locale
					}
					catch (t) {}
					try {
						t.shopifyOrderId = e.order?.id || e.checkout?.order_id
					}
					catch (t) {}
					try {
						t.shopifyOrderSubtotalPrice = e.order?.subtotalPrice || e.checkout?.subtotal_price
					}
					catch (t) {}
					try {
						t.shopifyOrderTotalPrice = e.order?.totalPrice || e.checkout?.total_price
					}
					catch (t) {}
					try {
						t.shopifyOrderCurrency = e.order?.currency || e.checkout?.currency
					}
					catch (t) {}
					try {
						t.shopifyOrderLineItems = e.order?.lineItems.map(function(t) {
							return {
								lineItemId: t.id,
								lineItemProductId: t.product?.id,
								lineItemTitle: t.title,
								lineItemVariantId: t.variant?.id
							}
						}) || e.checkout?.line_items.map(function(t) {
							return {
								lineItemId: t.id,
								lineItemProductId: t.product_id,
								lineItemTitle: t.title,
								lineItemVariantId: t.variant_id
							}
						})
					}
					catch (t) {}
					try {
						t.shopifyOrderProcessedAt = e.checkout?.updated_at
					}
					catch (t) {}
				}
				return t
			},
			getStoreURL: function(t) {
				return e && e.shop && (t.shopifyShopURL = e.shop),
					r.shopifyShopURL && (t.shopifyShopURL = r.shopifyShopURL),
					t
			},
			getAllShopifyData: function(e) {
				e = e || {};
				try {
					e = this.getStoreURL(e)
				}
				catch (t) {
					e.errors.push(JSON.stringify(t.stack))
				}
				try {
					e = this.getShopifyPageDataManually(e)
				}
				catch (t) {
					e.errors.push(JSON.stringify(t.stack))
				}
				try {
					e = this.getCheckoutInformation(e)
				}
				catch (t) {
					e.errors.push(JSON.stringify(t.stack))
				}
				return e
			}
		},
		// 11. Module om gegevens naar een server te sturen
		p = {
			getMetaInformationAndSend: function(e) {
				var r = this,
					o = new XMLHttpRequest;
				o.onreadystatechange = function() {
					if (4 === o.readyState) {
						try {
							var t;
							200 <= o.status && o.status < 300 && (t = JSON.parse(o.response), e.shopifyPageProductId = t.product.id)
						}
						catch (t) {}
						r.sendPayloadToServer(e, 5)
					}
				};
				try {
					o.open("GET", u() + ".json"), o.send()
				}
				catch (t) {
					r.sendPayloadToServer(e, 5)
				}
			},
			sendPayloadToServer: function(e, r) {
				var o = this,
					t = new XMLHttpRequest;
				t.onreadystatechange = function() {
					if (4 === t.readyState) try {
						(t.status < 200 || 300 <= t.status) && r && o.sendPayloadToServer(e, r - 1)
					}
					catch (t) {}
				};
				try {
					t.open("POST", "https://api-voorbeeld.com"),
						t.setRequestHeader("Content-Type", "application/json;charset=UTF-8"),
						t.send(JSON.stringify(e))
				}
				catch (t) {
					o.sendPayloadToServer(e, r - 1)
				}
			}
		};
	// Unieke gebruiker- en sessie-IDs instellen
	try {
		o = h.handleStorageTagging(o)
	}
	catch (t) {
		console.log(t), o.errors.push(JSON.stringify(t.stack))
	}
	// UTM-parameters, referrer, URL-onderdelen en andere pagina-informatie verzamelen
	try {
		(pageQuery = s()) && (o.pageQuery = pageQuery)
	}
	catch (t) {
		o.errors.push(JSON.stringify(t.stack))
	}
	try {
		(pageReferrer = t()) && (o.pageReferrer = pageReferrer)
	}
	catch (t) {
		o.errors.push(JSON.stringify(t.stack))
	}
	try {
		o.pageOrigin = c()
	}
	catch (t) {
		o.errors.push(JSON.stringify(t.stack))
	}
	try {
		o.pagePath = a()
	}
	catch (t) {
		o.errors.push(JSON.stringify(t.stack))
	}
	try {
		o.pageTitle = i()
	}
	catch (t) {
		o.errors.push(JSON.stringify(t.stack))
	}
	try {
		o = l.getAllUtmParameters(o)
	}
	catch (t) {
		o.errors.push(JSON.stringify(t.stack))
	}
	try {
		o = d.getAllShopifyData(o)
	}
	catch (t) {
		o.errors.push(JSON.stringify(t.stack))
	}
	// Controleer of er een "headlessEmail" parameter aanwezig is
	try {
		r.headlessEmail && (o.headlessEmail = r.headlessEmail)
	}
	catch (t) {}
	// Verzend de trackinggegevens naar de server
	try {
		r.meta || "product" !== d.isShopifyPageWithMeta() ? p.sendPayloadToServer(o, 5) : p.getMetaInformationAndSend(o)
	}
	catch (t) {
		o.errors.push(JSON.stringify(t.stack)),
			p.sendPayloadToServer(o, 5)
	}
}(window);
