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
new Swiper('.page-slider', {
	// Стрелки
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	// Навигация
	// Буллеты, текущее положение, прогрессбар
	pagination: {
		el: '.swiper-pagination',
		/*
		// Буллеты
		clickable: true,
		// Динамические буллеты
		dynamicBullets: true,
		// Кастомные буллеты
		renderBullet: function (index, className) {
			return '<span class="' + className + '">' + (index + 1) + '</span>';
		},
		*/

		// Фракция
		type: 'fraction',
		// Кастомные вывод фракции
		renderFraction: function (currentClass, totalClass) {
			return 'Фото <span class="' + currentClass + '"></span>' + ' из ' + '<span class="' + totalClass + '"></span>';
		},

		/*
		// Прогрессбар
		type: 'progressbar'
	*/
	},
	// Скролл
	scrollbar: {
		el: '.swiper-scrollbar',
		// Возможность перетаскивать скролл
		draggable: true
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

	// Управление колесом мыши
	mousewheel: {
		// Чувствительность колеса мыши
		sensitivity: 1,
		// Класс объекта на котором
		// будет срабатывать прокрутка мышью
		eventsTarget: '.image-slider'
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
	freeMode: true,
	/*
		// Автопрокрутка
		autoplay: {
			// Пауза между прокруткой
			delay: 1000, //ms
			// Закончить на последнем слайде
			stopOnLastSlide: true,
			// Включить\отключить после ручного переключения
			disableOnInteraction: false,
		},
		
		
	*/
	// Скорость смены слайдов
	speed: 800,
	// Вертикальное расположение
	//direction: 'vertical',

	// Эффекты переключения слайдов:
	// / Листание
	effect: 'slide',
	/*
	
	// / Смена прозрачности
	effect: 'fade',
	
	// Дополнения к fade
	fadeEffect: {
		// Паралельная смена прозрачности
		crossFade: true,
	}
	
// / Переворот
effect: 'flip',
// Дополнения к flip
flipEffect: {
	// Тень
	slideShadows: true,
	// Показ только активного слайда
	limitRotation: true,
}

// / Куб
effect: 'cube',
// Дополнения к cube
cubeEffect: {
	// Настройка тени
	slideShadows: true,
	shadow: true,
	shadowOffset: 20,
	shadowScale: 0.94,
},

// / Поток
effect: 'coverflow',
// Дополнения к cube
coverflowEffect: {
	// Угол
	rotate: 20,
	// Наложение
	stretch: 50,
	// Тень
	slideShadows: true,
}
*/
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
"use strict"

// Меню бургер
const iconMenu = document.querySelector('.icon-burger');
const menuBody = document.querySelector('.center-header');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		document.body.classList.toggle('_lock');
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
const menuLinks = document.querySelectorAll('.center-header__link[data-goto]');
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
				document.body.classList.remove('_lock');
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


let popupOaasdasdspen = 2
if (popupOaasdasdspen == 3) {
	const DATA = [
		{
			question: 'Вопрос 1',
			answers: [
				{
					id: '1',
					value: 'Ответ 1',
					correct: true,
				},
				{
					id: '2',
					value: 'Ответ 2',
					correct: false,
				},
				{
					id: '3',
					value: 'Ответ 3',
					correct: false,
				}
			]
		},
		{
			question: 'Вопрос 2',
			answers: [
				{
					id: '4',
					value: 'Ответ 4',
					correct: false,
				},
				{
					id: '5',
					value: 'Ответ 5',
					correct: true,
				},
				{
					id: '6',
					value: 'Ответ 6',
					correct: false,
				}
			]
		}
	];
	let localResults = {};

	const quiz = document.getElementById('quiz');
	const questions = document.getElementById('questions');
	const indicator = document.getElementById('indicator');
	const results = document.getElementById('results');
	const btnNextQuiz = document.getElementById('btn-next-quiz');
	const btnRestartQuiz = document.getElementById('btn-restart-quiz');

	const renderQuestions = (index) => {
		renderIndicator(index + 1);

		questions.dataset.currentStep = index;

		const renderAnswers = () => DATA[index].answers
			.map((answer) => `
					<li>
						<label>
							<input class="answer-input" type="radio" name=${index} value=${answer.id}>
								${answer.value}
						</label>
					</li>
				`
			)
			.join('')

		questions.innerHTML = `
			<div class="quiz-questions-item">
				<div class="quiz-questions-question">${DATA[index].question}</div>
					<ul class="quiz-questions-item__answers">${renderAnswers()}</ul>
				</div>
			</div>
		`
	};

	const renderResults = () => {
		let content = '';
		const getAnswers = (questionIndex) => DATA[questionIndex].answers
			.map((answer) => `<li>${answer.value}</li>`)
			.join('');

		DATA.forEach((question, index) => {
			content += `
				<div class="quiz-results-item">
					<div class="quiz-results-item__question">${question.question}</div>
					<ul class="quiz-results-item__answers">${getAnswers(index)}</ul>
				</div>
		`
		})
		results.innerHTML = content;
	};

	const renderIndicator = (currentStep) => {
		indicator.innerHTML = `${currentStep}/${DATA.length}`
	};

	quiz.addEventListener('change', (event) => {
		if (event.target.classList.contains('answer-input')) {
			localResults[event.target.name] = event.target.value;
			btnNextQuiz.disabled = false;
		}
	});

	quiz.addEventListener('click', (event) => {
		if (event.target.classList.contains('btn-next-quiz')) {
			const nextQuestionIndex = Number(questions.dataset.currentStep) + 1

			if (DATA.length === nextQuestionIndex) {
				questions.classList.add('questions--hidden')
				indicator.classList.add('indicator--hidden')
				results.classList.add('results--visible')
				btnNextQuiz.classList.add('btn-next-quiz--hidden')
				btnRestartQuiz.classList.add('btn-restart-quiz--visible')
				renderResults();
				console.log(localResults);

			} else {
				renderQuestions(nextQuestionIndex);
			}

			btnNextQuiz.disabled = true;
		}

		if (event.target.classList.contains('btn-restart-quiz')) {
			localResults = {};
			results.innerHTML = '';

			questions.classList.remove('questions--hidden')
			indicator.classList.remove('indicator--hidden')
			results.classList.remove('results--visible')
			btnNextQuiz.classList.remove('btn-next-quiz--hidden')
			btnRestartQuiz.classList.remove('btn-restart-quiz--visible')

			renderQuestions(0);
		}
	})

	window.onload = renderQuestions(0);


}


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
// console.log(btnBacks);
// console.log(btnNexts);
// console.log(shkafContents);



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


// Подпись в label выбора файла

var inputs = document.querySelectorAll('.inputfile');

Array.prototype.forEach.call(inputs, function (input) {
	var label = input.nextElementSibling,
		labelVal = label.innerHTML;

	input.addEventListener('change', function (e) {
		var fileName = '';
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



