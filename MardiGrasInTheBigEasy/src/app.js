
var SYMBOL_WIDTH = 232;
var SYMBOL_HEIGHT = 184;
var SYMBOL_WIDTH_HALF = 232 >> 1;
var SYMBOL_HEIGHT_HALF = 184 >> 1;
var MINIMUM_REELSPIN_DURATION = 5.0;
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
        this.objBangUpController = new BangUpController("PaidText", this);
        this.objBangUpController.onBangUpCompleate = this.onBangUpComplete.bind(this);


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
            var clipper = new cc.ClippingNode();
            clipper.width = reels.width;
            clipper.height = reels.height;
            clipper.anchorX = 0;
            clipper.anchorY = 1;
            clipper.x = reels.x;
            clipper.y = reels.y;
            //clipper.runAction(cc.rotateBy(1, 45).repeatForever());
            this.mainscene.node.addChild(clipper);

            var stencil = new cc.DrawNode();
            var rectangle = [cc.p(0, 0), cc.p(clipper.width, 0),
                cc.p(clipper.width, clipper.height),
                cc.p(0, clipper.height)];

            var white = cc.color(255, 255, 255, 0);
            stencil.drawPoly(rectangle, white, 1, white);
            clipper.stencil = stencil;
            clipper.addChild(this.aReelStrips[i]);
            this.aPaylineBox[i] = new cc.Sprite();
            this.aPaylineBox[i].initWithTexture(objPaylineBoxNode.getTexture());
            this.aPaylineBox[i].setAnchorPoint(cc.p(0, 1));
            this.aPaylineBox[i].x = reels.x+18;
            this.aPaylineBox[i].y = reels.y/*-184*/;
            for(var j=0; j<3;j++)
            {
                this.aPaylinePositions[j][i] = {x:reels.x+18,y:reels.y-j*184};
            }
            this.aPaylineBox[i].visible = false;
            //this.aPaylineBox[i].retain();
            this.mainscene.node.addChild(this.aPaylineBox[i]);
        }
        this.objPaylineSegment = new cc.DrawNode();
        this.objPaylineSegment.setLineWidth(5);
        this.mainscene.node.addChild(this.objPaylineSegment);
        /*var camera = cc.Camera.createPerspective(60, size.width/size.height, 1, 1000);
        camera.setCameraFlag(cc.CameraFlag.USER1);
        camera.setPosition3D(cc.math.vec3(0, 100, 100));
        camera.lookAt(cc.math.vec3(0, 0, 0), cc.math.vec3(0, 1, 0));
        this.mainscene.node.addChild(camera);
        this._spotLight = jsb.SpotLight.create(cc.math.vec3(-1, -1, 0), cc.math.vec3(0, 0, 0), cc.color(200, 200, 200), 0, 0.5, 10000);
        this._spotLight.setEnabled(true);
        this.mainscene.node.addChild(this._spotLight);
        this._spotLight.setCameraMask(2);
        this._angle = 0;
        var dt = 0;
        this._spotLight.setPosition3D(cc.math.vec3(100*Math.cos(this._angle+4*dt), 100, 100*Math.sin(this._angle+4*dt)));
        this._spotLight.setDirection(cc.math.vec3(-Math.cos(this._angle + 4 * dt), -1, -Math.sin(this._angle + 4*dt)));*/

        var objAnimReelSymbolsNode = this.mainscene.node.getChildByName("AnimatedReelSymbols");
        objAnimReelSymbolsNode.visible = false;
        for(var i=0;i<this.nreelsymbols;i++)
        {
            var sSYM = cc.aMathReelSet[0][i];
            this.aAnimatedReelSymbols[sSYM] = [];
            var aAnimReelSymbols = objAnimReelSymbolsNode.getChildByName("AnimatedReelSymbol."+sSYM);
            for(var k=0;k<5;k++)
            {
                this.aAnimatedReelSymbols[sSYM][k] = new FlipBookAnimation(aAnimReelSymbols.getTexture().url);
                this.aAnimatedReelSymbols[sSYM][k].onAnimationCompleated = this.hideAnimatedSymbol.bind(this,sSYM,k);
                var objNode = this.aAnimatedReelSymbols[sSYM][k].getNode();
                this.mainscene.node.addChild(objNode);
                objNode.visible = false;
            }
        }

        /*var label = new cc.LabelTTF(this.objAppData.getReelFace(), "fonts/arial.ttf", 55);
        label.x = size.width/2;
        label.y = 730;
        this.addChild(label);*/
        return true;
    },
    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                for (var i = 0; i < this.nSymbols; i++)
                {
                    this.nReelX[i] = this.aReelStrips[i].x;
                    this.nReelY[i] = this.aReelStrips[i].y;
                }
                this.aStopPosition = [Math.floor(Math.random()*79),Math.floor(Math.random()*79),Math.floor(Math.random()*79),Math.floor(Math.random()*79),Math.floor(Math.random()*79)];
                //this.aStopPosition = [76,5,25,44,66];
                this.objAppData.updateReelFace(this.aStopPosition);
                for(var i=0;i<this.nSymbols;i++)
                {
                    this.scheduleOnce(this.spinReel.bind(this,i), i*(0.3));
                }
                this.playbutton.setEnabled(false);
                break;
            default:
                break;
        }
    },
    checkControl1:function (i)
    {
        this.reelStop(i,false);
        /*if(i===4)
        {
            this.mainscene.node.visible = false;
            var pickScene = new PickBonusScene();
            cc.director.pushScene(pickScene);
        }*/
    },
    spinReel:function (i)
    {
        if(i===0)
        {
            this.bShowPaylines = false;
            this.objBangUpController.label.setString("0");
        }
        this.showWinningPayline();
        this.objPaylineSegment.clear();
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
                var actionMoveDone = cc.callFunc(this.startPaylines.bind(this), this);
                seq = cc.sequence(move, move1,actionMoveDone);
            }
            else
            {
                seq = cc.sequence(move, move1);
            }
            this.aReelStrips[i].runAction(seq);
        }

    },
    startPaylines:function ()
    {
        this.nAwardcredits = 100;
        var bIsBonus = false;
        this.objBangUpController.startBangup(this.nAwardcredits, bIsBonus);
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
        var objNode = this.aAnimatedReelSymbols[srtSYMB][nCol].getNode();
        objNode.visible = false;
        if(nCol===2)
        {
            this.showWinningPayline();
        }
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
                        this.playAnimatedReelSymbol(this.objAppData.aPaylineStrings[this.nPaylineCounter].charAt(nCols),nCols,this.aPaylineBox[nCols].x,this.aPaylineBox[nCols].y);
                    }
                    if(nCols != 0)
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
                /*this.scheduleOnce(this.showWinningPayline.bind(this),1);*/
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
            var ScaleX = 232/sprite.width;
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
            }
            sprite.x = pp.x+232/2;
            sprite.y = pp.y;
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

