PickMath = function()
{
    //this.getPickObjects = [];
    //this.aSymbolNames = [0,1,2,3,4];
    this.getPickObjects = [0,0,0,0,1,1,2,3,4,4,4,4];
    this.aMargaritaAward = [300,300,450,450];
    this.aScotchAward = [600,600,750,750];
    this.TotalPickObjAward = [];
    this.nMargaritaCounttt = 0;
    this.nScotchCounttt = 0;
    this.bEnable = true;
};

////////////////////////////////////////////////////////////////////////////////

PickMath.prototype.shuffle = function() {
        var i = this.getPickObjects.length, j, swap;
        while (--i) {
            j = Math.random() * (i + 1) | 0;
            swap = this.getPickObjects[i];
            this.getPickObjects[i] = this.getPickObjects[j];
            this.getPickObjects[j] = swap;
        }
        return this.getPickObjects;
    }

////////////////////////////////////////////////////////////////////////////////////////
/*

/!** pushRand

 *!/
    function pushRand (array, value, rng) {
        var j = (rng || Math).random() * (array.length + 1) | 0;
        array.push(array[j]);
        array[j] = value;
        return array.length;
    }
*/


////////////////////////////////////////////////////////////////////////////////////////

PickMath.prototype.getPickObjectatIndex = function(nCurrentindex)
{
      return this.getPickObjects[nCurrentindex];
};


////////////////////////////////////////////////////////////////////////////////////////

PickMath.prototype.getMargaritaRandom = function()
{
    var i = this.aMargaritaAward.length, j, swap;
    while (--i) {
        j = Math.random() * (i + 1) | 0;
        swap = this.aMargaritaAward[i];
        this.aMargaritaAward[i] = this.aMargaritaAward[j];
        this.aMargaritaAward[j] = swap;
    }
    return this.aMargaritaAward;
}
////////////////////////////////////////////////////////////////////////////////////////

PickMath.prototype.getScotchRandom = function()
{
    var i = this.aScotchAward.length, j, swap;
    while (--i) {
        j = Math.random() * (i + 1) | 0;
        swap = this.aScotchAward[i];
        this.aScotchAward[i] = this.aScotchAward[j];
        this.aScotchAward[j] = swap;
    }
    return this.aScotchAward;
}
////////////////////////////////////////////////////////////////////////////////////////

PickMath.prototype.getPickObjectAwardAtIndex = function()
{
    this.getMargaritaRandom();
    this.getScotchRandom();
    for(var nCount = 0; nCount < 12 ; nCount++)
    {
        var expression = this.getPickObjects[nCount];
        switch(expression) {
            case 0:
                //var label = new cc.LabelTTF("margarita", "fonts/arial.ttf", 25);
                //this.addChild(label);
                //label.x = this.Pickbutton[nCount].x;
                //label.y = this.Pickbutton[nCount].y;
                //  this.nMargaritaCounttt = 0;
                //this.nScotchCounttt = 0;
                //var
                this.TotalPickObjAward[nCount] = this.aMargaritaAward[this.nMargaritaCounttt];
                this.nMargaritaCounttt++;
                break;
            case 1:
                //var label = new cc.LabelTTF("martini", "fonts/arial.ttf", 25);
                //this.addChild(label);
                //label.x = this.Pickbutton[nCount].x;
                //label.y = this.Pickbutton[nCount].y;
                this.TotalPickObjAward[nCount] = 1500;
                break;
            case 2:
          /*      var label = new cc.LabelTTF("hurricane", "fonts/arial.ttf", 25);
                this.addChild(label);
                label.x = this.Pickbutton[nCount].x;
                label.y = this.Pickbutton[nCount].y;*/
                this.TotalPickObjAward[nCount] = 2350;
                break;
            case 3:
            /*    var label = new cc.LabelTTF("+3", "fonts/arial.ttf", 25);
                this.addChild(label);
                label.x = this.Pickbutton[nCount].x;
                label.y = this.Pickbutton[nCount].y;*/
                this.TotalPickObjAward[nCount] = 0;
                break;
            case 4:
       /*         var label = new cc.LabelTTF("scotch", "fonts/arial.ttf", 25);
                this.addChild(label);
                label.x = this.Pickbutton[nCount].x;
                label.y = this.Pickbutton[nCount].y;*/

                this.TotalPickObjAward[nCount] = this.getScotchRandom()[this.nScotchCounttt];
                this.nScotchCounttt++;
                break;
            default:
                break;
        }
    }
    return this.TotalPickObjAward;
}

/////////////////////////////////////////////////////////////////////////////////////////
//0 = margarita(Minimum 4 are present usually)
//1 = martini(usually 2)
//2 = hurricane(atleast one)
//3 = +3(atleast one)
//4 = scotch(atleast 4)