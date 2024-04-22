// Игра в Крестики Нолики
// С двумя режимами игры:
// Человек - Человек
// Человек - ИИ

//////////////////////////////
/////// Дезигн ///////////////
//////////////////////////////

document.body.style.backgroundColor = '#565656'
document.body.style.fontFamily = 'Comic Sans MS'
document.body.style.color = '#fff'

// Отступы игрового поля слева и сверху
let mLeft = (window.innerWidth-192)/2
let mTop  = (window.innerHeight-192)/2

// Строка
let s1 = 'H vs H.  '
let s2 = 'turn X'
let str = document.createElement('p')
document.body.appendChild(str)
str.style.width = '192px'
str.style.height = '40px'
str.style.position = 'absolute'
str.style.top = mTop - 40 + 'px'
str.style.left = mLeft + 'px'
str.style.textAlign = 'center'
str.textContent = s1 + s2

// Кнопка сброса
let btRes = document.createElement('button')
document.body.appendChild(btRes)
btRes.style.width = '96px'
btRes.style.height = '30px'
btRes.style.position = 'absolute'
btRes.style.top = mTop + 192 + 'px'
btRes.style.left = mLeft + 96 + 'px'
btRes.style.fontFamily = 'Comic Sans MS'
btRes.textContent = 'Restart'
btRes.onclick = restart

// Кнопка смены режима
let btSwap = document.createElement('button')
document.body.appendChild(btSwap)
btSwap.style.width = '96px'
btSwap.style.height = '30px'
btSwap.style.position = 'absolute'
btSwap.style.top = mTop + 192 + 'px'
btSwap.style.left = mLeft + 'px'
btSwap.style.fontFamily = 'Comic Sans MS'
btSwap.textContent = 'Swap'
btSwap.onclick = swap


//////////////////////////////
/////// Перменные ////////////
//////////////////////////////

// Положение курсора
let mouseX = 0
let mouseY = 0

// Ходят крестики
let turnX = true

// Идет ли игра
let isGame = true

// Массив состояний ячеек поля
let pole = []

// Массив Х О как картинок
let obj = []

// Режим Human VS Human активирован
let modeHH = true

// Есть ли победитель
let winner = false

// AI ходит крестиками
let turnAIX = true


//////////////////////////////
/// Вспомогательные функции //
//////////////////////////////

// Положение курсора
onmousemove = (event) => {
    mouseX = event.clientX
    mouseY = event.clientY
}

// Создание картинки url по коодинатам x y (64) 
function spawnChar(x,y,url){
    let a = document.createElement('div')
    document.body.appendChild(a)
    
    a.style.width = '64px'
    a.style.height = '64px'
    
    a.style.position = 'absolute'
    a.style.left = mLeft + x * 64 + 'px'
    a.style.top = mTop + y * 64 + 'px'
    a.style.backgroundImage = 'url('+url+')'
    
    return a
} 

// Обновление строки
function reloadStr(){
    if(modeHH){ s1 = 'H vs H.  '}
    else{ s1 = 'H vs AI. ' }

    if(isGame){
        if(turnX){ s2 = 'turn X' }
        else{ s2 = 'turn O' }
    }
    else{
        if(winner){
            if(turnX){ s2 = 'O is winner' }
            else{ s2 = 'X is winner' }
        }
        else{ s2 = 'paaaaaat' }
    }
    str.textContent = s1 + s2
}

// Функция кнопки Restart
function restart(){
    isGame = true
    turnX = true
    winner = false
    turnAIX =  !turnAIX
    reloadStr()

    for(let el in pole){
        pole[el] = 0
    }

    while(obj.length>0){
        document.body.removeChild(obj[ obj.length-1 ])
        obj.pop()
    }
}

// Функция кнопки Spawn
function swap(){
    modeHH = !modeHH
    restart()
}


//////////////////////////////
///// Стартовык действия /////
//////////////////////////////

// Создание "пустых ячеек" в масстве состояний ячеек
for(let i=0; i<9; i++){
    pole.push(0)
}

// Визуальное создание поля 
for(let y=0; y<3; y++){
    for(let x=0; x<3; x++){
        spawnChar(x,y,'ui_box.png')
    }
}


//////////////////////////////
///// Остновные функции //////
//////////////////////////////

// Проверка победы
// 1 если победа
// -1 если ничья
// 0 если игра не закончена
function isWin(){
    for(let i=0; i<3; i++){
        if(pole[i*3]==pole[i*3+1] && pole[i*3]==pole[i*3+2] && pole[i*3] !=0 ||
            pole[i]==pole[i+3] && pole[i]==pole[i+6] && pole[i] !=0 ||
            pole[0]==pole[4] && pole[0]==pole[8] && pole[0] !=0 ||
            pole[2]==pole[4] && pole[2]==pole[6] && pole[2] !=0){
                isGame = false
                winner = true
                return 1
            }
    }

    for(let i=0; i<9; i++){
        if(pole[i]==0){
            return 0
        }
    }

    isGame = false
    winner = false
    return -1
}

// Стаит Х или О по кооржинатам x y
function addChar(x,y){
    if(x>=0 && x<3 && y>=0 && y<3){
        if(pole[y*3+x] == 0 && isGame){
            let newObj = null
            if(turnX){
                pole[y*3+x] = 1
                newObj = spawnChar(x,y,'ui_numX.png')
            }
            else{
                pole[y*3+x] = 2
                newObj = spawnChar(x,y,'ui_numO.png')
            }
            obj.push(newObj)
            isWin()
            turnX = !turnX
            reloadStr()
        }
    }
}

// Реализация хода по нажатию мыши
function turn(){
    if(!modeHH && turnAIX == turnX){
        let resAI = minmax()
        addChar(resAI[0]%3,Math.floor(resAI[0]/3))   
    }
    else{
        let x = Math.floor( (mouseX-mLeft)/64 )
        let y = Math.floor( (mouseY-mTop)/64 )
    
        addChar(x,y)
        
        if(!modeHH && isGame) { turn() }
    }
}
onclick = turn


//////////////////////////////
///////////// AI /////////////
//////////////////////////////

// Своя реализация функций min и max с учетом null
// работает как max по масииву arr, если k>0
// работает как min по масииву arr, если k<=0
function myMIN_MAX(k, arr){
    if(arr.legth<=0){ return NaN }
    let res = null
    for(let i in arr){
        if(arr[i]!=null && arr[i]!=NaN){
            res = arr[i]
            break;
        }
    }
    if(res==null){ return NaN }

    for(let i in arr){
        if(arr[i]!=null && arr[i]!=NaN){
            if(k<=0 && arr[i]<res || k>0 && arr[i]>res){
                res = arr[i]
            }
        }  
    }
    return res
}

// Функция minmax для подстчета оптимального хода
function minmax(){
    let saveTurn = turnX
    let p = []
    for(let i in pole){
        p.push(null)
        if(pole[i]==0){
            if(turnX){ pole[i] = 1}
            else{ pole[i] = 2}
            if( isWin() != 0){
                if(winner){
                    p[i] = turnX ? 10 : -10
                }
                else{
                    p[i] = 0
                }
                isGame = true
                winner = false
            }
            else{
                turnX = !turnX
                let temp = minmax()
                p[i] = temp[1]
                turnX = saveTurn
            }
            pole[i] = 0
        }
    }
    return [p.indexOf( myMIN_MAX(turnAIX,p), 0), myMIN_MAX(turnX,p)]
}