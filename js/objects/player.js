function Player() {

  this.abilities = {
    webs: {
      name: "webs",
      enabled: false,
    },
    shoot: {
      name: "shoot",
      enabled: false,
    },
    destroyWalls: {
      name: "destroyWalls",
      enabled: false
    }
  };

  this.gainRandomAbility = function() {
    var disabledAbilityNames = [];
    for (ability in this.abilities) {
      if (!this.abilities[ability].enabled) {
        disabledAbilityNames.push(this.abilities[ability]);
      }
    }
    if (!disabledAbilityNames.length) {
      return;
    }
    else {
      var index = Math.floor(Math.random() * disabledAbilityNames.length);
      var ability = disabledAbilityNames[index];
      ability.enabled = true;
      console.log("gained " + ability.name + "!");
    }
  }
}

var player = new Player();
