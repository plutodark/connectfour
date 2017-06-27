/*jshint esversion: 6 */
// logical
const NO_OF_Y = 6;
const NO_OF_X = 7;

const WINNING_CONDITION = 4;

//physical
const CHECKER_DIAMETER = 80;
let BOARD_TOP = 0;
let BOARD_LEFT = 0;

const CURRENT_GAME = {
  // 0 = red player , 1 = yellow player
  current_player: 0,
  //two mode 1. human vs computer 2. human vs human
  game_mode: 1,
  //status: 1. playing , 2. Red Player Win 3. Yellow Player Win 4. Draw - maybe useless?
  status: 1,
  display_message : '',
  turn:1
};

let BOARD = new Array(NO_OF_X);

$(document).ready(function(){
    $( window ).resize(() => {adjust_board_position();});
});
/** This is the function for go back to the menu **/
const init_menu = function _init_menu(){
  $('#Game_container').hide();
  $('#Game_menu').show();

};
/** this is the function to start the game ***/
const start_game = function _start_game(game_mode){
  CURRENT_GAME.game_mode = game_mode;
  init_board();
};


const init_board = function _init_board(){
  $('#Game_menu').hide();
  reset_the_game();
  
  
  $('#Game_container').show();



};
/***** Status panel ****/


/*** Drawing the board ***/

const reset_the_game = function _reset_the_game(){
  $('.checker').remove();
  $('.x_button').remove();
  $('#Board_cover').remove();
  draw_empty_board();
  draw_cover();
  adjust_board_position();
  init_mouseover_effect();
  if(CURRENT_GAME.display_message.message != null){
    CURRENT_GAME.display_message.message = "Red Player\'s turn";
  }else{
      CURRENT_GAME.display_message = new Vue({
        el:'#Status_wording',
        data: {
          message: 'Red Player\'s turn'
        }
      });
  }
  CURRENT_GAME.current_player = 0;
  CURRENT_GAME.turn = 1;

  $('#Yellow_status_border').css('border-color','white');
  $('#Red_status_border').css('border-color','black');

};
const draw_empty_board = function _draw_empty_board(){
  for(let j=0; j < NO_OF_X; j++){
    BOARD[j] = new Array(NO_OF_Y);
    for(let i=0; i < NO_OF_Y; i++){
      BOARD[j][i] = make_empty_slot(j,i);

    }

  }
};

const make_empty_slot = function _make_empty_slot(x, y){
  let slot = {
    id: `slot_${x}_${y}`,
    top: y * CHECKER_DIAMETER,
    left: x * CHECKER_DIAMETER,
    // -1 = empty , 0 = red player , 1 = yellow player
    status: -1
  };
  return slot;
};

const draw_cover = function _draw_cover(){
//$('#Game_container').append("<div id='Board_cover'></div>");
$('.page-content').append("<div id='Board_cover'></div>");
  for(let j=0; j < NO_OF_Y; j++){
    for(let i=0; i < NO_OF_X; i++){
      $('#Board_cover').append(draw_cover_cell());
    }
     $('#Board_cover').append('<div class="clearfix"></div>');
  }
};

const draw_cover_cell = function _draw_cover_cell(){
  return `<div class="cover_cell"><svg  width="${CHECKER_DIAMETER}" height="${CHECKER_DIAMETER}"> \
            <defs> \
              <mask id="mask" x="0" y="0" width="${CHECKER_DIAMETER}" height="${CHECKER_DIAMETER}"> \
                <rect x="0" y="0" width="${CHECKER_DIAMETER}" height="${CHECKER_DIAMETER}" fill="#FFFFFF"/> \
                <circle cx="${CHECKER_DIAMETER/2}" cy="${CHECKER_DIAMETER/2}" r="${CHECKER_DIAMETER/2-CHECKER_DIAMETER*0.1}" /> \
              </mask> \
            </defs> \
            <rect x="0" y="0" width="${CHECKER_DIAMETER}" height="${CHECKER_DIAMETER}" mask="url(#mask)" fill-opacity="1" fill="blue"/> \
          </svg></div>`;
};

const init_mouseover_effect = function _init_mouseovereffect(){
  for(let i=0; i < NO_OF_X; i ++){
    let div_id = `Button_${i}`;
    //$('#Game_container').append(`<div id="${div_id}" class="x_button"></div>`);
    $('.page-content').append(`<div id="${div_id}" class="x_button"></div>`);
    $(`#${div_id}`).css("position","absolute");
    $(`#${div_id}`).css("top",`${BOARD_TOP}px`);
    $(`#${div_id}`).css("left",`${i*CHECKER_DIAMETER + BOARD_LEFT}px`);
    $(`#${div_id}`).css("width",`${CHECKER_DIAMETER}px`);
    $(`#${div_id}`).css("height",`${CHECKER_DIAMETER*(NO_OF_Y)}px`);

    $(`#${div_id}`).click(()=>add_checker(i));
  }
};

/** Board position **/
const adjust_board_position = function _adjust_board_position(){
  // determine the screen width
  let scrWidth = $(window).width();
  let scrHeight = $(window).height();

  let boardWidth = CHECKER_DIAMETER * NO_OF_X;
  let boardHeight = CHECKER_DIAMETER * NO_OF_Y;
  BOARD_LEFT = (scrWidth - boardWidth)/2;
  BOARD_TOP = 110;

  
  $('#Board_cover').css('top' , `${BOARD_TOP}px`);
  $('#Board_cover').css('left' , `${BOARD_LEFT}px`);
  
};


/** Add Checker**/

const add_checker = function _add_checker(x){
  // get the empty y by check the x first empty place
  let y = check_empty_y_in_x(x,BOARD);

  if(y != -1){
  
    draw_animate_checker(y,x);
    // change logical status of slot
    BOARD[x][y].status = CURRENT_GAME.current_player;
    CURRENT_GAME.turn++;
    // Check if anyone win or the game draw
    if(!check_game_status(y,x)){
      //change the current player
      change_player();
    }
  }
};

const draw_animate_checker = function _draw_animate_checker(y, x){
      // set the id of the checker
    const checker_id = `Checker_${x}_${y}`;
    // add Checker to the board
    $('#Board_cover').append(`<div \
      id="${checker_id}" \
      class="checker player${CURRENT_GAME.current_player}" \
      style=" \
        height: ${CHECKER_DIAMETER*0.9}px; \
        width: ${CHECKER_DIAMETER*0.9}px; \
        margin: ${CHECKER_DIAMETER*0.05}px; \
        -moz-border-radius: ${CHECKER_DIAMETER*0.9/2}px; \
        -webkit-border-radius: ${CHECKER_DIAMETER*0.9/2}px; \
        border-radius: ${CHECKER_DIAMETER*0.9/2}px; \
        top: 0px; \
        left: ${BOARD[x][y].left}px; \
      " \
      ></div>`);

    //animate the checker
    $(`#${checker_id}`).animate({top: `+=${BOARD[x][y].top}px`},1000);
};


// if the y full, it will return -1
const check_empty_y_in_x = function _check_empty_y_in_x(x,board){
  let y = -1;
  for (let i = NO_OF_Y-1 ; i >= 0; i--){
    if(board[x][i].status === -1){
      y = i;

      break;
    }
  }
  return y;
};

const change_player = function _change_player(){
  CURRENT_GAME.current_player = (CURRENT_GAME.current_player +1)%2;
  if(CURRENT_GAME.current_player === 1){
    CURRENT_GAME.display_message.message = 'Yellow Player\'s turn';
    $('#Yellow_status_border').css('border-color','black');
    $('#Red_status_border').css('border-color','white');
    pc_turn();
  }else {
    CURRENT_GAME.display_message.message = 'Red Player\'s turn';
    $('#Yellow_status_border').css('border-color','white');
    $('#Red_status_border').css('border-color','black');
  }
};

const check_game_status = function _check_game_status(y,x){
  const current_slot = BOARD[x][y];
  let counter = 0;
  let end_slot = current_slot;
  let stop_game = false;
  let isDraw = true;
  let winObj = [];
  
    //then check the draw
  for(let i=0; i < NO_OF_X; i++){
    if(BOARD[i][0].status === -1){
      isDraw = false;
      break;
    }
  }

  if(isDraw){
    CURRENT_GAME.display_message.message = 'The game is draw.';
    stop_game = true;
  }

  winObj = am_i_win(x,y, CURRENT_GAME.current_player, BOARD);

  if(winObj.isWin){
    stop_game = win_actions(winObj.checker_pairs);
  }
  return stop_game;
};

const win_actions = function _win_actions(checker_pairs){
  if (CURRENT_GAME.current_player === 0){
    CURRENT_GAME.display_message.message = 'Red Player Win!';
  }else{
    CURRENT_GAME.display_message.message = 'Yellow Player Win!';
  }
  //draw a line between two slot
  for(let i=0; i < checker_pairs.length;i++){
    let current_slot = checker_pairs[i].start_slot;
    let end_slot = checker_pairs[i].end_slot;
    let a = `Start_${current_slot.id}_${end_slot.id}`;
    let b = `End_${current_slot.id}_${end_slot.id}`;
    let line = `${current_slot.id}_${end_slot.id}`;
    $('#Board_cover').append(`<div id="${line}" class="line"></div>`);
    $('#Board_cover').append(`<div id="${a}" class="point"></div>`);
    $('#Board_cover').append(`<div id="${b}" class="point"></div>`);
    a = '#' + a;
    b = '#' + b;
    line = '#' + line;
    $(a).css('top', `${current_slot.top + CHECKER_DIAMETER/2 -5}px`);
    $(a).css('left', `${current_slot.left + CHECKER_DIAMETER/2 -5}px`);
    $(b).css('top', `${end_slot.top + CHECKER_DIAMETER/2-5}px`);
    $(b).css('left', `${end_slot.left + CHECKER_DIAMETER/2-5}px`);
    drawLine(a, b, line);
  }

  // Remove the interactions button prevent user click
  $('.x_button').remove();
  return true;
};

/**WINNING CHECK**/
const am_i_win = function _am_i_win(x,y, current_player, board){
  let obj = {
    isWin: false,
    checker_pairs: []
  };
  let win_ary = [];
  win_ary.push(vertical_win(y, x, current_player, board));
  win_ary.push(horizontal_win(y, x, current_player,board));
  win_ary.push(backslash_win(y,x, current_player,board));
  win_ary.push(slash_win(y,x, current_player,board));
  
  for(let i=0; i < win_ary.length; i++){
    if(win_ary[i].isWin){
      obj.isWin = true;
      obj.checker_pairs.push({
        start_slot: win_ary[i].start_slot,
        end_slot: win_ary[i].end_slot
      });
    }
  }
  return obj;
};

const vertical_win = function _vertical_win(y, x, current_player, board){
  let counter = 0;
  let obj  = {
    isWin: false,
    start_slot: board[x][y],
    end_slot : board[x][y]
  };
  if(y <= (NO_OF_Y - WINNING_CONDITION )){
    for(let i = y; i < NO_OF_Y  ; i++){
      if(current_player === board[x][i].status){
        counter++;
        obj.end_slot = board[x][i];
      }else{
        break;
      }
    }

    if(counter >= WINNING_CONDITION){
      obj.isWin = true;
    }
  }
  return obj;
};
const horizontal_win = function _horizontal_win(y,x, current_player,board){
  //left
  let counter = 0;
  let obj  = {
    isWin: false,
    start_slot: board[x][y],
    end_slot : board[x][y]
  };
  for(let i = x; i >= 0; i-- ){
    if(current_player === board[i][y].status){
      counter++;
      obj.start_slot = board[i][y];
    }else{
      break;
    }    
  }
  //right
  if(x < NO_OF_X){
    for(let i = x+1; i < NO_OF_X; i++ ){
      if(current_player === board[i][y].status){
        counter++;
        obj.end_slot = board[i][y];
      }else{
        break;
      }    
    }
  }
  
  if(counter >= WINNING_CONDITION){
    obj.isWin = true;
  }
  return obj;
};

const backslash_win = function _backslash_win(y,x, current_player,board){
  let counter = 0;
  let obj  = {
    isWin: false,
    start_slot: board[x][y],
    end_slot : board[x][y]
  };
  let temp_x = x;
  let temp_y = y;

  //go -ve side first
  while(temp_x >=0 && temp_y >=0){
    
    if(current_player === board[temp_x][temp_y].status){

      counter++;
      obj.start_slot = board[temp_x][temp_y];
      temp_x--;
      temp_y--;
    }else{
      break;
    }
  }

  temp_x = x + 1;
  temp_y = y + 1;
  //go +ve side second
  while(temp_x < NO_OF_X && temp_y < NO_OF_Y){
  
    if(current_player === board[temp_x][temp_y].status){
      

      counter++;
      obj.end_slot = board[temp_x][temp_y];
      temp_x++;
      temp_y++;
    }else{
      break;
    }
  }

  if(counter >= WINNING_CONDITION){
    obj.isWin = true;
  }
  return obj;
};

const slash_win = function _slash_win(y,x, current_player,board){
  let counter = 0;
  let obj  = {
    isWin: false,
    start_slot: board[x][y],
    end_slot : board[x][y]
  };
  let temp_x = x;
  let temp_y = y;

  //go -ve side first
  while(temp_x >=0 && temp_y < NO_OF_Y){
    
    if(current_player === board[temp_x][temp_y].status){
      
      counter++;
      obj.end_slot = board[temp_x][temp_y];
      temp_x--;
      temp_y++;
    }else{
      break;
    }
  }

  temp_x = x + 1;
  temp_y = y - 1;
  //go +ve side second
  while(temp_x < NO_OF_X && temp_y >= 0){
    
    if(current_player === board[temp_x][temp_y].status){
      

      counter++;
       obj.start_slot = board[temp_x][temp_y];
      temp_x++;
      temp_y--;
    }else{
      break;
    }
  }

  if(counter >= WINNING_CONDITION){
    obj.isWin = true;
  }
  return obj;
};

/** AI **/

const pc_turn = function _pc_turn(){
  if(CURRENT_GAME.game_mode === 1 && CURRENT_GAME.current_player === 1){
    //block the button first
    $('.x_button').hide();
    $('.mdl-spinner').show();
    setTimeout(()=>{
      pc_add_checker();
      $('.mdl-spinner').hide();
      $('.x_button').show();
    },1000);
  }
};

const available_xAry = function _avaiable_xAry(board){
  let xAry = [];
  //first check which y still available
  for(let i = 0 ; i < NO_OF_X; i++){
    if(board[i][0].status === -1){
      xAry.push(i);
    }
  }
  return xAry;
};

const pc_add_checker = function _pc_add_checker(){
    add_checker(alpha_beta_BFS(BOARD, CURRENT_GAME.current_player, CURRENT_GAME.current_player));
};



const alpha_beta_BFS = function _aplpha_beta_BFS(board, current_player, your_player){
  let x_ary = available_xAry(board);
  let objAry = new Array(x_ary.length);
  let level  = 0;
  let nodesCounter = 0;
  const LEVEL_LIMIT = 5;
  // first construct the objAry
  for(let i=0; i < objAry.length; i++){
    let nodesCollection = {
      scores:0,
      position: x_ary[i],
      nodes: []
    };
    //push the first node in it
    let y = check_empty_y_in_x(x_ary[i],board);
    nodesCollection.nodes.push(create_node(board,x_ary[i],y,current_player,your_player,i, level));
    nodesCounter++;
    objAry[i] = nodesCollection;
  }

  //start the score calculate (search)
  while(level < LEVEL_LIMIT && nodesCounter>0){
    for(let i=0; i < objAry.length; i++){
      loop2:
      while (objAry[i].nodes.length > 0){
        if(objAry[i].nodes[0].level === level){
          let node = objAry[i].nodes.shift();
          nodesCounter--;
          let minmax_scores = get_minmax_score(node.board, node.current_player, node.your_player, node.x, node.y);
          objAry[i].scores += minmax_scores;
          let new_nodes = get_childs(node);
          objAry[i].nodes = objAry[i].nodes.concat(new_nodes);
          nodesCounter += new_nodes.length;

        }else{
          break loop2;
        }
      }
    }

    //judgment level
    objAry = get_max_score_positions(objAry);

    //update the nodesCounter for testing
    nodesCounter = 0;
    for(let i =0; i < objAry.length; i ++){
      nodesCounter += objAry[i].nodes.length;
    }
    if(objAry.length === 1){
      
      return objAry[0].position;
    }else if(objAry.length ===2){
      objAry = find_slot_with_more_space(objAry);
      return objAry[0].position;
    }
    level++;
  }

  if(level >= LEVEL_LIMIT){
    // find the slot with better chance
    objAry = find_slot_with_more_space(objAry);
    return objAry[0].position;
  }

  //how if still cannot find any result? random it
  return objAry[0].position;

};

const find_slot_with_more_space = function _find_slot_with_more_space(objAry){
  let positionAry = [];
  for(let i = 0; i < objAry.length; i++){
    let board = BOARD.clone();
    let x = objAry[i].position;
    let y = check_empty_y_in_x(x, board);
    objAry[i].scores = 0;
    //pretend all the vertical, horizontal, slach and backslash which is empty, will be your checker
    board = pretend_vertical_are_pc(x,y,board);
    board = pretend_horizontal_are_pc(x,y,board);
    board = pretend_slash_are_pc(x,y,board);
    board = pretend_backslash_are_pc(x,y,board);
    //one win for 1 score
    if(vertical_win(y, x, 1, board).isWin){
      objAry[i].scores++;
    }
    if(horizontal_win(y, x, 1, board).isWin){
      objAry[i].scores++;
    }
    if(backslash_win(y, x, 1, board).isWin){
      objAry[i].scores++;
    }
    if(slash_win(y, x, 1, board).isWin){
      objAry[i].scores++;
    }  
  }
  objAry = get_max_score_positions(objAry);
  return objAry;
};

const pretend_vertical_are_pc = function _pretend_vertical_are_pc(x,y,board){
  for(let i=y; i >= board[x].length; i--){
    board = change_board_status_to_pc_if_empty(x,i,board);
  }
  return board;
};

const pretend_horizontal_are_pc = function _pretend_horizontal_are_pc(x,y,board){
  for(let i=0; i < NO_OF_X; i++){
    board = change_board_status_to_pc_if_empty(i,y,board);
  }
  return board;
};

const pretend_slash_are_pc = function _pretend_slash_are_pc(x,y,board){
  //go -ve side first
  let temp_x = x;
  let temp_y = y;
  while(temp_x >=0 && temp_y >=0){ 
    board = change_board_status_to_pc_if_empty(temp_x,temp_y,board);
    temp_x--;
    temp_y--;
  }

  temp_x = x + 1;
  temp_y = y + 1;
  //go +ve side second
  while(temp_x < NO_OF_X && temp_y < NO_OF_Y){
    board = change_board_status_to_pc_if_empty(temp_x,temp_y,board); 
    temp_x++;
    temp_y++;
  }
  return board;
};

const pretend_backslash_are_pc = function _pretend_backslash_are_pc(x,y,board){
  //go -ve side first
  let temp_x = x;
  let temp_y = y;
   while(temp_x >=0 && temp_y < NO_OF_Y){
    board = change_board_status_to_pc_if_empty(temp_x,temp_y,board);
    temp_x--;
    temp_y++;
  }

  temp_x = x ++;
  temp_y = y --;
  //go +ve side second
  while(temp_x < NO_OF_X && temp_y >= 0){
    board = change_board_status_to_pc_if_empty(temp_x,temp_y,board); 
    temp_x++;
    temp_y--;
  }
  return board;
};

const change_board_status_to_pc_if_empty = function _change_board_status_to_pc_if_empty(x,y,board){
    if(board[x][y].status === -1){
      board[x][y].status = 1;
    }
    return board;
};

const get_childs = function _get_childs(parent){

  let x_ary = available_xAry(parent.board);
  let node_ary = [];
  for(let j=0; j < x_ary.length; j++){
    let y = check_empty_y_in_x(x_ary[j],parent.board);
    let current_player = (parent.current_player+1)%2;
    node_ary.push(create_node(parent.board,x_ary[j],y,current_player,parent.your_player,parent.x_ary_no, parent.level+1));
  }
  return node_ary;
};

const create_node = function _create_node(board,x,y,current_player,your_player,x_ary_no, level){
  let node = {};
  let new_board = board.clone();
  new_board[x][y].status = current_player;
  node = {
      board: new_board,
      current_player: current_player,
      your_player:your_player,
      x:x,
      y:y,
      x_ary_no:x_ary_no,
      level: level
  };
  return node;
};


/**
Pretend this turn you already in, try the first child score
**/
const get_all_child_score = function _get_all_child_score(board, current_player, your_player,x ,y ){
  let x_ary = available_xAry(board);
  let score_ary = [];
  let next_player = (current_player +1) %2;
  board[x][y].status = current_player;
  if(xAry.length > 0){
    for(let i=0; i < x_ary.length; i++){
      let temp_y = check_empty_y_in_x(x_ary[i],board);
      board[xAry[i]][temp_y].status = next_player;
      score_ary.push(get_minmax_score(board, next_player, your_player, x_ary[i],temp_y));
    }
    return score_ary.reduce((a, b) => a + b, 0);
  }else{
    return -1;
  }

};

/**this one need unit test**/
const get_minmax_score = function _get_minmax_score(board, current_player, your_player, x,y){
  let score = 0;
  let winObj = am_i_win(x,y,current_player,board);
  if(winObj.isWin){
    if(current_player === your_player){
      score =2;
    }else{
      score = -1;
    }
  }
  return score;
};

function unit_test_get_minmax_score(){
  let board = BOARD.clone();
  board[0][5].status = 1;
  board[0][4].status = 1;
  board[0][3].status = 1;
  board[0][2].status = 1;
  console.log(board);
  //you are the player
  console.log(get_minmax_score(board, 1, 1, 0,2));
  //you are the not player
  console.log(get_minmax_score(board, 1, 0, 0,2));
}

const get_max_score_position = function _get_max_score_position(score_ary){
  let position = 0;
  let maxVal = score_ary[0];
  let isDifferent = false;
  for(let i=1; i < score_ary.length; i++){
    if(maxVal > score_ary[i]){
      isDifferent = true;
    }else if(score_ary[i] > maxVal){
      isDifferent = true;
      maxVal = score_ary[i];
      position = i;
    }
  }
  if(isDifferent){
    // need to check is it unique
    let counter = score_ary.filter((result)=>result===score_ary[position]).length;
    if(counter === 1){
      return position;
    }else{
      position = -1;
    }
  }else{
    position =  -1;
  }
  return position;
};

const get_max_score_positions = function _get_max_score_positions(objAry){
  let maxVal = objAry[0].scores;
  let isDifferent = false;
  let new_ary = [];
  for(let i=1; i < objAry.length; i++){
    if(maxVal > objAry[i].scores){
      isDifferent = true;
    }else if(objAry[i].scores > maxVal){
      isDifferent = true;
      maxVal = objAry[i].scores;
    }
  }
  if(isDifferent){
    for(let i=0; i < objAry.length; i++){
      if(objAry[i].scores === maxVal){
        new_ary.push(objAry[i]);
      }
    }
  }else{
    new_ary = objAry;
  }
  return new_ary;
};

function test_position(){
  let ary = [7];
  ary[0] = {scores:-12000};
  ary[1] = {scores:-12000};
  ary[2] = {scores:0};
  ary[3] = {scores:0};
  ary[4] = {scores:-12000};
  ary[5] = {scores:-12000};
  ary[6] = {scores:-12000};
  console.log(ary.length);
  ary = get_max_score_positions(ary);
  console.log(ary.length);
}
/** Utility 
Clone the array
**/
Array.prototype.clone = function() {
  let new_ary = new Array(this.length);
  for(let i=0; i < new_ary.length; i++){
    new_ary[i] = new Array(this[i].length);
    for(let j=0; j < new_ary[i].length; j++){
      new_ary[i][j] = {
        status: this[i][j].status
      };
    }
  }
  return new_ary;
};

/** draw line for winning by 
David D. Boling
https://codepen.io/daveboling/pen/jWOorz
**/
function lineDistance(x, y, x0, y0){
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

function drawLine(a, b, line) {
  var pointA = $(a).offset();
  var pointB = $(b).offset();
  var pointAcenterX = $(a).width() / 2;
  var pointAcenterY = $(a).height() / 2;
  var pointBcenterX = $(b).width() / 2;
  var pointBcenterY = $(b).height() / 2;
  var angle = Math.atan2(pointB.top - pointA.top, pointB.left - pointA.left) * 180 / Math.PI;
  var distance = lineDistance(pointA.left, pointA.top, pointB.left, pointB.top);


  // Set Angle
  $(line).css('transform', 'rotate(' + angle + 'deg)');

  // Set Width
  $(line).css('width', distance + 'px');
                  
  // Set Position
  $(line).css('position', 'absolute');
  if(pointB.left < pointA.left) {
    $(line).offset({top: pointA.top + pointAcenterY, left: pointB.left + pointBcenterX});
  } else {
    $(line).offset({top: pointA.top + pointAcenterY, left: pointA.left + pointAcenterX});
  }
}


