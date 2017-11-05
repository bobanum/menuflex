/*jslint esnext:true, browser:true*/
/*globals html_beautify:true,css_beautify:true*/
class Presentation {
	static init() {
		this.afficherSeulementSiCss = true;
		this.evt = {
			window: {
				load: function () {
					Presentation.load();
				}
			},
			body: {
				mouseover: function (e) {
					Presentation.afficherDetails(e.target);
					e.stopPropagation();
				},
				mouseout: function (e) {
					e.target.classList.remove('pres-affiche');
				}
			},
			etape: {
				change: function () {
					var styles = {
						"rien": '',
						"base": '#base',
						"boutons": '#base, #boutons',
						"base2": '#base, #boutons, #base2',
						"erreurs_de_base": '#base, #boutons, #base2, #base_erreurs',
						"hierarhie": '#base, #boutons, #hierarchie',
						"hierarhie_cachee": '#base, #boutons, #hierarchie_cachee',
						"hierarhie_flottante": '#base, #boutons, #hierarchie_flottante',
						"hierarhie_droite": '#base, #boutons, #hierarchie_droite',
						"horizontal": '#base, #boutons, #horizontal',
					};
					Presentation.activerEtapes(styles[this.value]);
				}
			}
		};
		window.addEventListener("load", this.evt.window.load);
	}
	static get code() {
			if (this._code === undefined) {
				this._code = this.dom_code();
			}
			return this._code;
		}
	static get html() {
			if (this._html === undefined) {
				this._html = this.dom_html();
			}
			return this._html;
		}
	static get css() {
			if (this._css === undefined) {
				this._css = this.dom_css();
			}
			return this._css;
		}
	static get options() {
			if (this._options === undefined) {
				this._options = this.dom_options();
			}
			return this._options;
		}
	static dom_code() {
		var resultat;
		resultat = document.createElement('div');
		resultat.setAttribute('id', 'code');
		this.ajouterToggle(resultat, "code_html_toggle");
		resultat.appendChild(this.html);
//		this.ajouterToggle(resultat, "code_css_toggle");
		resultat.appendChild(this.css);
		return resultat;
	}
	static ajouterToggle(conteneur, id) {
		var input, label;
		input = conteneur.appendChild(document.createElement("input"));
		input.classList.add("toggle");
		input.setAttribute("type", "checkbox");
		input.setAttribute("id", id);
		label = conteneur.appendChild(document.createElement("label"));
		label.setAttribute("for", id);
		label.setAttribute("type", "checkbox");
	}
	static dom_interface(contenu) {
		document.body.appendChild(this.dom_header());
		var milieu = document.body.appendChild(document.createElement("div"));
		milieu.classList.add("milieu");
		milieu.appendChild(contenu);
		milieu.appendChild(this.code);
		milieu.appendChild(this.options);
		document.body.appendChild(this.dom_footer());
	}
	static load() {
		var page;
		page = document.createElement("div");
		page.setAttribute("id", "body");
		this.wrapContenu(document.body, page);
		this.dom_interface(page);
		this.desactiverEtapes();

		this.normaliserRegles();

		document.getElementById("etape_base2").dispatchEvent(new Event('change'));
		document.getElementById("etape_base2").setAttribute("checked", "checked");

		page.addEventListener("mouseover", this.evt.body.mouseover);
		page.addEventListener("mouseout", this.evt.body.mouseout);
	}
	static wrapContenu(element, conteneur) {
		while (element.childNodes.length > 0) {
			conteneur.appendChild(element.firstChild);
		}
		element.appendChild(conteneur);
		return conteneur;
	}
	static dom_header() {
		var html;
		html = document.createElement('header');
		html.innerHTML = "Créer un menu";
		return html;
	}
	static dom_footer() {
		var html;
		html = document.createElement('footer');
		html.innerHTML = "Status bar";
		return html;
	}
	static dom_html() {
		var html;
		html = document.createElement('div');
		html.setAttribute('id', 'code-html');
		return html;
	}
	static dom_css() {
		var css;
		css = document.createElement('div');
		css.setAttribute('id', 'code-css');
		return css;
	}
	static dom_options() {
		var options;
		options = document.createElement('div');
		options.setAttribute('id', 'pres-options');
		options.appendChild(this.creerBoutons("etape", this.evt.etape.change, {
			'rien':'Rien',
			'base':'Base',
			'boutons':'Boutons',
			'base2':'Base2',
			'erreurs_de_base':'Erreurs de&nbsp;base',
			'hierarhie':'Hiérarchie',
			'hierarhie_cachee':'Hiérarchie cachée',
			'hierarhie_flottante':'Hiérarchie flottante',
			'hierarhie_droite':'Hiérarchie droite',
			'horizontal':'Horizontal',
		}));
		return options;
	}
	static creerRadio(etiquette, name, value, evt) {
		var resultat, id, input, label;
		id = name + "_" + value;
		resultat = document.createElement("span");
		resultat.classList.add("radio");
		input = resultat.appendChild(document.createElement("input"));
		input.setAttribute("type", "radio");
		input.setAttribute("name", name);
		input.setAttribute("value", value);
		input.setAttribute("id", id);
		input.addEventListener("change", evt);
		label = resultat.appendChild(document.createElement("label"));
		label.setAttribute("for", id);
		label.innerHTML = etiquette;
		return resultat;
	}
	static creerBoutons(name, evt, boutons) {
		var resultat, k;
		resultat = document.createElement('div');
		for (k in boutons) {
			resultat.appendChild(this.creerRadio(boutons[k], name, k, evt));
		}
		return resultat;
	}
	static desactiverEtapes(selecteur) {
		var styles, i, n;
		selecteur = selecteur || 'style.etape';
		styles = document.querySelectorAll(selecteur);
		for (i = 0, n = styles.length; i < n; i += 1) {
			styles[i].disabled = true;
			//TODO UTILISER DISABLED
		}
		return this;
	}
	static activerEtapes(selecteur) {
		var styles, i, n;
		this.desactiverEtapes();
		if (!selecteur) {
			return this;
		}
		styles = document.querySelectorAll(selecteur);
		for (i = 0, n = styles.length; i < n; i += 1) {
			styles[i].disabled = false;
			//TODO UTILISER DISABLED
		}
		return this;
	}
	static getRules() {
		var resultat, styleSheets;
		resultat = [];
		styleSheets = [].slice.call(document.styleSheets, 0);
		styleSheets = styleSheets.filter((sheet)=>(!sheet.disabled && (!sheet.href || !sheet.href.endsWith('presentation.css'))));
		styleSheets.forEach(function (sheet) {
			var rules = [].slice.call(sheet.cssRules, 0);
			resultat.push.apply(resultat, rules);
		}, this);
		return resultat;
	}
	static normaliserRegles() {
		var regles = this.getRules();
		regles.forEach((r, i) => this.normaliserRegle(r, i));
		return this;
	}
	static normaliserRegle(regle, idxRule) {
		var sel, sel2, sheet, cssText;
		sel = regle.selectorText;
		sel2 = sel.replace(/($|[^\.\#])body/g, "$1body>div#body");
		if (sel !== sel2) {
			sheet = regle.parentStyleSheet;
			cssText = sel2 + regle.cssText.substr(sel.length);
			sheet.deleteRule(idxRule);
			sheet.insertRule(cssText, idxRule);
		}
		return this;
	}
	static trouverRegles(element) {
		var resultat;
		var regles = this.getRules();
		resultat = regles.filter(r=>element.matches(r.selectorText));
		return resultat;
	}
	static afficherDetails(element) {
		var css_code, html_code;
		css_code = this.css_code(element);
		if (!this.afficherSeulementSiCss || css_code) {
			element.classList.add('pres-affiche');
			html_code = this.html_code(element);
			this.html.innerHTML = html_code;
			this.css.innerHTML = css_code;
		}
	}
	static formatterCode(txt) {
		var resultat, div;
		if (!txt) {
			return "";
		}
		div = document.createElement("div");
		div.textContent = txt;
		resultat = div.innerHTML;
		resultat = resultat.split(/\r\n|\n\r|\r|\n/);
		resultat = resultat.map((l)=>"<div>"+l+"</div>");
		resultat = resultat.join("\r\n");
		return resultat;
	}
	static html_code(element) {
		var resultat = element.outerHTML;
		var options = {
			'indent_size': 3,
			'indent_char': ' ',
			'max_char': 78,
			'brace_style': 'expand',
			'unformatted': ['a', 'sub', 'sup', 'b', 'i', 'u', 'strong', 'em']
		};
		resultat = resultat.replace(/pres-[a-zA-Z_-]+ +| +pres-[a-zA-Z_-]+|pres-[a-zA-Z_-]+/g, "");
		resultat = resultat.replace(/ *class=" *"/g, "");
		resultat = html_beautify(resultat, options);
		resultat = this.formatterCode(resultat);
		return resultat;
	}
	static css_code(element) {
		var resultat, regles, i, n;
		resultat = "";
		regles = this.trouverRegles(element);
		if (regles.length) {
			for (i = 0, n = regles.length; i < n; i += 1) {
				resultat += regles[i].cssText;
			}
		}
		resultat = css_beautify(resultat, {
			'indent_size': 3,
			'indent_char': ' '
		});
		resultat = this.formatterCode(resultat);
		return resultat;
	}
}
Presentation.init();
