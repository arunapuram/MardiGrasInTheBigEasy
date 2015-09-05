PickMath = function()
{
    this.getPickObjects = [];
    this.aSymbolNames = [0,1,2,3,4];
    this.aplus3Excluded = [0,1,2,4];
    this.bEnable = true;

};

////////////////////////////////////////////////////////////////////////////////////////
PickMath.prototype.initiate = function()
{
    var sprite;
    var nRandom;
    for (var nCount = 0;nCount < 12 ; nCount++)
    {
        nRandom = Math.floor((Math.random() * 5));
        sprite = (this.aSymbolNames[nRandom]);
        if(sprite === 3 && this.bEnable === true)
        {
            this.bEnable = false;
            this.getPickObjects[nCount] = [sprite];
        }
        else
        {
            nRandom = Math.floor((Math.random() * 4));
            sprite = (this.aplus3Excluded[nRandom]);
            this.getPickObjects[nCount] = [sprite];
        }

    }
};

////////////////////////////////////////////////////////////////////////////////////////

PickMath.prototype.getPickObjectatIndex = function(nCurrentindex)
{
      return this.getPickObjects[nCurrentindex][0];
};

/////////////////////////////////////////////////////////////////////////////////////////
