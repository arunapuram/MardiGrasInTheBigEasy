
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
        this.nReelX=[];
        this.nReelY=[];
        this.fe2=[];
        this.aStopPosition = [34,44,24,14,4];

        this.nreelsymbols= cc.aMathReelSet[0].length;
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        this.bHelpVisible = true;
        this.mainscene = ccs.load(res.MainScene_json);
        this.addChild(this.mainscene.node);
        this.aSymbolNames = ["res/source/Reels/Ace/Ace.png","res/source/Reels/Jack/Jack.png","res/source/Reels/King/King.png","res/source/Reels/Queen/Queen.png","res/source/Reels/Ten/Ten.png"];
        // create a render texture
        for(var i=0;i<this.nSymbols;i++)
        {
            this.aReelStrips[i] = new cc.RenderTexture(SYMBOL_WIDTH, SYMBOL_HEIGHT*this.nSymbolCount,2);
            /*var pp = cc.p(23+(232/2)+i*232,-1*(184*this.nSymbolCount/2)+1400);*/
            var pp = cc.p(23+(SYMBOL_WIDTH_HALF)+i*SYMBOL_WIDTH,-1*(SYMBOL_HEIGHT*this.nSymbolCount/2)+cc.winSize.height);
            this.nCurrentReelIndex[i] = 0;
            this.reelStop(i,true);
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
            this.UpdateReelStrip(i);
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

        this.playbutton = this.mainscene.node.getChildByName("Play.Button");
        this.playbutton.addTouchEventListener(this.touchEvent, this);
        var objReelNode = this.mainscene.node.getChildByName("Reels");
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
            this.addChild(clipper);

            var stencil = new cc.DrawNode();
            var rectangle = [cc.p(0, 0), cc.p(clipper.width, 0),
                cc.p(clipper.width, clipper.height),
                cc.p(0, clipper.height)];

            var white = cc.color(255, 255, 255, 0);
            stencil.drawPoly(rectangle, white, 1, white);
            clipper.stencil = stencil;
            clipper.addChild(this.aReelStrips[i]);
        }
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
        this.aReelStrips[i].stopAction(this.fe2[i]);
        this.reelStop(i,false);
        this.playbutton.setEnabled(true);
    },
    spinReel:function (i)
    {
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
        this.aReelStrips[i].x = SYMBOL_WIDTH_HALF;
        this.aReelStrips[i].y = -1*((SYMBOL_HEIGHT*this.nSymbolCount/2)-(2*SYMBOL_HEIGHT)) + ((this.aStopPosition[i]%10)*SYMBOL_HEIGHT);//550;

        if(bFromStart === false)
        {
            var move = cc.moveBy(0.3, cc.p(0,50));
            var move1 = cc.moveBy(0.3, cc.p(0,-50));
           /* var actionMoveDone = cc.callFunc(this.resetReel.bind(this,i), this);*/
            var seq = cc.sequence(move,move1);
            this.aReelStrips[i].runAction(seq);
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
            var label = new cc.LabelTTF("" + (j +this.nCurrentReelIndex[i])%80, "fonts/arial.ttf", 55);
            label.setAnchorPoint(cc.p(0, 0));
            label.x = pp.x;
            label.y = pp.y;
            sprite.visit();
            label.visit();
        }
        this.aReelStrips[i].end();
        this.aReelStrips[i].getSprite().getTexture().setAntiAliasTexParameters();
       // this.scheduleOnce(this.UpdateReelStrip.bind(this,i),0.1);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

