var AppData = function()
{
    this.strReelFace = [];
    for(var nRows = 0; nRows < 3; nRows++)
    {
        this.strReelFace[nRows] = []
        for(var nCols = 0; nCols < 5; nCols++)
        {
            this.strReelFace[nRows][nCols] = "";
        }
    }
};
AppData.prototype.updateReelFace = function(aReelStopPosition)
{
    this.resetReelFace();
    for(var nRows = 0; nRows < 3; nRows++)
    {
        for(var nCols = 0; nCols < 5; nCols++)
        {
            this.strReelFace[nRows][nCols] = cc.aMathReelSet[0][(cc.aMathBaseReelStrip[nCols][aReelStopPosition[nCols]+nRows-1])-1];
        }
    }
};
AppData.prototype.resetReelFace = function()
{
    for(var nRows = 0; nRows < 3; nRows++)
    {
        for(var nCols = 0; nCols < 5; nCols++)
        {
            this.strReelFace[nRows][nCols] = "";
        }
    }
};
AppData.prototype.getReelFace = function()
{
    var strFace = "";
    for(var nRows = 0; nRows < 3; nRows++)
    {
        for(var nCols = 0; nCols < 5; nCols++)
        {
            strFace = strFace + this.strReelFace[nRows][nCols];
        }
    }
    return strFace;
};