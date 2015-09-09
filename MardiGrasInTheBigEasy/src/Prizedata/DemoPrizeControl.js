////////////////////////////////////////////////////////////////////////////////////////
var CC_RED = cc.color(255, 0, 0);
var CC_BLACK = cc.color(0, 0, 0);
var CC_WHITE = cc.color(255, 255, 255);
var CC_YELLOW = cc.color(221, 224, 45);
var CC_CYAN = cc.color(47, 199, 216);
var nCatX = 150;
var nCatY = 600;
var rectWidth = 200;
var rectHeight = 30;
DemoPrizeControl =function(mainNode)
{
    cc.MenuItemFont.setFontName("Arial");
    cc.MenuItemFont.setFontSize(20);
    this.demoItems = [];
    this.mainNode = mainNode;
    this.menuRequest = new cc.Menu();
    this.drawbox = new cc.DrawNode();
    this.mainNode.addChild(this.drawbox);
    this.mainNode.addChild(this.menuRequest);
    this.menuRequest.setPosition(cc.p(0, 0));

    this.addReelStop("Bonus", "Voodoowilds-Showcase", "yellow", [13,13,10,9,9]);
    this.addReelStop("Bonus", "Voodoowilds-Random", "yellow", [13,13,10,9,9]);
    this.addReelStop("Bonus", "Multipliers-Showcase", "yellow", [48,65,67,65,43]);
    this.addReelStop("Bonus", "Multipliers-Random", "yellow", [79,33,15,43,6]);
    this.addBonus("Jester Wheel", "Showcase", "yellow", 5);
    this.addBonus("Jester Wheel", "Random", "yellow", 5);
    this.addBonus("Jester Wheel", "Random+PYP", "yellow", 5);
    this.addBonus("Jester Wheel", "Random+FSP", "yellow", 5);
    this.addBonus("Jester Wheel", "Wheel+FSP", "yellow", 5);
    this.addBonus("Jester Wheel", "Wheel+PYP", "yellow", 5);
    this.addBonus("Jester Wheel", "MaxSpins", "yellow", 5);
    this.addReelStop("Jester Wheel", "Anticipation", "yellow", [10,2,15,15,45]);
    this.addReelStop("Jester Wheel", "Anticipation+FSP", "yellow", [5,5,15,15,45]);
    this.addReelStop("Pick Your Poison (PYP)", "Showcase", "yellow", [45, 10, 10, 10, 46]);
    this.addReelStop("Pick Your Poison (PYP)", "Random", "yellow", [45, 10, 10, 10, 46]);
    this.addReelStop("Pick Your Poison (PYP)", "Anticipation", "yellow", [45, 10, 10, 46, 46]);
    this.addReelStop("Pick Your Poison (PYP)", "Anticipation+FSP", "yellow", [5,10, 10, 5, 46]);
    this.addReelStop("Free Spin Party (FSP)", "Showcase", "yellow", [5,6,4,5,4]);
    var aFreeSpinScenarios = [];
    this.addBonus("Free Spin Party (FSP)", "Retrigger", "yellow", 1, aFreeSpinScenarios);
/*    aFreeSpinScenarios = this.setupMaxRetriggerFreeSpins();*/
    this.addBonus("Free Spin Party (FSP)", "Max Retrigger", "yellow", 1, aFreeSpinScenarios);
/*    aFreeSpinScenarios = this.setupMaxRetriggerFreeSpinsWilds();*/
    this.addBonus("Free Spin Party (FSP)", "Max with Wilds", "yellow", 1, aFreeSpinScenarios);
    this.addReelStop("Free Spin Party (FSP)", "Random", "yellow", [5,5,3,5,3]);
    this.addReelStop("Free Spin Party (FSP)", "Anticipation", "yellow", [5,6,3,3,3]);
    this.addReelStop("Themes", "Wild", "blue",  [21,21,23,21,22]);
    this.addReelStop("Themes", "Girl", "blue",  [19,41,44,42,42]);
    this.addReelStop("Themes", "Mask", "blue",  [48,27,57,49,74]);
    this.addReelStop("Themes", "Hurricane", "blue",  [50,20,32,37,22]);
    this.addReelStop("Themes", "King Cake", "blue",  [58,39,6,14,31]);
    this.addReelStop("Aussies", "Ace", "blue",  [43,16,56,40,7]);
    this.addReelStop("Aussies", "King", "blue",  [49,16,15,59,23]);
    this.addReelStop("Aussies", "Queen", "blue",  [68,14,10,42,16]);
    this.addReelStop("Aussies", "Jack", "blue",  [30,41,2,44,65]);
    this.addReelStop("Aussies", "Ten", "blue",  [57,2,74,11,15]);
    this.addReelStop("Aussies", "Nine", "blue",  [46,64,0,52,28]);
    this.menuData = {};
    this.menuData.MenuArray = this.demoItems;
    this.updateDemoMenu();
};
////////////////////////////////////////////////////////////////////////////////////////

DemoPrizeControl.prototype.updateDemoMenu = function()
{
    var objCat = [];
    var objX = [];
    var objY = [];
    for(var i=0;i<this.menuData.MenuArray.length;i++)
    {
        var menuItem = this.menuData.MenuArray[i];
        objCat.push(menuItem.category);
    }
    var objCatArray = objCat.filter(function(elem, pos) {
        return objCat.indexOf(elem) == pos;
    });
    for(var i=0;i<objCatArray.length;i++)
    {
        this.drawCategory(objCatArray[i],nCatX,nCatY,i);
    }
    for(var i=0;i<this.menuData.MenuArray.length;i++)
    {
        var menuItem = this.menuData.MenuArray[i];
        var item1 = new cc.MenuItemFont(menuItem.Name, this.forceBasePlay, this);
        item1.setColor(cc.color(0, 200, 20));
        this.drawbox.drawRect(cc.p(250, 300), cc.p(300, 400), cc.color(0, 255, 255, 255), 2, cc.color(255, 0, 255, 255));
        item1.setPosition(cc.p(250, 50));
        this.menuRequest.addChild(item1);
    }
};
////////////////////////////////////////////////////////////////////////////////////////

DemoPrizeControl.prototype.drawCategory = function(strcategory, xpos, ypos,nIndex)
{
    var item1 = new cc.MenuItemFont(strcategory, null, this);
    item1.setColor(CC_WHITE);
    var nX = xpos+nIndex*rectWidth;
    var nY = ypos;
    this.drawbox.drawRect(cc.p(nX, nY), cc.p(nX+rectWidth, nY+rectHeight), CC_BLACK, 4, CC_RED);
    item1.setPosition(cc.p(nX, ypos));
    this.menuRequest.addChild(item1);
};

////////////////////////////////////////////////////////////////////////////////////////

DemoPrizeControl.prototype.addReelStop = function(category, symbolName, buttonColor, reelStops)
{
    var menuItem = {};
    menuItem.Name = symbolName;
    menuItem.category = category;
    menuItem.buttonColor = buttonColor;
    menuItem.stops = reelStops;
    menuItem.bonusID = 0;
    menuItem.aBonusScenarios = null;
    this.demoItems.push(menuItem);
};

////////////////////////////////////////////////////////////////////////////////////////

DemoPrizeControl.prototype.forceBasePlay = function()
{
};

////////////////////////////////////////////////////////////////////////////////////////

DemoPrizeControl.prototype.addBonus = function(category, symbolName, buttonColor, bonusID, aBonusScenarios)
{
    var menuItem = {};
    menuItem.Name = symbolName;
    menuItem.category = category;
    menuItem.buttonColor = buttonColor;
    menuItem.stops = null;
    menuItem.bonusID = bonusID;
    menuItem.aBonusScenarios = aBonusScenarios;
    this.demoItems.push(menuItem);
};

////////////////////////////////////////////////////////////////////////////////////////