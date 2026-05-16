// ═══ 8BFR GAME SESSION MANAGER ═══
// Tracks active games. If you leave mid-game, you must forfeit or resume.
// Include this on every game page BEFORE the game script.

(function(){
var KEY='8bfr_game_session';
var db=null;
try{db=window.supabase.createClient('https://novbuvwpjnxwwvdekjhr.supabase.co','sb_publishable_xUzu8q8DhqqS9c8SQUDPlA_N8dUVz5f');}catch(e){}

function getSession(){
  try{var s=localStorage.getItem(KEY);return s?JSON.parse(s):null;}catch(e){return null;}
}
function saveSession(data){
  try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){}
}
function clearSession(){
  try{localStorage.removeItem(KEY);}catch(e){}
}

window.GameSession={
  // Call when game starts
  start:function(gameName,userId){
    saveSession({game:gameName,userId:userId||null,startedAt:Date.now(),active:true});
  },

  // Call when game ends normally (win or lose)
  end:function(){
    clearSession();
  },

  // Forfeit - records a loss
  forfeit:async function(){
    var sess=getSession();
    if(!sess||!sess.active)return;
    // Record as loss
    if(db&&sess.userId){
      try{await db.rpc('record_game_result',{p_user_id:sess.userId,p_game:sess.game,p_won:false,p_coins:0});}catch(e){}
    }
    clearSession();
    return true;
  },

  // Check if there's an active session
  getActive:function(){
    return getSession();
  },

  // Check if user has an active game somewhere else
  checkOtherGame:function(currentGame){
    var sess=getSession();
    if(!sess||!sess.active)return null;
    if(sess.game===currentGame)return null;// Same game, they're resuming
    return sess;// Different game is active
  },

  // Show forfeit UI if needed
  showForfeitBar:function(gameName){
    var existing=document.getElementById('forfeitBar');
    if(existing)existing.remove();

    var sess=getSession();
    if(!sess||!sess.active||sess.game!==gameName)return;

    var bar=document.createElement('div');
    bar.id='forfeitBar';
    bar.style.cssText='position:fixed;bottom:0;left:0;right:0;z-index:9999;background:rgba(239,68,68,.9);padding:.4rem .6rem;display:flex;justify-content:space-between;align-items:center;font-size:.72rem;color:#fff;font-weight:600;';
    bar.innerHTML='<span>Game in progress</span><button onclick="GameSession.forfeit().then(function(){document.getElementById(\'forfeitBar\').remove();location.reload();})" style="background:#fff;color:#ef4444;border:none;padding:.25rem .6rem;border-radius:6px;font-weight:700;font-size:.68rem;cursor:pointer;">Forfeit</button>';
    document.body.appendChild(bar);
  },

  // Show "you have a game in progress" warning on non-game pages
  showReturnBar:function(){
    var sess=getSession();
    if(!sess||!sess.active)return;

    var bar=document.createElement('div');
    bar.id='gameReturnBar';
    bar.style.cssText='position:fixed;bottom:62px;left:0;right:0;z-index:9998;background:rgba(251,191,36,.9);padding:.35rem .5rem;display:flex;justify-content:space-between;align-items:center;font-size:.68rem;color:#000;font-weight:600;';

    var gameNames={
      pool8:'Pool 8-Ball',pool9:'Pool 9-Ball',pooltrick:'Pool Trick Shot',
      chess:'Chess',checkers:'Checkers',connect4:'Connect 4',tictactoe:'Tic-Tac-Toe',
      darts:'Darts',bowling:'Bowling',basketball:'Basketball',soccer:'Soccer',
      mazemuncher:'Maze Muncher',barreldodge:'Barrel Dodge',spaceblaster:'Space Blaster',
      minesweeper:'Minesweeper',wordblitz:'Word Blitz',letterstorm:'Letter Storm',
      dice:'Dice Frenzy',wildcards:'Wild Cards',hearts:'Hearts',spades:'Spades',solitaire:'Solitaire'
    };
    var gameFiles={
      pool8:'pool-game.html',pool9:'pool-game.html',pooltrick:'pool-game.html',
      chess:'chess-game.html',checkers:'checkers-game.html',connect4:'connect4-game.html',
      tictactoe:'tictactoe-game.html',darts:'darts-game.html',bowling:'bowling-game.html',
      basketball:'basketball-game.html',soccer:'soccer-game.html',
      mazemuncher:'mazemuncher-game.html',barreldodge:'barreldodge-game.html',
      spaceblaster:'spaceblaster-game.html',minesweeper:'minesweeper-game.html',
      wordblitz:'wordblitz-game.html',letterstorm:'letterstorm-game.html',
      dice:'dice-game.html',wildcards:'wildcards-game.html',hearts:'hearts-game.html',
      spades:'spades-game.html',solitaire:'solitaire-game.html'
    };
    var name=gameNames[sess.game]||sess.game;
    var file=gameFiles[sess.game]||'multiplayer-games.html';

    bar.innerHTML='<span>'+name+' in progress</span><div><a href="'+file+'" style="background:#000;color:#fbbf24;padding:.2rem .5rem;border-radius:5px;font-size:.62rem;text-decoration:none;font-weight:700;margin-right:.3rem;">Return</a><button onclick="GameSession.forfeit().then(function(){document.getElementById(\'gameReturnBar\').remove();})" style="background:rgba(0,0,0,.2);color:#000;border:none;padding:.2rem .5rem;border-radius:5px;font-size:.62rem;font-weight:700;cursor:pointer;">Forfeit</button></div>';
    document.body.appendChild(bar);
  }
};

// On non-game pages, show return bar if game is active
var path=(location.pathname||'').toLowerCase();
var isGamePage=/game\.html|pool-|chess-|checkers-|connect4-|darts-|bowling-|basketball-|soccer-|maze|barrel|space|mine|word|letter|dice-|wild|hearts-|spades-|solitaire-/.test(path);
if(!isGamePage){
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){GameSession.showReturnBar();});
  }else{
    GameSession.showReturnBar();
  }
}
})();
