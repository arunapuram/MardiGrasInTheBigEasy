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
        this.strReelFace[nRows] = [];
        for(var nCols = 0; nCols < 5; nCols++)
        {
            this.strReelFace[nRows][nCols] = "";
        }
    }
};
AppData.prototype.GetRefSymbol = function(nsPayLine)
{
    var strSYM = "-1";
    for (var nCols = 0; nCols < 5; nCols++)
    {
        for (var nRows = 0; nRows < 3; nRows++)
        {
            if (cc.aMathPayline[nsPayLine][nRows][nCols] === 1 && ((this.strReelFace[nRows][nCols] != "X" && this.strReelFace[nRows][nCols] != "Y" && this.strReelFace[nRows][nCols] != "Z" && this.strReelFace[nRows][nCols] != "F" && this.strReelFace[nRows][nCols] != "G" && this.strReelFace[nRows][nCols] != "H" && this.strReelFace[nRows][nCols] != "W")))
            {
                strSYM = this.strReelFace[nRows][nCols];
                return strSYM;
            }
        }
    }
    return strSYM;
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

        for(var nPaylineAIndex = 0; nPaylineAIndex < aOffsetPrioPaylines[nPaylineOrder].length; nPaylineAIndex++)
        {
            var selPaylineIndex = aOffsetPrioPaylines[nPaylineOrder][nPaylineAIndex];
            var strPaylineStr = "";
            var apaylineOff = [];
            var nCounter = 0;
            var refSymbol = this.GetRefSymbol(selPaylineIndex);
            for(var nCols = 0; nCols < 3; nCols++)
            {
                for(var nRows = 0; nRows < 3; nRows++)
                {
                    if(cc.aMathPayline[selPaylineIndex][nRows][nCols]===1 && ((this.strReelFace[nRows][nCols] === refSymbol) || (this.strReelFace[nRows][nCols] === "F" || this.strReelFace[nRows][nCols] === "G" || this.strReelFace[nRows][nCols] === "H" || this.strReelFace[nRows][nCols] === "W")))
                    {
                        strPaylineStr = strPaylineStr + this.strReelFace[nRows][nCols];
                        nCounter++;
                        apaylineOff[nCols] = nRows-1;
                    }
                }
            }
            var coter = nCounter;
            if(nCounter >= 3)
            {
                this.aPaylineID.push(selPaylineIndex);
                for(var nPindex=nCounter;nPindex<5;nPindex++)
                {
                    var nIncCounter = 0
                    for(var nRows = 0; nRows < 3; nRows++)
                    {
                        if(cc.aMathPayline[selPaylineIndex][nRows][nPindex]===1 && ((this.strReelFace[nRows][nPindex] === refSymbol) || (this.strReelFace[nRows][nPindex] === "F" || this.strReelFace[nRows][nPindex] === "G" || this.strReelFace[nRows][nPindex] === "H" || this.strReelFace[nRows][nPindex] === "W")))
                        {
                            strPaylineStr = strPaylineStr + this.strReelFace[nRows][nPindex];
                            coter++;
                            nIncCounter++;
                        }
                    }
                    if(nIncCounter === 0)
                        break;
                }
                for(var nPindex=coter;nPindex<5;nPindex++)
                {
                    strPaylineStr = strPaylineStr + "?";
                }
                for(var nPoffsets=nCounter;nPoffsets<5;nPoffsets++)
                {
                    for(var nRows = 0; nRows < 3; nRows++)
                    {
                        if(cc.aMathPayline[selPaylineIndex][nRows][nPoffsets]===1)
                        {
                            apaylineOff[nPoffsets] = nRows-1;
                        }
                    }
                }
                this.aPaylineStrings.push(strPaylineStr);
                this.aPaylineOffsets.push(apaylineOff);
            }
        }
    }
    this.updateBonusPayline("X",30);
    this.updateBonusPayline("Y",31);
    this.updateBonusPayline("Z",32);
};
AppData.prototype.updateBonusPayline = function(str,nPayID)
{
    var strBonusPaylineStr = "";
    var aBonuspaylineOff = [];
    var nBonusCounter = 0;
    for(var nCols = 0; nCols < 5; nCols++)
    {
        var nIncCnt = 0;
        for(var nRows = 0; nRows < 3; nRows++)
        {
            if(this.strReelFace[nRows][nCols] === str)
            {
                strBonusPaylineStr = strBonusPaylineStr+this.strReelFace[nRows][nCols];
                nIncCnt++;
                nBonusCounter++;
                aBonuspaylineOff[nCols] = nRows-1;
            }
        }
        if(nIncCnt === 0)
        {
            strBonusPaylineStr = strBonusPaylineStr + "?";
            aBonuspaylineOff[nCols] = 0;
        }
    }
    if(nBonusCounter >= 3)
    {
        this.aPaylineStrings.push(strBonusPaylineStr);
        this.aPaylineOffsets.push(aBonuspaylineOff);
        this.aPaylineID.push(nPayID);
    }
}
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