class Player {
    constructor(name) {
        this.name = name;
        this.operations = [];
        this.balance = 1500;
    }

    makeTransfer(recipient, amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            this.operations.push({ type: 'out', amount: amount });

            recipient.balance += amount;
            recipient.operations.push({ type: 'in', amount: amount });

            updatePlayerBalances();

            return true;
        } else {
            alert('Nie masz wystarczająco środków na koncie.');
            return false;
        }
    }
}

const playersArray = [];
let activePlayerIndex;
let activePlayer = playersArray[activePlayerIndex];


const $form = document.getElementById('playersForm');
const $names = document.getElementById('playersNames');
const $allNames = document.querySelectorAll("#players");
const $accounts = document.querySelector(".accounts");
let $playerContainer = document.querySelectorAll(".player");
let $activePlayer = document.querySelector(".activePlayerText");



$form.addEventListener('submit', e => {
    e.preventDefault();

    const numPlayers = $form.elements.players.value;

    if (numPlayers < 2 || numPlayers > 6) return;

    for (let i = 0; i < numPlayers; i++) {
        const player = new Player(`Gracz ${i + 1}`);
        playersArray.push(player);
        $names.insertAdjacentHTML("beforeend", ` <label for="names">Gracz ${i + 1}</label>
                             <input type="text" id="names" name="players" class="player__names">`);

    }

    $form.classList.add("invisible");
    $names.classList.remove("invisible");
});


$names.addEventListener('submit', e => {
    e.preventDefault();

    const $playerNames = document.querySelectorAll('#playersNames input');

    $playerNames.forEach((input, index) => {
        playersArray[index].name = input.value;


        const html =`  
                            <p class="name">${playersArray[index].name}</p>
                            <p class="balance">${playersArray[index].balance}$</p>
                            <form class="opponents">
                                <label for="player-${index + 1}-select">
                                    <select id="player-${index + 1}-select" class="selectOpponent"></select>
                                </label>
                            </form>
                            <form class="transfer">
                                <label for="amount">Kwota:</label>
                                <input type="number" id="amount" name="amount">
                                <button type="submit">Wykonaj przelew</button>
                            </form>
                        `;

        const newPlayer = document.createElement('div');

        $accounts.appendChild(newPlayer);
        newPlayer.classList.add('player');
        newPlayer.innerHTML = html;
    });

    $names.classList.add("invisible");
    $accounts.classList.remove("invisible");
    $playerContainer = document.querySelectorAll(".player");
    createOpponentsArray();
    addClickEvent();
    createOpponentsList(playersArray);
});


const addClickEvent = () => {
    $playerContainer.forEach(function (box, index) {
        box.addEventListener('click', function () {
            activePlayerIndex = index;
            activePlayer = playersArray[activePlayerIndex].name;
            $activePlayer.innerText = `Aktywny gracz: ${activePlayer}`;
        });
    });

};

const createOpponentsArray = () => {
    playersArray.forEach(player => {
        player.opponents = playersArray.filter(p => p !== player).map(p => p.name);
    });
};



const createOpponentsList = array => {
    array.forEach((player, i) => {
        const $selectOpponent = document.querySelector(`#player-${i + 1}-select`);
        player.opponents.forEach(opponent => {
            const option = document.createElement("option");
            option.value = opponent;
            option.textContent = opponent;
            $selectOpponent.appendChild(option);
        });
    });
};








