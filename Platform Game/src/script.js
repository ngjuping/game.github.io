    var dialogues;
    var tips;
    var tips_container;
    var menu;
    var startGameBtn;
    var pauseGame;
    var homeBtn;
    var gameIsPaused = false;
    var musicBtn;
    var mute = false;
    var musicPlayer;
    var helpBtn;
    var helpBtn2;
    var helpPanel;
    var closeBtn
    var deathBoard;
    var scoreBoard;
    var secondsTaken = 0;
    var gameOverStatus = true;
    var helpStatus = 0;
    var settings;
    window.onload = function()
    {
        //DOM elements
        dialogues = Array.from(document.getElementsByClassName("dialogues"));
        tips = Array.from(document.getElementsByClassName("tips"));
        tips_container = document.getElementById("tips_container");
        menu = document.getElementById("menu");
        startGameBtn = document.getElementById("startBtn");
        startGameBtn.addEventListener("click",()=>{gameOverStatus = false; musicPlayer.play();startGame();menu.style.display = "none";});
        pauseGame = document.getElementById("pauseBtn");
        homeBtn = document.getElementById("homeBtn");
        homeBtn.addEventListener("click",()=>{history.go(0)});
        helpBtn = document.getElementById("helpBtn");
        helpBtn2 = document.getElementById("helpBtn2");
        helpPanel = document.getElementById("helpPanel");
        helpBtn.addEventListener("click",()=>{
            if(helpStatus==0)
            {
                openHelp();
                helpStatus = 1;
            }
            else
            {
                closeHelp();
                helpStatus = 0;
            }
        })
        helpBtn2.addEventListener("click",()=>{
            if(helpStatus==0)
            {
                openHelp();
                helpStatus = 1;
            }
            else
            {
                closeHelp();
                helpStatus = 0;
            }
        })
        closeBtn = document.getElementById("closeBtn");
        closeBtn.addEventListener("click",()=>{
            closeHelp();
            helpStatus = 0;
        });

        musicBtn = document.getElementById("musicBtn");
        musicPlayer = document.getElementById("musicPlayer");
        musicBtn.addEventListener("click",()=>{
            if(!mute){
                musicPlayer.pause();
                musicBtn.style.backgroundImage = "url('../src/muted.jpg')";
                mute = true;
            } 
            else{
                musicPlayer.play();
                musicBtn.style.backgroundImage = "url('../src/unmute.jpg')";
                mute = false;
            }});
        deathBoard = document.getElementById("deaths");
        scoreBoard = document.getElementById("score");
        settings = document.getElementById("btnContainer");
    }
    function openHelp()
    {
        helpPanel.classList.remove("hidden");
    }
    function closeHelp()
    {
        helpPanel.classList.add("hidden");
    }
    function restartDialogues(dialoguesArr)
    {
        for(var i=0 ; i<dialoguesArr.length ; i++)
        {
            dialoguesArr[i].classList.add("hidden");
        }
    }
    function restartTips(tipsArr)
    {
        for(var i=0 ; i<tipsArr.length ; i++)
        {
            tipsArr[i].classList.add("hidden");
        }
    }
    function startGame(){
    //game elements
    var gravity = 0.4;
    var moveStatus = 1;
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    var innerWidth = 1800;
    var innerHeight = 900;
    var pauseStatus = 0;
    var distanceTravelled = 0;
    var verticalDisplacement = 0;
    var blocksGenerated = 0;
    var tempFunc = {};
    var distanceMultiplier = 1;
    var meteors = [];
    var lastPressedKey = "left";
    const missionTrigger = 1000;
    var missionVal = 1;
    var endMissions = false;
    var end = false;
    var currentStageBgsrc = "url('../src/background/background5.jpg'";
    
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    //initialize mashimaro
    var player = new Player(60,60,canvas.width/2,canvas.height/2,"hero","../src/hero/m7.png");
    var deadLocation = [];
    var deadImage = new Image();
    deadImage.src = "../src/death.png";
    var lastX = 0;
    var lastY = 0;
    //initialize enemy
    
    minionSrc_r = "../src/enemy/enemy10.png";
    minionSrc_l = "../src/enemy/enemy7.png";
    flySrc_r = "../src/enemy/enemy4.png";
    flySrc_l = "../src/enemy/enemy11.png";
    var enemyArr = [];
    //Initialize obstacles
    //function Obstacles(blockType,x,y,i_vy="none",i_vx=0)
    var base = new Obstacles("6",0,canvas.height+200,"none",0);
    var top = new Obstacles("6",0,-500,"none",0);
    var terrains = [base];
    var obstacles_details = [["4",0,500,"none",10],["3",canvas.width,350,"none",-6],["5",canvas.width,230,"none",-11],
                             ["2",canvas.width,420,"none",-7],["7",canvas.width,300,"none",-9,"2"],["3",canvas.width,200,"none",-5],
                             ["5",canvas.width,160,"none",-8],["3",canvas.width,250,"none",-7],["4",canvas.width,500,"none",-8],
                             ["4",canvas.width,650,"none",-10,"2"]];
    var obstacles_details_vertical = [["2",canvas.width,100,"none",-9,"1"],["3",canvas.width,900,"none",-10,"1"],["4",canvas.width,450,"none",-5,"1"]];
    var obstacles = [];
    var checkPoint = new Obstacles("8",150,base.y-(Math.random()+0.3)*500,"none",0);
    
    var portal = new Others(canvas.width-400,0,500,base.y-top.y,"portal","../src/portal.png");
    var spaceShip = new Others(canvas.width,canvas.height/2,800,800,"spaceShip","../src/spaceShip.png");
    var others = [];
    setInterval(()=>{lastX = player.x ; lastY = player.y},300);
    
    newterrain(6);
    var timer1 = setInterval(spawn_meteor,8000);
    var timer2 = setInterval(()=>{secondsTaken++;},1000);
    var timer3 = setInterval(()=>{
        if(index<8)
        {
            prev.classList.add("hidden");
            index++;
            prev = dialogues[index];
            prev.classList.remove("hidden");
            blocksGenerated++;
        }
        },2500);

    var prev = dialogues[0];
    prev.classList.remove("hidden");
    var index = 0;
    var dialogueTrigger = 9;

    //camera trigger
    pauseGame.addEventListener("click",pauseClick)
    function pauseClick(){
        if(pauseStatus == 0)
        {
            pauseGame.style.backgroundImage = "url('../src/paused.png')";
            pause();
        }
        else
        {
            pauseGame.style.backgroundImage = "url('../src/resumed.png')";
            unpause();
        }
            
    }
    //keydown event
    function keyDown(e){
        player.keyup = false;
        if(moveStatus==1)
        {
            if(e.code=='ArrowLeft')
            {
                lastPressedKey = "left";
                prevCode = e.code;
                player.vx = -7;
            }
            
            if(e.code=='ArrowUp'&&player.inAirStatus<2)
            {
                lastPressedKey = "up";
                player.inAirStatus++;//prevent infinite fly
                player.bounce = -0.6;
                player.vy = -14;
                // setTimeout(()=>{enemy.vy = (player.y-enemy.y)/20},Math.random()*1000);
                //setTimeout(()=>{enemy2.vy = (player.y-enemy2.y)/15},1000);
            }
                
            if(e.code=='ArrowRight')
            {
                lastPressedKey = "right";
                prevCode = e.code;
                player.vx = 7;
            }
                
            if(e.code=='ArrowDown')
            {
                lastPressedKey = "down";
            }
            if(e.code=='Space')
            {
                if(player.charge==1)
                {
                    switch(lastPressedKey)
                    {
                        case "left":
                        player.x -= 200;
                        break;
                        case "right":
                        player.x += 200;
                        break;
                        case "up":
                        player.y -= 200;
                        break;
                        case "down":
                        player.y += 200;
                        break;
                    }
                    setTimeout(()=>{player.charge=1},2000);
                    player.charge--;
                    player.vy = 0;
                }
            }
            if(e.code=='Escape')
            {
                if(pauseStatus == 0)
                {
                    pauseGame.style.backgroundImage = "url('../src/paused.png')";
                    pause();
                }
                else
                {
                    pauseGame.style.backgroundImage = "url('../src/resumed.png')";
                    unpause();
                }
            }        
        }
    }
    window.addEventListener("keydown",keyDown);
    function keyUp(e){
        if(e.code=='ArrowRight'||e.code=='ArrowLeft')
        {
            player.keyup = true;
        }
        if(e.code=='ArrowUp')
        {
            player.bounce = -0.6;
            player.jumpCount++;
        }
    }

    window.addEventListener("keyup",keyUp);
    
    function Others(x,y,width,height,type,src)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.img = new Image();
        this.img.src = src;
    }
    Others.prototype.updateImg = function()
    {
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }

    function Meteor(x,y,width,height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.img.src = "../src/background/background3.png";
        this.img2 = new Image();
        this.img2.src = "../src/background/background4.png";
        if(Math.random()>0.5)
        {
            this.direction = "r";
        }
        else
        {
            this.direction = "l";
            this.x = canvas.width - this.width - 20;
        }
        
    }
    Meteor.prototype.draw = function()
    {
        if(this.direction=="r")
        {
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
        else
        {
            ctx.drawImage(this.img2,this.x,this.y,this.width,this.height);
        }
    }
    Meteor.prototype.updatePos = function()
    {
        if(this.direction=="r")
        {
            this.x ++;
            this.y ++;
        }
        else
        {
            this.x--;
            this.y++;
        }
    }

    function spawn_meteor()
    {
        var randomSize = Math.random()*400;
        var meteor = new Meteor(0,Math.random()*200,randomSize,randomSize);
        meteors.push(meteor);
        if(meteors.length>10)
        {
            meteors.shift();
        }
    }
    function disableMovement()
    {
        moveStatus = 0;
    }
    function enableMovement()
    {
        moveStatus = 1;
    }
    function death(player)
    {
        deadLocation.push([player.x,player.y]);
        if(gameOverStatus===false)
        {
            disableContainedIn(1200,()=>{
                setBackground(currentStageBgsrc,1)
                enableMovement();
                player.invulnerable = false;
            })
        }
        
        disableMovement();
        setBackground("url('../src/background/respawn.gif')",1)
        player.invulnerable = true;
        deathBoard.innerText = deadLocation.length+"";
        
        checkPoint.x = 200;
        player.x = checkPoint.x;
        player.y = top.y;
        player.vx = 0;

        for(let j=0 ; j<enemyArr.length ; j++)
        {
            enemyArr[j].attackCount = 0;
        }
        for(let i=0 ; i<obstacles.length ; i++)
        {
            obstacles[i].x += 150;
            obstacles[i].vx = 2;
        }
        for(let i=0 ; i<terrains.length ; i++)
        {
            if(terrains[i].blockType=="6" || terrains[i].trueType == "checkpoint") continue;
            terrains[i].x += 150;
            terrains[i].vx = 2;
        }
        distanceMultiplier += 0.3;//penalty
        //     if(obstacles[i].spikeType == "0" && obstacles[i].type=="platform" && obstacles[i].x>0 && !isTargeted(obstacles[i]))
        //     {
        //         player.x = obstacles[i].x + obstacles[i].width/2;
        //         player.y = obstacles[i].y - player.height;
        //         return 0;
        //     }
        // }
        obstacles.push(new Obstacles("2",checkPoint.x+200,checkPoint.y-Math.random()*400,"none",2));
        if(presentBrick()<1)
        {
            gameOver("lose")
        }
        
        
    }
    function presentBrick()
    {
        var init = obstacles.length;
        for(var i=0 ; i<obstacles.length ; i++)
        {
            if(obstacles[i].x>canvas.width)
            {
                init--;
            }
        }
        return init;
    }
    function newterrain(number)
    {
        var obs = obstacles_details[0];
        for(var i=0 ; i<number ; i++)
        {
            obstacles.push(new Obstacles(obs[0],obs[1],obs[2],obs[3],obs[4],obs[5]));
            obstacles_details.push(obstacles_details.shift());
            obs = obstacles_details[0];
        } 
    }
    function disableContainedIn(duration,callback)
    {
        if(Player.prototype.containedIn.toString()!="function(){}")
        {
            tempFunc.containedIn = Player.prototype.containedIn;
        }
        Player.prototype.containedIn = function(){};//disable containedIn
        setTimeout(()=>{
            Player.prototype.containedIn = tempFunc.containedIn;
            callback();
        },duration);
    }

    
    function setBackground(url,opacity=1)
    {
        canvas.style.background = url;
        canvas.style.opacity = opacity+"";
        canvas.style.backgroundSize = "100% 100%";
    }

    function pause(gif="url('../src/pause.jpg')")
    {
        tempFunc.animate = animate;
        animate = function(){};
        pauseStatus = 1;
        if(gameOverStatus==false)
        {
            tips_container.classList.remove("hidden");
            tips[0].classList.remove("hidden");
        }
        setBackground(gif,0.8);
        clearInterval(timer1);
        clearInterval(timer2);
        clearInterval(timer3);
        settings.style.right = "38%";
        settings.style.top = "17%";
    }

    function unpause()
    {
        animate = tempFunc.animate;
        pauseStatus = 0;
        settings.style.right = "0px";
        settings.style.top = "0px";
        tips_container.classList.add("hidden");
        tips[0].classList.add("hidden");
        tips.push(tips.shift());
        setBackground(currentStageBgsrc,1);
        timer1 = setInterval(spawn_meteor,8000);
        timer2 = setInterval(()=>{secondsTaken++},1000);
        timer3 = setInterval(()=>{
            if(index<8)
            {
                prev.classList.add("hidden");
                index++;
                prev = dialogues[index];
                prev.classList.remove("hidden");
                blocksGenerated++;
            }
            },2500);
        animate();
    }


    function Obstacles(blockType,x,y,i_vy="none",i_vx="none",spikeType="0")
    {
        this.s_width = 40//width of a square block
        this.s_height = 40;//height of a square block
        this.width = 0;
        this.height = 0;
        this.x = x;
        this.y = y;
        this.vy = i_vy+gravity;
        this.vx = i_vx;
        this.bounce = -0.6;
        this.type = "platform";
        this.blockType = blockType;
        this.attribute = "none";
        this.spikeType = spikeType;
        this.trueType = "obstacles";

        this.bricks = new Image();
        this.cover = new Image();
        this.bricks.src = "../src/bricks/brick1.jpg";
        this.cover.src = "../src/bricks/grass1.jpg";

        this.spikeUp = new Image();
        this.spikeDown = new Image();
        this.spikeLeft = new Image();
        this.spikeRight = new Image();
        if(this.spikeType=="1")
        {
            this.cover.src = "../src/bricks/spikes.png";
        }
        if(this.spikeType=="2")
        {
            this.spikeUp.src = "../src/bricks/spikes.png";
            this.spikeDown.src = "../src/bricks/spikeDown.png";
            this.spikeLeft.src = "../src/bricks/spikeLeft.png";
            this.spikeRight.src = "../src/bricks/spikeRight.png";
        }
        if(i_vy=="none" && i_vx=="none")
        {
            this.type = "checkpoint";
        }
            
        
        this.fire = new Image();
        this.fire.src = "../src/bricks/fire3.jpg";
        this.fire2 = new Image();
        this.fire2.src = "../src/bricks/fire1.png";
        this.steel1 = new Image();
        this.steel1.src = "../src/bricks/steel1.jpg";
        this.ice1 = new Image();
        this.ice1.src = "../src/bricks/ice1.jpg";
        this.tech1 = new Image();
        this.tech1.src = "../src/bricks/tech1.jpg";
        this.checkpoint = new Image();
        this.checkpoint.src = "../src/bricks/checkpoint.jpg";

        if(i_vy=="none")
        {
            this.type = "platform";
        }
        //this.vy = gravity;
        
        switch(this.blockType)
        {
            case "1":
            this.matrix = [[1,0,0,0],
                           [0,0,0,0],
                           [0,0,0,0],
                           [0,0,0,0]];
            this.width = 1*this.s_width;
            this.height = 1*this.s_height;
            this.type = "killing_block";
            this.trueType = "killing_block";
            
                        
            break;
            case "2":
            this.matrix = [[1,1,1,1],
                           [1,1,1,1],
                           [0,0,0,0],
                           [0,0,0,0]];
            this.width = 4*this.s_width;
            this.height = 2*this.s_height;
            break;
            case "3":
            this.matrix = [[1,1,1,0],
                           [1,1,1,0],
                           [1,1,1,0],
                           [0,0,0,0]];
            this.width = 3*this.s_width;
            this.height = 3*this.s_height;
            break;

            case "4":
            this.matrix = [[1,1,1,1],
                           [1,1,1,1],
                           [1,1,1,1],
                           [1,1,1,1]]
            this.width = 4*this.s_width;
            this.height = 4*this.s_height;
            break;

            case "5":
            this.matrix = [[1,1,1,1,1,1,1],
                           [0,1,1,0,1,1,0],
                           [0,1,1,0,1,1,0],
                           [1,1,1,1,1,1,1]];

            this.width = 7*this.s_width;
            this.height = 4*this.s_height;
            break;
            case "6":
            this.matrix = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],]
            this.width = 45*this.s_width;
            this.height = 2*this.s_height;
            break;
            case "7":
            this.matrix = [[1,1,1,1,1,1],
                           [1,1,1,1,1,1],
                           [1,1,1,1,1,1],
                           [1,1,1,1,1,1]]
            this.width = 6*this.s_width;
            this.height = 4*this.s_height;
            break;
            case "8":
            this.matrix = [[1,1,1,1,1],
                           [1,1,0,1,1],
                           [1,0,0,0,1],
                           [1,1,0,1,1]]
            this.width = 5*this.s_width;
            this.height = 4*this.s_height;
            break;
            default:
            this.matrix = [[1,0,0,0],
                           [1,0,0,0],
                           [1,0,0,0],
                           [1,0,0,0]]
            this.width = 1*this.s_width;
            this.height = 4*this.s_height;
        }        
        
    }
    function drawAlgo(img,obj)
    {
        for(var i=0 ; i<obj.width/obj.s_width ; i++)
        {
            for(var j=0 ; j<obj.height/obj.s_height ; j++)
            {
                if(obj.matrix[j][i]==1)
                {
                    ctx.drawImage(img,obj.x+i*obj.s_height,obj.y+j*obj.s_width,obj.s_width,obj.s_height);
                }
            }
        }
    }
    
    function drawAlgo_spiky(defBrick,obj)
    {
        for(var i=0 ; i<obj.width/obj.s_width ; i++)
        {
            for(var j=0 ; j<obj.height/obj.s_height ; j++)
            {
                if(obj.matrix[j][i]==1)
                {
                    if(i!=0 && i!=obj.width/obj.s_width-1)
                    {
                        if(j==0)
                        {
                            ctx.drawImage(obj.spikeUp,obj.x+i*obj.s_height,obj.y+j*obj.s_width,obj.s_width,obj.s_height);
                        }
                        else if(j==obj.height/obj.s_height-1)
                        {
                            ctx.drawImage(obj.spikeDown,obj.x+i*obj.s_height,obj.y+j*obj.s_width,obj.s_width,obj.s_height);
                        }
                    }
                    else if(j!=0 && j!=obj.height/obj.s_height-1)
                    {
                        if(i==0)
                        {
                            ctx.drawImage(obj.spikeLeft,obj.x+i*obj.s_height,obj.y+j*obj.s_width,obj.s_width,obj.s_height);
                        }
                        else if(i==obj.width/obj.s_width-1)
                        {
                            ctx.drawImage(obj.spikeRight,obj.x+i*obj.s_height,obj.y+j*obj.s_width,obj.s_width,obj.s_height);
                        }
                    }
                    if(j!=0 && j!=obj.height/obj.s_height-1 && i!=0 && i!=obj.width/obj.s_width-1)
                    {
                        ctx.drawImage(defBrick,obj.x+i*obj.s_height,obj.y+j*obj.s_width,obj.s_width,obj.s_height);
                    }
                }
            }
        }
    }
    Obstacles.prototype.draw = function()
    {
        if(this.blockType=="1" && this.type!="killing_block")//infected platform
        {
            drawAlgo(this.fire,this);
        }
        else if(this.spikeType=="2")
        {
            drawAlgo_spiky(this.bricks,this);
        }
        else if(this.blockType=="1" && this.type=="killing_block")//killing block
        {
            drawAlgo(this.fire2,this);
        }
        else if(this.blockType=="4")
        {
            drawAlgo(this.steel1,this);
        }
        else if(this.blockType=="5")
        {
            drawAlgo(this.ice1,this);
        }
        else if(this.blockType=="6")//base
        {
            drawAlgo(this.tech1,this);
        }
        else if(this.blockType=="8")
        {
            drawAlgo(this.checkpoint,this);
        }
        
        else
        {
            for(var i=0 ; i<4 ; i++)
            {
                for(var j=0 ; j<4 ; j++)
                {
                    if(this.matrix[j][i]==1)
                    {
                        if(j==0)
                        {
                            ctx.drawImage(this.cover,this.x+i*this.s_height,this.y+j*this.s_width,this.s_width,this.s_height)
                        }
                        else{
                            ctx.drawImage(this.bricks,this.x+i*this.s_height,this.y+j*this.s_width,this.s_width,this.s_height);
                        }
                    }
                }
            }
        }
        
    }

    Obstacles.prototype.updatePos = function()
    {
        if(this.type=="platform")
        {
            this.vy = 0;
        }
        if(this.vx!=0 && this.attribute!="bullet")
        {
            this.vx *= 0.99;
        }
        if(this.type=="killing_block"  && this.attribute!="bullet" && Math.abs(this.vy)<14)
        {
            this.vy += gravity;
        }
        else if(this.type=="platform_block" && Math.abs(this.vy)<14)
        {
            this.vy += gravity/2;
        }
        if(this.type!="platform")
        {
            this.y += this.vy;
        }
            this.x += this.vx;
        
    }



    //----------------------------------------------------------------------------------------------------------------------
    //Player constructor -- DONE
    function Player(width,height,x,y,type,src,extra)
    {
        //Variables
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.type = type;
        this.invulnerable = false;
        this.keyup = false;
        this.inAirStatus = 0;
        this.jumpCount = 0;
        this.bounce = -0.8;//negative number, go up
        this.img = new Image();
        this.img.src = src;
        this.aim = new Image();
        this.aim.src = "../src/hero/aim2.png";
        this.vxSlowRate = 0.25;
        this.charge = 1;
        this.extra = extra;
        

        if(this.type=="enemy")
        {
            this.movedDistance = 0;
            this.attackCount = 0;
            this.bounce = -1;
            this.initialX = x;
            this.initialY = y;
            this.targetPlatform = "none";
            Player.prototype.follow = function(target)
            {
                if(this.extra == "minion")
                {
                    if(target.x>=this.x)
                    {
                        this.img.src = minionSrc_r;
                    }
                    else
                    {
                        this.img.src = minionSrc_l;
                    }
                }
                if(this.extra == "fly")
                {
                    (target.x-this.x)>0? this.vx = Math.abs(target.x-this.x)/200+1 : this.vx = -1*Math.abs(target.x-this.x)/200 -1;
                    if(target.x>=this.x)
                    {
                        this.img.src = flySrc_r;
                    }
                    else
                    {
                        this.img.src = flySrc_l;
                    }
                    if(this.y <= target.y)
                    {
                        this.vy = Math.abs(this.y-target.y)/300;
                        if(this.vy>10)
                        {
                            this.vy = 10;
                        }
                        
                    }
                    else
                    {
                        this.vy = -Math.abs(this.y-target.y)/300;
                        if(this.vy<-10)
                        {
                            this.vy = -10;
                        }
                    }
                    if(distanceBetween(this,target)<=400 && this.attackCount<1)
                    {
                        (target.x-this.x)>0? this.vx += 3 : this.vx -= 3;
                        this.attack(target);
                        this.attackCount++;
                        return 1;
                    }
                }
                if(this.extra == "boss")
                {
                    (target.x-this.x)>0? this.vx = (Math.abs(this.x-target.x)/400) : this.vx = -Math.abs(this.x-target.x)/400;
                    if(this.y>=lastY+target.height*2)
                    {
                        this.vy += -(Math.abs(this.y-target.y)/600)-3;
                    }
                }
                
                
            }
            function distanceBetween(src,target)
            {
                return Math.sqrt(Math.pow(src.x-target.x,2)+Math.pow(src.y-target.y,2));
            }
            Player.prototype.attack = function()
            {
                var bullet1;
                var bullet2;
                var bullet3;
                var bullet4;
                var bullet5;
                var bullet6;

                obstacles.push(bullet1 = new Obstacles("1",this.x+this.width+40,this.y+this.height,15,12));
                obstacles.push(bullet2 = new Obstacles("1",this.x-40,this.y+this.height,15,-12));
                obstacles.push(bullet3 = new Obstacles("1",this.x+this.width/2,this.y-40,-15,0));//up
                obstacles.push(bullet4 = new Obstacles("1",this.x+this.width,this.y-20,0,12));//right
                obstacles.push(bullet5 = new Obstacles("1",this.x-40,this.y-20,0,-12));//left
                obstacles.push(bullet6 = new Obstacles("1",this.x+this.width/2,this.y+this.height,15,0));
                bullet1.attribute = "bullet";
                bullet2.attribute = "bullet";
                bullet3.attribute = "bullet";
                bullet4.attribute = "bullet";
                bullet5.attribute = "bullet";
                bullet6.attribute = "bullet";
                
                // obstacles.push(bullet4 = new Obstacles("1",this.x+this.width,this.y+this.height,15,-20));
                
                // bullet4.attribute = "bullet";
          
            // 
            }
            Player.prototype.moveRandomLy = function(target)
            {
                if(this.x+this.width>=target.x+target.width)
                {
                    this.x=target.x+target.width-this.width;
                    this.vx = -5;
                }
                if(this.x<=target.x)
                {
                    this.x=target.x;
                    this.vx = 5;
                }
            }
        }
    }

    Player.prototype.updatePortrait = function()
    {
        //update pic of player
        if(this.type=="hero")
        {
            if(this.vx<-0.5)
            {
                this.img.src = "../src/hero/m8.png";//left
            }
            else if(this.vx>0.5)
            {
                this.img.src = "../src/hero/m6.png";//right
            }
            else
            {
                this.img.src = "../src/hero/m7.png";//idle
            }
            
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
        else if(this.type=="enemy")
        { 
            //ctx.drawImage(this.blink,this.tempx,this.tempy,this.width,this.height);
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
        if(this.charge == 1 && this.type=="hero")
        {
            if(lastPressedKey=="left")
            {
                ctx.drawImage(this.aim,this.x-200,this.y,this.width,this.height);
            }
            else if(lastPressedKey=="right")
            {
                ctx.drawImage(this.aim,this.x+200,this.y,this.width,this.height);
            }
            else if(lastPressedKey=="up")
            {
                ctx.drawImage(this.aim,this.x,this.y-200,this.width,this.height);
            }
            else if(lastPressedKey=="down")
            {
                ctx.drawImage(this.aim,this.x,this.y+200,this.width,this.height);
            }

        }
    }

    Player.prototype.updatePos = function()
        {
            if(this.vy < 20 && this.extra!="fly")
            {
                this.vy += gravity;//gravity
            }

            //horizontal deceleration
            if(this.keyup)
            {
                if (this.vx != 0)
                {
                    this.vx *= this.vxSlowRate;
                }
            }
            //update position
            this.x += this.vx;
            this.y += this.vy;
            
            
        }
    function collideWithEnemy(player)
    {
        death(player);
    }

    function collideWithKillingBlock(player)
    {
        death(player);
    }


    function bounceAway(src,target)
    {
        src.vy = -6;
        var midLine = target.x+(target.width/2);
        src.x+src.width/2>=midLine ? src.vx = 4:src.vx = -4;
    }
    
    function icify(src,target)
    {
        if(src.blockType=="1" && target.type!="hero")
        {
            if(target.blockType=="5")
            {
               src.blockType = "5";
               if(src.type=="killing_block")
               {
                   src.type="platform_block";
                   src.attribute = "none";
               }
               if(src.type=="platform_block")
               {
                   src.type = "platform";
               }
            }
            else
            {
                bounceAway(src,target);
                if(target.type!="hero" && parseInt(target.blockType)<4)
                {
                    target.blockType="1";
                }
            }
        }
        return ;
    }

    function contactFromLeft(src,target)
    {
        let temp;
        temp = Math.abs(src.vx-target.vx);
        src.vx = -temp/3;
        target.vx = temp/3;
        
        icify(src,target);
    }

    function contactFromRight(src,target)
    {   
        let temp;
        temp = Math.abs(src.vx-target.vx);
        src.vx = temp/3;
        target.vx = -temp/3;
        icify(src,target);
    }

    function contactFromTop(src,target)
    {
        src.vy *= src.bounce;
        src.bounce *= 0.8;
        if((src.type=="hero"||src.type=="enemy"))
        {
            src.jumpCount = 0;
            src.inAirStatus = 0;
            src.vxSlowRate = 0.3;
        }  
        if(target.type=="platform" || target.type=="platform_block")
        {
            if((target.blockType=="1"||target.trueType=="killing_block") && src.type=="hero")//infested platform provides uptrust
            {
                if(target.trueType!="killing_block")
                {
                    src.vy = -10;
                }
                target.type = "platform_block";
            }
            if(src.spikeType!="0" && src.type!="hero" && (target.spikeType=="0") && target.type!="hero")
            {
                bounceAway(src,target);
            }
        }
        if(src.type=="hero")
        {
            if(target.blockType=="5")
            {
                src.vxSlowRate = 0.9;
                src.vx *= 1.015;
            }
            if(target.spikeType=="1")
            {
                collideWithKillingBlock(player);
            }
        }
        icify(src,target);
        
    }
    
    function contactFromBottom(src,target)
    {
        if((src.type=="hero"||src.type=="enemy") && target.type=="platform")
        {
            src.vy = 1;
        }
        
        if(src.type=="hero" && target.type=="enemy")
        {
            collideWithEnemy(src,target);
        }
        icify(src,target);
    }

    function moveAwayFrom(src,target)
    {
        var btmLine = src.y+src.height;
        var upperLine = src.y;
        var leftLine = src.x;
        var rightLine = src.x+src.width;

        var t_btmLine = target.y + target.height;
        var t_upperLine = target.y;
        var t_leftLine = target.x;
        var t_rightLine = target.x + target.width;

        var collision_square_width;
        var collision_square_height;

            //multiple sections to detect place of detection
            if(btmLine>t_upperLine && btmLine < t_upperLine+target.height/2 && rightLine>t_leftLine+target.width/2 && rightLine<t_rightLine)
            {
                contactFromTop(src,target);
                src.y = t_upperLine-src.height;
            }

            if(btmLine>t_upperLine && btmLine < t_upperLine+target.height/2 && leftLine<t_rightLine-target.width/2 && leftLine>t_leftLine)
            {
                contactFromTop(src,target);
                src.y = t_upperLine-src.height;
                
            }

            if(btmLine>t_upperLine && btmLine < t_upperLine+target.height/2 && leftLine>t_leftLine-src.width/2 && rightLine<t_rightLine+src.width/2)
           {
                contactFromTop(src,target);
                src.y = t_upperLine-src.height;
           }

           if(btmLine>t_upperLine && btmLine < t_upperLine+target.height/2 && rightLine>t_leftLine && rightLine<=t_leftLine+target.width/2)
           {
               collision_square_width = rightLine-t_leftLine;
               if(collision_square_width>src.width){ collision_square_width = src.width;}
               collision_square_height = btmLine-t_upperLine;
               if(collision_square_height>src.height){ collision_square_height = src.height;}
               

               if(collision_square_height > collision_square_width)
               {
                    contactFromLeft(src,target);
                    src.x = t_leftLine-src.width;
               }
               else if(collision_square_height < collision_square_width)
               {
                    contactFromTop(src,target);
                    src.y = t_upperLine-src.height;
                   
               }
               else
               {
                src.x = t_leftLine-src.width;
                src.y = t_upperLine-src.height;
               }
           }
           
           if(btmLine>t_upperLine && btmLine < t_upperLine+target.height/2 && leftLine>t_rightLine-target.width/2 && leftLine<t_rightLine)
           {
            collision_square_width = t_rightLine-leftLine;
            if(collision_square_width>src.width){ collision_square_width = src.width;}
            collision_square_height = btmLine-t_upperLine;
            if(collision_square_height>src.height){ collision_square_height = src.height;}

            if(collision_square_height > collision_square_width)
            {
                contactFromRight(src,target);
                 src.x = t_rightLine;
            }
            else if(collision_square_height < collision_square_width)
            {
                contactFromTop(src,target);
                src.y = t_upperLine-src.height;
            }
            else
            {
             src.x = t_rightLine;
             src.y = t_upperLine-src.height;
            }
               
           }

           
           //bottom
           if(upperLine>t_btmLine-target.height/2 && upperLine < t_btmLine && rightLine>t_leftLine+target.width/2 && rightLine<t_rightLine)
            {
                contactFromBottom(src,target);
                src.y = t_btmLine;
                
            }
            
            if(upperLine>t_btmLine-target.height/2 && upperLine < t_btmLine && leftLine<t_rightLine-target.width/2 && leftLine>t_leftLine)
            {
                contactFromBottom(src,target);
                src.y = t_btmLine;
            }
            if(upperLine>t_btmLine-target.height/2 && upperLine < t_btmLine && leftLine>t_leftLine-src.width/2 && rightLine<t_rightLine+src.width/2)
           {
                contactFromBottom(src,target);
                src.y = t_btmLine;
           }

           if(upperLine>t_btmLine-target.height/2 && upperLine < t_btmLine && rightLine>t_leftLine && rightLine<t_leftLine+target.width/2)
           {
            collision_square_width = rightLine-t_leftLine;
            if(collision_square_width>src.width){ collision_square_width = src.width;}
            collision_square_height = t_btmLine-upperLine;
            if(collision_square_height>src.height){ collision_square_height = src.height;}
            
            if(collision_square_height > collision_square_width)
            {
                contactFromLeft(src,target);
                 src.x = t_leftLine-src.width;
            }
            else if(collision_square_height < collision_square_width)
            {
                contactFromBottom(src,target);
                src.y = t_btmLine;
            }
            else
            {
             src.x = t_leftLine-src.width;
             src.y = t_btmLine;
            }
               
           }
           
           if(upperLine>t_btmLine-target.height/2 && upperLine < t_btmLine && leftLine>t_rightLine-target.width/2 && leftLine<t_rightLine)
           {
            collision_square_width = t_rightLine-leftLine;
            if(collision_square_width>src.width){ collision_square_width = src.width;}
            collision_square_height = t_btmLine-upperLine;
            if(collision_square_height>src.height){ collision_square_height = src.height;}

            if(collision_square_height > collision_square_width)
            {
                contactFromRight(src,target);
                 src.x = t_rightLine;
            }
            else if(collision_square_height < collision_square_width)
            {
                contactFromBottom(src,target);
                src.y = t_btmLine;
            }
            else
            {
             src.x = t_rightLine;
             src.y = t_btmLine;
            }
               
           }
           
           //left
           if(target.height<src.height)
           {
                if(rightLine>=t_leftLine && rightLine<t_leftLine+target.width/2 && upperLine>=t_upperLine-src.height && btmLine<=t_btmLine+src.height)
                {
                    contactFromLeft(src,target);
                    src.x = t_leftLine-src.width;
                }
            }
           else
           {
                if(rightLine>=t_leftLine && rightLine<t_leftLine+target.width/2 && upperLine>=t_upperLine&&btmLine<=t_btmLine)
                {
                    contactFromLeft(src,target);   
                    src.x = t_leftLine-src.width;            
                }
                if(rightLine>=t_leftLine&&rightLine<t_leftLine+target.width/2 && upperLine>=t_upperLine && upperLine<=t_upperLine+target.height/2)
                {
                    contactFromLeft(src,target);
                    src.x = target.x - src.width;
                }
                if(rightLine>=t_leftLine&&rightLine<t_leftLine+target.width/2 && btmLine<=t_btmLine && btmLine>=t_btmLine-target.height/2)
                {
                    contactFromLeft(src,target);
                    src.x = target.x - src.width;
                }
            }

           //right
           if(target.height<src.height)
           {
                if(leftLine<=t_rightLine&&leftLine>t_rightLine-target.width/2 && upperLine>=t_upperLine-src.height && btmLine<=t_btmLine+src.height)
                {
                    contactFromRight(src,target);
                    src.x = t_rightLine;
                }
            }
           else
           {
                if(leftLine<=t_rightLine&&leftLine>t_rightLine-target.width/2 && upperLine>=t_upperLine && btmLine<=t_btmLine)
                {
                    contactFromRight(src,target);
                    src.x = t_rightLine;
                }
                if(leftLine<=t_rightLine&&leftLine>t_rightLine-target.width/2 && upperLine>=t_upperLine && upperLine<=t_upperLine+target.height/2)
                {
                    contactFromRight(src,target);
                    src.x = t_rightLine;
                }
                if(leftLine<=t_rightLine&&leftLine>t_rightLine-target.width/2 && btmLine<=t_btmLine && btmLine>=t_btmLine-target.height/2)
                {
                    contactFromRight(src,target);
                    src.x = t_rightLine;
                }
            }
           
    }

    Object.prototype.crashWith = function(target)
    {
            var btmLine = this.y+this.height;
            var upperLine = this.y;
            var leftLine = this.x;
            var rightLine = this.x+this.width;

            var t_btmLine = target.y + target.height;
            var t_upperLine = target.y;
            var t_leftLine = target.x;
            var t_rightLine = target.x + target.width;
            
            if(btmLine>t_upperLine && upperLine<t_btmLine && leftLine<t_rightLine && rightLine>t_leftLine)//bounding box collision
            { 
                if(this.type=="hero" && target.type=="portal")
                {
                    pause("url('../src/teleport.gif')");
                    others.splice(others.indexOf(portal),1);
                    setTimeout(()=>{
                    unpause();newStage()},1500);
                    return;
                }
                else if(this.type=="hero" && target.type=="spaceShip")
                {
                    gameOver("win");
                    others.splice(others.indexOf(portal),1);
                    moveStatus = 0;
                }

                if(this.type=="hero" && (target.type=="killing_block"||target.spikeType=="2"))
                {
                    collideWithKillingBlock(player);
                }
                if(this.type=="hero" && target.type=="enemy")
                {
                    collideWithEnemy(this);
                }
                moveAwayFrom(this,target);
               
            }
            
    }
    function newStage()
    {
        currentStageBgsrc = "url('../src/background/background6.jpg')";
        canvas.style.backgroundImage = currentStageBgsrc;
        minionSrc_l = "../src/enemy/enemy6.png";
        minionSrc_r = "../src/enemy/enemy13.png"
        flySrc_l = "../src/enemy/enemy8.png";
        flySrc_r = "../src/enemy/enemy14.png";
        clearTerrain();
        newterrain(5);
        death(player);
    }

    function clearTerrain()
    {
        for(var i=0 ; i<obstacles.length ; i++)
        {
            obstacles.pop();
        }
    }
    
    function gameOver(status)
    {
        gameOverStatus = true;
        scoreBoard.classList.remove("hidden");
        window.removeEventListener("keyup",keyUp);
        window.removeEventListener("keydown",keyDown);
        pauseBtn.removeEventListener("click",pauseClick);
        if(status=="win")
        {
            pause("url('../src/endAnimation2.webp')","end");
            scoreBoard.innerHTML = `
            <h2><u>Deaths</u></h2>
            <p>${deadLocation.length} <i>deaths</i></p>
            <h2><u>Distance travelled</u></h2>
            <p>${parseInt(distanceTravelled)} <i>meters</i></p>
            <h2><u>Time Elapsed</u></h2>
            <p>${secondsTaken} seconds</p>
            <h2>Special Thanks to</h2>
            <h3><u> Hoe Fei and Doboki </u><h3>
            `
        }
        else
        {
            setBackground("url('../src/gameover.gif')")
            scoreBoard.innerHTML = `
            <h2>SADLY YOU RUN OUT OF LIVES!</h2>`
            scoreBoard.style.top = "30%";
        }
    }

    Obstacles.prototype.crashWith_obstacles = function(target)
    {
        var btmLine = this.y + this.height;
        var upperLine = this.y;
        var leftLine = this.x;
        var rightLine = this.x + this.width;

        if(btmLine>=target.y&&btmLine<target.y+target.height && leftLine>target.x-this.width*0.9&&rightLine<target.x+target.width+this.width*0.9)
        {
            contactFromTop(this,target);
            this.y = target.y - this.height;
        }
        if(rightLine>=target.x && rightLine<=target.x+10 && upperLine>=target.y-this.height && upperLine<target.y+target.height)
        {
            contactFromLeft(this,target);
            this.x = target.x-this.width;
        }
        if(upperLine<=target.y+target.height && upperLine>target.y && leftLine>target.x-this.width*0.9 && rightLine<target.x+target.width+this.width*0.9)
        {
            contactFromBottom(this,target);
            this.y = target.y+target.height;
        }
        if(leftLine<=target.x+target.width && leftLine>target.x+target.width-10 && upperLine>=target.y-this.height && upperLine<target.y+target.height)
        {
            contactFromRight(this,target);
            this.x = target.x+target.width;
        }
    }

    Player.prototype.containedIn = function(target)//collision with container
    {
        
        if(blocksGenerated>dialogueTrigger && index<dialogues.length-1)
        {
            dialogueTrigger += 2;
            prev.classList.add("hidden");
            index++;
            prev = dialogues[index];
            prev.classList.remove("hidden");
        }

        if(this.y>=target.height/2)
        {
            // this.vy = 10*this.bounce;
            // this.bounce *= 0.5;
            verticalDisplacement -= Math.abs(this.y-target.height/2);
            checkPoint.y -= this.y-target.height/2;
            for(let i=0 ; i<terrains.length ; i++)
            {
                terrains[i].y -= this.y-target.height/2;
            }
            for(var i=0 ; i<obstacles.length ; i++)
            {
                obstacles[i].y -= this.y-target.height/2;
            }
            for(let j=0 ; j<enemyArr.length ; j++)
            {
                enemyArr[j].y -= this.y-target.height/2;
            }
            for(let k=0 ; k<deadLocation.length ; k++)
            {
                deadLocation[k][1] -= this.y-target.height/2;
            }
            for(let k=0 ; k<others.length ; k++)
            {
                others[k].y -= this.y-target.height/2;
            }
            this.y = target.height/2;
            
            //if(this.type=="hero")
            
        }
        if(this.y<target.height/2 && this.type == "hero")
        {
                verticalDisplacement += Math.abs(this.y-target.height/2)
                checkPoint.y -= this.y-target.height/2;
                for(let i=0 ; i<terrains.length ; i++)
                {
                    terrains[i].y -= this.y-target.height/2;
                }
                for(let i=0 ; i<obstacles.length ; i++)
                {
                    obstacles[i].y -= this.y-target.height/2;
                }
                for(let j=0 ; j<enemyArr.length ; j++)
                {
                    enemyArr[j].y -= this.y-target.height/2;
                }
                for(let k=0 ; k<deadLocation.length ; k++)
                {
                    deadLocation[k][1] -= this.y-target.height/2;
                }
                for(let k=0 ; k<others.length ; k++)
                {
                    others[k].y -= this.y-target.height/2;
                }
                this.y = target.height/2;
           
        }

        if(this.x>target.width/2)
        {
            if(this.type == "hero")
            {
                distanceTravelled += this.x-target.width/2;
                checkPoint.x -= this.x-target.width/2;
                for(let i=0 ; i<terrains.length ; i++)
                {
                    terrains[i].x -= this.x-target.width/2;
                }
                for(let i=0 ; i<obstacles.length ; i++)
                {
                    obstacles[i].x -= this.x-target.width/2;
                }
                for(let j=0 ; j<enemyArr.length ; j++)
                {
                    enemyArr[j].x -= this.x-target.width/2;
                }
                for(let k=0 ; k<deadLocation.length ; k++)
                {
                    deadLocation[k][0] -= this.x-target.width/2;
                }
                for(let i=0 ; i<others.length ; i++)
                {
                    others[i].x -= this.x-target.width/2;
                }
                if(distanceTravelled>distanceMultiplier*canvas.width/2)
                {
                    obstacles.push(new Obstacles(obstacles_details[0][0],obstacles_details[0][1],base.y-obstacles_details[0][2],obstacles_details[0][3],obstacles_details[0][4],obstacles_details[0][5]));
                    obstacles.push(new Obstacles(obstacles_details[1][0],obstacles_details[1][1],base.y-obstacles_details[1][2],obstacles_details[1][3],obstacles_details[1][4],obstacles_details[1][5]));
                    obstacles_details.push(obstacles_details.shift());
                    obstacles_details.push(obstacles_details.shift());
                    blocksGenerated++;
                    
                    //vertical platform formation
                    distanceMultiplier+=0.6;
                    if(Number.isInteger(distanceMultiplier))
                    {
                        obstacles.push(new Obstacles(obstacles_details_vertical[0][0],obstacles_details_vertical[0][1]+(Math.random()+0.2)*700,base.y-obstacles_details_vertical[0][2],obstacles_details_vertical[0][3],obstacles_details_vertical[0][4],obstacles_details_vertical[0][5]));
                        obstacles_details_vertical.push(obstacles_details_vertical.shift());
                    }   
                    obstacles.unshift(new Obstacles("2",0,base.y-(Math.random()+0.2)*500,"none",20));
                    
                    
                }
                
            }
            else
            {
                this.vx = 10*this.bounce;
                this.bounce *= 0.5;
            }
            
            this.x = target.width-target.width/2;
            
        }
        
        if(this.x < 0 &&this.type != "block")
        {
            this.vx = -10*this.bounce;
            this.bounce *= 0.5;
            this.x = 0;
        }
        canvas.style.backgroundPosition = `${distanceTravelled*0.01}% ${-verticalDisplacement*0.05}%`;
    }
    
    if(endMissions==true)
    {
        setTimeout(()=>{canvas.style.backgroundSize = "100% 100%";canvas.style.background = "url('../src/endAnimation2.webp')"},3000)
        setTimeout(()=>{canvas.style.backgroundSize = "100% 100%";canvas.style.background = "url('../src/endAnimation3.gif')"},5000)
    }
    Obstacles.prototype.containedIn = Player.prototype.containedIn;

    function spawnMinion()
        {
            var enemy;
            var targetPlatform = new Obstacles(""+(parseInt(Math.random()*3)+2),canvas.width-Math.random()*300,base.y-Math.random()*700,"none",-1*Math.random()*10);
            obstacles.push(targetPlatform);
            enemy = new Player(80,80, targetPlatform.x, targetPlatform.y-80,"enemy","../src/enemy/enemy7.png","minion");
            enemy.targetPlatform = targetPlatform;
            enemyArr.push(enemy);
        }

    function spawnFly(num)
    {
        for(var i=0 ; i<num ; i++)
        {
            var enemy = new Player(120,120,canvas.width,base.y-Math.random()*800,"enemy","../src/enemy/enemy11.png","fly");
            enemyArr.push(enemy)
            console.log(enemy)
        }
    }

    function spawnTerrain()
    {
        var terrain1 = new Obstacles("4",player.x,top.y+top.height,10,0,"2");
        terrain1.attribute = "bullets";
        terrain1.type = "platform_block";
        terrains.push(terrain1);
    }
    function randomDrop()
    {
        obstacles.push(new Obstacles("1",player.x,0,0.8,0));
        setTimeout(()=>{
            obstacles.push(new Obstacles("1",player.x+30,0,3,0))
            },300); 
        setTimeout(()=>{
            obstacles.push(new Obstacles("1",player.x+60,0,3,0))
            },600); 
        setTimeout(()=>{
            obstacles.push(new Obstacles("1",player.x+90,0,3,0))
            },900); 
    }
    //----------------------------------------------------------------------------------------------------------------------
    function mission(code)
    {
        switch(code)
            {
                case 1:
                    spawnMinion();
                    spawnTerrain();
                    spawnFly(1);
                break;

                case 2:
                    spawnFly(1);
                    spawnMinion();
                break;

                case 3:
                    setBackground("url('../src/background/background8.gif')",1)
                    setTimeout(()=>{setBackground(currentStageBgsrc)},1500)
                    setTimeout(()=>{
                        for(let i=0 ; i<3 ; i++)
                        {
                            randomDrop();
                        }
                    },1000);
                break;

                case 4:
                    spawnMinion();
                    spawnMinion();
                break;

                case 5:
                    spawnMinion();
                    spawnTerrain();
                break;

                case 6:
                    others.push(portal);
                    spawnMinion();
                    spawnMinion();
                break;

                case 7:
                setBackground("url('../src/background/background8.gif')",1)
                setTimeout(()=>{setBackground(currentStageBgsrc)},1500)
                setTimeout(()=>{
                    for(let i=0 ; i<2 ; i++)
                    {
                        randomDrop();
                    }
                },1000);
                break;

                case 8: 
                    spawnFly(1);
                break;

                case 9:
                    spawnMinion(2)
                    spawnTerrain();
                break;

                case 10:
                    spawnFly(2);
                break;

                case 11:
                spawnTerrain();
                randomDrop();
                
                case 12:
                setTimeout(()=>{spawnTerrain()},2000);
                spawnTerrain();
                randomDrop();
                randomDrop();
                setTimeout(()=>{randomDrop()},1000);
                spawnFly(3);
                spawnMinion(2);
                others.push(spaceShip);
                break;
            }
    }
    function animate()
    {
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,canvas.width,canvas.height);//order matters
        
        deathBoard.innerText = `${10-deadLocation.length}`
        for(let i=0 ; i<meteors.length ; i++)
        {
            meteors[i].draw();
            meteors[i].updatePos();
        }
        
        for(let i=0 ; i<deadLocation.length ; i++)
        {
            ctx.drawImage(deadImage,deadLocation[i][0],deadLocation[i][1],30,30);
        }
        //missions
        
        if(distanceTravelled > missionVal * missionTrigger)
        {
            mission(missionVal);
            missionVal++;
        }
        
        if(endMissions == true)
        {
            clearInterval(timer1);
            canvas.style.background = "url('../src/endAnimation.webp')";
            canvas.style.backgroundSize = "100% 100%"
        }
        if(deadLocation.length>=10)
        {
            gameOver("lose");
        }
        player.containedIn(canvas);
        player.updatePortrait();
        player.updatePos();
        player.crashWith(checkPoint);
        checkPoint.draw();
        
        if(player.y>base.y)
        {
            death(player);
        }
        player.crashWith(base);
        
        for(let i=0 ; i<others.length ; i++)
        {
            others[i].updateImg();
            player.crashWith(others[i]);
        }
        for(let k=enemyArr.length-1 ; k>=0 ; k--)
        {
            player.crashWith(enemyArr[k]);
            enemyArr[k].updatePortrait();
            enemyArr[k].updatePos();
            if(enemyArr[k].follow(player)==1)
            {
                enemyArr.splice(k,1);
                break;
            }
            if(enemyArr[k].extra=="minion")
            {
                enemyArr[k].moveRandomLy(enemyArr[k].targetPlatform);
            }
            if(enemyArr[k].x<0)
            {
                if(enemyArr[k].extra=="boss")
                {
                    clearInterval(timer2);
                }
                enemyArr.splice(k,1);
            }
            
            // enemyArr[i].crashWith(obstacles[0]);
        }
        for(let i=0 ; i<enemyArr.length ; i++)
        {
            for(let j=0 ; j<enemyArr.length ; j++)
            {
                enemyArr[i].crashWith(enemyArr[j])
            }
        }
        for(let i=obstacles.length-1 ; i>=0 ; i--)
        {
            
            if(obstacles[i].x+obstacles[i].width<0 ||((obstacles[i].y+obstacles[i].height)>canvas.height && obstacles[i].trueType=="killing_block"))
            {
                obstacles.splice(obstacles.indexOf(obstacles[i]),1);
                continue;
            }
            if(obstacles[i].y>base.y)
            {
                obstacles.splice(obstacles.indexOf(obstacles[i]),1);
                continue;
            }
            
            //obstacles[i].crashWith(base)

            for(let j=obstacles.length-1 ; j>=0 ; j--)
            {
                obstacles[i].crashWith_obstacles(obstacles[j]);
            }
            for(let j=0 ; j<terrains.length ; j++)
            {
                obstacles[i].crashWith_obstacles(terrains[j]);
            }
            if(!player.invulnerable)
            {
                player.crashWith(obstacles[i]);
            }

            
            for(let j=enemyArr.length-1 ; j>=0 ; j--)
            {
                if(obstacles[i].attribute == "bullet")
                {
                    continue;
                }
                
                enemyArr[j].crashWith(obstacles[i]);
            }
            
            if(obstacles[i]!=undefined)
            {
                obstacles[i].draw();
                obstacles[i].updatePos();
            }
        }
        for(let i=terrains.length-1 ; i>=0 ; i--)
        {
            terrains[i].draw();
            terrains[i].updatePos();
            if(!player.invulnerable)
            {
                player.crashWith(terrains[i])
            }
            if(terrains[i].y>base.y)
            {
                terrains.splice(terrains.indexOf(terrains[i]),1);
            }
        }
       
       
    }
   animate();
   
}

           