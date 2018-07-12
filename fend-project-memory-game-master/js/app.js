

/* array with all cards */
const cardsList = ["fa-paper-plane-o", "fa-paper-plane-o",
			"fa-diamond", "fa-diamond",
			"fa-bicycle", "fa-bicycle",
			"fa-anchor", "fa-anchor",
			"fa-bolt", "fa-bolt",
			"fa-cube", "fa-cube",
			"fa-leaf", "fa-leaf",
			"fa-bomb", "fa-bomb",
			];
/* Shuffle function from http://stackoverflow.com/a/2450976*/
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
let totalSec = 0;
let min = document.querySelector(".min");
let sec = document.querySelector(".sec");

/* function for the timer */
function startTimer (){

	function setTime() {
		++totalSec;
		sec.innerHTML = pad(totalSec % 60);
		min.innerHTML = pad(parseInt(totalSec / 60));
	}

	function pad (val) {
		let valString = val + "";
		if (valString.length < 2) {
			return "0" + valString;
		} else {
			return valString;
		}
	}
	timer = setInterval(setTime, 1000)

}

function stopTimer() {
	clearInterval(timer);
}

const moves = document.querySelector(".moves");
let moveCounter = 0;

/* moves counter function */
function movesCount() {
	moveCounter += 1;
	moves.innerHTML = moveCounter
}
/* adds cards into the html when called upon */
function displayCards(card) {
	return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`
}
/* removes all stars currently being used and replaced with my default stars*/
function resetStars() {
	document.querySelector(".star-1").remove();
	document.querySelector(".star-2").remove();
	document.querySelector(".star-3").remove();
	$(".stars").append('<li class="star-1"><i class="fas fa-star"></i></li>');
	$(".stars").append('<li class="star-2"><i class="fas fa-star"></i></li>');
	$(".stars").append('<li class="star-3"><i class="fas fa-star"></i></li>');
}

function resetCards() {
	const deck = document.querySelector(".deck");
	allCards.forEach(function(card) {
		card.classList.remove("match", "show", "open");
		selectedCards = [];
		matchedCards = [];

	});
}

function endGame () {
	const modal = document.querySelector(".modal");
	const modalContent = document.querySelector(".modal-content");
	const messagePara = document.querySelector(".winning-message");
	const messageContainer = document.createElement("p");
	const closeModal = document.querySelector(".close");

	const newGame = document.querySelector(".new-game");
	let totalStars = document.querySelector(".stars").innerHTML;
	let scoreMessage = document.createElement("span");
	let timeMessage = document.createElement("p");

	setTimeout(function() {
		clearInterval(timer);
	}, 300);

	modal.classList.add("modal-open");
	messageContainer.textContent = "You scored"
	messagePara.append(messageContainer);
	scoreMessage.innerHTML = totalStars;
	messageContainer.append(scoreMessage);

	timeMessage.innerText = "With a time of  " + min.innerHTML + ":" + sec.innerHTML+ "!"
	messagePara.append(timeMessage);

	newGame.addEventListener("click", function() {
		location.reload();
	});

}
/* function for the game to start*/
function gameStart () {
	const deck = document.querySelector(".deck");

	let deckHTML = shuffle(cardsList).map(function(card) {
		return displayCards(card);
	});
	deck.innerHTML = deckHTML.join("");
	startTimer();
}
/* call the game to start*/
gameStart();

const allCards = document.querySelectorAll(".card");
const stars = document.querySelector(".stars");
const reset = document.querySelector(".fa-repeat");
let selectedCards = [];
let matchedCards = [];

reset.addEventListener("click", function resetAll() {
	moves.innerHTML = 0;
	moveCounter = 0;
	totalSec = 0;
	stopTimer();
	startTimer();
	resetStars();
	resetCards();
});
/* function makes the game work */
allCards.forEach(function(card) {
	card.addEventListener('click', function(e) {
/* add selected cards to an array to prevent double click */
		if(!card.classList.contains("open") && !card.classList.contains("show") && !card.classList.contains("match")) {
			card.classList.add('open', 'show');
			selectedCards.push(card);
		}
/* this statement flips cards back when they dont match*/
			if(selectedCards.length === 2) {
				setTimeout(function() {
					selectedCards.forEach(function(card) {
						card.classList.remove("open", "show");
					});

					selectedCards = [];
					}, 300);
			}
/* this prevents bug of matching 3 cards */
			while (selectedCards.length === 3) {
				selectedCards.remove(selectedCards.length);
			}
/* this starts the moves counter */
			if (selectedCards.length === 2 || matchedCards === 2) {
				movesCount();
			}
/* if player reaches 14 moves a star is taken away*/
			if (moves.innerText == 14) {
				document.querySelector(".star-3").remove();
				$(".stars").append('<li class="star-3"><i class="far fa-star"></i></li>');
			}
/* if player reaches 18 moves a star is taken away*/
			else if (moves.innerText == 18) {
				document.querySelector(".star-2").remove();
				$(".stars").append('<li class="star-2"><i class="far fa-star"></i></li>');
			}
/* determines whether the cards with the same picture match*/
			if (selectedCards[0].dataset.card === selectedCards[1].dataset.card) {
				selectedCards.forEach(function(card) {
					card.classList.add("match");
				});
/* adds the match cards to an array */
					if (card.classList.contains("match")) {
					matchedCards.push(card);
					}
/* when theres 8 matches vict?ory screen displays*/
					if (matchedCards.length === 8) {
						endGame();
					}
			}

	});
});
