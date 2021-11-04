"use strict"

// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
new Swiper('.page-slider__container', {
	// Стрелки
	navigation: {
		nextEl: '.page-slider__swiper-button-next',
		prevEl: '.page-slider__swiper-button-prev',
	},
	// Навигация
	// Буллеты, текущее положение, прогрессбар
	pagination: {
		el: '.page-slider__swiper-pagination',

		// Буллеты
		clickable: true,

		// Динамические буллеты
		dynamicBullets: true,

	},

	// Включение/отключение свайпа на пк
	simulateTouch: true,
	// Чувствительность свайпа
	touchRatio: 1,
	// Угол срабатывания свайпа
	touchAngle: 45,
	// Курсор перетаскивания
	grabCursor: true,

	// Переключение при клике на слайд
	slideToClickedSlide: true,

	// Навигация по хешу
	hashNavigation: {
		// Отслеживать состояние
		watchState: true,
	},
	// Управление клавиатурой
	keyboard: {
		// Включить/выключить
		enabled: true,
		// Включить/выключить
		// только когда слайдер
		// в пределах вьюпорта
		onlyInViewport: true,
		// Включить/выключить
		// управление клавишами
		// pageUP, pageDown
		pageUpDown: true,
	},



	// Автовысота
	autoHeight: false,

	// Количество слайдов для показа
	slidesPerView: 1,

	// Отключение функционала
	// если слайдов меньше чем нужно
	//watchOverflow: true,

	// Отступ между слайдами
	spaceBetween: 30,

	// Количество пролистываемых слайдов
	slidesPerGroup: 1,

	// Активный слайд по центру
	//centeredSlides: true,

	// Стартовый слайд
	//initialSlide: 0,

	// Мультирядность
	slidesPercolumn: 1,

	// Бесконечный слайдер
	loop: false,

	// Количество дулирующих слайдов
	loopedSlides: 1,

	// Свободный режим
	freeMode: false,

	// Автопрокрутка
	autoplay: {
		// Пауза между прокруткой
		delay: 1000, //ms
		// Закончить на последнем слайде
		stopOnLastSlide: false,
		// Включить\отключить после ручного переключения
		disableOnInteraction: false,
	},


	// Скорость смены слайдов
	speed: 800,
	// Вертикальное расположение
	//direction: 'vertical',

	// Эффекты переключения слайдов:
	// / Листание
	effect: 'slide',

	// Брейк поинты (адаптив)
	// Ширина экрана
	breakpoints: {
		320: {
			slidesPerView: 1,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
		1500: {
			slidesPerView: 4,
			spaceBetween: 30,
		},
	},


});


new Swiper('.constructor-form-center-slider', {
	// Стрелки
	navigation: {
		nextEl: '.constructor-form-center-slider__swiper-button-next',
		prevEl: '.constructor-form-center-slider__swiper-button-prev',
	},
	// Навигация
	// Буллеты, текущее положение, прогрессбар
	pagination: {
		el: '.constructor-form-center-slider__pagination',

		// Буллеты
		clickable: true,

		// Динамические буллеты
		dynamicBullets: true,

	},

	// Включение/отключение свайпа на пк
	simulateTouch: true,
	// Чувствительность свайпа
	touchRatio: 1,
	// Угол срабатывания свайпа
	touchAngle: 45,
	// Курсор перетаскивания
	grabCursor: true,


	// Навигация по хешу
	hashNavigation: {
		// Отслеживать состояние
		watchState: true,
	},
	// Управление клавиатурой
	keyboard: {
		// Включить/выключить
		enabled: true,
		// Включить/выключить
		// только когда слайдер
		// в пределах вьюпорта
		onlyInViewport: true,
		// Включить/выключить
		// управление клавишами
		// pageUP, pageDown
		pageUpDown: true,
	},



	// Автовысота
	autoHeight: false,

	// Количество слайдов для показа
	slidesPerView: 3,

	// Отключение функционала
	// если слайдов меньше чем нужно
	//watchOverflow: true,

	// Отступ между слайдами
	spaceBetween: 30,

	// Количество пролистываемых слайдов
	slidesPerGroup: 1,

	// Активный слайд по центру
	centeredSlides: true,

	// Стартовый слайд
	//initialSlide: 0,

	// Мультирядность
	slidesPercolumn: 1,

	// Бесконечный слайдер
	loop: false,

	// Количество дулирующих слайдов
	loopedSlides: 1,

	// Свободный режим
	freeMode: false,

	// Скорость смены слайдов
	speed: 800,
	// Вертикальное расположение
	//direction: 'vertical',

	// Эффекты переключения слайдов:
	// / Листание
	effect: 'slide',

	// Брейк поинты (адаптив)
	// Ширина экрана
	breakpoints: {
		0: {
			slidesPerView: 1,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 20,
		},
		1500: {
			slidesPerView: 4,
			spaceBetween: 30,
		},
	},
});
"use strict"

// Меню бургер
const iconMenu = document.querySelector('.icon-burger');
const menuBody = document.querySelector('.center-header');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {

		document.body.classList.toggle('_lockburger');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	})
}





const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding');

let unlock = true;

const timeout = 300;

if (popupLinks.length > 0) {
	for (let index = 0; index < popupLinks.length; index++) {
		const popupLink = popupLinks[index];
		popupLink.addEventListener('click', function (e) {
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener('click', function (e) {
			if (!e.target.closest('.popup__content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}
function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}
function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('_lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('_lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});
// Прокрутка при клике
const menuLinks = document.querySelectorAll('.anim__link[data-goto]');
if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener('click', onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset;

			if (iconMenu.classList.contains('_active')) {
				document.body.classList.remove('_lockburger');
				iconMenu.classList.remove('_active');
				menuBody.classList.remove('_active');
			}
			window.scrollTo({
				top: gotoBlockValue,
				behavior: 'smooth'
			}),
				e.preventDefault();
		}
	}
};

// What

const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll() {
		for (let index = 0; index < animItems.length; index++) {
			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 4;

			let animItemPoint = window.innerHeight - animItemHeight / animStart;

			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
				animItem.classList.add('_active');
			} else {
				if (!animItem.classList.contains('_anim-no-hide')) {
					animItem.classList.remove('_active');
				}

			}
		}
	}
	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}
	setTimeout(() => {
		animOnScroll();
	}, 300)
}

document.addEventListener('DOMContentLoaded', function () {
	const forms = document.querySelectorAll('form');

	let form;
	forms.forEach(function (item, index) {
		item.addEventListener('submit', function (e) {
			e.preventDefault();


			if (item.id == 'form-telephone') {
				form = item;
				formSend(form)
			}
			if (item.id == 'form-zamer') {
				form = item;
				formSend(form)
			}
			if (item.id == 'form-calculation') {
				form = item;
				formSend(form)
			}
			if (item.id == 'form-constructor') {
				form = item;
				formSend(form)
			}
		});

	});



	async function formSend(form) {

		let error = formValidate(form);

		let formData = new FormData(form);


		if (error === 0) {
			form.parentNode.classList.add('_sending');
			let response = await fetch('../sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				alert(result.message);
				form.reset();
				form.parentNode.classList.remove('_sending');
			} else {
				alert('Ошибка')
				form.parentNode.classList.remove('_sending');
			}
		} else {
			alert('Заполните обязательные поля')
		}
	}

	function formValidate(form) {
		let error = 0;

		let formReq = form.querySelectorAll('._reg');

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input)

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			} else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
				formAddError(input);
				error++;
			} else {
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}

		return error;
	};

	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
	};
	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	};
	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value)
	};

	// Подпись в label выбора файла
	let inputs = document.querySelectorAll('.inputfile');

	Array.prototype.forEach.call(inputs, function (input) {
		let label = input.nextElementSibling,
			labelVal = label.innerHTML;

		input.addEventListener('change', function (e) {
			let fileName = '';
			if (this.files && this.files.length > 1)
				fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
			else
				fileName = this.files[0].name;

			if (fileName) {
				let labelSpan = label.querySelector('span');
				labelSpan.innerHTML = fileName;
				labelSpan.classList.remove('_icon-search');
			} else {
				label.innerHTML = labelVal;
			}
		});
	});



	// const formImage = document.querySelector('.form-file__image');
	// const formPreview = document.getElementById('form-file__preview');

	// formImage.addEventListener('change', () => {
	// 	uploadFile(formImage.files[0])
	// });


	// function uploadFile(file) {
	// 	if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
	// 		alert('Разрешены только изображения.');
	// 		formImage.value = '';
	// 		return;
	// 	}
	// 	if (file.size > 2 * 1024 * 1024) {
	// 		alert('Файл должен быть менее 2 МБ.');

	// 	} else {

	// 	}
	// }
})



function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});


// Анимация открытия шкафа

let btnNexts = document.querySelectorAll('.btn-next');
let btnBacks = document.querySelectorAll('.btn-back');
let shkafContents = document.querySelectorAll('.page-shkaf__content');
let pageShkafImg = document.querySelectorAll('.page-shkaf__img');
let backShkafImg = document.querySelectorAll('.back-shkaf__img');


pageShkafImg.forEach(function (item, index) {
	item.addEventListener('click', function (e) {
		shkafContents[index].classList.add('_active')
	});
});

backShkafImg.forEach(function (item, index) {
	item.addEventListener('click', function (e) {
		item.parentNode.parentNode.parentNode.classList.remove('_active')
	});
});

btnNexts.forEach(function (item, index) {
	item.addEventListener('click', function (e) {
		e.preventDefault();
		shkafContents[index].classList.add('_active')
	});
});

btnBacks.forEach(function (item, index) {
	item.addEventListener('click', function (e) {
		e.preventDefault();
		shkafContents[index].classList.remove('_active')
	});
});

// Получение приблизительной цены

var inp = document.getElementsByName('group');

inp.forEach(function (item, index) {
	item.addEventListener('click', function (e) {
		let constructorForm = document.getElementById('constructorform');
		constructorForm.classList.add('_active')
		let inputHeight;
		let volumeHeight;
		let inputWidth;
		let volumeWidth;
		let inputDepth;
		let volumeDepth;
		let inputBoxes;
		let volumeBoxes;
		let inputShkaf;
		let resultsConstructor;
		let baseHeight = 200;;
		let baseWidth;
		let baseDepth = 40;
		let base;
		let step;
		if (item.id == 'one') {
			inputHeight = constructorForm.elements.oneuserheigt;
			volumeHeight = document.querySelector('#onevolumeuserheigt');
			inputWidth = constructorForm.elements.oneuserwidth;
			volumeWidth = document.querySelector('#onevolumeuserwidth');
			inputDepth = constructorForm.elements.oneuserdepth;
			volumeDepth = document.querySelector('#onevolumeuserdepth');
			inputBoxes = constructorForm.elements.oneuserboxes;
			volumeBoxes = document.querySelector('#onevolumeuserboxes');
			inputShkaf = constructorForm.elements.onesliderinput;
			resultsConstructor = document.querySelector('#oneconstructorformlabel');
			baseWidth = 100;
			base = 15900;
			step = 500;
		}
		if (item.id == 'two') {
			inputHeight = constructorForm.elements.twouserheigt;
			volumeHeight = document.querySelector('#twovolumeuserheigt');
			inputWidth = constructorForm.elements.twouserwidth;
			volumeWidth = document.querySelector('#twovolumeuserwidth');
			inputDepth = constructorForm.elements.twouserdepth;
			volumeDepth = document.querySelector('#twovolumeuserdepth');
			inputBoxes = constructorForm.elements.twouserboxes;
			volumeBoxes = document.querySelector('#twovolumeuserboxes');
			inputShkaf = constructorForm.elements.twosliderinput;
			resultsConstructor = document.querySelector('#twoconstructorformlabel');
			baseWidth = 160;
			base = 24900;
			step = 800;
		}
		if (item.id == 'three') {
			inputHeight = constructorForm.elements.threeuserheigt;
			volumeHeight = document.querySelector('#threevolumeuserheigt');
			inputWidth = constructorForm.elements.threeuserwidth;
			volumeWidth = document.querySelector('#threevolumeuserwidth');
			inputDepth = constructorForm.elements.threeuserdepth;
			volumeDepth = document.querySelector('#threevolumeuserdepth');
			inputBoxes = constructorForm.elements.threeuserboxes;
			volumeBoxes = document.querySelector('#threevolumeuserboxes');
			inputShkaf = constructorForm.elements.threesliderinput;
			resultsConstructor = document.querySelector('#threeconstructorformlabel');
			baseWidth = 260;
			base = 29900;
			step = 1000;
		}

		let valueHeight = inputHeight.value;
		let valueWidth = inputWidth.value;
		let valueDepth = inputDepth.value;
		let valueBoxes = inputBoxes.value;
		let valueShkaf = inputShkaf.value;
		inputShkaf.forEach(function (item, index) {
			item.addEventListener('click', function (e) {
				valueShkaf = inputShkaf[index].value;
				mathConstructor()
			});
		});

		inputHeight.oninput = function () {
			valueHeight = inputHeight.value;
			volumeHeight.value = valueHeight;
			mathConstructor()
		};
		inputWidth.oninput = function () {
			valueWidth = inputWidth.value;
			volumeWidth.value = valueWidth;
			mathConstructor()
		};
		inputDepth.oninput = function () {
			valueDepth = inputDepth.value
			volumeDepth.value = valueDepth;
			mathConstructor()
		};
		inputBoxes.oninput = function () {
			valueBoxes = inputBoxes.value
			volumeBoxes.value = valueBoxes;
			mathConstructor()
		};

		function mathConstructor() {
			let sumConstructor = parseInt((base + (parseInt((valueHeight - baseHeight) / 10 * step) + parseInt((valueWidth - baseWidth) / 10 * step) + parseInt((valueDepth - baseDepth) / 10 * step) + parseInt(valueBoxes * 2500))) * parseFloat(valueShkaf * 1));
			resultsConstructor.querySelector('span').innerHTML = sumConstructor.toLocaleString();
		}
	});
});

// отправка заказа

let constructorFormButtons = document.querySelectorAll('.constructor-form-bottom__button');

constructorFormButtons.forEach(function (item, index) {
	item.addEventListener('click', function (e) {
		e.preventDefault()
		let constructorForm = document.getElementById('constructorform');
		let formConstructorType = document.querySelector('.form-constructor__type');
		let formConstructorWidth = document.querySelector('.form-constructor__width');
		let formConstructorHeight = document.querySelector('.form-constructor__height');
		let formConstructorDepth = document.querySelector('.form-constructor__depth');
		let formConstructorBoxes = document.querySelector('.form-constructor__boxes');
		let formConstructorDoors = document.querySelector('.form-constructor__doors');

		let inputWidth;
		let inputHeight;
		let inputDepth;
		let inputBoxes;
		let inputShkaf;
		let nameShkaf;
		if (index === 0) {
			inputWidth = constructorForm.elements.oneuserwidth.value;
			inputHeight = constructorForm.elements.oneuserheigt.value;
			inputDepth = constructorForm.elements.oneuserdepth.value;
			inputBoxes = constructorForm.elements.oneuserboxes.value;
			inputShkaf = constructorForm.elements.onesliderinput;
			inputShkaf.forEach(function (item, index) {
				if (inputShkaf[index].checked == true) {
					nameShkaf = item.previousElementSibling.innerHTML;
				}
			})

			formConstructorType.innerHTML = 'Вы выбрали двуххдверный шкаф купе';
			formConstructorWidth.querySelector('span').innerHTML = inputWidth;
			formConstructorHeight.querySelector('span').innerHTML = inputHeight;
			formConstructorDepth.querySelector('span').innerHTML = inputDepth;
			formConstructorBoxes.querySelector('span').innerHTML = inputBoxes;
			formConstructorDoors.querySelector('span').innerHTML = nameShkaf;

		};
		if (index === 1) {
			inputWidth = constructorForm.elements.twouserwidth.value;
			inputHeight = constructorForm.elements.twouserheigt.value;
			inputDepth = constructorForm.elements.twouserdepth.value;
			inputBoxes = constructorForm.elements.twouserboxes.value;
			inputShkaf = constructorForm.elements.twosliderinput;
			inputShkaf.forEach(function (item, index) {
				if (inputShkaf[index].checked == true) {
					nameShkaf = item.previousElementSibling.innerHTML;
				}
			})

			formConstructorType.innerHTML = 'Вы выбрали трехдверный шкаф купе';
			formConstructorWidth.querySelector('span').innerHTML = inputWidth;
			formConstructorHeight.querySelector('span').innerHTML = inputHeight;
			formConstructorDepth.querySelector('span').innerHTML = inputDepth;
			formConstructorBoxes.querySelector('span').innerHTML = inputBoxes;
			formConstructorDoors.querySelector('span').innerHTML = nameShkaf;
		};
		if (index === 2) {
			inputWidth = constructorForm.elements.threeuserwidth.value;
			inputHeight = constructorForm.elements.threeuserheigt.value;
			inputDepth = constructorForm.elements.threeuserdepth.value;
			inputBoxes = constructorForm.elements.threeuserboxes.value;
			inputShkaf = constructorForm.elements.threesliderinput;
			inputShkaf.forEach(function (item, index) {
				if (inputShkaf[index].checked == true) {
					nameShkaf = item.previousElementSibling.innerHTML;
				}
			})

			formConstructorType.innerHTML = 'Вы выбрали четырехдверный шкаф купе';
			formConstructorWidth.querySelector('span').innerHTML = inputWidth;
			formConstructorHeight.querySelector('span').innerHTML = inputHeight;
			formConstructorDepth.querySelector('span').innerHTML = inputDepth;
			formConstructorBoxes.querySelector('span').innerHTML = inputBoxes;
			formConstructorDoors.querySelector('span').innerHTML = nameShkaf;
		};
	})
});