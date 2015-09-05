/////////////////////////////////////////////////////////////////////////
var PickBonusLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
     this._super();

     this.pickscene = ccs.load(res.PickScene_json);
     this.addChild(this.pickscene.node);
        //////////////////////////////
       this.bVisible = true;
       this.button = [];
       this.Pickbutton = [];
       this.Coasterglow = [];
       this.pickobject = []
        this.repeat = [];
        // 1. super init first
        cc.log("LOADED");
        this.aPickbackground = this.pickscene.node.getChildByName("Image_1");
        this.aPickbackground.visible = true;

        this.aPypBanner = this.pickscene.node.getChildByName("PickyourPoisonBanner");
        this.mathfunc = new PickMath();
        this.mathfunc.initiate();
        //this.aPypBanner.visible = true;
        //PickyourPoisonBanner
        this.bEnable = false;
        var j = 0;
        for(var nCount = 0; nCount < 12 ; nCount++)
         {
            j = nCount+8;
            k = nCount+1;
            this.Pickbutton[nCount] = this.pickscene.node.getChildByName("Button_"+j);
            this.Coasterglow[nCount] = this.pickscene.node.getChildByName("Coasterglow"+k);
            this.pickobject[nCount] = [];
            for(var nIndex = 0; nIndex < 5 ; nIndex++)
            {
                this.pickobject[nCount][nIndex] = this.pickscene.node.getChildByName("PB.pickobject"+nCount+nIndex);
                this.pickobject[nCount][nIndex].visible = false;

                this.pickscene.node.reorderChild(this.pickobject[nCount][nIndex],500);
            }
            this.Pickbutton[nCount].addTouchEventListener(this.touchEvent, this);
            this.FadeAction(nCount);

         }

        this.playCoasterFade();
        return true;
    },

    FadeAction: function (nCount) {
        var fade = cc.fadeOut(1.0);
        var fade_in = fade.reverse();
        var delay = cc.delayTime(0.025);
        var seq = cc.sequence(fade, delay, fade_in, delay.clone());
        this.repeat[nCount] = seq.repeatForever();
        //this.playCoasterFade();

    },
         touchEvent: function (sender, type) {
             switch (type) {
                 case ccui.Widget.TOUCH_ENDED:
                if(this.bEnable === false)
                {
                    this.bEnable = true;
                        var j = 0;
                        for(var nCount = 0; nCount < 12 ; nCount++)
                         {
                             //this.Coasterglow[nCount].stopAction();
                             j = nCount+8;
                             this.button[nCount] = this.pickscene.node.getChildByName("Button_"+j);
                              if(this.button[nCount] == sender)
                              {
                                  this.nCurrentpickIndex = nCount;
                                  this.playCoasterFade();
                                  this.bEnable = true;
                                  this.playGlowBurst(sender.x,sender.y);
                                  sender.visible = false;
                                  sender.setEnabled(false);
                              }
                              else
                              {
//                                 button.setColor(cc.color(255,0.5,0.5));
        //                         button.setBright(false);
                              }
                         }
                }
                     break;
                 default:
                     break;
             }
         },
            playGlowBurst: function (x,y) {
/*                this.PickObjecttype = this.mathfunc.getPickObjectatIndex(this.nCurrentpickIndex);
                this.pickobject[this.nCurrentpickIndex][this.PickObjecttype].visible = true;*/
            // create sprite sheet
            //this.bEnable = false;
            var xyz = "Pickoneflip";
            this.pickanimation = new SpriteAnimation(x,y,xyz,!true, this.playGlowBurstContinued.bind(this));
            this.addChild(this.pickanimation.getNode(), 2);
                this.pickanimation.playAnimationOnce();
            },
            playGlowBurstContinued: function (x,y) {
            // create sprite sheet
                this.PickObjecttype = this.mathfunc.getPickObjectatIndex(this.nCurrentpickIndex);
                 this.pickobject[this.nCurrentpickIndex][this.PickObjecttype].visible = true;
            this.bEnable = false;
             this.playCoasterFade();
            var xyz = "glowburst";
            var pickanimation2 = new SpriteAnimation(x,y, xyz, true);
            this.pickscene.node.addChild(pickanimation2.getNode(),0);
            pickanimation2.playAnimation();


                /*this.PickObjecttype = this.mathfunc.getPickObjectatIndex(this.nCurrentpickIndex);
            this.pickobject[this.nCurrentpickIndex][this.PickObjecttype].visible = true;*/


                //this.pickobject[3][2].visible = true;
            }


});

////////////////////////////////////////////////////////////////////////////////////////

PickBonusLayer.prototype.playCoasterFade = function()
{
   /* for(var nCount = 0; nCount < 12 ; nCount++)
    {
        this.Coasterglow[nCount].setColor(cc.color(255,0,0));
    }*/
    for(var nCount = 0; nCount < 12 ; nCount++)
    {
        if(this.Pickbutton[nCount].visible) {

            if(!this.bEnable) {
               // this.Coasterglow[nCount].setColor(cc.color(0,0,0));
                this.Coasterglow[nCount].visible = true;
                this.Coasterglow[nCount]._realOpacity = 255;
  /*              var fade = cc.fadeOut(1.0);
                var fade_in = fade.reverse();
                var delay = cc.delayTime(0.025);
                var seq = cc.sequence(fade, delay, fade_in, delay.clone());
                var repeat = seq.repeatForever();*/
                //this.Coasterglow[nCount].stopAction(this.repeat[nCount]);
               /* this.Coasterglow[nCount].setColor(cc.color(255,255,255,255));*/
                this.repeat[nCount]._elapsed = 0;
                this.Coasterglow[nCount].runAction(this.repeat[nCount]);
            }
            else
            {
                //this.Coasterglow[nCount].stopAction(this.repeat[nCount]);
                this.Coasterglow[nCount].visible = false;
            }

        }
    }
     /*for(var nCount = 0; nCount < 12 ; nCount++)
     {
        this.Coasterglow[nCount].setColor(cc.color(255,255,255));
     }*/

    this.aPypBanner.visible = !this.bEnable;
    if(this.bEnable === false)
    {
        this.pypCoasterBanner();
    }


}

////////////////////////////////////////////////////////////////////////////////////////

PickBonusLayer.prototype.pypCoasterBanner = function()
{
    this.aPypBanner.visible = !this.bEnable;
    if(this.bEnable === false) {
        this.scheduleOnce(this.playCoasterBanner1, 0.3);
    }
}

////////////////////////////////////////////////////////////////////////////////////////

PickBonusLayer.prototype.playCoasterBanner1 = function()
{
    this.aPypBanner.visible = this.bEnable;

    this.scheduleOnce(this.pypCoasterBanner,0.5);
}

////////////////////////////////////////////////////////////////////////////////////////

var PickBonusScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new PickBonusLayer();
        this.addChild(layer);
    }
});

