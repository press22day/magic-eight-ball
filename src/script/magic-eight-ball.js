(function() {
	var pfx = ["webkit", "moz", "MS", "o", ""],
		css = ["shake", "tell"];

	function prefixedEvent(element, type, callback) {
		for (var p = 0; p < pfx.length; p++) {
			if (!pfx[p]) type = type.toLowerCase();
			element.addEventListener(pfx[p]+type, callback, false);
		}
	}
	function random(o) {
		return o[Math.floor(Math.random() * o.length)];
	}
	function shuffle(o) {
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}
	function shrink(o) {
		return shuffle(o).splice(0, Math.floor(o.length / 2));
	}
	function setClass(o, c) {
		o.className = c;
	}
	function addClass(o, c) {
		o.className += " " + c;
	}
	function removeClass(o, c) {
		var r = new RegExp("(?:^|\\s)" + c + "(?!\\S)", "g");
		return o.className.replace(r, '');
	}

	Polymer("magic-eight-ball", {
		outlook: 0,
		prediction: "Ask me a question",
		domReady: function () {
			var ball = this.$.ball;
			prefixedEvent(ball, "AnimationEnd", this.tell.bind(this));
			ball.addEventListener("click", this.predict.bind(this));
		},
		predict: function () {
			var ball = this.$.ball,
				pred = this.$.prediction,
				opt = random(this.getOptions());
			setClass(ball, removeClass(ball, css[1]));
			addClass(ball, css[0]);
			pred.innerHTML = opt;
		},
		tell: function () {
			var ball = this.$.ball;
			setClass(ball, removeClass(ball, css[0]));
			addClass(ball, css[1]);
		},
		getOptions: function () {
			var options = this.children,
				optimistic = [], pessimistic = [], list = [];

			for(var n=0; n<options.length; n++){
				var item = options[n],
					outlook = item.getAttribute("outlook"),
					text = item.innerHTML;

				if (text === this.$.prediction.innerHTML)
					continue;

				if (outlook > 0)
					optimistic.push(text);
				else if (outlook < 0)
					pessimistic.push(text);
				else
					list.push(text);
			}

			if (this.outlook > 0)
				pessimistic = shrink(pessimistic);
			if (this.outlook < 0)
				optimistic = shrink(optimistic);

			return list.concat(optimistic).concat(pessimistic);
		}
	})
})();
