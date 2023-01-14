class Player {
    constructor(name) {
        this.name = name;
        this.operations = [];
        this.balance = 1500;
    }

    makeTransfer(recipient, amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            this.operations.push(-amount);

            recipient.balance += Number(amount);
            recipient.operations.push(Number(amount));

        } else {
            alert('Nie masz wystarczająco środków na koncie.');
        }
    }
}

const playersArray = [];
let activePlayerIndex = 0;
let activePlayer = playersArray[activePlayerIndex];


const $form = document.getElementById('playersForm');
const $names = document.getElementById('playersNames');
const $allNames = document.querySelectorAll("#players");
const $accounts = document.querySelector(".accounts");
let $playerContainer = document.querySelectorAll(".player");
let $activePlayer = document.querySelector(".activePlayerText");

let $transfer = document.querySelectorAll(".transfer");




const updatePlayerBalances = () => {
    playersArray.forEach((player, index) => {
        const playerElement = document.querySelector(`.player:nth-of-type(${index + 1}) .balance`);
        playerElement.textContent = `${player.balance}$`;
    });
};

$form.addEventListener('submit', e => {
    e.preventDefault();

    const numPlayers = $form.elements.players.value;

    if (numPlayers < 2 || numPlayers > 6) return;

    for (let i = 0; i < numPlayers; i++) {
        const player = new Player(`Gracz ${i + 1}`);
        playersArray.push(player);
        $names.insertAdjacentHTML("beforeend", ` <label for="names">Gracz ${i + 1}</label>
                             <input type="text" id="names" name="players" class="player__names" value="Gracz ${i+1}">`);

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
                            <form class="transfer">
                                <label for="player-${index + 1}">
                                    <select id="player-${index + 1}" class="selectOpponent" name="selectOpponent"></select>
                                </label>
                           
                            
                                <label for="amount">Kwota:</label>
                                <input type="number" id="amount" name="amount">
                                <button type="submit" class="transfer-button">Wykonaj przelew</button>
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
    $transfer = document.querySelectorAll(".transfer");
    console.log($transfer);

    $transfer.forEach((form, i) => {
        form.addEventListener("submit", e => {
            e.preventDefault();

            let transferAmount = form.amount.value;
            let recipientPlayer = form[`player-${i + 1}`].value;

            handleTransfer(transferAmount, recipientPlayer);
            updatePlayerBalances();
        });
    });

});


const addClickEvent = () => {
    $playerContainer.forEach(function (box, index) {
        box.addEventListener('click', function () {
            activePlayerIndex = index;
            activePlayer = playersArray[activePlayerIndex];
            $activePlayer.innerText = `Aktywny gracz: ${activePlayer.name}`;
            $transfer = document.querySelectorAll(".transfer");
            console.log($transfer);
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
        const $selectOpponent = document.querySelector(`#player-${i + 1}`);
        player.opponents.forEach(opponent => {
            const option = document.createElement("option");
            option.value = opponent;
            option.textContent = opponent;
            $selectOpponent.appendChild(option);
        });
    });
};


const handleTransfer = (amount, recipient) => {
    const activePlayer = playersArray[activePlayerIndex];
    const recipientPlayer = playersArray.find(p => p.name === recipient);
    activePlayer.makeTransfer(recipientPlayer, amount);
};



