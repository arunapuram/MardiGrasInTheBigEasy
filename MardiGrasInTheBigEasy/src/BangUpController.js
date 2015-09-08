
/////////////////////////////////////////////////////////////////////////
BangUpController = function(str, appInstance)
{
    this.strPaidTextName = str;
    this.appInstance = appInstance;
    this.mainscene = appInstance.mainscene;
    this.fDefaultMusicalBangupMinSpeed = 5.9;
    this.bBangingUp = false;
    this.audioEngine = cc.audioEngine;
    this.audioEngine.setEffectsVolume(0.5);
    this.audioEngine.setMusicVolume(0.5);
    this.BangupSoundPrefix = "BangUp";
    this.onBangUpCompleateCallback = null;
    /*
    this.aDefaultMusicalBangupData = [];
    this.aDefaultMusicalBangupData[0] = {fBangUpTime : 0.200, nMaxRatio : 0.30};
    this.aDefaultMusicalBangupData[1] = {fBangUpTime : 0.666, nMaxRatio : 0.75};
    this.aDefaultMusicalBangupData[2] = {fBangUpTime : 1.030, nMaxRatio : 1.55};
    this.aDefaultMusicalBangupData[3] = {fBangUpTime : 1.523, nMaxRatio : 2.15};
    this.aDefaultMusicalBangupData[4] = {fBangUpTime : 2.029, nMaxRatio : 2.85};
    this.aDefaultMusicalBangupData[5] = {fBangUpTime : 2.498, nMaxRatio : 3.85};
    this.aDefaultMusicalBangupData[6] = {fBangUpTime : 3.522, nMaxRatio : 4.95};
    this.aDefaultMusicalBangupData[7] = {fBangUpTime : 4.570, nMaxRatio : 5.65};
    this.aDefaultMusicalBangupData[8] = {fBangUpTime : 5.026, nMaxRatio : 8.05};
    this.aDefaultMusicalBangupData[9] = {fBangUpTime : 7.526, nMaxRatio : 11.25};
    this.aDefaultMusicalBangupData[10] = {fBangUpTime : 10.116, nMaxRatio : 15.85};
    this.aDefaultMusicalBangupData[11] = {fBangUpTime : 15.055, nMaxRatio : 22.25};
    this.aDefaultMusicalBangupData[12] = {fBangUpTime : 20.217, nMaxRatio : 32.55};
    this.aDefaultMusicalBangupData[13] = {fBangUpTime : 30.064, nMaxRatio : 38.55};
    this.aDefaultMusicalBangupData[14] = {fBangUpTime : 35.058, nMaxRatio : 50.55};
    this.aDefaultMusicalBangupData[15] = {fBangUpTime : 40.087, nMaxRatio : 55.55};
    this.aDefaultMusicalBangupData[16] = {fBangUpTime : 44.972, nMaxRatio : 1000.00};

    this.funcOnCompletedCallback = null;

    for (nIndex = 0; nIndex < this.aDefaultMusicalBangupData.length; nIndex ++)
    {
        var fBangUpTime = this.aDefaultMusicalBangupData[nIndex].fBangUpTime;
        var nMaxRatio = this.aDefaultMusicalBangupData[nIndex].nMaxRatio;

       // objBangUp.addPayoutDef(fBangUpTime, nMaxRatio, strSoundCue);
        var nRandomNumber = 0;
        switch(nIndex)
        {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
                nRandomNumber = Math.floor((Math.random()*10)%3);
                break;
            case 8:
            case 9:
                nRandomNumber = Math.floor((Math.random()*10)%2);
                break;
            default:
                nRandomNumber = 0;
        }

        var strSoundCue = BangupSoundPrefix + nIndex+"_"+nRandomNumber;
        cc.log("Adding Musical Bang Up Ratio "+ strSoundCue);
    }*/
    //this.audioEngine.playMusic("res/Sounds/AwardSounds/"+strSoundCue+".wav", false);
    this.initBangUp();
};

////////////////////////////////////////////////////////////////////////////////////////

BangUpController.prototype.initBangUp = function()
{
    if(this.strPaidTextName === null)
        this.strPaidTextName = "PaidText";

    this.paidStart = 0;
    this.paidCurrentValue = 0;
    this.paidEnd = 0;

    this.label = this.mainscene.node.getChildByName(this.strPaidTextName);
    this.label.setString(this.paidStart.toString());// = this.paidStart.toString();
};

/////////////////////////////////////////////////////////////////////////////////////////

BangUpController.prototype.startBangup = function(nAwardAmount, bIsBonus)
{
    this.determineAudioCue(nAwardAmount);
    this.audioEngine.playMusic("res/Sounds/AwardSounds/"+ this.strSoundCue +".wav", false);
    this.paidStart = 0;
    this.paidCurrentValue = 0;
    this.paidEnd = 0;
    this.label = this.mainscene.node.getChildByName(this.strPaidTextName);
    this.label._localZOrder = 100;

    this.nAwardAmount = nAwardAmount;
    this.paidEnd = this.paidStart + this.nAwardAmount;
    this.paidCurrentValue = this.paidEnd - this.nAwardAmount;
    this.appInstance.schedule(this.incrementText,0.01);
};

/////////////////////////////////////////////////////////////////////////////////////////

BangUpController.prototype.incrementText = function ()
{

    if(this.objBangUpController.paidCurrentValue >= this.objBangUpController.paidEnd) {
        this.objBangUpController.paidStart = this.objBangUpController.paidCurrentValue;
        this.objBangUpController.audioEngine.stopMusic("res/Sounds/AwardSounds/"+ this.strSoundCue +".wav", false);
        this.objBangUpController.audioEngine.playMusic("res/Sounds/AwardSounds/BangUpSTOP.wav", false);
        this.unschedule(this.objBangUpController.incrementText);
        this.onBangUpComplete();
        return;
    }
    else {
        this.objBangUpController.paidCurrentValue++;
        this.objBangUpController.label.setString(this.objBangUpController.paidCurrentValue.toString());
    }
};

/////////////////////////////////////////////////////////////////////////////////////////

BangUpController.prototype.determineAudioCue = function (nAwardAmount)
{
   /* var fBangUpTime = this.aDefaultMusicalBangupData[nIndex].fBangUpTime;
    var nMaxRatio = this.aDefaultMusicalBangupData[nIndex].nMaxRatio;

    // objBangUp.addPayoutDef(fBangUpTime, nMaxRatio, strSoundCue);
    var nRandomNumber = 0;
    switch(nIndex)
    {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            nRandomNumber = Math.floor((Math.random()*10)%3);
            break;
        case 8:
        case 9:
            nRandomNumber = Math.floor((Math.random()*10)%2);
            break;
        default:
            nRandomNumber = 0;
    }
    */
    //this.strSoundCue = BangupSoundPrefix + nIndex+"_"+nRandomNumber;
    var nRandomNumber = 0;
    nIndex = 16;                                                        // Making it always play the longest sound cue a
    this.strSoundCue = this.BangupSoundPrefix + nIndex+"_"+nRandomNumber;    // and after completion of bangup stopping this
                                                                        // and playing the ding sound
    //cc.log("Adding Musical Bang Up Ratio "+ this.strSoundCue);

};


BangUpController.prototype.onBangUpComplete = function()
{
    if(this.onBangUpCompleateCallback != null)
        this.onBangUpCompleateCallback();
};