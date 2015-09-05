SpriteAnimation =function(X,Y,xyz,bRepeatForever, func)
{
    this.func = func;
    this.ButtonXpos = X;
    this.ButtonYpos = Y;
    this.bRepeatForever = bRepeatForever;
    this.xyz = xyz;
    cc.spriteFrameCache.addSpriteFrames("res/source/Bonus/PickYourPoison/"+this.xyz+".plist");
    this.spriteSheet = new cc.SpriteBatchNode("res/source/Bonus/PickYourPoison/"+this.xyz+".png");

    var animFrames = [];
    var i = 0;
    do{
        str = this.xyz+"_"+ i +".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrames.push(frame);
        i++;
    }while(cc.spriteFrameCache.getSpriteFrame(this.xyz+"_"+ i +".png") != undefined );

    var animation = new cc.Animation(animFrames, 0.1);
    if(bRepeatForever)
        this.loopFromStart = new cc.RepeatForever(new cc.Animate(animation));
    else
        this.loopFromStart = new cc.Repeat(new cc.Animate(animation), 1);
    this.sprite = new cc.Sprite("#"+this.xyz+"_0.png");
    this.sprite.attr({x:X, y:Y});
    this.spriteSheet.addChild(this.sprite);
};

////////////////////////////////////////////////////////////////////////////////////////

SpriteAnimation.prototype.playAnimation = function()
{
    this.sprite.runAction(this.loopFromStart);
};

////////////////////////////////////////////////////////////////////////////////////////

SpriteAnimation.prototype.playAnimationOnce = function()
{
    var actionMoveDone = cc.callFunc(this.onAnimCompleated.bind(this), this);
    var seqa = cc.sequence(this.loopFromStart,actionMoveDone);
    this.sprite.runAction(seqa);
};

SpriteAnimation.prototype.onAnimCompleated = function()
{
    this.func(this.ButtonXpos,this.ButtonYpos);
};
/////////////////////////////////////////////////////////////////////////////////////////

SpriteAnimation.prototype.getNode = function()
{
    return this.spriteSheet;
};

////////////////////////////////////////////////////////////////////////////////////////