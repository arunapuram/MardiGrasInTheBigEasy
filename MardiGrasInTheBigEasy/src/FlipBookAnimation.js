FlipBookAnimation =function(strpath)
{
    this.onAnimationCompleated = null;
    this.strpathname = strpath.substring(0,strpath.lastIndexOf('/')+1);
    this.strfilename = strpath.substring(strpath.lastIndexOf('/')+1,strpath.length-4);
    cc.spriteFrameCache.addSpriteFrames(this.strpathname+this.strfilename+".plist");
    this.objMainNode = new cc.SpriteBatchNode(this.strpathname+this.strfilename+".png");
    var animFrames = [];
    var i = 0;
    do{
        str = this.strfilename+ i +".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        animFrames.push(frame);
        i++;
    }while(cc.spriteFrameCache.getSpriteFrame(this.strfilename+ i +".png") != undefined );
    var animation = new cc.Animation(animFrames,1,true,1,0.5,1);
    this.objAnim = new cc.Animate(animation)
    this.objloopAnim  = this.objAnim.repeatForever();
    var seqa = this.objAnim.repeat(1);
    var actionMoveDone = cc.callFunc(this.onAnimCompleated.bind(this), this);
    this.objPlayAnim   = cc.sequence(seqa,actionMoveDone);
    this.objSubNode = new cc.Sprite("#"+this.strfilename+"0.png");
    this.objMainNode.addChild(this.objSubNode);
};

////////////////////////////////////////////////////////////////////////////////////////

FlipBookAnimation.prototype.loopFromStart = function()
{
    this.objSubNode.runAction(this.objloopAnim);
};

////////////////////////////////////////////////////////////////////////////////////////

FlipBookAnimation.prototype.playFromStart = function()
{
    this.objSubNode.runAction(this.objPlayAnim);
};

FlipBookAnimation.prototype.onAnimCompleated = function()
{
    this.objSubNode.stopAction(this.objPlayAnim);
    if(this.onAnimationCompleated != null)
        this.onAnimationCompleated();
};
/////////////////////////////////////////////////////////////////////////////////////////

FlipBookAnimation.prototype.getNode = function()
{
    return this.objMainNode;
};

////////////////////////////////////////////////////////////////////////////////////////