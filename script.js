document.addEventListener("DOMContentLoaded", () => {
  // get the form and elements
  const player1 = document.querySelector("#player1");
  const player2 = document.querySelector("#player2");
  const submitBtn = document.querySelector("#submit");
  const resetBtn = document.querySelector("#reset");
  const gameboard = document.querySelector(".gameboard");
  const form = document.querySelector("#myForm");
  const playerName1 = document.querySelector(".playerName1");
  const playerName2 = document.querySelector(".playerName2");
  const winnerDisplay = document.querySelector(".winner");
  // assign values and conditions of game
  const X_MARK = "X";
  const CIRCLE_MARK = "O";
  let difficulty;
  let turn;
  //create array from gameboard nodes
  const init = gameboard.children;
  const initArr = [...init];
  // all winning combos and moves for x's and o's
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let playedMovesX = [];
  let playedMovesO = [];

  // adds listeners to each field and checks condition for win
  function addListenersForField() {
    initArr.forEach((field) => {
      field.addEventListener("click", switchPlayer, { once: true });
    });
  }

  function switchPlayer(e) {
    const switchMark = turn ? CIRCLE_MARK : X_MARK;
    nextTurn(switchMark, e);
  }
  // logic for AI mode
  function pcTurn(switchMark) {
    const num = initArr[Math.floor(Math.random() * 9)];
    console.log(+num.attributes[1].value);
    const value = num.attributes[0].ownerElement.innerText;
    if (value === "") {
      console.log("prazno", num);
      num.innerText = switchMark;
      playedMovesO.push(+num.attributes[1].value);
    } else if (playedMovesO.length >= 4 || playedMovesX >= 5) return;
    else if (pcTurn(switchMark));
  }

  // sets next players turn and checks for win
  function nextTurn(switchMark, event) {
    turn = !turn;
    event.target.innerText = switchMark;
    if (difficulty === 1 && switchMark === "X") {
      pcTurn("O");
      turn = !turn;
      checkForWin(winningCombos, playedMovesO, "O");
    }

    if (switchMark === "O") {
      playedMovesO.push(+event.target.getAttribute("value"));
      checkForWin(winningCombos, playedMovesO, switchMark);
      return;
    }
    playedMovesX.push(+event.target.getAttribute("value"));
    checkForWin(winningCombos, playedMovesX, switchMark);
    console.log(playedMovesO);
  }

  function finishedGame() {
    winnerDisplay.classList.add("hidden");
    playerName1.innerText = "";
    playerName2.innerText = "";
    resetGame();
  }

  // goes trough each array to find matching winning combos
  function checkForWin(arr1, arr2, mark) {
    const winCheck = (arr1, arr2) => arr1.every((x) => arr2.includes(x));
    //draw game
    if (playedMovesX.length >= 5) {
      winnerDisplay.innerText = "It's a draw!";
      winnerDisplay.classList.remove("hidden");
      setTimeout(finishedGame, 2500);
    }
    for (let i = 0; i < arr1.length; i++) {
      let combination = arr1[i];
      if (winCheck(combination, arr2)) {
        winnerDisplay.innerText = `Winner is ${mark}`;
        winnerDisplay.classList.remove("hidden");
        setTimeout(finishedGame, 2500);
      }
    }
  }
  // get form info
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addListenersForField();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    playerOne = data.player1;
    const players = playersStats(data.player1, data.player2, +data.difficulty);
    players.displayPlayers();
    console.log(players);
    playerName1.classList.remove("hidden");
    player1.value = "";
    playerName2.classList.remove("hidden");
    player2.value = "";
    if (data.difficulty == 1) {
      playerName2.innerText = "AI";
      difficulty = 1;
    }
  });

  const playersStats = (playerOne, playerTwo, difficulty) => {
    const displayPlayers = () => {
      playerName1.innerText = playerOne;
      playerName2.innerText = playerTwo;
    };
    return { playerOne, playerTwo, difficulty, displayPlayers };
  };
  // resets all game functions
  function resetGame() {
    initArr.forEach((field) => {
      field.removeEventListener("click", switchPlayer);
      field.innerText = "";
      playedMovesX = [];
      playedMovesO = [];
      turn = false;
    });
  }
  // reset game button
  resetBtn.addEventListener("click", resetGame);
});
