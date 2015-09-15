FlipBookAnimation =function(strpath)
{
    this.onAnimationCompleated = null;
    this.strpathname = strpath.substring(0,strpath.lastIndexOf('/')+1);
    this.strfilename = strpath.substring(strpath.lastIndexOf('/')+1,strpath.length-4);
    cc.spriteFrameCache.addSpriteFrames(this.strpathname+this.strfilename+".plist");
    this.objMainNode = new cc.SpriteBatchNode(this.strpathname+this.strfilename+".png");
    this.animFrames = [];
    var i = 0;
    do{
        str = this.strfilename+ i +".png";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        this.animFrames.push(frame);
        i++;
    }while(cc.spriteFrameCache.getSpriteFrame(this.strfilename+ i +".png") != undefined );
    this.objSubNode = new cc.Sprite("#"+this.strfilename+"0.png");
    this.objMainNode.addChild(this.objSubNode);
};

////////////////////////////////////////////////////////////////////////////////////////

FlipBookAnimation.prototype.loopFromStart = function()
{
    var animation = new cc.Animation(this.animFrames,1/this.animFrames.length,1);
    var objAnim = new cc.Animate(animation);
    var objloopAnim  = objAnim.repeatForever();
    this.objSubNode.runAction(objloopAnim);
};

////////////////////////////////////////////////////////////////////////////////////////

FlipBookAnimation.prototype.playFromStart = function()
{
    var animation = new cc.Animation(this.animFrames,1/this.animFrames.length,1);
    var objAnim = new cc.Animate(animation);
    var seqa = objAnim.repeat(1);
    var actionMoveDone = cc.callFunc(this.onAnimCompleated.bind(this), this);
    var objPlayAnim   = cc.sequence(seqa,actionMoveDone);
    this.objSubNode.runAction(objPlayAnim);
};

FlipBookAnimation.prototype.onAnimCompleated = function()
{
    //this.objSubNode.stopAction(this.objPlayAnim);
   /* if(this.onAnimationCompleated != null)
        this.onAnimationCompleated();*/
};
/////////////////////////////////////////////////////////////////////////////////////////

FlipBookAnimation.prototype.getNode = function()
{
    return this.objMainNode;
};

////////////////////////////////////////////////////////////////////////////////////////