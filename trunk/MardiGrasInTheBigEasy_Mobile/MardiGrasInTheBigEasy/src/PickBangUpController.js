
/////////////////////////////////////////////////////////////////////////
PickBangUpController = function(str2,str,bIsBonus,appInstance,existingamount)
{
    this.strPaidTextName = str;
    this.existingAmount = existingamount;
    this.strCreditTextName = str2;
    this.bIsBonus = bIsBonus;
    this.appInstance = appInstance;
    this.pickscene = appInstance.pickscene;
    this.fDefaultMusicalBangupMinSpeed = 5.9;
    this.bBangingUp = false;
    this.audioEngine = cc.audioEngine;
    this.audioEngine.setEffectsVolume(0.5);
    this.audioEngine.setMusicVolume(0.5);
    this.BangupSoundPrefix = "BangUp";
    this.onBangUpCompleateCallback = null;
    this.initBangUp();
};

////////////////////////////////////////////////////////////////////////////////////////

PickBangUpController.prototype.initBangUp = function()
{

    this.paidStart = 0;
    this.paidCurrentValue = 0;
    this.paidEnd = 0;

    this.PaidTextlabel = this.pickscene.node.getChildByName(this.strPaidTextName);
    this.PaidTextlabel.setString(this.existingAmount.toString());// = this.paidStart.toString();
    this.CreditTextlabel = this.pickscene.node.getChildByName(this.strCreditTextName);
    this.CreditTextlabel.setString(this.paidStart);// = this.paidStart.toString();
};

/////////////////////////////////////////////////////////////////////////////////////////

PickBangUpController.prototype.startBangup = function(nAwardAmount, bIsBonus)
{
    //this.determineAudioCue(nAwardAmount);
    //this.audioEngine.playMusic("res/Sounds/AwardSounds/"+ this.strSoundCue +".wav", false);
    this.paidStart = 0;
    this.paidCurrentValue = 0;
    this.paidEnd = 0;

    this.PaidTextlabel = this.pickscene.node.getChildByName(this.strPaidTextName);
    this.CreditTextlabel = this.pickscene.node.getChildByName(this.strCreditTextName);

    this.nAwardAmount = nAwardAmount;
    this.paidEnd = this.paidStart + this.nAwardAmount;
    this.paidCurrentValue = this.paidEnd - this.nAwardAmount;
    this.appInstance.schedule(this.incrementText,0.01);
};

/////////////////////////////////////////////////////////////////////////////////////////

PickBangUpController.prototype.incrementText = function ()
{

    if(this.PickBangUpController.paidCurrentValue >= this.PickBangUpController.paidEnd) {
        this.PickBangUpController.paidStart = this.PickBangUpController.paidCurrentValue;
        //this.objBangUpController.audioEngine.stopMusic("res/Sounds/AwardSounds/"+ this.strSoundCue +".wav", false);
       // this.objBangUpController.audioEngine.playMusic("res/Sounds/AwardSounds/BangUpSTOP.wav", false);
        this.unschedule(this.PickBangUpController.incrementText);
        this.onBangUpComplete();
        return;
    }
    else {
        this.PickBangUpController.paidCurrentValue++;
        var nCreditValue =  this.PickBangUpController.paidCurrentValue;
        //this.PickBangUpController.PaidTextlabel.setString(this.PickBangUpController.paidCurrentValue.toString());
        this.PickBangUpController.CreditTextlabel.setString(nCreditValue);
        this.PickBangUpController.PaidTextlabel.setString(nCreditValue+CREDIT_METER_AMOUNT);
    }
};

/////////////////////////////////////////////////////////////////////////////////////////