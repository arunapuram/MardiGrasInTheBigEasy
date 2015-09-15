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
        var nStartFraction = 1000;
        var _rotationaction1 = cc.rotateBy(10 , 360000);
        do {
            var _rotationaction1 = cc.rotateBy(1 * nStartFraction, nStartFraction * 360);
            nStartFraction --;
            cc.log("nStartFraction = " + nStartFraction);
        }while(nStartFraction > 0)

        var _rotationaction2 = cc.rotateBy(1, nFinalDegree);
        var action1 = cc.sequence(_rotationaction1, _rotationaction2).repeat();

        this.objJesterWheel.runAction(action1);
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

