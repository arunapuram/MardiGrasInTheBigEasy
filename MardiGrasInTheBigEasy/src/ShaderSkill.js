cc.GLNode = cc.GLNode || cc.Node.extend({
        ctor:function(){
            this._super();
            this.init();
        },
        init:function(){
            this._renderCmd._needDraw = true;
            this._renderCmd.rendering =  function(ctx){
                cc.kmGLMatrixMode(cc.KM_GL_MODELVIEW);
                cc.kmGLPushMatrix();
                cc.kmGLLoadMatrix(this._stackMatrix);

                this._node.draw(ctx);

                cc.kmGLPopMatrix();
            };
        },
        draw:function(ctx){
            this._super(ctx);
        }
    });
//------------------------------------------------------------------
//
// ShaderNode
//
//------------------------------------------------------------------
var ShaderNode = cc.GLNode.extend({
    ctor:function(vertexShader, framentShader) {
        this._super();
        this.init();
        this.PosX=[0,0,0];
        this.PosY=[0,0,0];
        if( 'opengl' in cc.sys.capabilities ) {
            this.width = 1360;
            this.height = 768;
            this.anchorX = 0.5;
            this.anchorY = 0.5;

            this.shader = cc.GLProgram.create(vertexShader, framentShader);
            this.shader.retain();
            this.shader.addAttribute("aVertex", cc.VERTEX_ATTRIB_POSITION);
            this.shader.link();
            this.shader.updateUniforms();

            var program = this.shader.getProgram();
            this.uniformCenter = []
            for(var ii=0;ii<3;ii++)
            {
                this.uniformCenter[ii] = gl.getUniformLocation(program, "position"+ii);
            }
            this.uniformResolution = gl.getUniformLocation( program, "lightSize");
            this.initBuffers();

            // this.scheduleUpdate();
            this._time = 0;
        }
    },
    draw:function() {
        this.shader.use();
        this.shader.setUniformsForBuiltins();

        var sF = cc.director.getOpenGLView();
        //  var pp = cc.p(sF._originalScaleX*cc.winSize.width/2,sF._originalScaleX*cc.winSize.height/2);//position + center / 2.0;
        var ll = 150.0*sF._originalScaleX;
        for(var ii=0;ii<3;ii++)
        {
            this.shader.setUniformLocationWith2f(this.uniformCenter[ii], sF._originalScaleX*this.PosX[ii], sF._originalScaleX*this.PosY[ii]);
        }
        this.shader.setUniformLocationWith1f(this.uniformResolution, ll);
        cc.glEnableVertexAttribs( cc.VERTEX_ATTRIB_FLAG_POSITION );

        // Draw fullscreen Square
        gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
        gl.vertexAttribPointer(cc.VERTEX_ATTRIB_POSITION, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    },

    updateLPosition:function(dt,SLight) {

        for(var ii=0;ii<3;ii++)
        {
            this.PosX[ii] = SLight[ii].x;
            this.PosY[ii] = SLight[ii].y;
        }
        this.draw();
    },
    initBuffers:function() {

        //
        // Square
        //
        var squareVertexPositionBuffer = this.squareVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
        vertices = [
            1360,            768,
            0,              768,
            1360,            0,
            0,              0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
});
/////////////////////////////////////////////////////////////////////////
var SkillSceneLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();

        this.skillscene = ccs.load(res.ShaderSkill_json);
        this.addChild(this.skillscene.node);
        var size = cc.winSize;
        cc.log("LOADED");
        this.shaderNode = new ShaderNode("res/Shaders/example_Spotlight.vsh", "res/Shaders/example_Spotlight.fsh");
        this.skillscene.node.addChild(this.shaderNode);
        this.aMardigrasbackground = this.skillscene.node.getChildByName("BackGroundFlip");
        this.aMardigrasbackground1 = this.skillscene.node.getChildByName("BackGround");
        this.Flip();

        this.shaderNode.x = size.width/2;
        this.shaderNode.y = size.height/2;
        this.aPositionPathY = [];
        this.aPositionPathX = [];
        this.aPositionPathX[0] = [37,399,806,1235,1717,-511];
        this.aPositionPathX[1] = [1581,319,1626,-309,1821,-755];
        this.aPositionPathX[2] = [-243,703,1422,-493,1589,1965];
        this.aPositionPathY[0] = [ 10, 712, 28, 706, -264, 968];
        this.aPositionPathY[1] = [ 382, 1136, -340, 214, 860, -216];
        this.aPositionPathY[2] = [ 1006, -340, 1220, 318, -40, -424];
        this.sp0A = [];
        this.sp1A = [];
        this.sp2A = [];
        this.SL = [];
        this.aSpotLight = [];
        for(var ii=0;ii<3;ii++)
        {
            this.aSpotLight[ii] = new cc.Sprite("res/source/Bonus/FreeSpin/Spotlight.png");
            this.aSpotLight[ii].x = this.aPositionPathX[ii][5];
            this.aSpotLight[ii].y = this.aPositionPathY[ii][5];
            this.skillscene.node.addChild(this.aSpotLight[ii]);
        }
        for(var ii=0;ii<this.aPositionPathX[0].length;ii++)
        {
            this.sp0A[ii] = cc.moveTo(2, cc.p(this.aPositionPathX[0][ii], this.aPositionPathY[0][ii]));
        }
        for(var ii=0;ii<this.aPositionPathX[1].length;ii++)
        {
            this.sp1A[ii] = cc.moveTo(2, cc.p(this.aPositionPathX[1][ii], this.aPositionPathY[1][ii]));
        }
        for(var ii=0;ii<this.aPositionPathX[2].length;ii++)
        {
            this.sp2A[ii] = cc.moveTo(2, cc.p(this.aPositionPathX[2][ii], this.aPositionPathY[2][ii]));
        }
        var ss0 = cc.sequence(this.sp0A[0],this.sp0A[1],this.sp0A[2],this.sp0A[3],this.sp0A[4],this.sp0A[5]);
        var ss1 = cc.sequence(this.sp1A[0],this.sp1A[1],this.sp1A[2],this.sp1A[3],this.sp1A[4],this.sp1A[5]);
        var ss2 = cc.sequence(this.sp2A[0],this.sp2A[1],this.sp2A[2],this.sp2A[3],this.sp2A[4],this.sp2A[5]);
        this.SL[0] = ss0.repeatForever();
        this.SL[1] = ss1.repeatForever();
        this.SL[2] = ss2.repeatForever();
        for(var ii=0;ii<3;ii++)
        {
            this.aSpotLight[ii].runAction(this.SL[ii]);
            this.aSpotLight[ii].visible = false;
        }
        this.scheduleUpdate();
        return true;
    },
    update:function(dt) {
        this.shaderNode.updateLPosition(dt,this.aSpotLight);
        cc.log( "X ="+this.aSpotLight[0]._position.x)
    },


    Flip:function() {

        this.aMardigrasbackground.visible = true;
        this.aMardigrasbackground1.visible = false;
        this.scheduleOnce(this.FlipAgain, 5.0);
    },
    FlipAgain:function() {
        this.aMardigrasbackground.visible = false;
        this.aMardigrasbackground1.visible = true;
        this.scheduleOnce(this.Flip, 5.0);
    },

});


var SkillScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SkillSceneLayer();
        this.addChild(layer);
    }
});

