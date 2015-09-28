
var CREDIT_METER_AMOUNT = 4000;
var TOTAL_BET = 250;
var BET_PER_LINE = 5;
var SYMBOL_WIDTH = 232;
var SYMBOL_HEIGHT = 184;
var SYMBOL_WIDTH_HALF = 232 >> 1;
var SYMBOL_HEIGHT_HALF = 184 >> 1;
var MINIMUM_REELSPIN_DURATION = 5.0;
cc.GLNode = cc.GLNode || cc.Node.extend({
        ctor:function(){
            this._super();
            this.init();
        },
        init:function(){
            this._renderCmd._needDraw = true;
            this._renderCmd.rendering =  function(ctx){
                cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
                cc.kmGLPushMatrix();
                cc.kmGLLoadMatrix(this._stackMatrix);

                this._node.draw(ctx);

                cc.kmGLPopMatrix();
            };
        },
        draw:function(ctx){
            this._super(ctx);
        }
    });
//------------------------------------------------------------------
//
// ShaderNode
//
//------------------------------------------------------------------
var ShaderNode = cc.GLNode.extend({
    ctor:function(vertexShader, framentShader) {
        this._super();
        this.init();

        if( 'opengl' in cc.sys.capabilities ) {
            this.width = 1368;
            this.height = 768;
            this.anchorX = 0.5;
            this.anchorY = 0.5;

            this.shader = cc.GLProgram.create(vertexShader, framentShader);
            this.shader.retain();
            this.shader.addAttribute("aVertex", cc.VERTEX_ATTRIB_POSITION);
            this.shader.link();
            this.shader.updateUniforms();

            var program = this.shader.getProgram();
            this.uniformCenter = gl.getUniformLocation( program, "position");
            this.uniformResolution = gl.getUniformLocation( program, "lightSize");
            this.initBuffers();

            this.scheduleUpdate();
            this._time = 0;
        }
    },
    draw:function() {
        this.shader.use();
        this.shader.setUniformsForBuiltins();

        //
        // Uniforms
        //
        var center = cc.winSize;
        var circleRadius = 200;
        var lightSize = Math.sin(this._time) * 50 + 100;
        var position = cc.p(Math.cos(this._time) * circleRadius, Math.sin(this._time) * circleRadius);
        var pp = cc.p(cc.winSize.width/2,cc.winSize.height/2);//position + center / 2.0;
        var ll = 200.0;
        //this.shader.setUniformLocationF32( this.uniformCenter, frameSize.width/2, frameSize.height/2);
        //this.shader.setUniformLocationF32( this.uniformResolution, 256, 256);
        this.shader.setUniformLocationWith2f(this.uniformCenter,pp.x,pp.y);
        this.shader.setUniformLocationWith1f(this.uniformResolution, ll);
        cc.glEnableVertexAttribs( cc.VERTEX_ATTRIB_FLAG_POSITION );

        // Draw fullscreen Square
        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    },

    update:function(dt) {




        this._time += dt;



    },
    initBuffers:function() {

        //
        // Square
        //
        var squareVertexPositionBuffer = this.squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        vertices = [
            1360,            768,
            0,              768,
            1360,            0,
            0,              0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
});
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        this.nSymbols = 5;
        this.nSymbolCount = 10+3;
        this.nTotalSymbolCount = 80;
        this.nCurrentReelIndex = [];
        this.aReelSymbols = [];
        this.aReelStrips = [];
        this.aPaylineBox = [];
        this.objPaylineSegment = null;
        this.aPaylinePositions = [];
        this.objClipper = [];
        this.nPaylineCounter = 0;
        this.bShowPaylines = false;
        for(var j=0; j<3;j++)
        {
            this.aPaylinePositions[j] = [];
        }
        this.aAnimatedReelSymbols = [];
        this.nReelX=[];
        this.nReelY=[];
        this.fe2=[];
        this.aStopPosition = [44,16,56,38,5];
        this.objAppData = new AppData();
        this.objAppData.updateReelFace(this.aStopPosition);

        this.nreelsymbols= cc.aMathReelSet[0].length;
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        this.bHelpVisible = true;
        this.mainscene = ccs.load(res.MainScene_json);
        this.addChild(this.mainscene.node);

//        this.pickscene.node.visible = false;
        this.mainscene.node.visible = true;
        this.aSymbolNames = ["res/source/Reels/Ace/Ace.png","res/source/Reels/Jack/Jack.png","res/source/Reels/King/King.png","res/source/Reels/Queen/Queen.png","res/source/Reels/Ten/Ten.png"];
        // create a render texture
        for(var i=0;i<this.nSymbols;i++)
        {
            this.aReelStrips[i] = new cc.RenderTexture(SYMBOL_WIDTH, SYMBOL_HEIGHT*this.nSymbolCount,2);
            /*var pp = cc.p(23+(232/2)+i*232,-1*(184*this.nSymbolCount/2)+1400);*/
            var pp = cc.p(23+(SYMBOL_WIDTH_HALF)+i*SYMBOL_WIDTH,-1*(SYMBOL_HEIGHT*this.nSymbolCount/2)+cc.winSize.height);
            this.nCurrentReelIndex[i] = 0;
            this.aReelStrips[i].visible = true;
            //this.mainscene.node.addChild(this.aReelStrips[i]);
        }
        var objReelSymbolsNode = this.mainscene.node.getChildByName("ReelSymbols");
        for(var i=0;i<this.nreelsymbols;i++)
        {
            this.aReelSymbols[i] = objReelSymbolsNode.getChildByName("ReelSymbol."+cc.aMathReelSet[0][i]);
            this.aReelSymbols[i].visible = false;
        }
        for(var i=0;i<this.nSymbols;i++)
        {
            this.reelStop(i,true);
            /*this.aReelStrips[i].beginWithClear(255,255,255,255);*//*
            this.aReelStrips[i].beginWithClear(1,1,1,1);
            for(var j = 0; j < this.nSymbolCount; j++)
            {
                var nRandom = Math.floor(*//*(Math.random() * 4)*//*j%5);
                var sprite = new cc.Sprite(this.aSymbolNames[nRandom]);
                sprite.setAnchorPoint(cc.p(0,0));
                var pp = cc.p(0,(SYMBOL_HEIGHT*(this.nSymbolCount-1))-(sprite.height*j));
                sprite.x=pp.x;
                sprite.y=pp.y;

                var label = new cc.LabelTTF(""+j, "fonts/arial.ttf", 55);
                label.setAnchorPoint(cc.p(0,0));
                label.x=pp.x;
                label.y=pp.y;
                sprite.visit();
                label.visit();
            }
            this.aReelStrips[i].end();
            this.aReelStrips[i].getSprite().getTexture().setAntiAliasTexParameters();
            //this.aReelStrips[i].setAlphaBlending(true);
           // this.aReelStrips[i].clip(cc.size(232, 184*3));*/
        }
        this.bIsBonus = false;
        this.objBangUpController = new BangUpController("PaidText","CreditText",this.bIsBonus, this);
        this.objBangUpController.onBangUpCompleate = this.onBangUpComplete.bind(this);
        this.objBetPerLineText = this.mainscene.node.getChildByName("BET_PER_LINE");
        this.objTotalBetText = this.mainscene.node.getChildByName("TOTAL_BET_TEXT");
        this.objBetPerLineText.setString(BET_PER_LINE.toString());
        this.objTotalBetText.setString(TOTAL_BET.toString());

        this.playbutton = this.mainscene.node.getChildByName("Play.Button");
        this.coinparticle0 = this.mainscene.node.getChildByName("coin_particle0");
        this.coinparticle1 = this.mainscene.node.getChildByName("coin_particle1");
        this.coinparticle2 = this.mainscene.node.getChildByName("coin_particle2");
        this.coinparticle3 = this.mainscene.node.getChildByName("coin_particle3");
        this.mainscene.node.reorderChild(this.coinparticle0,500);
        this.mainscene.node.reorderChild(this.coinparticle1,503);
        this.mainscene.node.reorderChild(this.coinparticle2,501);
        this.mainscene.node.reorderChild(this.coinparticle3,502);
        this.coinparticle0.visible = false;
        this.coinparticle1.visible = false;
        this.coinparticle2.visible = false;
        this.coinparticle3.visible = false;
        this.playbutton.addTouchEventListener(this.touchEvent, this);
        var objReelNode = this.mainscene.node.getChildByName("Reels");
        var objPaylineNode = this.mainscene.node.getChildByName("Paylines");
        var objPaylineBoxNode = objPaylineNode.getChildByName("PaylineBox");
        objPaylineBoxNode.visible = false;
        for(var i=0; i<this.nSymbols;i++)
        {
            var reels = objReelNode.getChildByName("Reel"+i);
            this.objClipper[i] = new cc.ClippingNode();
            this.objClipper[i].width = reels.width;
            this.objClipper[i].height = reels.height;
            this.objClipper[i].anchorX = 0;
            this.objClipper[i].anchorY = 1;
            this.objClipper[i].x = reels.x;
            this.objClipper[i].y = reels.y;
            //clipper.runAction(cc.rotateBy(1, 45).repeatForever());
            this.mainscene.node.addChild(this.objClipper[i]);

            var stencil = new cc.DrawNode();
            var rectangle = [cc.p(0, 0), cc.p(this.objClipper[i].width, 0),
                cc.p(this.objClipper[i].width, this.objClipper[i].height),
                cc.p(0, this.objClipper[i].height)];

            var white = cc.color(255, 255, 255, 0);
            stencil.drawPoly(rectangle, white, 1, white);
            this.objClipper[i].stencil = stencil;
            this.objClipper[i].addChild(this.aReelStrips[i]);
        }

        var objAnimReelSymbolsNode = this.mainscene.node.getChildByName("AnimatedReelSymbols");
        objAnimReelSymbolsNode.visible = false;
        for(var i=0;i<this.nreelsymbols;i++)
        {
            var sSYM = cc.aMathReelSet[0][i];
            this.aAnimatedReelSymbols[sSYM] = [];
            var aAnimReelSymbols = objAnimReelSymbolsNode.getChildByName("AnimatedReelSymbol."+sSYM);
            for(var k=0;k<5;k++)
            {
               /* var label = new cc.LabelTTF(cc.textureCache.getTextureFilePath(aAnimReelSymbols.getTexture()), "fonts/arial.ttf", 55);
                label.x = size.width/2;
                label.y = 730;
                this.addChild(label);*/
                var strpath;
                if(cc.sys.isNative)
                    strpath = cc.textureCache.getTextureFilePath(aAnimReelSymbols.getTexture());
                else
                    strpath = aAnimReelSymbols.getTexture().url;
                this.aAnimatedReelSymbols[sSYM][k] = new FlipBookAnimation(strpath);
                this.aAnimatedReelSymbols[sSYM][k].onAnimationCompleated = this.hideAnimatedSymbol.bind(this,sSYM,k);
                var objNode = this.aAnimatedReelSymbols[sSYM][k].getNode();
                this.objClipper[k].addChild(objNode);
                objNode.visible = false;
            }
        }

        /*var label = new cc.LabelTTF(this.objAppData.getReelFace(), "fonts/arial.ttf", 55);
        label.x = size.width/2;
        label.y = 730;
        this.addChild(label);*/
        for(var i=0; i<this.nSymbols;i++)
        {
            var reels = objReelNode.getChildByName("Reel" + i);
            this.aPaylineBox[i] = new cc.Sprite();
            this.aPaylineBox[i].initWithTexture(objPaylineBoxNode.getTexture());
            this.aPaylineBox[i].setAnchorPoint(cc.p(0, 1));
            this.aPaylineBox[i].x = reels.x + 18;
            this.aPaylineBox[i].y = reels.y/*-184*/;
            for (var j = 0; j < 3; j++) {
                this.aPaylinePositions[j][i] = {x: reels.x + 18, y: reels.y - j * 184};
            }
            this.aPaylineBox[i].visible = false;
            this.mainscene.node.addChild(this.aPaylineBox[i]);
        }
        this.objPaylineSegment = new cc.DrawNode();
        this.objPaylineSegment.setLineWidth(5);
        this.mainscene.node.addChild(this.objPaylineSegment);
        this.bIsDemoOpen = false;
        this.objDemo = new DemoPrizeControl(this);
        this.DemoBtn = this.mainscene.node.getChildByName("DemoButton");
        this.DemoBg = this.mainscene.node.getChildByName("DemoBackground");
        this.mainscene.node.reorderChild(this.DemoBtn,1000);
        this.mainscene.node.reorderChild(this.DemoBg,1000);
        this.DemoBtn.addTouchEventListener(this.touchEvent, this);
        this.DemoBg.visible = this.bIsDemoOpen;
        this.objDemo.enable(this.bIsDemoOpen);

        this.largeCoaster = this.mainscene.node.getChildByName("LargeCoster");
        this.mainscene.node.reorderChild(this.largeCoaster,1000);
        this.largeCoaster.visible = false;
        //if(cc.sys.isNative)
        {
            var s = cc.winSize;
            //setup camera
           /* var camera = cc.Camera.createPerspective(40, s.width / s.height, 0.01, 1000);
            camera.setCameraFlag(cc.CameraFlag.USER1);
            camera.setPosition3D(cc.math.vec3(0, 30, 100));
            camera.lookAt(cc.math.vec3(0, 0, 0));
            this.addChild(camera);*/

            //var circleBack = new jsb.Sprite3D();
//Roulette is here add here later
 /*            this.circle = new cc.Sprite("res/source/Bonus/Roulette/Roulette.png");
            this.circle.setPosition(cc.p(size.width/2,size.height/2));
           // circleBack.setScale(0.5);
           // circleBack.addChild(circle);
            this.circle.runAction(cc.rotateBy(1, 360,0).repeatForever());
           // circleBack.setRotation3D(cc.math.vec3(90, 0, 0));
           // circleBack.setCameraMask(2);
            this.mainscene.node.addChild(this.circle);*/

           /* this._spotLight = jsb.SpotLight.create(cc.math.vec3(-1, -1, 0), cc.math.vec3(0, 0, 0), cc.color(200, 200, 200), 0, 0.5, 10000);
            this._spotLight.setEnabled(true);
            this.mainscene.node.addChild(this._spotLight);
            this._spotLight.setCameraMask(2);
            this._angle = 0;*/
            this._accAngle = 0;
            this.scheduleUpdate();
        }
        var shaderNode = new ShaderNode("res/Shaders/example_Spotlight.vsh", "res/Shaders/example_Spotlight.fsh");
        this.mainscene.node.addChild(shaderNode);
        shaderNode.x = size.width/2;
        shaderNode.y = size.height/2;
        return true;
    },
    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if(sender === this.playbutton)
                {
                    this.startPlay();
                }
                else if(sender === this.DemoBtn)
                {
                    this.bIsDemoOpen = !this.bIsDemoOpen;
                    this.DemoBg.visible = this.bIsDemoOpen;
                    this.objDemo.enable(this.bIsDemoOpen);
                }
                break;
            default:
                break;
        }
    },
    startPlay:function (bFromDemo,aReelStp) {
        for (var i = 0; i < this.nSymbols; i++) {
            this.nReelX[i] = this.aReelStrips[i].x;
            this.nReelY[i] = this.aReelStrips[i].y;
        }
        if (bFromDemo)
        {
            this.bIsDemoOpen = false;
            this.DemoBg.visible = this.bIsDemoOpen;
            this.objDemo.enable(this.bIsDemoOpen);
            this.aStopPosition = aReelStp;
        }
        else
            this.aStopPosition = [Math.floor(Math.random() * 79), Math.floor(Math.random() * 79), Math.floor(Math.random() * 79), Math.floor(Math.random() * 79), Math.floor(Math.random() * 79)];
        //this.aStopPosition = [76,5,25,44,66];
        this.objAppData.updateReelFace(this.aStopPosition);
        for (var i = 0; i < this.nSymbols; i++) {
            this.scheduleOnce(this.spinReel.bind(this, i), i * (0.3));
        }
        this.playbutton.setEnabled(false);
    },
    checkControl1:function (i)
    {
        this.reelStop(i,false);
        
    },
    spinReel:function (i)
    {
        if(i===0)
        {
            CREDIT_METER_AMOUNT = CREDIT_METER_AMOUNT - TOTAL_BET;
            this.objBangUpController.CreditTextlabel.setString(CREDIT_METER_AMOUNT.toString());
            this.bShowPaylines = false;
            this.objBangUpController.PaidTextlabel.setString("0");
            this.showWinningPayline();
            this.objPaylineSegment.clear();
        }
        var move = cc.moveBy(0.3, cc.p(0,50));
        var actionMoveDone = cc.callFunc(this.spinReelAfterBounce.bind(this,i), this);
        var seq = cc.sequence(move,actionMoveDone);
        this.aReelStrips[i].runAction(seq);
    },
    spinReelAfterBounce:function (i)
    {
        var move = cc.moveTo(0.5, cc.p(SYMBOL_WIDTH_HALF,-1*((SYMBOL_HEIGHT*this.nSymbolCount/2)-(3*SYMBOL_HEIGHT))));
        var actionMoveDone = cc.callFunc(this.resetReel.bind(this,i), this);
        var seq = cc.sequence(move,actionMoveDone);
        this.fe2[i] = seq.repeatForever();
        this.aReelStrips[i].runAction(this.fe2[i]);
        this.scheduleOnce(this.checkControl1.bind(this,i),5+(i*0.4));
    },
    resetReel:function (i)
    {
        if(this.nCurrentReelIndex[i] === 0)
            this.nCurrentReelIndex[i] = 70;
        else
            this.nCurrentReelIndex[i] = this.nCurrentReelIndex[i] - 10;
        this.UpdateReelStrip(i);
        this.aReelStrips[i].x = SYMBOL_WIDTH_HALF;
        this.aReelStrips[i].y = (SYMBOL_HEIGHT*this.nSymbolCount/2);
    },
    reelStop:function (i,bFromStart)
    {
        this.nCurrentReelIndex[i] = parseInt(""+(this.aStopPosition[i]/10));
        this.nCurrentReelIndex[i] = this.nCurrentReelIndex[i]*10;
        if(this.aStopPosition[i]%10 === 0)
            this.resetReel(i);
        this.aReelStrips[i].x = SYMBOL_WIDTH_HALF;
        if(this.aStopPosition[i]%10 === 0)
            this.aReelStrips[i].y = -1*((SYMBOL_HEIGHT*this.nSymbolCount/2)-(2*SYMBOL_HEIGHT)) + (10*SYMBOL_HEIGHT);//550;
        else
            this.aReelStrips[i].y = -1*((SYMBOL_HEIGHT*this.nSymbolCount/2)-(2*SYMBOL_HEIGHT)) + ((this.aStopPosition[i]%10)*SYMBOL_HEIGHT);//550;
        this.UpdateReelStrip(i);
        if(bFromStart === false)
        {
           // this.playbutton.setEnabled(true);
            this.aReelStrips[i].stopAction(this.fe2[i]);
            var move = cc.moveBy(0.3, cc.p(0,50));
            var move1 = cc.moveBy(0.3, cc.p(0,-50));
            var seq;
            if(i===4)
            {
                var actionMoveDone = cc.callFunc(this.onAllReelStopped.bind(this), this);
                seq = cc.sequence(move, move1,actionMoveDone);
            }
            else
            {
                var actionMoveDone = cc.callFunc(this.onReelStopped.bind(this,i), this);
                seq = cc.sequence(move, move1,actionMoveDone);
            }
            this.aReelStrips[i].runAction(seq);
        }

    },
    onReelStopped:function (nReelIndexVal)
    {

    },
    onAllReelStopped:function ()
    {
        var bonusId = 0;
        for(var i=0;i<this.objAppData.aPaylineID.length;i++)
        {
            if(this.objAppData.aPaylineID[i] === 30)
            {
                bonusId = 1;
                break;
            }
            else if(this.objAppData.aPaylineID[i] === 31)
            {
                bonusId = 4;
                break;
            }
            else if(this.objAppData.aPaylineID[i] === 32)
            {
                bonusId = 5;
                break;
            }
        }
        if(bonusId===4)
        {
           /* this.mainscene.node.visible = false;
            var pickScene = new PickBonusScene();
            cc.director.pushScene(pickScene);*/
            this.largeCoaster.setPosition(cc.p(-390,390));
            this.largeCoaster.visible = true;
            var move = cc.moveBy(3.0, cc.p(3000,0));
            this.largeCoaster.runAction(move);
            this.largeCoaster.runAction(cc.rotateBy(1, 360,0).repeatForever());
        }
        else if(bonusId===5)
        {
            //Jester Wheel starting point
            this.mainscene.node.visible = false;
            var JesterScene = new JesterWheelScene();
            cc.director.pushScene(JesterScene);
        }
        else
        {
            this.startPaylines();
        }
    },
    startPaylines:function ()
    {
        this.nAwardcredits = 100;
        this.objBangUpController.startBangup(this.nAwardcredits, this.bIsBonus);
        this.nPaylineCounter = 0;
        this.bShowPaylines = true;
        this.showWinningPayline();
    },
    playAnimatedReelSymbol:function (srtSYMB,nCol,x,y)
    {
        var objNode = this.aAnimatedReelSymbols[srtSYMB][nCol].getNode();
        objNode.visible = true;
        objNode.x = x-18+SYMBOL_WIDTH_HALF;
        objNode.y = y-SYMBOL_HEIGHT_HALF;
        this.aAnimatedReelSymbols[srtSYMB][nCol].playFromStart();
    },
    hideAnimatedSymbol:function (srtSYMB,nCol)
    {
        /*var objNode = this.aAnimatedReelSymbols[srtSYMB][nCol].getNode();
        objNode.visible = false;*/
        /*if(nCol===2)
        {
            this.showWinningPayline();
        }*/
    },
    hidePaylines:function ()
    {
        for (var i = 0; i < this.nreelsymbols; i++)
        {
            var sSYM = cc.aMathReelSet[0][i];
            for (var k = 0; k < 5; k++)
            {
                var objNode = this.aAnimatedReelSymbols[sSYM][k].getNode();
                objNode.visible = false;
            }
        }
    },
    showWinningPayline:function ()
    {
        this.hidePaylines();
        for(var nCols = 0; nCols < 5; nCols++)
        {
            this.aPaylineBox[nCols].visible = false;
        }
        if(this.bShowPaylines)
        {
            if(this.nPaylineCounter<this.objAppData.aPaylineID.length)
            {
                var colorval = cc.color(Math.random()*255,Math.random()*255,Math.random()*255,200);
                this.objPaylineSegment.clear();
                this.objPaylineSegment.setDrawColor(colorval);
                for(var nCols = 0; nCols < 5; nCols++)
                {
                    this.aPaylineBox[nCols].setColor(colorval);
                    this.aPaylineBox[nCols].x = this.aPaylinePositions[(this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols])+1][nCols].x;
                    this.aPaylineBox[nCols].y = this.aPaylinePositions[(this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols])+1][nCols].y;
                    if(this.objAppData.aPaylineStrings[this.nPaylineCounter].charAt(nCols) != "?")
                    {
                        this.aPaylineBox[nCols].visible = true;
                        var nYoff = 0;
                        if(this.objAppData.aPaylineStrings[this.nPaylineCounter].charAt(nCols) === "I")
                            nYoff = -184/2;
                        else if(this.objAppData.aPaylineStrings[this.nPaylineCounter].charAt(nCols) === "L")
                            nYoff = 184/2;
                        else
                            nYoff = 0;
                        this.playAnimatedReelSymbol(this.objAppData.aPaylineStrings[this.nPaylineCounter].charAt(nCols),nCols,18,this.aPaylineBox[nCols].y-184+28+nYoff);
                    }
                    if(nCols != 0 && this.objAppData.aPaylineID[this.nPaylineCounter] < 30)
                    {
                        if(this.objAppData.aPaylineStrings[this.nPaylineCounter].charAt(nCols) === "?" && this.objAppData.aPaylineStrings[this.nPaylineCounter].charAt(nCols-1) === "?")
                        {
                            this.objPaylineSegment.drawSegment(cc.p(this.aPaylineBox[nCols - 1].x + (194/2), this.aPaylineBox[nCols - 1].y - (186 / 2)), cc.p(this.aPaylineBox[nCols].x + (194/2), this.aPaylineBox[nCols].y - (186 / 2)));
                            if(nCols===4)
                                this.objPaylineSegment.drawSegment(cc.p(this.aPaylineBox[nCols].x + (194/2), this.aPaylineBox[nCols].y - (186 / 2)),cc.p(this.aPaylineBox[nCols].x + (194), this.aPaylineBox[nCols].y - (186/2)));
                        }
                        else if(this.objAppData.aPaylineStrings[this.nPaylineCounter].charAt(nCols) === "?" && this.objAppData.aPaylineStrings[this.nPaylineCounter].charAt(nCols-1) != "?")
                        {
                            var nY = (186 / 2);
                            if(this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols]===this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols-1])
                                nY = (186 / 2);
                            else if(this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols]<this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols-1])
                                nY = 0;
                            else if(this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols]>this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols-1])
                                nY = (186);
                            this.objPaylineSegment.drawSegment(cc.p(this.aPaylineBox[nCols - 1].x + (194), this.aPaylineBox[nCols - 1].y - nY), cc.p(this.aPaylineBox[nCols].x + (194/2), this.aPaylineBox[nCols].y - (186 / 2)));
                            if(nCols===4)
                                this.objPaylineSegment.drawSegment(cc.p(this.aPaylineBox[nCols].x + (194/2), this.aPaylineBox[nCols].y - (186 / 2)),cc.p(this.aPaylineBox[nCols].x + (194), this.aPaylineBox[nCols].y - (186/2)));
                        }
                        else
                        {
                            var nY = (186 / 2);
                            if(this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols]===this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols-1])
                                nY = (186 / 2);
                            else if(this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols]<this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols-1])
                                nY = 0;
                            else if(this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols]>this.objAppData.aPaylineOffsets[this.nPaylineCounter][nCols-1])
                                nY = (186);
                            this.objPaylineSegment.drawSegment(cc.p(this.aPaylineBox[nCols - 1].x + (194), this.aPaylineBox[nCols - 1].y - nY), cc.p(this.aPaylineBox[nCols].x , this.aPaylineBox[nCols].y - (186 / 2)));
                        }
                    }
                    /*this.objAppData.aPaylineStrings*/
                }
                this.nPaylineCounter++;
                if(this.nPaylineCounter == this.objAppData.aPaylineID.length)
                    this.nPaylineCounter = 0;
                this.scheduleOnce(this.showWinningPayline.bind(this),2.1);
            }
        }
    },
    UpdateReelStrip:function (i)
    {
        this.aReelStrips[i].beginWithClear(1,1,1,1);
        for(var j = 0; j < this.nSymbolCount; j++)
        {
            var nReelIndex = (j +this.nCurrentReelIndex[i])%80;
            var nstripid = cc.aMathBaseReelStrip[i][nReelIndex];
            var sprite = new cc.Sprite();
            sprite.initWithTexture(this.aReelSymbols[nstripid-1].getTexture());
            sprite.setAnchorPoint(cc.p(0.5, 0));
            var pp = cc.p(0, (SYMBOL_HEIGHT * (this.nSymbolCount - 1)) - (184 * j));
            /*var ScaleX = 232/sprite.width;
            var ScaleY = 184/sprite.height;
            if(ScaleX === 1 && ScaleY === 1)
            {
                sprite.setScaleX(ScaleX);
                sprite.setScaleY(ScaleY);
            }
            else
            {
                sprite.setScaleX(ScaleY);
                sprite.setScaleY(ScaleY);
            }*/
            var ScaleY = (sprite.height - 184)/2;
            var ScaleX = (sprite.width - 232)/2;
            sprite.x = pp.x+(sprite.width/2)-ScaleX;
            sprite.y = pp.y-ScaleY;
            var nStripIndex = (j +this.nCurrentReelIndex[i])%80;
           /* var label = new cc.LabelTTF("" + nStripIndex + cc.aMathReelSet[0][nstripid-1], "fonts/arial.ttf", 55);
            label.setAnchorPoint(cc.p(0, 0));
            label.x = pp.x;
            label.y = pp.y;*/
            sprite.visit();
           // label.visit();
        }
        this.aReelStrips[i].end();
        this.aReelStrips[i].getSprite().getTexture().setAntiAliasTexParameters();
       // this.scheduleOnce(this.UpdateReelStrip.bind(this,i),0.1);
    },
    onBangUpComplete:function ()
    {
       // this.objBangUpController.label.setString("0");
        CREDIT_METER_AMOUNT = CREDIT_METER_AMOUNT + this.objBangUpController.nAwardAmount;
        this.playbutton.setEnabled(true);
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

