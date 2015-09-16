/////////////////////////////////////////////////////////////////////////
var JesterWheelLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
     this._super();

     this.JeseterWheelscene = ccs.load(res.JesterWheelScene_json);
     this.addChild(this.JeseterWheelscene.node);
        //////////////////////////////

        // 1. super init first
        cc.log("LOADED");
        //this.JeseterWheelscene.node.visible = false;
        this.objJesterWheel = this.JeseterWheelscene.node.getChildByName("JusterWheel");
        this.objJesterWheel.visible = true;
        this.startSpinbutton = this.JeseterWheelscene.node.getChildByName("PressToSpin");
        this.startSpinbutton.addTouchEventListener(this.touchEvent, this);

        this.objJWGlowPointer = this.JeseterWheelscene.node.getChildByName("GlowPointer");

        this.nGlowCounter = 1;
        this.startRenderJW();
        return true;
    },
    touchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if(sender === this.startSpinbutton) {
                    this.startJWSpin();
                }
                break;
            default:
                break;
        }
    },
    startJWSpin:function () {
        var nFinalDegree = Math.random() * 360;
        var _rotationaction1 = cc.rotateBy(0.25 , -10);
        var _rotationaction2 = cc.rotateBy(10, 5760);
        var _rotationaction3 = cc.rotateBy(2.5, 720);
        var _rotationaction5 = cc.rotateBy(2.5 , 360 + nFinalDegree);
      var action1 = cc.sequence(_rotationaction1, _rotationaction2, _rotationaction3, /*_rotationaction4,*/ _rotationaction5).repeat();

        this.objJesterWheel.runAction(action1);
    },
    startRenderJW:function() {
        this.schedule(this.updateGlowPointerPosition, 0.2);
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
    onEnter:function () {
        this._super();
        var layer = new JesterWheelLayer();
        this.addChild(layer);
    }
});

