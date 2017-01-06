// Creating variables
endlessCanvas = true;
var selectedCelX, selectedCelY;
var selectedType = 0, selectedTypeX = NaN, selectedTypeY = NaN;
var houseLv1 = new Image(), houseLv1Builded = new Image(), houseLv2 = new Image(), houseLv3 = new Image();
houseLv1.src = "houseLv1.png";
houseLv1Builded.src = "houseLv1Builded.png";
houseLv2.src = "houseLv2.png";
houseLv3.src = "houseLv3.png";
var water = new Image();
water.src = "water.png";
var grass = new Image();
grass.src = "grass.png";
var floatingX = window.innerWidth / 3 , floatingY = window.innerHeight, buttonFloatingX = window.innerWidth / 2 - 10, buttonFloatingY = window.innerHeight - 20, floatingMenu = false;
var colour = [grass, water, houseLv1Builded, houseLv2, houseLv3];
var field = { x : 300,
              y : 150,
              field : [],
              fieldX : 0,
              fieldY : 0}
var celSize = 50;
var countUpdates = 0;
function make_arrow_forward(arrowX, arrowY, arrowSizeX, arrowSizeY){
  context.fillStyle = "red";
  context.beginPath();
  context.moveTo(arrowX, arrowY);
  context.lineTo(arrowX + arrowSizeX, arrowY + arrowSizeY);
  context.lineTo(arrowX - arrowSizeX, arrowY + arrowSizeY);
  context.closePath();
  context.fill();
}
function make_arrow_backward(arrowX, arrowY, arrowSizeX, arrowSizeY){
  context.fillStyle = "red";
  context.beginPath();
  context.moveTo(arrowX, arrowY);
  context.lineTo(arrowX + arrowSizeX, arrowY - arrowSizeY);
  context.lineTo(arrowX - arrowSizeX, arrowY - arrowSizeY);
  context.closePath();
  context.fill();
}
function distance(x1, y1, x2, y2) {
  a = x1 - x2;
  b = y1 - y2;
  var c = Math.sqrt(a * a + b * b);
  return c;
}
function collideWithCircle(mouse_x, mouse_y, okrX, okrY, radius){
  if (distance(mouse_x, mouse_y, okrX, okrY) < radius){
    return true;
  }else{
    return false;
  }
}
function select_building(){
  if (areColliding(mouseX, mouseY, 0, 0, floatingX - 175, floatingY + 10, 50, 50)) {
    selectedType = 2;
    selectedTypeX = floatingX - 175;
    selectedTypeY = floatingY + 10;
  }
}
function make_building(type) {
  if (type >= 2) {
    if (field.field[selectedCelX][selectedCelY] < 1) {
      field.field[selectedCelX][selectedCelY] = type;
    }
  }
  if (type == 1) {
    if (field.field[selectedCelX][selectedCelY] == 0) {
      field.field[selectedCelX][selectedCelY] = type;
    }
  }
  if (type == 0) {
    if (field.field[selectedCelX][selectedCelY]  == 1) {
      field.field[selectedCelX][selectedCelY] = type;
    }
  }
}
function make_grid() {
  for (var i = 0;i < field.x;i ++) {
    field.field[i] = [];
    for (var j = 0;j < field.y;j ++) {
      field.field[i][j] = 0;
    }
  }
}
function zoom() {
  if (isKeyPressed[90] && celSize < 60) {
    celSize ++;
  }
  if (isKeyPressed[88] && celSize > 15) {
    celSize --;
  }
}
function move_field() {
  if (isKeyPressed[65] || isKeyPressed[key_left]) {
    if (field.fieldX <= -3)
      field.fieldX += 10;
    }
  if (isKeyPressed[68] || isKeyPressed[key_right]) {
    if (field.fieldX > canvas.width - field.x * celSize + 5) {
      field.fieldX -= 10;
    }
  }
  if (isKeyPressed[87] || isKeyPressed[key_up]) {
    if (field.fieldY <= -3) {
      field.fieldY += 10;
    }
  }
  if (isKeyPressed[83] || isKeyPressed[key_down]) {
    if (field.fieldY > canvas.height - field.y * (celSize + 1) + 5) {
      field.fieldY -= 10;
    }
  }
}
function make_lake(X, Y, depth) {
  if (X < 0 || X >= field.x || Y < 0 || Y >= field.y) {
    return 0;
  }
  if (depth == 0) {
    return 0;
  }
  if(field.field[X][Y]==1){
    return 0;
  }
  field.field[X][Y] = 1;
  if (Math.random() > 0.6) {
    depth --;
    make_lake(X + 1, Y, depth);
    make_lake(X - 1, Y, depth);
    make_lake(X, Y + 1, depth);
    make_lake(X, Y - 1, depth);
  }
}
function make_river(X, Y, riverSize){
  var direction;
  direction = Math.random();
  if (X < 0 || X >= field.x || Y < 0 || Y >= field.y) {
    return 0;
  }
  field.field[X][Y] = 1;
  if (riverSize == 0) {
      return 0;
  }
  if (direction < 0.25) {
    make_river(X + 1, Y, -- riverSize);
  }
  if (direction < 0.5 && direction > 0.25) {
    make_river(X - 1, Y, -- riverSize);
  }
  if (direction < 0.75 && direction > 0.5) {
    make_river(X, Y + 1, -- riverSize);
  }
  if (direction > 0.75) {
    make_river(X, Y - 1, -- riverSize);
  }
}
function spawn_water(countLake){
  var randomX, randomY;
  for (var i = 0;i < countLake;i ++) {
    randomX = Math.floor(Math.random() * field.x);
    randomY = Math.floor(Math.random() * field.y);
    make_lake(randomX, randomY, 100);
    make_river(randomX, randomY, 100)
  }
}
make_grid();
make_lake(Math.floor(Math.random() * field.x), Math.floor(Math.random() * field.y), 10);
make_river(Math.floor(Math.random() * field.x), Math.floor(Math.random() * field.y), 10)
spawn_water(100);
function stupid_Iashu_button() {
  if (floatingMenu) {
    buttonFloatingY += (canvas.height - 190 - buttonFloatingY) / 10;
  }else{
    buttonFloatingY += (canvas.height - 15 - buttonFloatingY) / 10;
  }
}
function stupid_Iashu_menu() {
  if (floatingMenu) {
    floatingX += (canvas.width / 3 - floatingX) / 10;
    floatingY += (canvas.height - 180 - floatingY) / 10;
    selectedTypeY += (floatingY - selectedTypeY) / 10;
  }else{
    floatingX += (canvas.width / 3 - floatingX) / 10;
    floatingY += (canvas.height - floatingY) / 10;
    selectedTypeY += (floatingY - selectedTypeY) / 10;
  }
}
function draw_grid(){
  for (var i = 0;i < field.x;i ++) {
    for (var j = 0;j < field.y;j ++) {
        if (i * (celSize + 1) + field.fieldX <= canvas.width && i * (celSize + 1) +
                field.fieldX >= 0 - (celSize + 1) && j * (celSize + 1) + field.fieldY <=
                canvas.height && j * (celSize + 1) + field.fieldY >= 0 - (celSize + 1)) {
            if (selectedCelX == i && selectedCelY == j){
                if (countUpdates % 60 < 30){
                    context.globalAlpha = 0.5;
                }
            }
            context.drawImage(colour[field.field[i][j]], i * (celSize + 1) + field.fieldX, j * (celSize + 1) + field.fieldY, celSize - 1, celSize - 1);
            context.globalAlpha = 1;
      }
    }
  }
}
function draw_floating_menu(){
  context.fillStyle = "orange";
  context.beginPath();
  context.arc(buttonFloatingX, buttonFloatingY, 10, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
  context.fillStyle = "lightblue";
  context.fillRect(floatingX - 200, floatingY, 800, 300);
  context.fillRect(floatingX - 175, floatingY + 10, 50, 50);
  context.drawImage(houseLv1, floatingX - 175, floatingY + 10, 50, 50);
  context.fillStyle = "orange";
  context.fillRect(selectedTypeX, selectedTypeY + 60, 50, 5);
  if (floatingMenu) {
    make_arrow_backward(buttonFloatingX, buttonFloatingY + 3, 5, 6);
  }else{
    make_arrow_forward(buttonFloatingX, buttonFloatingY - 3, 5, 6);
  }
}
function update() {
  ++ countUpdates;
  move_field();
  zoom();
  stupid_Iashu_button();
  stupid_Iashu_menu();
}
function draw() {
    draw_grid();
    draw_floating_menu();
}
function keyup(key) {
  if (key == 32) {
    make_building(selectedType);
  }
}
function mouseup() {
    selectedCelX = Math.floor((mouseX - field.fieldX) / (celSize + 1));
    selectedCelY = Math.floor((mouseY - field.fieldY) / (celSize + 1));
    if (collideWithCircle(mouseX, mouseY, buttonFloatingX, buttonFloatingY, 10)) {
        floatingMenu = !floatingMenu;
    }
    select_building();
}
