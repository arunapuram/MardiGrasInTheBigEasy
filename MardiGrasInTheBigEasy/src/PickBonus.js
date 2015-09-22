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
        this.pick = this.mathfunc.shuffle();
        this.pickAmount =  this.mathfunc.getPickObjectAwardAtIndex();
        this.nCount = 0;
        this.ntotCount = 5;
        //this.aPypBanner.visible = true;
        //PickyourPoisonBanner
        this.bEnable = false;
        var j = 0;

        this.label = new cc.LabelTTF(this.ntotCount.toString(), "fonts/arial.ttf", 57);
        this.addChild(this.label);
        this.label.x = 517;//538.01;517
        this.label.y = 39;// 599.08;51.77
        this.label.setColor(cc.color(255,0,0,255));

        this.creditsText = new cc.LabelTTF("15000", "fonts/arial.ttf", 57);
        this.addChild(this.creditsText);
        this.creditsText.x = 195;//538.01;517
        this.creditsText.y = 39;// 599.08;51.77
        this.creditsText.setColor(cc.color(255,0,0,255));

        this.BetText = new cc.LabelTTF("150", "fonts/arial.ttf", 57);
        this.addChild(this.BetText);
        this.BetText.x = 710;//538.01;517
        this.BetText.y = 37;// 599.08;51.77
        this.BetText.setColor(cc.color(255,0,0,255));

      /*  for(var nCount = 0; nCount < 12 ; nCount++) {
            this.BetText = new cc.LabelTTF("150", "fonts/arial.ttf", 57);
            this.addChild(this.BetText);
            this.BetText.x = 710;//538.01;517
            this.BetText.y = 37;// 599.08;51.77
            this.BetText.setColor(cc.color(255, 0, 0, 255));
        }*/
        for(var nCount = 0; nCount < 12 ; nCount++)
         {
            j = nCount+8;
            k = nCount+1;
            this.Pickbutton[nCount] = this.pickscene.node.getChildByName("Button_"+j);
            this.Coasterglow[nCount] = this.pickscene.node.getChildByName("Coasterglow"+k);
             var expression = this.pick[nCount];

             switch(expression) {
                 case 0:
                     var label = new cc.LabelTTF("margarita", "fonts/arial.ttf", 25);
                     this.addChild(label);
                     label.x = this.Pickbutton[nCount].x;
                     label.y = this.Pickbutton[nCount].y;
                     break;
                 case 1:
                     var label = new cc.LabelTTF("martini", "fonts/arial.ttf", 25);
                     this.addChild(label);
                     label.x = this.Pickbutton[nCount].x;
                     label.y = this.Pickbutton[nCount].y;
                     break;
                 case 2:
                     var label = new cc.LabelTTF("hurricane", "fonts/arial.ttf", 25);
                     this.addChild(label);
                     label.x = this.Pickbutton[nCount].x;
                     label.y = this.Pickbutton[nCount].y;
                     break;
                 case 3:
                     var label = new cc.LabelTTF("+3", "fonts/arial.ttf", 25);
                     this.addChild(label);
                     label.x = this.Pickbutton[nCount].x;
                     label.y = this.Pickbutton[nCount].y;
                     break;
                 case 4:
                     var label = new cc.LabelTTF("scotch", "fonts/arial.ttf", 25);
                     this.addChild(label);
                     label.x = this.Pickbutton[nCount].x;
                     label.y = this.Pickbutton[nCount].y;
                     break;
                 default:
                 break;
             }
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
                                  this.nCount++;
                                  this.ntotCount =  this.ntotCount -  1;
                                  this.getPickObjectatIndex = this.mathfunc.getPickObjectatIndex(this.nCurrentpickIndex);
                                  if (this.getPickObjectatIndex === 3)
                                  {
                                      this.ntotCount = this.ntotCount + 3;
                                  }
                                  this.playCoasterFade();
                                  this.bEnable = true;
                                  this.playGlowBurst(sender.x,sender.y);
                                  sender.visible = false;
                                  sender.setEnabled(false);

                                  //label.setAnchorPoint(cc.p(0, 0));
                                  this.label._string = this.ntotCount.toString();
                                  //this.label._originalText = "BYEEEEEEEEEEEEE";
                                  this.label.x = 517;//538.01;517
                                  this.label.y = 39;// 599.08;51.77
                                  this.label.setColor(cc.color(255,0,0,255));


                                /*  var label = new cc.LabelTTF("HIIIIIIIIIIIIIIIII"+  sender.visible, "fonts/arial.ttf", 57);
                                  label.setAnchorPoint(cc.p(0, 0));
                                  label.x = sender.x;
                                  label.y = sender.y;*/
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
            var str = "Pickoneflip";
            this.pickanimation = new SpriteAnimation(x,y,str,!true, this.playGlowBurstContinued.bind(this));
            this.addChild(this.pickanimation.getNode(), 2);
                this.pickanimation.playAnimationOnce();
            },






            playGlowBurstContinued: function (x,y) {
            // create sprite sheet
            //    this.PickObjecttype = this.mathfunc.getPickObjectatIndex(this.nCurrentpickIndex);
            this.pickobject[this.nCurrentpickIndex][this.getPickObjectatIndex].visible = true;
            var label = new cc.LabelTTF(this.pickAmount[this.nCurrentpickIndex], "fonts/arial.ttf", 60);
            this.pickscene.node.addChild(label,600);
            label.x = x;
            label.y = y;
            label.setColor(cc.color(0,255,0,255));
            this.bEnable = false;
            this.playCoasterFade();
            var str = "glowburst";
            var pickanimation2 = new SpriteAnimation(x,y, str, true);
            this.pickscene.node.addChild(pickanimation2.getNode(),0);
            pickanimation2.playAnimation();
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

