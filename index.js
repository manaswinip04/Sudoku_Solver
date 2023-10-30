var board = [[], [], [], [], [], [], [], [], []];

// slider.style.boxShadow = "0px 0px 10px 2px rgba(44, 130, 201, 1)";

let solved = false;

let difficult = 'easy';

const slider = document.querySelector('.slider');
const solver = document.querySelector('.solveSudoku');
const easy = document.querySelector('.easy');
const medium = document.querySelector('.medium');
const hard = document.querySelector('.hard');
const stop = document.querySelector('.stop');

let initialvalue = 20;

function handleslider(){
    slider.value = initialvalue;
    slider.style.backgroundSize = slider.value + "% 100%";
}

handleslider();

slider.addEventListener('input',e =>{
    initialvalue = e.target.value;
    handleslider();
});

// easy.addEventListener('click',function(){
//     if(difficult!='easy' || solved==true)
//     {
//         solved=false;
//         difficult='easy';
//         loadSudoku();
//     }
// });

// medium.addEventListener('click',function(){
//     if(difficult!='medium' || solved==true)
//     {
//         solved=false;
//         difficult='medium';
//         loadSudoku();
//     }
// });

// hard.addEventListener('click',function(){
//     if(difficult!='hard' || solved==true)
//     {
//         solved=false;
//         difficult='hard';
//         loadSudoku();
//     }
// });

easy.addEventListener('click',async function(){ 
    easy.style.pointerEvents='none';
    medium.style.pointerEvents='none';
    hard.style.pointerEvents='none';
    await colorRemove(); 
    difficult='easy';
    await loadSudoku();
    colorAdd();
    easy.style.pointerEvents='all';
    medium.style.pointerEvents='all';
    hard.style.pointerEvents='all';
});

medium.addEventListener('click',async function(){
    easy.style.pointerEvents='none';
    medium.style.pointerEvents='none';
    hard.style.pointerEvents='none';
    await colorRemove();
    difficult='medium';
    await loadSudoku();
    colorAdd();
    easy.style.pointerEvents='all';
    medium.style.pointerEvents='all';
    hard.style.pointerEvents='all';
});

hard.addEventListener('click',async function(){
    easy.style.pointerEvents='none';
    medium.style.pointerEvents='none';
    hard.style.pointerEvents='none';
    await colorRemove();
    difficult='hard';
    await loadSudoku();
    colorAdd();
    easy.style.pointerEvents='all';
    medium.style.pointerEvents='all';
    hard.style.pointerEvents='all';
});

async function loadSudoku(){
    let content = await fetch(`https://sugoku.onrender.com/board?difficulty=${difficult}`);
    let sudokuvalue = await content.json();
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            let dataofsudoku = document.getElementsByClassName(9*j+i);
            if(sudokuvalue.board[i][j]==0){
                board[i][j]=0;
                dataofsudoku[0].innerText='';
            }
            else{
                board[i][j]=sudokuvalue.board[i][j];
                dataofsudoku[0].innerText=sudokuvalue.board[i][j];
                // dataofsudoku.style.backgroundColor = "red";
            }
        }
    }
}

// function printBoard(){
//     for(let i=0;i<9;i++){
//         for(let j=0;j<9;j++){
//             console.log(board[i][j]);
//         }
//     }
// }

function isSafe(i,j,ch,board){
    for(let val=0;val<9;val++){
        if(board[val][j]==ch){
            return false;
        }
        if(board[i][val]==ch){
            return false;
        }
    }

    let row1 = Math.floor(i / 3) * 3;
    let col1 = Math.floor(j / 3) * 3;
    for(let i1=0;i1<3;i1++){
        for(let j1=0;j1<3;j1++){
            if(board[row1+i1][col1+j1]==ch){
                return false;
            }
        }
    }
    return true;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function solve(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                for (let ch = 1; ch <= 9; ch++) {
                    if (isSafe(i, j, ch, board)) {
                        let value = 9*j+i;
                        let content = document.getElementsByClassName(value);
                        board[i][j] = ch;
                        await delay((200-initialvalue*2));
                        content[0].innerText = ch;
     
                        // console.log(i + '' + j + ' ' + board[i][j]);
                        if (await solve(board)) {
                            return true;
                        } else {
                            board[i][j] = 0;
                            content[0].innerText='';
                        }
                    }
                }
                return false;
            }
        }
    }
    solved = 1;
    return true;
}



function colorAdd(){
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            let dataofsudoku = document.getElementsByClassName(9*j+i);
            if(board[i][j]!=0){
                dataofsudoku[0].style.backgroundColor = "rgba(0, 255, 62, 0.8)";
            }
        }
    }
}



async function colorRemove(){
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            let dataofsudoku = document.getElementsByClassName(9*j+i);
            if(board[i][j]!=0){   
                dataofsudoku[0].style.backgroundColor = "white";
            }
        }
    }
}

async function run(){
    await loadSudoku();
    colorAdd();
}

run();

solver.addEventListener('click',async function(){
    easy.style.pointerEvents='none';
    medium.style.pointerEvents='none';
    hard.style.pointerEvents='none';
    await solve(board);
    easy.style.pointerEvents='all';
    medium.style.pointerEvents='all';
    hard.style.pointerEvents='all';
});
