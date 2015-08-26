var AppData = function()
{
    this.strReelFace = [];
    this.aPaylineID = [];
    this.aPaylineOffsets = [];
    this.aPaylineStrings = [];
    this.nActivePaylines = 0;
    this.nPaylines = 30;
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
    this.resetPaylineInfo();
    for(var nRows = 0; nRows < 3; nRows++)
    {
        for(var nCols = 0; nCols < 5; nCols++)
        {
            this.strReelFace[nRows][nCols] = cc.aMathReelSet[0][(cc.aMathBaseReelStrip[nCols][aReelStopPosition[nCols]+nRows-1])-1];
        }
    }
    var aOffsetPrioPaylines = [];
    for(var nRows = 0; nRows < 3; nRows++)
    {
        aOffsetPrioPaylines[nRows] = [];
    }
    for(var nIndex = 0; nIndex < this.nPaylines; nIndex++)
    {
        for(var nRows = 0; nRows < 3; nRows++)
        {
            if(cc.aMathPayline[nIndex][nRows][0] === 1)
                aOffsetPrioPaylines[nRows].push(nIndex);
        }
    }
    for(var nPaylineOrder = 0; nPaylineOrder < 3; nPaylineOrder++)
    {
        var refSymbol = this.strReelFace[nPaylineOrder][0];
        for(var nPaylineAIndex = 0; nPaylineAIndex < aOffsetPrioPaylines[nPaylineOrder].length; nPaylineAIndex++)
        {
            var selPaylineIndex = aOffsetPrioPaylines[nPaylineOrder][nPaylineAIndex];
            var nCounter = 0;
            for(var nRows = 0; nRows < 3; nRows++)
            {
                for(var nCols = 0; nCols < 5; nCols++)
                {
                    if(cc.aMathPayline[selPaylineIndex][nRows][nCols]===1 && this.strReelFace[nRows][nCols] === refSymbol)
                    {
                        nCounter++;
                    }
                }
            }
            if(nCounter >= 3)
                this.aPaylineID.push(selPaylineIndex);
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
AppData.prototype.resetPaylineInfo = function()
{
    this.aPaylineID = [];
    this.aPaylineOffsets = [];
    this.aPaylineStrings = [];
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