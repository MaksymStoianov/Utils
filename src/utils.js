/**
 * MIT License
 *
 * Copyright (c) 2023 Maksym Stoianov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * @class               Utils
 * @namespace           Utils
 * @version             1.6.0
 * @author              Maksym Stoianov <stoianov.maksym@gmail.com>
 * @license             MIT
 * @tutorial            https://maksymstoianov.com/
 * @see                 [GitHub](https://github.com/MaksymStoianov/Utils)
 * @see                 https://github.com/lodash/lodash/tree/main/src
 */
class Utils {
	/**
	 * Частный метод для проверки сигнатуры метода.
	 * @param {...*} args Аргументы для проверки типов.
	 * @return {function} Возвращает функцию для проверки сигнатуры.
	 */
	static checkSignature(...args) {
		const types = args.map((item) => this.getType(item));

		/**
		 * Функция для проверки сигнатуры.
		 * @param {...string} signature Ожидаемые типы аргументов.
		 * @return {boolean} Возвращает `true`, если все проверки прошли успешно.
		 */
		const checkSignature = function (...signature) {
			if (args.length !== signature.length) return false;

			for (let i = 0; i < signature.length; i++) {
				// NOTE null используется для обозначения любого типа.
				if (!(signature[i] === null || signature[i] === types[i])) {
					return false;
				}
			}

			return true;
		};

		/**
		 * Возвращает список типов аргументов (сигнатуру).
		 * @param {string} [hint = 'string'] Строковый аргумент, который передаёт желаемый тип: `string` или `Array`.
		 * @return {(Array<string>|string)}
		 */
		checkSignature.getSignature = function (hint) {
			return hint !== "Array" ? types.join(", ") : types;
		};

		/**
		 * Проверяет сигнатуру и возвращает `true` или `false`.
		 * @param {...string} signature Ожидаемые типы аргументов.
		 * @return {boolean} `true`, если сигнатура совпадает, иначе `false`.
		 */
		checkSignature.checkSignature = function (...signature) {
			return checkSignature(...signature);
		};

		/**
		 * Проверяет сигнатуру и выбрасывает исключение, если сигнатура не совпадает.
		 * @param {...string} signature Ожидаемые типы аргументов.
		 * @throws {Error} Если сигнатура не совпадает.
		 */
		checkSignature.validate = function (...signature) {
			if (!checkSignature(...signature)) {
				throw new Error(
					`The parameters (${types.join(", ")}) don't match the expected signature (${signature.join(", ")}).`
				);
			}

			return true;
		};

		return checkSignature;
	}

	/**
	 * Возвращает тип аргумента.
	 * @param {*} input Значение для которого нужно получить тип.
	 * @return {string} Строковое представление типа значения.
	 */
	static getType(input) {
		if (!arguments.length) {
			throw new Error(
				`The parameters () don't match any method signature for ${this.name}.getType.`
			);
		}

		let type = typeof input;

		if (type === "object" && input === null) {
			type = "null";
		} else if (
			type === "function" &&
			input?.prototype?.constructor === input &&
			typeof input?.name === "string" &&
			(((input) => input === input?.toUpperCase())(input?.name?.charAt(0)) ||
				new RegExp(`^class\\s+${input?.name}\\s+\\{`).test(String(input)))
		) {
			// Класс
			type = input.name;
		} else if (
			type === "object" &&
			input?.constructor?.name &&
			((input) => input === input.toUpperCase())(
				input.constructor?.name?.charAt(0)
			)
		) {
			// Экземпляр класса
			type = input.constructor.name;
		} else if (type === "object") {
			type = Object.prototype.toString.call(input).slice(8, -1);
		}

		return type;
	}

	/**
	 * Преобразует значение в строку с помощью `Object.prototype.toString`.
	 * @param {*} input Значение для преобразования.
	 * @return {string} Строковое представление типа значения.
	 */
	static getStringTag(input) {
		this.checkSignature(...arguments).validate(null);

		return Object.prototype.toString.call(input);
	}

	/**
	 * Проверяет, является ли значение массивом.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение массив, иначе `false`.
	 */
	static isArray(input) {
		this.checkSignature(...arguments).validate(null);

		return Array.isArray(input);
	}

	/**
	 * Проверяет, является ли значение "подобным массиву".
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение подобно массиву, иначе `false`.
	 */
	static isArrayLike(input) {
		this.checkSignature(...arguments).validate(null);

		return (
			input != null && this.isLength(input.length) && !this.isFunction(input)
		);
	}

	/**
	 * Проверяет, является ли значение булевым.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение булево, иначе `false`.
	 */
	static isBoolean(input) {
		this.checkSignature(...arguments).validate(null);

		return this.getStringTag(input) === this.StringTag.BOOLEAN;
	}

	/**
	 * Проверяет, является ли значение датой.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение дата, иначе `false`.
	 */
	static isDate(input) {
		this.checkSignature(...arguments).validate(null);

		return (
			this.isObjectLike(input) &&
			this.getStringTag(input) == this.StringTag.DATE
		);
	}

	/**
	 * Проверяет, является ли значение пустым (`null`, `undefined`, пустой массив, объект без свойств).
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение пустое, иначе `false`.
	 */
	static isEmpty(input) {
		// TODO `isEmpty()`
		this.checkSignature(...arguments).validate(null);

		if (input == null) {
			return true;
		}

		if (
			this.isArrayLike(input) &&
			(this.isArray(input) ||
				this.isString(input) ||
				this.isFunction(input.splice))
		) {
			return !input.length;
		}

		if (
			[this.StringTag.MAP, this.StringTag.SET].includes(
				this.getStringTag(input)
			)
		) {
			return !input.size;
		}

		for (const key in input) {
			if (Object.prototype.hasOwnProperty.call(input, key)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Проверяет, является ли значение ошибкой.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение ошибка, иначе `false`.
	 */
	static isError(input) {
		this.checkSignature(...arguments).validate(null);

		if (input instanceof Error) {
			return true;
		}

		if (!this.isObjectLike(input)) {
			return false;
		}

		return (
			this.getStringTag(input) === this.StringTag.ERROR ||
			(this.isString(input.message) &&
				this.isString(input.name) &&
				!this.isObject(input))
		);
	}

	/**
	 * Проверяет, является ли значение конечным числом.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение конечное число, иначе `false`.
	 */
	static isFinite(input) {
		this.checkSignature(...arguments).validate(null);

		return Number.isFinite(input);
	}

	/**
	 * Проверяет, является ли значение числом с плавающей точкой.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение число с плавающей точкой, иначе `false`.
	 */
	static isFloat(input) {
		this.checkSignature(...arguments).validate(null);

		return (
			this.isNumber(input) &&
			!this.isInteger(input) &&
			!this.isNaN(input) &&
			this.isFinite(input)
		);
	}

	/**
	 * Проверяет, является ли значение функцией.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение функция, иначе `false`.
	 */
	static isFunction(input) {
		this.checkSignature(...arguments).validate(null);

		return [
			this.StringTag.FUNCTION,
			this.StringTag.ASYNC_FUNCTION,
			this.StringTag.GENERATOR_FUNCTION,
			this.StringTag.PROXY
		].includes(this.getStringTag(input));
	}

	/**
	 * Проверяет, является ли значение классом.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение класс, иначе `false`.
	 */
	static isClass(input) {
		this.checkSignature(...arguments).validate(null);

		return (
			this.isFunction(input) &&
			input?.prototype?.constructor === input &&
			(((input) => input === input.toUpperCase())(input.name.charAt(0)) ||
				new RegExp(`^class\\s+${input.name}\\s+\\{`).test(String(input)))
		);
	}

	/**
	 * Проверяет, является ли значение целым числом.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение целое число, иначе `false`.
	 */
	static isInteger(input) {
		this.checkSignature(...arguments).validate(null);

		return Number.isInteger(input);
	}

	/**
	 * Проверяет, является ли значение допустимой длиной (для массивов, строк).
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение допустимая длина, иначе `false`.
	 */
	static isLength(input) {
		this.checkSignature(...arguments).validate(null);

		return (
			this.isNumber(input) &&
			input > -1 &&
			input % 1 === 0 &&
			input <= Number.MAX_SAFE_INTEGER
		);
	}

	/**
	 * Проверяет, является ли значение `NaN`.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение `NaN`, иначе `false`.
	 */
	static isNaN(input) {
		this.checkSignature(...arguments).validate(null);

		return Number.isNaN(input);
	}

	/**
	 * Проверяет, является ли значение `null` или `undefined`.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение `null` или `undefined`, иначе `false`.
	 */
	static isNil(input) {
		this.checkSignature(...arguments).validate(null);

		return input == null;
	}

	/**
	 * Проверяет, является ли значение `null`.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение `null`, иначе `false`.
	 */
	static isNull(input) {
		this.checkSignature(...arguments).validate(null);

		return input === null;
	}

	/**
	 * Проверяет, является ли значение числом.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение число, иначе `false`.
	 */
	static isNumber(input) {
		this.checkSignature(...arguments).validate(null);

		return typeof input === "number" && !this.isNaN(input);
	}

	/**
	 * Проверяет, является ли значение числом в более широком смысле.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение число, иначе `false`.
	 */
	static isNumberLike(input) {
		this.checkSignature(...arguments).validate(null);

		return (
			(typeof input === "number" && !this.isNaN(input)) ||
			(typeof input === "string" &&
				input.trim().length &&
				!Number.isNaN(Number(input)) &&
				Number.isFinite(Number(input)))
		);
	}

	/**
	 * Проверяет, является ли значение простым объектом.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение простой объект, иначе `false`.
	 */
	static isObject(input) {
		this.checkSignature(...arguments).validate(null);

		return (
			input !== null &&
			typeof input === "object" &&
			input.constructor === Object
		);
	}

	/**
	 * Проверяет, является ли значение объектом в более широком смысле.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение объект, иначе `false`.
	 */
	static isObjectLike(input) {
		this.checkSignature(...arguments).validate(null);

		return (
			input !== null && (typeof input === "object" || this.isFunction(input))
		);
	}

	/**
	 * Проверяет, является ли значение регулярным выражением.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение регулярное выражение, иначе `false`.
	 */
	static isRegExp(input) {
		this.checkSignature(...arguments).validate(null);

		return this.getStringTag(input) === this.StringTag.REG_EXP;
	}

	/**
	 * Проверяет, является ли значение строкой.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение строка, иначе `false`.
	 */
	static isString(input) {
		this.checkSignature(...arguments).validate(null);

		return typeof input === "string" || input instanceof String;
	}

	/**
	 * Проверяет, является ли значение символом.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение символ, иначе `false`.
	 */
	static isSymbol(input) {
		this.checkSignature(...arguments).validate(null);

		return typeof input === "symbol";
	}

	/**
	 * Проверяет, является ли значение `undefined`.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение `undefined`, иначе `false`.
	 */
	static isUndefined(input) {
		this.checkSignature(...arguments).validate(null);

		return input === undefined;
	}

	/**
	 * Проверяет, является ли значение скалярным типом (строка, число, булево значение, символ).
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение скаляр, иначе `false`.
	 */
	static isScalar(input) {
		this.checkSignature(...arguments).validate(null);

		return /string|number|boolean|symbol/.test(typeof input);
	}

	/**
	 * Проверяет, является ли значение итерируемым объектом.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение итерируемо, иначе `false`.
	 */
	static isIterable(input) {
		this.checkSignature(...arguments).validate(null);

		return input != null && typeof input[Symbol.iterator] === "function";
	}

	/**
	 * Проверяет, является ли значение счётным (имеет свойство `length`).
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение счётное, иначе `false`.
	 */
	static isCountable(input) {
		this.checkSignature(...arguments).validate(null);

		return (
			(Array.isArray(input) ||
				typeof input === "string" ||
				this.isIterable(input)) &&
			typeof input.length === "number"
		);
	}

	/**
	 * Проверяет, является ли значение допустимым адресом электронной почты.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение email, иначе `false`.
	 */
	static isEmail(input) {
		this.checkSignature(...arguments).validate("string");

		const regExp = /^[a-z0-9._]+[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

		return regExp.test(input);
	}

	/**
	 * Проверяет, является ли значение допустимым url.
	 * @param {*} input Значение для проверки.
	 * @return {boolean} `true`, если значение url, иначе `false`.
	 */
	static isUrl() {
		// TODO `isUrl()`
		throw new Error(`Метод ${this.name}.isUrl еще в разработке!`);
	}

	/* SpreadsheetApp */

	/**
	 * Проверяет, является ли заданное значение объектом типа [`Spreadsheet`](https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet).
	 * @param {*} input Значение для проверки.
	 * @return {boolean}
	 */
	static isSpreadsheet(input) {
		this.checkSignature(...arguments).validate("Object");

		return input === Object(input) && input?.toString() === "Spreadsheet";
	}

	/**
	 * Проверяет, является ли заданное значение объектом типа [`Sheet`](https://developers.google.com/apps-script/reference/spreadsheet/sheet).
	 * @param {*} input Значение для проверки.
	 * @return {boolean}
	 */
	static isSheet(input) {
		this.checkSignature(...arguments).validate("Object");

		return input === Object(input) && input?.toString() === "Sheet";
	}

	/**
	 * Проверяет, является ли заданное значение объектом типа [`Range`](https://developers.google.com/apps-script/reference/spreadsheet/range).
	 * @param {*} input Значение для проверки.
	 * @return {boolean}
	 */
	static isRange(input) {
		this.checkSignature(...arguments).validate("Object");

		return input === Object(input) && input?.toString() === "Range";
	}

	/* HtmlService */

	/**
	 * Проверяет, является ли заданное значение объектом типа [`Ui`](https://developers.google.com/apps-script/reference/base/ui.html).
	 * @param {*} input Значение для проверки.
	 * @return {boolean}
	 */
	static isUi(input) {
		this.checkSignature(...arguments).validate("Object");

		return input === Object(input) && input.toString() === "Ui";
	}

	/* */

	/**
	 * Проверяет, является ли имя допустимым идентификатором в `JavaScript`.
	 * @param {string} input Значение для проверки.
	 * @return {boolean} `true`, если значение является допустимым идентификатором, иначе `false`.
	 */
	static isValidIdentifier(input) {
		this.checkSignature(...arguments).validate("string");

		return input.length || /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(input);
	}

	/**
	 * Проверяет, является ли значение допустимой строкой версии.
	 * @param {string} input Значение для проверки.
	 * @return {boolean} `true`, если значение является допустимой версией, иначе `false`.
	 */
	static isValidVersion(input) {
		this.checkSignature(...arguments).validate("string");

		return input.length && /(\d+)(\.\d+)?/.test(input);
	}

	/**
	 * Проверяет, является ли значение ...
	 * @param {string} input Значение для проверки.
	 * @return {boolean}
	 */
	static isValidSlug(input) {
		this.checkSignature(...arguments).validate("string");

		return input.length && /^[a-z][0-9a-z_-]*$/i.test(input);
	}

	/**
	 * Проверяет, является ли значение ...
	 * @param {string} input Значение для проверки.
	 * @return {boolean}
	 */
	static isValidLocale(input) {
		this.checkSignature(...arguments).validate("string");

		return input.length && /^[a-z]{2}$/i.test(input);
	}

	/* */

	/**
	 * Сравнивает две «стандартизованные» строки с номером версии.
	 * @param {string} version1 Номер первой версии.
	 * @param {string} version2 Номер второй версии.
	 * @return {boolean} `-1`, если первая версия меньше второй;
	 * `0`, когда они равны;
	 * `1`, если вторая меньше первой.
	 */
	static versionCompare(version1, version2) {
		this.checkSignature(...arguments).validate("string", "string");

		if (!this.isValidVersion(version1)) {
			throw new TypeError(`The version1 parameter has an invalid value.`);
		}

		if (!this.isValidVersion(version2)) {
			throw new TypeError(`The version2 parameter has an invalid value.`);
		}

		const parse = (string) =>
			string
				.split(".")
				.map(Number)
				.map((item) =>
					Number.isNaN(item) || !Number.isInteger(item) ? 0 : item
				);

		version1 = parse(version1);
		version2 = parse(version2);

		const length = Math.max(version1.length, version2.length);

		for (let i = 0; i < length; i++) {
			const n1 = version1[i] ?? 0;
			const n2 = version2[i] ?? 0;

			if (n1 > n2) {
				return 1;
			}

			if (n2 > n1) {
				return -1;
			}
		}

		return 0;
	}

	/**
	 * Проверяет, совместима ли указанная версия с требуемой версией.
	 * @param {string} currentVersion Текущая версия.
	 * @param {string} requiredVersion Требуемая версия.
	 * @return {boolean} `true`, если версии совместимы, иначе `false`.
	 */
	static isVersionCompatible(currentVersion, requiredVersion) {
		return this.versionCompare(currentVersion, requiredVersion) >= 0;
	}

	/**
	 * Если пользователь подключен к нескольким учетным записям в одном сеансе браузера `google.script.run` может выполняться другой учетной записью, чем инициатор.
	 * @param {string} email Учетная запись, которая запустила отображение пользовательского интерфейса.
	 * @return {Object}
	 */
	static checkMultipleAccount(email) {
		// TODO `checkMultipleAccount()`
		this.checkSignature(...arguments).validate("string");

		if (!this.isEmail(email)) {
			throw new TypeError(
				`Параметры (${typeof email}) не соответствуют сигнатуре статического метода ${this.name}.checkMultipleAccount.`
			);
		}

		// Пользователь, от имени которого запущен скрипт
		const effectiveUserEmail = Session?.getEffectiveUser()
			?.getEmail()
			?.toLowerCase();

		return email.toLowerCase() !== effectiveUserEmail;
	}

	/**
	 * Создает пространство имен в объекте.
	 *
	 * #### Example 1
	 * ```javascript
	 * const namespace = ['1', '2\\.0', '3/4', ['5']];
	 * const result = Utils.namespace({}, namespace);
	 *
	 * console.log(JSON.stringify(result, null, 2));
	 * ```
	 *
	 * #### Example 2
	 * ```javascript
	 * const result = Utils.namespace({}, '1/2.3', '4');
	 *
	 * console.log(JSON.stringify(result, null, 2));
	 * ```
	 * @param {Object} target Целевой объект.
	 * @param {string[]} ...namespace Пространство имен.
	 * @return {Object}
	 */
	static namespace(target, ...namespace) {
		this.checkSignature(target, namespace).validate("Object", "Array");

		if (
			namespace.length === 0 ||
			!namespace.every(
				(item) => typeof item === "string" || Array.isArray(item)
			)
		)
			throw new TypeError(
				`Пространство имен невалидно. Ожидаются строки или массивы строк.`
			);

		/**
		 * @param {*} item
		 * @return
		 */
		const _cleanNamespace = (input) => {
			const regExp1 = /(?<![\\])\.+|(?<![\\])\//;

			input = this.flat(input).map((item) => item.split(regExp1));

			const regExp2 = /\\(\.|\/)/g;

			return this.flat(input)
				.map((item) => (item ? item.trim().replace(regExp2, "$1") : null))
				.filter((item) => item && item.length);
		};

		namespace = _cleanNamespace(namespace);

		let cursor = target;

		for (let i = 0; i < namespace.length; i++) {
			const name = namespace[i].trim();

			if (!cursor[name]) {
				cursor[name] = {};
			}

			cursor = cursor[name];

			if (!["object", "function"].includes(typeof cursor)) {
				throw new TypeError(
					`Метод target.${namespace.slice(0, i + 1).join(".")} имеет тип ${typeof cursor}, а должно быть "Object" или "Function".`
				);
			}
		}

		return target;
	}

	/**
	 * Выпрямляет вложенный объект или массив до заданной глубины.
	 *
	 * #### Example 1
	 * ```javascript
	 * const data = {
	 *   user: {
	 *     name: 'Maksym Stoianov',
	 *     email: 'stoianov.maksym@gmail.com'
	 *   }
	 * };
	 * const result = Utils.flat(data);
	 *
	 * console.log(result);
	 * ```
	 *
	 * #### Example 2
	 * ```javascript
	 * const data = [
	 *   [
	 *     'Maksym Stoianov',
	 *     'stoianov.maksym@gmail.com'
	 *   ]
	 * };
	 * const result = Utils.flat(data);
	 *
	 * console.log(result);
	 * ```
	 * @param {(Object|Array)} input Объект или массив для выпрямления.
	 * @param {number} [depth = Number.MAX_SAFE_INTEGER] Максимальная глубина выпрямления. По умолчанию выпрямляет все уровни.
	 * @return {(Object|Array)} Выпрямленный объект или массив.
	 */
	static flat(input, depth = Number.MAX_SAFE_INTEGER, ...args) {
		const _ = this.checkSignature(input, depth, ...args);

		if (!(_("Object", "number") || _("Array", "number"))) {
			throw new Error(
				`The parameters (${_.getSignature()}) don't match any method signature for ${this.name}.flat.`
			);
		}

		if (!this.isLength(depth)) {
			throw new TypeError(`The depth parameter has an invalid value.`);
		}

		if (this.isObject(input)) {
			let result = {};

			/**
			 * @param {*} input
			 * @param {*} [currentDepth = 0]
			 * @param {*} parent
			 */
			const flatObject = (input, currentDepth = 0, parent) => {
				for (const key in input) {
					const propName = parent ? `${parent}.${key}` : key;
					const propValue = input[key];

					if (this.isObject(propValue) && currentDepth < depth) {
						flatObject(propValue, currentDepth + 1, propName);
					} else {
						result[propName] = propValue;
					}
				}
			};

			flatObject(input);

			return result;
		} else {
			return input.flat(depth);
		}
	}

	/**
	 * Заменяет метки вида `{{key}}`, `{{key:defaultValue}}`, `{{key:defaultValue:format}}` и `{{key.key}}` в тексте на соответствующие значения из объекта полей.
	 * Также поддерживает экранирование символа `:` с помощью `\`.
	 *
	 * __Обратите внимание!__
	 * Если поле с именем `group` не имеет значения, то на выходе:
	 *  - `{{group}}    // ''`
	 *  - `{{group:}}   // '{{group}}'`
	 *  - `{{group::}}  // '{{group}}'`
	 *
	 * #### Example
	 * ```javascript
	 * const fields = {
	 *   user: {
	 *     name: 'Maksym Stoianov',
	 *     email: 'stoianov.maksym@gmail.com'
	 *   },
	 *   date: new Date(),
	 *   count: 5,
	 *   sum: null
	 * };
	 * const message = 'Привет {{user.name}}!\nСегодня: {{date::yyyy-MM-dd HH\\:mm}}.\nCount: {{count:0:%.1f}}.\nSum: {{sum:0:$%.2f}}\nGroup: {{group::}}';
	 * const result = Utils.merge(message, fields);
	 *
	 * console.log(result);
	 * ```
	 * @param {string} [message = ''] Строка, содержащая метки для замены. Если не указана, используется пустая строка.
	 * @param {Object} [fields = {}] Объект, ключи которого соответствуют меткам в тексте, а значения будут использованы для замены.
	 * По умолчанию пустой объект.
	 * Формат меток может быть следующим:
	 *   - `{{date::yyyy-MM-dd}}`: для значений типа `Date`, которые обрабатываются с помощью `Utilities.formatDate`.
	 *   - `{{count::%s}}`: для значений типа `string` или `number`, которые обрабатываются с помощью `Utilities.formatString`.
	 *   - `{{key:defaultValue:format}}`: если ключ отсутствует или значение пустое, используется значение по умолчанию, затем форматируется.
	 * @return {string} Строка с заменёнными метками. Если для метки не найдено соответствующего значения, она остаётся без изменений.
	 */
	static merge(message = "", fields = {}, ...args) {
		this.checkSignature(message, fields, ...args).validate("string", "Object");

		fields = this.flat(fields);

		return message.replace(/{{([^}]+?)}}/g, (match, p1) => {
			try {
				let key, defaultValue, format;

				if (p1.includes(":")) {
					const parts = p1
						.split(/(?<!\\):/)
						.map((part) => part.replace(/\\:/g, ":"));

					// {{key:defaultValue:format}}
					[key, defaultValue, ...format] = parts;

					format = format.length ? format.join(":") : null;

					if (typeof format === "string" && !format.length) {
						format = null;
					}
				} else {
					// {{key}}
					key = p1;
				}

				// Получаем значение из fields или используем defaultValue, если значение отсутствует или пусто
				let value = fields[key];

				if (value === undefined || value === null || value === "") {
					value = defaultValue ?? "";
				}

				if (value instanceof Date) {
					value = this.formatDate(value, format ?? "yyyy-MM-dd");
				} else if (["string", "number"].includes(typeof value)) {
					if (defaultValue === "" && value === "") {
						value = match.replace(/:/g, "");
					} else if (this.isNumberLike(value)) {
						value = Number(value);
					}

					value = this.sprintf(format ?? "%s", value);
				} else if (typeof value === "object") {
					value = JSON.stringify(value);
				}

				return value;
			} catch (error) {
				console.warn(`Ошибка при обработке метки ${match}:`, error.message);
			}

			return match;
		});
	}

	/**
	 * Форматирует строку, используя указанный формат и аргументы.
	 * Синтаксический сахар для `Utilities.formatString`.
	 * @param {string} format Строка формата, содержащая спецификаторы.
	 * @param {...*} args Значения для форматирования.
	 * @return {string} Форматированная строка.
	 */
	static sprintf(format, ...args) {
		return Utilities.formatString(format, ...args);
	}

	/**
	 * Кодирует текст в `HEX`.
	 *
	 * #### Example
	 * ```javascript
	 * const text = "Текст";
	 * const result = Utils.encodeHex(text);
	 *
	 * console.log(result);
	 * ```
	 * @param {string} input Строка для кодирования.
	 * @return {string}
	 */
	static encodeHex(input) {
		let symbols = (input.match(/./g) ?? [])
			// Делаем массив уникальным
			.filter((value, index, self) => self.indexOf(value) === index);

		const regExp = new RegExp("[.*+?^${}()|[]\\]", "g");

		for (const symbol of symbols) {
			input = input.replace(
				new RegExp(symbol.replace(regExp, "\\$&"), "g"),
				`&#x${symbol.charCodeAt(0).toString(16)};`
			);
		}

		return input;
	}

	/**
	 * Декодирует текст в котором есть `HEX`.
	 *
	 * #### Example
	 * ```javascript
	 * const text = "&#x422;&#x435;&#x43a;&#x441;&#x442;";
	 * const result = Utils.decodeHex(text);
	 *
	 * console.log(result);
	 * ```
	 * @param {string} input Строка для кодирования.
	 * @return {string}
	 */
	static decodeHex(input) {
		const hexes = (input.match(/&#.{1,5};/g) ?? [])
			// Делаем массив уникальным
			.filter((value, index, self) => self.indexOf(value) === index);

		for (const hex of hexes) {
			input = input.replace(
				new RegExp(hex, "g"),
				String.fromCharCode(parseInt(hex.replace(/&#x|;/g, ""), 16))
			);
		}

		return input;
	}

	/**
	 * Кодирует символы строки (от `U+00A0` до `U+9999`) в соответствующие HTML-сущности.
	 * @param {string} input Строка для кодирования.
	 * @return {string} Строка с закодированными в HTML-сущности символами.
	 */
	static encodeHtml(input) {
		this.checkSignature(...arguments).validate("string");

		return input.replace(
			/([\u00A0-\u9999<>&])(.|$)/g,
			function (full, char, next) {
				if (char !== "&" || next !== "#") {
					if (/[\u00A0-\u9999<>&]/.test(next)) {
						next = `&#${next.charCodeAt(0)};`;
					}

					return `&#${char.charCodeAt(0)};${next}`;
				}

				return full;
			}
		);
	}

	/**
	 * Декодирует HTML-сущности в строке.
	 * @param {string} input Строка с HTML-сущностями для декодирования.
	 * @return {string} Строка с декодированными HTML-сущностями.
	 */
	static decodeHtml(input) {
		this.checkSignature(...arguments).validate("string");

		return input.replace(/&#([0-9]+);/g, (full, int) =>
			String.fromCharCode(parseInt(int))
		);
	}

	/**
	 * Экранирует HTML-блоки.
	 * @param {string} input
	 * @return {string}
	 */
	static escapeHtml(input) {
		this.checkSignature(...arguments).validate("string");

		return (
			input
				// Амперсанд
				.replace(/&/g, "&amp;")

				// Двойная кавычка
				.replace(/"/g, "&quot;")

				// Одинарная кавычка `&#39;`
				.replace(/'/g, "&#x27;")

				// Меньше чем
				.replace(/</g, "&lt;")

				// Больше чем
				.replace(/>/g, "&gt;")
		);
	}

	/**
	 * Экранирует XML-блоки.
	 * @param {string} input
	 * @return {string}
	 */
	static escapeXml(input) {
		this.checkSignature(...arguments).validate("string");

		return (
			input
				// Амперсанд
				.replace(/&/g, "&amp;")

				// Двойная кавычка
				.replace(/"/g, "&quot;")

				// Одинарная кавычка
				.replace(/'/g, "&#39;")

				// Меньше чем
				.replace(/</g, "&lt;")

				// Больше чем
				.replace(/>/g, "&gt;")
		);
	}

	/**
	 * Экранирует HTML-атрибуты.
	 * @param {string} input
	 * @return {string}
	 */
	static escapeAttr(input) {
		this.checkSignature(...arguments).validate("string");

		return (
			input
				// Амперсанд
				.replace(/&/g, "&amp;")

				// Двойная кавычка
				.replace(/"/g, "&quot;")

				// Одинарная кавычка
				.replace(/'/g, "&#39;")

				// Меньше чем
				.replace(/</g, "&lt;")

				// Больше чем
				.replace(/>/g, "&gt;")
		);
	}

	/**
	 * Экранирует `'`, `"`, `<`, `>`, `&` и исправляет окончания строк.
	 * Он предназначен для использования со встроенным JS (в атрибуте тега, например `onclick="..."`).
	 *
	 * __Обратите внимание!__
	 * Строки должны быть заключены в одинарные кавычки.
	 * @param {string} input
	 * @return {string}
	 */
	static escapeJavaScript(input) {
		this.checkSignature(...arguments).validate("string");

		// Проверка строки на недопустимые символы `UTF-8`.
		let safeText = this.sanitizeUtf8(input);

		// Замена специальных символов HTML
		safeText = this.escapeAttr(safeText);

		// Замена HTML-кодированных одинарных кавычек на обычные.
		safeText = safeText.replace(/&#0*39;/gi, "'").replace(/&#x0*27;/gi, "'");

		// Удаление возврата каретки
		safeText = safeText.replace(/\r/g, "").replace(/\n/g, "");

		// Замена новой строки на \n и экранирование символов
		safeText = safeText.replace(/"/g, '\\"');

		return safeText;
	}

	/**
	 * Экранирует URL-адрес.
	 * @param {string} input
	 * @return {string}
	 */
	static escapeUrl() {
		// TODO `escapeUrl()`
		throw new Error(`Метод ${this.name}.escapeUrl еще в разработке!`);
	}

	/**
	 * Экранирует URL-адрес.
	 * @param {string} input
	 * @return {string}
	 */
	static escapeUrlRaw() {
		// TODO `escapeUrlRaw()`
		throw new Error(`Метод ${this.name}.escapeUrl еще в разработке!`);
	}

	/**
	 * @overload
	 * @param {string} input
	 * @return {string}
	 */
	/**
	 * @overload
	 * @param {RegExp} input
	 * @return {RegExp}
	 */
	static escapeRegExp(input) {
		// TODO `escapeRegExp()`
		this.checkSignature(...arguments).validate("string");

		return input.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
	}

	/**
	 * Удаляет все символы, которые недопустимы для `UTF-8`.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeUtf8(input) {
		this.checkSignature(...arguments).validate("string");

		return unescape(encodeURIComponent(input));
	}

	/**
	 * Удаляет все символы, которые не допускаются в названии локали.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeLocaleName(input) {
		this.checkSignature(...arguments).validate("string");

		return input.replace(/[^a-z0-9_-]/gi, "");
	}

	/**
	 * Удаляет все символы, которые недопустимы для имени HTML-класса.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeHtmlClass(input) {
		this.checkSignature(...arguments).validate("string");

		return input.replace(/[^a-z0-9_-]/gi, "");
	}

	/**
	 * Удаляет все символы, которые недопустимы для имени HTML-тега.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeHtmlTag(input) {
		this.checkSignature(...arguments).validate("string");

		return input.replace(/[^a-z0-9_:]/i, "").toLowerCase();
	}

	/**
	 * Преобразует массив атрибутов в строку атрибутов, которая помещается внутри тега `script`.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeScriptAttrs() {
		// TODO `sanitizeScriptAttrs()`
		throw new Error(`Метод ${this.name}.sanitizeScriptAttrs еще в разработке!`);
	}

	/**
	 * Удаляет все HTML-теги.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeText(input) {
		this.checkSignature(...arguments).validate("string");

		return input.replace(/<\/?[^>]+(>|$)/g, "");
	}

	/**
	 * Удаляет все символы, которые недопустимы в электронном письме.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeEmail() {
		// TODO `sanitizeEmail()`
		throw new Error(`Метод ${this.name}.sanitizeEmail еще в разработке!`);
	}

	/**
	 * Удаляет все символы, которые недопустимы URL-адресе.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeUrl() {
		// TODO `sanitizeUrl()`
		throw new Error(`Метод ${this.name}.sanitizeUrl еще в разработке!`);
	}

	/**
	 * Удаляет все символы, которые недопустимы для типа mime.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeMimeType(input) {
		this.checkSignature(...arguments).validate("string");

		return input.replace(/[^-+*.a-z0-9/]/gi, "");
	}

	/**
	 * Удаляет все символы, которые недопустимы для ключа.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeKey(input) {
		this.checkSignature(...arguments).validate("string");

		return input.replace(/[^a-z0-9_-]/gi, "");
	}

	/**
	 * Удаляет все символы, которые недопустимы имени файла.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeFileName() {
		// TODO `sanitizeFileName()`
		throw new Error(`Метод ${this.name}.sanitizeFileName еще в разработке!`);
	}

	/**
	 * Удаляет все символы, которые недопустимы для текстового поля.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeTextField() {
		// TODO `sanitizeTextField()`
		throw new Error(`Метод ${this.name}.sanitizeTextField еще в разработке!`);
	}

	/**
	 * Удаляет все символы, которые недопустимы для `textarea`.
	 * @param {string} input
	 * @return {string}
	 */
	static sanitizeTextareaField() {
		// TODO `sanitizeTextareaField()`
		throw new Error(
			`Метод ${this.name}.sanitizeTextareaField еще в разработке!`
		);
	}

	/**
	 * Возвращает длину строки в кодировке `UTF-8`, измеряемую в байтах.
	 * @param {string} input Строка, длина которой будет рассчитана в байтах.
	 * @return {Integer} Длина входной строки в байтах.
	 */
	static getByteSize(input) {
		this.checkSignature(...arguments).validate("string");

		return (
			input
				// 0
				// .replace(/[\u{0000}-\u{007F}]/u, '0')

				// 00
				// .replace(/[\u{0080}-\u{07FF}]/u, '0')

				// 000
				// .replace(/[\u{0800}-\u{D7FF}\u{E000}-\u{FFFF}]/u, '0')

				// 0000
				.replace(/[\u{D800}-\u{DFFF}]/u, "00").length
		);
	}

	/**
	 * Создает массив элементов, разбитый на группы длиной `size`.
	 * Если `array` не может быть разбит равномерно, то конечным куском будут оставшиеся элементы.
	 * @param {Array} array Массив для обработки.
	 * @param {number} [size = 1] Длина каждого фрагмента.
	 * @return {Array} Возвращает новый массив фрагментов.
	 */
	static chunk(array, size = 1, ...args) {
		this.checkSignature(array, size, ...args).validate("Array", "number");

		if (!this.isInteger(size)) {
			throw new TypeError(`The size parameter has an invalid value.`);
		}

		size = Math.max(size, 0);

		const length = array == null ? 0 : array.length;

		if (!length || size < 1) {
			return [];
		}

		let index = 0;
		let resIndex = 0;

		const result = new Array(Math.ceil(length / size));

		while (index < length) {
			result[resIndex++] = array.slice(index, (index += size));
		}

		return result;
	}

	/**
	 * Возвращает новую строку, преобразованную в нижний регистр.
	 *
	 * #### Example
	 * ```javascript
	 * const text = "Hello world!";
	 * const result = Utils.toLowerCase(text);
	 *
	 * console.log(result); // hello world!
	 * ```
	 * @param {string} input Исходная строка.
	 * @param {Object} [options = {}]
	 * @param {boolean} [options.trim = false]
	 * @return {string}
	 */
	static toLowerCase(input, options = {}, ...args) {
		this.checkSignature(input, options, ...args).validate("string", "Object");

		let result = input.toLowerCase(input);

		if (options.trim === true) {
			result = result.trim().replace(/\s+/g, "s");
		}

		return result;
	}

	/**
	 * Возвращает новую строку, преобразованную в верхний регистр.
	 *
	 * #### Example
	 * ```javascript
	 * const text = "Hello world!";
	 * const result = Utils.toUpperCase(text);
	 *
	 * console.log(result); // HELLO WORLD!
	 * ```
	 * @param {string} input Исходная строка.
	 * @param {Object} [options = {}]
	 * @param {boolean} [options.trim = false]
	 * @return {string}
	 */
	static toUpperCase(input, options = {}, ...args) {
		this.checkSignature(input, options, ...args).validate("string", "Object");

		let result = input.toUpperCase(input);

		if (options.trim === true) {
			result = result.trim().replace(/\s+/g, "s");
		}

		return result;
	}

	/**
	 * Возвращает новую строку, в которой первая буква каждого слова заглавная, а остальные — строчные.
	 *
	 * #### Example
	 * ```javascript
	 * const text = "Hello world!";
	 * const result = Utils.toProperCase(text);
	 *
	 * console.log(result); // Hello World!
	 * ```
	 * @param {string} input Исходная строка.
	 * @param {Object} [options = {}]
	 * @param {boolean} [options.trim = false]
	 * @return {string}
	 */
	static toProperCase(input, options = {}, ...args) {
		this.checkSignature(input, options, ...args).validate("string", "Object");

		let result = input.replace(
			/\b\w+\b/g,
			(match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
		);

		if (options.trim === true) {
			result = result.trim().replace(/\s+/g, "s");
		}

		return result;
	}

	/**
	 * Возвращает новую строку в формат `kebab-case`.
	 *
	 * `kebab-case` — это стиль написания, в котором слова разделяются дефисами, а все буквы пишутся в нижнем регистре.
	 *
	 * #### Example
	 * ```javascript
	 * const text = "Hello world!";
	 * const result = Utils.toKebabCase(text);
	 *
	 * console.log(result); // hello-world!
	 * ```
	 * @param {string} input Исходная строка.
	 * @param {Object} [options = {}]
	 * @param {boolean} [options.trim = false]
	 * @param {boolean} [options.clean = true]
	 * @return {string}
	 */
	static toKebabCase(input, options = {}, ...args) {
		this.checkSignature(input, options, ...args).validate("string", "Object");

		let result = input
			// Заменяем пробелы и нижнее подчеркивание
			.replace(/[\s_]/g, "-")
			// Заменяем заглавные буквы на малые, добавляя перед ними дефис, но только если это не начало строки
			.replace(/([a-z])([A-Z])/g, "$1-$2")
			// Преобразуем всю строку в нижний регистр
			.toLowerCase();

		if (options.clean !== false) {
			result = result.replace(/[^a-zA-Z0-9-]/g, "");
		}

		if (options.trim === true) {
			result = result.trim().replace(/-+/g, "-");
		}

		return result;
	}

	/**
	 * Возвращает новую строку в формат `snake_case`.
	 *
	 * `snake_case` — это стиль написания, в котором слова разделяются символами подчеркивания (_), а все буквы пишутся в нижнем регистре.
	 *
	 * #### Example
	 * ```javascript
	 * const text = "Hello world!";
	 * const result = Utils.toSnakeCase(text);
	 *
	 * console.log(result); // hello_world!
	 * ```
	 * @param {string} input Исходная строка.
	 * @param {Object} [options = {}]
	 * @param {boolean} [options.trim = false]
	 * @param {boolean} [options.clean = true]
	 * @return {string}
	 */
	static toSnakeCase(input, options = {}, ...args) {
		this.checkSignature(input, options, ...args).validate("string", "Object");

		let result = input
			// Заменяем пробелы и дефисы
			.replace(/[\s-]/g, "_")
			// Заменяем заглавные буквы на малые, добавляя перед ними подчеркивание, но только если это не начало строки
			.replace(/([a-z])([A-Z])/g, "$1_$2")
			// Преобразуем всю строку в нижний регистр
			.toLowerCase();

		if (options.clean !== false) {
			result = result.replace(/[^a-zA-Z0-9_]/g, "");
		}

		if (options.trim === true) {
			result = result.trim().replace(/_+/g, "_");
		}

		return result;
	}

	/**
	 * Возвращает новую строку в формат `camelCase`.
	 *
	 * `camelCase` — это стиль написания, в котором первая буква каждого слова заглавная, а остальные — строчные, и удалены пробелы, дефисы и нижние подчеркивания.
	 *
	 * #### Example
	 * ```javascript
	 * const text = "Hello world!";
	 * const result = Utils.toCamelCase(text);
	 *
	 * console.log(result); // HelloWorld
	 * ```
	 * @param {string} input Исходная строка.
	 * @param {Object} [options = {}]
	 * @param {boolean} [options.clean = true]
	 * @param {boolean} [options.firstWordToLowerCase = true] Начинать ли искомую строку с маленького символа (lowercase).
	 * @return {string}
	 */
	static toCamelCase(input, options = {}, ...args) {
		this.checkSignature(input, options, ...args).validate("string", "Object");

		let result = input
			.replace(
				/\b\w+\b/g,
				(match) => match.charAt(0).toUpperCase() + match.slice(1).toLowerCase()
			)
			// Заменяем пробелы, дефисы и нижнее подчеркивание
			.replace(/[\s-_]+/g, "");

		if (options.clean !== false) {
			result = result.replace(/[^a-zA-Z0-9]/g, "");
		}

		if (options.firstWordToLowerCase !== false) {
			result = result.charAt(0).toLowerCase() + result.slice(1);
		}

		return result;
	}

	/**
	 * Преобразует входное значение в целое число.
	 *
	 * #### Example
	 * ```javascript
	 * console.log(Utils.toInteger('42'));           // 42
	 * console.log(Utils.toInteger('42.5'));         // 42
	 * console.log(Utils.toInteger('abc'));          // null
	 * console.log(Utils.toInteger(null));           // null
	 * console.log(Utils.toInteger(undefined));      // null
	 * console.log(Utils.toInteger(123));            // 123
	 * console.log(Utils.toInteger(0));              // 0
	 * console.log(Utils.toInteger('-15'));          // -15
	 * console.log(Utils.toInteger({}));             // null
	 * console.log(Utils.toInteger([42]));           // 42
	 * console.log(Utils.toInteger([42, 43]));       // null
	 * ```
	 * @param {*} input Входное значение для преобразования в целое число.
	 * @return {Integer} Преобразованное целое число или `null`, если преобразование невозможно.
	 */
	static toInteger(input) {
		this.checkSignature(...arguments).validate(null);

		if (input === null || input === undefined) return null;

		const parsed = parseInt(input, 10);

		if (isNaN(parsed)) return null;

		return parsed;
	}

	/**
	 * Парсит строку `JSON`, включая обработку и исправление ошибок форматирования, которые могут вызвать сбой стандартного парсинга.
	 *
	 * #### Example
	 * ```javascript
	 * const jsonString = `{key: 'value', 'list': [1, 2, 3]}`;
	 * const result = Utils.parseJson(jsonString);
	 * console.log(result);
	 * ```
	 * @param {string} input Строка, содержащая `JSON`, который нужно распарсить.
	 * @return {Object} Возвращает объект, если парсинг удался, или `null`, если `JSON` не удалось распарсить даже после попыток исправления.
	 */
	static parseJson(input) {
		this.checkSignature(...arguments).validate("string");

		try {
			// Пробуем распарсить JSON как есть
			return JSON.parse(input);
		} catch (error) {
			console.warn(error.message);
			// Первичный парсинг не удался, пытаемся исправить JSON...")

			/**
			 * Проверяет, является ли токен валидным ключом.
			 */
			const isValidKey = (token) =>
				/^"[^"]*"$/.test(token) || /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(token);

			/**
			 * Проверяет, является ли токен валидным значением.
			 */
			const isValidValue = (token) =>
				token === "true" ||
				token === "false" ||
				token === "null" ||
				/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(token) ||
				/^"[^"]*"$/.test(token);

			let tokens = [];
			let currentToken = "";
			let isString = false;
			let isEscaped = false;
			let quoteType = null;

			for (let i = 0; i < input.length; i++) {
				let char = input[i];

				if (isEscaped) {
					currentToken += char;
					isEscaped = false;
					continue;
				}

				if (char === "\\") {
					currentToken += char;
					isEscaped = true;
					continue;
				}

				if (char === '"' || char === "'") {
					if (isString) {
						if (char === quoteType) {
							isString = false;
							currentToken += '"';
							tokens.push(currentToken);
							currentToken = "";
						} else {
							currentToken += char;
						}
					} else {
						isString = true;
						quoteType = char;
						currentToken += '"';
					}
				} else if (isString) {
					currentToken += char;
				} else if (char.match(/\s/)) {
					if (currentToken) {
						tokens.push(currentToken);
						currentToken = "";
					}
				} else if ([":", ",", "{", "}", "[", "]"].includes(char)) {
					if (currentToken) {
						tokens.push(currentToken);
						currentToken = "";
					}
					tokens.push(char);
				} else {
					currentToken += char;
				}
			}

			if (currentToken) {
				tokens.push(currentToken);
			}

			let correctedTokens = [];
			let expectingValue = false;
			let expectingKey = false;

			for (let i = 0; i < tokens.length; i++) {
				let token = tokens[i];

				if (token === "{" || token === "[") {
					correctedTokens.push(token);
					expectingKey = token === "{";
					expectingValue = token === "[";
				} else if (token === "}" || token === "]") {
					correctedTokens.push(token);
					expectingValue = false;
					expectingKey = false;
				} else if (token === ":") {
					correctedTokens.push(token);
					expectingValue = true;
					expectingKey = false;
				} else if (token === ",") {
					correctedTokens.push(token);
					expectingKey = correctedTokens[correctedTokens.length - 2] === "}";
					expectingValue = !expectingKey;
				} else if (expectingKey && isValidKey(token)) {
					correctedTokens.push(`"${token.replace(/"/g, "")}"`);
					expectingKey = false;
				} else if (expectingValue && isValidValue(token)) {
					correctedTokens.push(
						token.match(/^'[^']*'$/)
							? `"${token.slice(1, -1).replace(/"/g, '\\"')}"`
							: token
					);
					expectingValue = false;
				} else if (isValidKey(token)) {
					correctedTokens.push(`"${token.replace(/"/g, "")}"`);
				} else if (isValidValue(token)) {
					correctedTokens.push(
						token.match(/^'[^']*'$/)
							? `"${token.slice(1, -1).replace(/"/g, '\\"')}"`
							: token
					);
				} else {
					throw new Error(`Не удается обработать токен: ${token}`);
				}
			}

			let correctedJson = correctedTokens.join("");

			return JSON.parse(correctedJson);
		}
	}

	/**
	 * Транспонирует двумерный массив.
	 *
	 * #### Example
	 * ```javascript
	 * const array = [
	 *   [1, 2, 3],
	 *   [4, 5, 6],
	 *   [7, 8, 9]
	 * ];
	 * const transposedArray = Utils.transpose(array);
	 * // return:
	 * // [
	 * //   [1, 4, 7],
	 * //   [2, 5, 8],
	 * //   [3, 6, 9]
	 * // ]
	 * ```
	 * @param {Array} input
	 * @return {Array<Array<*>>} Транспонированный двумерный массив.
	 */
	static transpose(input) {
		this.checkSignature(...arguments).validate("Array");

		/**
		 * Проверяет, является ли массив двумерным.
		 * @param {Array} arr Массив для проверки.
		 */
		function _checkIf2DArray(arr) {
			if (!arr.length || !Array.isArray(arr[0])) {
				throw new Error("Массив должен быть двумерным.");
			}
		}

		/**
		 * Проверяет, что все подмассивы имеют одинаковую длину.
		 * @param {Array} arr Массив для проверки.
		 */
		function _checkSubArraysLength(arr) {
			const colCount = arr[0].length;

			for (const row of arr) {
				if (!Array.isArray(row) || row.length !== colCount) {
					throw new Error("Все подмассивы должны иметь одинаковую длину.");
				}
			}
		}

		_checkIf2DArray(input);
		_checkSubArraysLength(input);

		/**
		 * Транспонирует массив.
		 * @param {Array} arr Массив для транспонирования.
		 * @return {Array<Array<*>>} Транспонированный массив.
		 */
		function _transposeArray(arr) {
			return arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));
		}

		return _transposeArray(input);
	}

	/**
	 * Получает хеш заданной строки.
	 */
	/**
	 * @overload
	 * @param {string} value Входное значение, для которого создается хэш.
	 * @return {string}
	 */
	/**
	 * @overload
	 * @param {string} key Ключ, используемый для генерации хеша.
	 * @param {string} value  Входное значение, для которого создается хэш.
	 * @return {string}
	 */
	/**
	 * @overload
	 * @param {string} value Входное значение, для которого создается хэш.
	 * @param {string} charset
	 * @return {string}
	 */
	/**
	 * @overload
	 * @param {string} key Ключ, используемый для генерации хеша.
	 * @param {string} value Входное значение, для которого создается хэш.
	 * @param {string} charset [Charset](https://developers.google.com/apps-script/reference/utilities/charset), представляющий входной набор символов.
	 * @return {string}
	 */
	static getHash(...args) {
		const _ = this.checkSignature(...args);

		const _isValidKey = (input) => input.trim().length;
		const _isValidValue = (input) => input.trim().length;
		const _isValidCharset = (input) =>
			[Utilities.Charset.UTF_8, Utilities.Charset.US_ASCII].includes(input);

		let bytes;

		if (_("string")) {
			const [value] = args;

			if (!_isValidValue(value))
				throw new TypeError(`The value parameter has an invalid value.`);

			bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, value);
		} else if (_("string", "Object")) {
			const [value, charset] = args;

			if (!_isValidValue(value))
				throw new TypeError(`The value parameter has an invalid value.`);

			if (!_isValidCharset(charset))
				throw new TypeError(`The charset parameter has an invalid value.`);

			bytes = Utilities.computeDigest(
				Utilities.DigestAlgorithm.MD5,
				value,
				charset
			);
		} else if (_("string", "string")) {
			const [key, value] = args;

			if (!_isValidKey(key))
				throw new TypeError(`The key parameter has an invalid value.`);

			if (!_isValidValue(value))
				throw new TypeError(`The value parameter has an invalid value.`);

			bytes = Utilities.computeHmacSignature(
				Utilities.MacAlgorithm.HMAC_MD5,
				value,
				key
			);
		} else if (_("string", "string", "Object")) {
			const [key, value, charset] = args;

			if (!_isValidKey(key))
				throw new TypeError(`The key parameter has an invalid value.`);

			if (!_isValidValue(value))
				throw new TypeError(`The value parameter has an invalid value.`);

			if (!_isValidCharset(charset))
				throw new TypeError(`The charset parameter has an invalid value.`);

			bytes = Utilities.computeHmacSignature(
				Utilities.MacAlgorithm.HMAC_MD5,
				value,
				key,
				charset
			);
		} else
			throw new Error(
				`Недопустимые аргументы: невозможно определить правильную перегрузку для ${this.name}.getHash.`
			);

		// Преобразование массива байтов в шестнадцатеричную строку.

		let result = "";

		for (let byte of bytes) {
			byte = (byte < 0 ? (byte += 256) : byte).toString(16);

			result += `${byte.length == 1 ? "0" : ""}${byte}`;
		}

		return result;
	}

	/**
	 * Создает криптографический токен, привязанный к определенному действию и пользователю.
	 * @param {string} action Скалярное значение для добавления контекста к одноразовому номеру.
	 * @return {string}
	 */
	static createNonce(action) {
		this.checkSignature(...arguments).validate("string");

		const temporaryKey = Session.getTemporaryActiveUserKey();
		const hash = this.getHash(`${action}|${temporaryKey}`);

		return hash;
	}

	/**
	 * Проверяет, что использовался правильный одноразовый номер безопасности с ограничением по времени.
	 * @param {string} nonce Значение `nonce`, которое использовалось для проверки, обычно через поле формы.
	 * @param {(string|number)} action Должен давать контекст происходящему и быть таким же, когда был создан nonce.
	 * @return {boolean}
	 */
	static verifyNonce(nonce, action = -1) {
		return nonce === this.createNonce(action);
	}

	/**
	 * Рассчитывает разницу между текущей датой и указанной датой и форматирует ее в соответствии с указанным шаблоном.
	 *
	 * #### Example 1
	 * ```javascript
	 * const now = new Date();
	 * const result = Utils.diffDate(now, new Date(), "{{hours}} часов и {{minutes}} минут");
	 * console.log(result);
	 * ```
	 *
	 * #### Example 2
	 * ```javascript
	 * const now = new Date();
	 * const result = Utils.diffDate(now, new Date(), "minutes");
	 * console.log(result);
	 * ```
	 * @param {(string|Date)} date Дата или строка, представляющая дату, с которой сравнивается текущая дата.
	 * @param {string} format Шаблон форматирования с использованием плейсхолдеров.
	 *  - {{years}}
	 *  - {{months}}
	 *  - {{weeks}}
	 *  - {{days}}
	 *  - {{hours}}
	 *  - {{minutes}}
	 *  - {{seconds}}
	 *  - {{milliseconds}}
	 * @return {string} Строка, содержащая разницу между датами в заданном формате.
	 */
	static diffDate(dateStart, date, format) {
		if (!arguments.length)
			throw new Error(
				`Параметры () не соответствуют сигнатуре метода ${this.name}.diffDate.`
			);

		date = new Date(date);

		const units = {
			// Средняя продолжительность года с учетом високосных лет
			years: 1000 * 60 * 60 * 24 * 365.25,

			// Средняя продолжительность месяца
			months: 1000 * 60 * 60 * 24 * 30.44,
			weeks: 1000 * 60 * 60 * 24 * 7,
			days: 1000 * 60 * 60 * 24,
			hours: 1000 * 60 * 60,
			minutes: 1000 * 60,
			seconds: 1000,
			milliseconds: 1
		};

		let timeDifference = Math.abs(dateStart - date);

		if (units[format]) return Math.round(timeDifference / units[format]);
		else {
			/**
			 * @param {string} template
			 */
			function extractPlaceholders(template) {
				const placeholderRegex = /{{(\w+)}}/g;
				const placeholders = [];
				let match;

				while ((match = placeholderRegex.exec(template))) {
					placeholders.push({
						startIndex: match.index,
						endIndex: match.index + match[0].length,
						name: match[1],
						length: match[0].length,
						value: null
					});
				}

				return placeholders;
			}

			let placeholders = extractPlaceholders(format);

			let placeholder_names = [
				...new Set(placeholders.map((item) => item.name))
			].sort((a, b) => units[b] - units[a]);

			let last_placeholder_name =
				placeholder_names[placeholder_names.length - 1];

			// Добавляем значения к плейсхолдерам
			for (const key of Object.keys(units).sort(
				(a, b) => units[b] - units[a]
			)) {
				if (!placeholder_names.includes(key)) continue;

				let value = ((input) =>
					last_placeholder_name === key
						? Math.round(input)
						: Math.floor(input))(timeDifference / units[key]);

				// Оставшаяся часть
				timeDifference %= units[key];

				for (const placeholder of placeholders) {
					if (placeholder.name !== key) continue;

					placeholder.value = value;
				}
			}

			// Заменим все плейсхолдеры на их значения
			for (const { startIndex, endIndex, value } of placeholders.reverse())
				format = format.slice(0, startIndex) + value + format.slice(endIndex);

			return format;
		}
	}

	/**
	 * Форматирует дату в соответствии со спецификацией, описанной в классе [`Java SE SimpleDateFormat`](http://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html).
	 *
	 * #### Example 1
	 * ```javascript
	 * const dateStr = Utils.formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
	 * console.log(dateStr);
	 * ```
	 *
	 * #### Example 2
	 * ```javascript
	 * const dateStr = Utils.formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'", "GMT");
	 * console.log(dateStr);
	 * ```
	 * @param {string} format Формат согласно спецификации `Java SE SimpleDateFormat` (например: `"yyyy-MM-dd'T'HH:mm:ss'Z'"`).
	 * @param {string} [timeZone] Выходной часовой пояс результата (например: `"GMT"`). По умолчанию часовой пояс скрипта.
	 * @return {string} Дата ввода в виде форматированной строки.
	 */
	static formatDate(date, format, timeZone) {
		if (!arguments.length)
			throw new Error(
				`Параметры () не соответствуют сигнатуре метода ${this.name}.formatDate.`
			);

		if (typeof format !== "string") {
			throw new TypeError(
				`Параметры (${typeof format}) не соответствуют сигнатуре метода ${this.name}.formatDate.`
			);
		}

		if (typeof timeZone !== "string") {
			timeZone = Session.getTimeZone();
		}

		return Utilities.formatDate(date, timeZone, format);
	}

	/**
	 * Смещает дату на указанное количество единиц времени (минут, часов, дней, недель, месяцев, лет).
	 *
	 * #### Example
	 * ```javascript
	 * const date = new Date();
	 * const newDate = Utils.offsetDate(date, 1, 'months');
	 * console.log(newDate);
	 * ```
	 * @param {number} input Количество единиц времени для смещения. Может быть положительным или отрицательным числом.
	 * @param {string} type Тип единицы времени для смещения: `minutes`, `hours`, `days`, `weeks`, `months`, `years`.
	 * @return {Date} Новый объект [`Date`](#), представляющий смещенную дату.
	 */
	static offsetDate(date, input, type) {
		if (!arguments.length)
			throw new Error(
				`Параметры () не соответствуют сигнатуре метода ${this.name}.offsetDate.`
			);

		let result = null;

		switch (type) {
			case "years":
				result = new Date(date.setFullYear(date.getFullYear() + input));
				break;

			case "months":
				result = new Date(date.setMonth(date.getMonth() + input));
				break;

			case "weeks":
				result = new Date(date.setDate(date.getDate() + input * 7));
				break;

			case "days":
				result = new Date(date.setDate(date.getDate() + input));
				break;

			case "hours":
				result = new Date(date.setHours(date.getHours() + input));
				break;

			case "minutes":
				result = new Date(date.setMinutes(date.getMinutes() + input));
				break;

			// days
			default:
				result = new Date(date.setDate(date.getDate() + input));
				break;
		}

		return result;
	}

	/**
	 * Генерирует случайный шестнадцатеричный цвет.
	 * @return {string} Случайный шестнадцатеричный цвет в формате "#RRGGBB".
	 */
	static getRandomHexColor() {
		const LETTERS = "0123456789ABCDEF";

		const _getRandomLetter = () => LETTERS[Math.floor(Math.random() * 16)];

		const color = Array.from({ length: 6 }, _getRandomLetter()).join("");

		return `#${color}`;
	}

	constructor() {
		throw new Error(`${this.constructor.name} is not a constructor.`);
	}
}

/**
 * @readonly
 * @enum {string}
 */
Utils.StringTag = {};

Utils.StringTag.ARGUMENTS = "[object Arguments]";
Utils.StringTag.ARRAY = "[object Array]";
Utils.StringTag.ASYNC_FUNCTION = "[object AsyncFunction]";
Utils.StringTag.BOOLEAN = "[object Boolean]";
Utils.StringTag.DATE = "[object Date]";
Utils.StringTag.ERROR = "[object Error]";
Utils.StringTag.FUNCTION = "[object Function]";
Utils.StringTag.GENERATOR_FUNCTION = "[object GeneratorFunction]";
Utils.StringTag.MAP = "[object Map]";
Utils.StringTag.NUMBER = "[object Number]";
Utils.StringTag.NULL = "[object Null]";
Utils.StringTag.OBJECT = "[object Object]";
Utils.StringTag.PROMISE = "[object Promise]";
Utils.StringTag.PROXY = "[object Proxy]";
Utils.StringTag.REG_EXP = "[object RegExp]";
Utils.StringTag.SET = "[object Set]";
Utils.StringTag.STRING = "[object String]";
Utils.StringTag.SYMBOL = "[object Symbol]";
Utils.StringTag.UNDEFINED = "[object Undefined]";
Utils.StringTag.WEAK_MAP = "[object WeakMap]";
Utils.StringTag.WEAK_SET = "[object WeakSet]";

Utils.StringTag.ARRAY_BUFFER = "[object ArrayBuffer]";
Utils.StringTag.DAT_VIEW = "[object DataView]";
Utils.StringTag.FLOAT_32_ARRAY = "[object Float32Array]";
Utils.StringTag.FLOAT_64_ARRAY = "[object Float64Array]";
Utils.StringTag.INT_8_ARRAY = "[object Int8Array]";
Utils.StringTag.INT_16_ARRAY = "[object Int16Array]";
Utils.StringTag.INT_32_ARRAY = "[object Int32Array]";
Utils.StringTag.UINT_8_ARRAY = "[object Uint8Array]";
Utils.StringTag.UINT_8_CLAMPED_ARRAY = "[object Uint8ClampedArray]";
Utils.StringTag.UINT_16_ARRAY = "[object Uint16Array]";
Utils.StringTag.UINT_32_ARRAY = "[object Uint32Array]";
