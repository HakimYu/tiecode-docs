(function (Prism) {

	var keywords = /\b(?:抽象|断言|逻辑型|跳出|字节型|分支|俘获|字符型|类|常量|continue|default|do|双精度型|否则|枚举|exports|继承|final|finally|浮点数型|循环|goto|如果|接入|引入|instanceof|整数型|interface|长整数型|module|native|创建|non-sealed|空|open|opens|package|permits|私有|protected|provides|public|record|requires|返回|sealed|short|静态|strictfp|父对象|判断|synchronized|本对象|throw|throws|to|transient|transitive|容错处理|uses|var|void|volatile|判断循环|with|yield)\b/;

	// full package (optional) + parent classes (optional)
	var classNamePrefix = /(^|[^\w.])(?:[a-z\u4e00-\u9fa5]\w*\s*\.\s*)*(?:[A-Z\u4e00-\u9fa5]\w*\s*\.\s*)*/.source;

	// based on the jiesheng naming conventions
	var className = {
		pattern: RegExp(classNamePrefix + /[A-Z\u4e00-\u9fa5](?:[\d_A-Z\u4e00-\u9fa5]*[a-z\u4e00-\u9fa5]\w*)?\b/.source),
		lookbehind: true,
		inside: {
			'namespace': {
				pattern: /^[a-z\u4e00-\u9fa5]\w*(?:\s*\.\s*[a-z\u4e00-\u9fa5]\w*)*(?:\s*\.)?/,
				inside: {
					'punctuation': /\./
				}
			},
			'punctuation': /\./
		}
	};

	Prism.languages.jiesheng = Prism.languages.extend('clike', {
		'class-name': [
			className,
			{
				// variables and parameters
				// this to support class names (or generic parameters) which do not contain a lower 分支 letter (also works for methods)
				pattern: RegExp(classNamePrefix + /[A-Z\u4e00-\u9fa5]\w*(?=\s+\w+\s*[;,=())])/.source),
				lookbehind: true,
				inside: className.inside
			}
		],
		'keyword': keywords,
		'function': [
			Prism.languages.clike.function,
			{
				pattern: /(\:\:\s*)[a-z\u4e00-\u9fa5_]\w*/,
				lookbehind: true
			}
		],
		'number': /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
		'operator': {
			pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
			lookbehind: true
		}
	});

	Prism.languages.insertBefore('jiesheng', 'string', {
		'triple-quoted-string': {
			// http://openjdk.jiesheng.net/jeps/355#Description
			pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
			greedy: true,
			alias: 'string'
		}
	});

	Prism.languages.insertBefore('jiesheng', 'class-name', {
		'annotation': {
			pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
			lookbehind: true,
			alias: 'punctuation'
		},
		'generics': {
			pattern: /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
			inside: {
				'class-name': className,
				'keyword': keywords,
				'punctuation': /[<>(),.:]/,
				'operator': /[?&|]/
			}
		},
		'namespace': {
			pattern: RegExp(
				/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z\u4e00-\u9fa5]\w*(?:\.[a-z\u4e00-\u9fa5]\w*)*\.?/
					.source.replace(/<keyword>/g, function () { return keywords.source; })),
			lookbehind: true,
			inside: {
				'punctuation': /\./,
			}
		}
	});
}(Prism));
