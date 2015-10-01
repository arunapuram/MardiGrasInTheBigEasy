/////////////////////////////////////////////////////////////////////////
var JesterWheelLayer = cc.Layer.extend({
    sprite:null,
    ctor:function (funcOnBonusCompleteCallback) {
     this._super();
     this.funcOnBonusCompleteCallback = funcOnBonusCompleteCallback;
     this.JeseterWheelscene = ccs.load(res.JesterWheelScene_json);
     this.addChild(this.JeseterWheelscene.node);
        //////////////////////////////

        // 1. super init first
        cc.log("LOADED");
        //this.JeseterWheelscene.node.visible = false;
        this.objJesterWheel = this.JeseterWheelscene.node.getChildByName("JusterWheel");
        this.objJesterWheel.visible = true;

        this.startSpinbutton = this.JeseterWheelscene.node.getChildByName("PressToSpin");
        this.startSpinbutton.visible = true;
        this.startSpinbutton.addTouchEventListener(this.touchEvent, this);


        this.objRedPointer = this.JeseterWheelscene.node.getChildByName("RedPointer");
        this.objRedPointer.visible = true;

        this.TBWTextlabel = this.JeseterWheelscene.node.getChildByName("TBWAmountText");
        this.TBWTextlabel.visible = false;
        this.JeseterWheelscene.node.reorderChild(this.TBWTextlabel,500);

        var objSpritename = this.JeseterWheelscene.node.getChildByName("TouchToSpinSprite");
        objSpritename.visible = false;
        if(cc.sys.isNative)
            strpath = cc.textureCache.getTextureFilePath(objSpritename.getTexture());
        else
            strpath = objSpritename.getTexture().url;

        this.objJWGlowPointer = this.JeseterWheelscene.node.getChildByName("GlowPointer");
        this.objJWGlowPointer.visible = true;
        this.nGlowCounter = 1;

        this.objJWLargeArrow = this.JeseterWheelscene.node.getChildByName("LargeArrow");
        this.objJWLargeArrow.visible = false;

        this.aPrizeIndex = [600,2000,800,700,1000, 4, 700,3000,600,800,1000,10]; // 10 - FS, 4 - Pick
        this.aAngleIndex = [ 30, 60,  90,120, 150,180,210,240, 270,300,330, 360];
        this.startRenderJWdetails();
        this.TBWamount = 0;
        this.startSpinSprite = new FlipBookAnimation(strpath);
        this.startSpinSpriteNode = this.startSpinSprite.getNode();
        this.startSpinSpriteNode.x = 680;
        this.startSpinSpriteNode.y = 200;
        this.JeseterWheelscene.node.addChild(this.startSpinSpriteNode);
        this.startSpinSpriteNode.visible = true;
        this.startSpinSprite.loopFromStart();

        objSpritename = this.JeseterWheelscene.node.getChildByName("TotalBonusWonSprite");
        objSpritename.visible = false;

        if(cc.sys.isNative)
            strpath = cc.textureCache.getTextureFilePath(objSpritename.getTexture());
        else
            strpath = objSpritename.getTexture().url;

        this.TBWSprite = new FlipBookAnimation(strpath);
        this.TBWSpriteNode = this.TBWSprite.getNode();
        this.TBWSpriteNode.x = 680;
        this.TBWSpriteNode.y = 400;
        this.JeseterWheelscene.node.addChild(this.TBWSpriteNode);
        this.TBWSpriteNode.visible = false;
        //this.TBWSprite.loopFromStart();

        objSpritename = this.JeseterWheelscene.node.getChildByName("SpinAgainSprite");
        objSpritename.visible = false;

        if(cc.sys.isNative)
            strpath = cc.textureCache.getTextureFilePath(objSpritename.getTexture());
        else
            strpath = objSpritename.getTexture().url;

        this.TBWSprite = new FlipBookAnimation(strpath);
        this.TBWSpriteNode = this.TBWSprite.getNode();
        this.TBWSpriteNode.x = 680;
        this.TBWSpriteNode.y = 400;
        this.JeseterWheelscene.node.addChild(this.TBWSpriteNode);
        this.TBWSpriteNode.visible = false;
        return true;
    },
    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if(sender === this.startSpinbutton) {
                    this.objSpinAgain.visible = false;
                    this.startJWSpin();
                    this.startSpinbutton.setEnabled(false);
                    this.startSpinbutton.visible = true;
                }
                break;
            default:
                break;
        }
    },
    startJWSpin:function () {
        this.startSpinSpriteNode.visible = false;
        this.finalPrize = 0;
        var _rotation = cc.rotateTo(0.03, -10);
        var _rotation1 = cc.rotateTo(0.03, 10);
        this.action = cc.sequence(_rotation, _rotation1).repeatForever();
        this.objRedPointer.runAction(this.action);

        var nFinalDegree = Math.floor(Math.random() * 360);
        for(this.nIndex = 0; this.nIndex < this.aAngleIndex.length; this.nIndex++)
        {
            if(nFinalDegree < this.aAngleIndex[this.nIndex])
            {
                this.finalPrize = this.aPrizeIndex[this.nIndex];
                break;
            }
            if(nFinalDegree >= this.aAngleIndex[this.nIndex]) {
                if (nFinalDegree % 30 <= 5)
                    nFinalDegree = nFinalDegree + 12;
                else if (nFinalDegree % 30 >= 25)
                    nFinalDegree = nFinalDegree - 12;
            }
        }
        var _rotationaction1 = cc.rotateBy(0.25 , -10);
        var _rotationaction2 = cc.rotateTo(5, 2880 );
        var _rotationaction3 = cc.rotateTo(3, 1080 );
        var _rotationaction4 = cc.rotateTo(1.5, 360 + nFinalDegree);
        var actionOnJWDone = cc.callFunc(this.onSpinComplete.bind(this), this);
        var action1 = cc.sequence(_rotationaction1, _rotationaction2, _rotationaction3, _rotationaction4, actionOnJWDone);

        this.objJesterWheel.runAction(action1);


        var deltaAngle = nFinalDegree%30;
        if(deltaAngle >= 15)
            deltaAngle = (deltaAngle -15);
        else
            deltaAngle = (15 - deltaAngle)* -1;

        var _rotationaction = cc.rotateTo(0, deltaAngle);
        var action2 = cc.sequence(_rotationaction);
        this.objJWLargeArrow.runAction(action2);
        this.objJWLargeArrow.visible = false;
    },
    onSpinComplete:function ()
    {
        this.objJWLargeArrow.visible = true;
        this.objRedPointer.stopAction(this.action);
        this.TBWamount = this.TBWamount + this.finalPrize;
        switch(this.nIndex)
        {
            case 3:
            case 9:
                this.objSpinAgain.visible = true;
                this.startSpinbutton.setEnabled(true);
                //respin
                break;
            case 11:
                //FreeSpin
                this.startSpinbutton.setEnabled(true);
                break;
            case 5:
                // PickBonus
                this.startSpinbutton.setEnabled(true);
                break;
            default :
                this.scheduleOnce(this.showTotalBonusWonState, 1.0);

                break;
        }

    },

    startRenderJWdetails:function() {
    	this.schedule(this.updateGlowPointerPosition, 0.2);
    },
    showTotalBonusWonState:function() {
        this.TBWSpriteNode.visible = true;
        this.TBWSprite.playFromStart();
        this.TBWTextlabel.visible = true;
        this.TBWTextlabel.setString(this.TBWamount.toString());
        this.scheduleOnce(this.JWDone, 3.0);
    },
    JWDone:function() {
        /*cc.director.popScene();*/
        this.funcOnBonusCompleteCallback();
    },
    updateGlowPointerPosition:function(){
        switch(this.nGlowCounter) {
            case 0:
                this.objJWGlowPointer.x = 171.00;
                this.nGlowCounter = 1;
                break;
            case 1:
                this.objJWGlowPointer.x = 210.00;
                this.nGlowCounter = 2;
                break;
            case 2:
                this.objJWGlowPointer.x = 248.00;
                this.nGlowCounter = 0;
                break;
        }
    }
});

////////////////////////////////////////////////////////////////////////////////////////

var JesterWheelScene = cc.Scene.extend({
    ctor : function (funcOnBonusCompleteCallback) {
        this._super();
        var layer = new JesterWheelLayer(funcOnBonusCompleteCallback);
        this.addChild(layer);
    }/*,
    onEnter:function () {
        this._super();
        var layer = new JesterWheelLayer();
        this.addChild(layer);
    },*/
});

