var res = {

    MainScene_json : "res/BaseGame.json",
    PickScene_json : "res/PickBonus.json",
    glowburst_png  : "res/source/Bonus/PickYourPoison/glowburst.png",
    glowburst_plist : "res/source/Bonus/PickYourPoison/glowburst.plist",
    Pickoneflip_png  : "res/source/Bonus/PickYourPoison/Pickoneflip.png",
    Pickoneflip_plist : "res/source/Bonus/PickYourPoison/Pickoneflip.plist",
    Pickoneflip_png  : "res/source/Reels/Ace/Animated/Ace.png",
    Pickoneflip_plist : "res/source/Reels/Ace/Animated/Ace.plist",
    Pickoneflip_png  : "res/source/Reels/Jack/Animated/Jack.png",
    Pickoneflip_plist : "res/source/Reels/Jack/Animated/Jack.plist",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
