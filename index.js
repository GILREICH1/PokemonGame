$(function () {
    const f = 'https://answers.unity.com/storage/temp/113819-grass-texture-2.png';
    let avatar;
    const trainer = './media/PS_avatar_trainer_cropped.png';
    const obstacle = './media/PS_obstacle_cropped.gif';
    let currentBoard;
    // save location of elements in array format of [x,y]
    let obstacleArr;
    let avatarLocation;
    let trainerLocation;
    let stepCounter = 0;
    let gameTime;
    // avatarLink defined on user selection at start
    let avatarLink = '';
    $('#winScreen').hide();
    $('#loseScreen').hide();
    $('#board').hide();

    // called at start to create a random board
    // creates array containing y arrays, each of x length of which each element is an object
    // for example, for x=2,y=3
    // let Arr = [
    //   Arr[0]:  [{el: srcLink, x: 0, y: 0},{el: srcLink, x: 1, y: 0}],
    //   Arr[1]:  [{el: srcLink, x: 0, y: 1},{el: srcLink, x: 1, y: 1}],
    //   Arr[2]:  [{el: srcLink, x: 0, y: 2},{el: srcLink, x: 1, y: 2}],
    // ]
    function generateBoard(x, y) {
        const board = [];
        fillBoardWithGrass(board,x, y);

        // place avatar
        avatarLocation = generateRandomCoords(x, y)
        board[avatarLocation[1]][avatarLocation[0]].el = avatar;

        // place trainer
        trainerLocation = generateRandomCoords(x, y)
        board[trainerLocation[1]][trainerLocation[0]].el = trainer;
        // place obstacles
        // obstacleArr is array of board tile elements which have format = [x, y]
        obstacleArr = generateObstacleArr(x, y);
        // lay down obstacle for each tile element
        obstacleArr.forEach((e) => {
            board[e.x][e.y].el = obstacle;
        });
        let objArr = _.flatten(board, 1);
        let wasTrainerPlaced = _.find(objArr, {el: trainer});
        let wasAvatarPlaced = _.find(objArr, {el: avatar});
        if (wasTrainerPlaced && wasAvatarPlaced) {
            return board;
        } else {
            return generateBoard(x, y);
        }
    };

    function fillBoardWithGrass(board,x, y){
        for (let i = 0; i < y; i++) {
            let row = [];
            for (let j = 0; j < x; j++) {
                row.push({
                    el: f,
                    x: j,
                    y: i
                });
            }
            board.push(row);
        }
    }

    function generateObstacleArr(x, y) {
        const obstacles = [];
        const obstaclePercent = 0.1;
        const obastaclesCount = Math.floor((y * x) * obstaclePercent);
        for (let i = 0; i < obastaclesCount; i++) {
            const [obstacleY, obstacleX] = generateRandomCoords(x, y)
            obstacles.push({
                x: obstacleX,
                y: obstacleY
            });
        }
        return obstacles;
    }

    function generateRandomCoords(xMax, yMax) {
        const x = Math.floor(Math.random() * xMax);
        const y = Math.floor(Math.random() * yMax);
        return [x, y]
    };

    function selectWinImage(){
        const winImages = {
            squirtle: "https://media.giphy.com/media/TcG7Tw3uq6tJS/giphy.gif",
            pikachu: "./Media/endGame/happy_pikachu.gif",
            bulbasaur: "https://img.17qq.com/images/ghfhkgpmgqy.jpeg"
        }
        $('#winImage').attr('src', winImages[avatar]);
    }

    function renderWinScreen () {
        let winTime = (Date.now() - gameTime) / 1000;
        let secondsPerStep = (winTime / stepCounter).toFixed(2);
        selectWinImage();
        $('#board').hide();
        $('#winScreen h2').text(`You won in ${stepCounter} steps and ${winTime} seconds! That's ${secondsPerStep} seconds per step! wowwwwww...`);
        $('#winScreen').show();
    }

    function renderLoseScreen(){
        const loseImages = {
            squirtle: "https://64.media.tumblr.com/59c53b5400b6755abd9d9c21a2ad4a4a/tumblr_o7wo0lCXUk1tgjlm2o1_500.gifv",
            pikachu: "./Media/endGame/sad_pikachu.gif",
            bulbasaur: "https://img.17qq.com/images/qrareqtrhqx.jpeg"
        }
        $('#loseImage').attr('src', loseImages[avatar]);
        $('#board').hide();
        $('#loseScreen').show();
    }

    // takes an array of arrays and creates a div for each nested array.
    // called on character selection
    function renderBoard(array, direction) {
        $('#board').html('');
        if (avatarLocation[0] === trainerLocation[0] && avatarLocation[1] === trainerLocation[1]) {
            renderWinScreen();
        }
        // if lose
        else if (obstacleArr.some(e => avatarLocation[0] === e.y && avatarLocation[1] === e.x)) {
            renderLoseScreen();
        }
        // if not a winning move:
        else {
            array.forEach(arrEl => {
                let div = $('<span class=row></span>');
                $('#board').append(div);
                arrEl.forEach(el => {
                    if (el.el === avatar) {
                        div.append(`<img src='${avatarLink}${direction}.png' id='[${el.x},${el.y}]' class='tile'></img>`);
                    } else {
                        div.append(`<img src='${el.el}' id='${el}' class='tile'></img>`);
                    }
                });
            });
        }
    }


    $(document).keyup(function move(event) {
        // $(document).keypress(function (event) {
        // var key = (event.keyCode ? event.keyCode : event.which);
        if ($('#board').is(':visible')) {
            let keyCode = event.which;
            if ((keyCode < 37 || keyCode > 40)) {
                return false;
            }
            let direction;
            let avatarCoords = {};
            currentBoard.forEach((arrEl, i) => {
                arrEl.forEach((e, j) => {
                    if (e.el === avatar) {
                        avatarCoords.y = i;
                        avatarCoords.x = j;
                    }
                })
            })
            switch (keyCode) {
                case 37:
                    currentBoard[avatarCoords.y][avatarCoords.x - 1].el = avatar;
                    avatarLocation = [avatarCoords.x - 1, avatarCoords.y];
                    direction = 'left';
                    break;
                case 38:
                    currentBoard[avatarCoords.y - 1][avatarCoords.x].el = avatar;
                    avatarLocation = [avatarCoords.x, avatarCoords.y - 1];
                    direction = 'up';
                    break;
                case 39:
                    currentBoard[avatarCoords.y][avatarCoords.x + 1].el = avatar;
                    avatarLocation = [avatarCoords.x + 1, avatarCoords.y];
                    direction = 'right';
                    break;
                case 40:
                    currentBoard[avatarCoords.y + 1][avatarCoords.x].el = avatar;
                    avatarLocation = [avatarCoords.x, avatarCoords.y + 1]
                    direction = 'down';
            }
            stepCounter++;
            currentBoard[avatarCoords.y][avatarCoords.x].el = f;
            renderBoard(currentBoard, direction);
        };
    })

    // initial board render
    // used to generate randomely sized board
    const randX = Math.floor(Math.random() * 5) + 10;
    const randY = Math.floor(Math.random() * 5) + 10;

    $('#selectionScreen').click(function (e) {
        let sprite = e.target.id;
        avatar = sprite;
        if (!sprite) {
            window.location.reload();
        }
        gameTime = Date.now();
        avatarLink = `./media/PS_${sprite}_`
        $('#selectionScreen').hide();
        currentBoard = generateBoard(randX, randY);
        renderBoard(currentBoard, 'down');
        $('#board').show();
    })
});
