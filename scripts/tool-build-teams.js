app.page("tool-build-teams", function()
{

  var $section = document.getElementById('tool-build-teams');
  var $nb = $section.querySelector(".nb-members");
  var $teamList = $section.querySelector('.team-list');
  var $resultList = $section.querySelector('.teams-result');
  var $okBtn = $section.querySelector('input[type="submit"]');

  //store template definition
  var tplTeamList = doT.template($teamList.innerHTML);
  var tplResultList = doT.template($resultList.innerHTML);

  var currentOutput = null;
  var config = null;

  var exec = function(){
    var teamId = $teamList.value;
    //special case for all teams
    if (teamId==-1){

        remoteStorage.teams.findAll().then(
          function(teams){
            var team = {members:[]};
            for (var t_id in teams){
              team.members.push.apply(team.members, teams[t_id].members);
            }

            generate(team);
          }
        );

      }else{
        //team = TeamRepository.findById(teamId);
        remoteStorage.teams.find(teamId).then(generate);
      }
  }

  var generate = function(team){

    var team_names = config.team_names || [1,2,3,4,5,6,7,8,9,10];

    var members = team.members;
    if (members.length==0){
        $resultList.innerHTML = null;
        app.alert('alert-info','humm, no members found, you can add members by clicking on the "My Groups" menu');
      return;
    }
    //define an array of indices
    var idxs = members.map(function (x, i) { return i });

    var nbPers = parseInt($nb.value);
    var teams = null;
    var nbTeam = Math.floor(members.length / nbPers);

    var idx, n;
    var teams = [];
    if (nbTeam==0){
      teams.push({ name: 'Team ' + team_names[0], members: members});
    }else{
      for (var i = 0; i < nbTeam; i++) {
        var team = { name : 'Team ' +team_names[i] + ':'};
        var tmp_members = [nbPers];
        for (var j = 0; j < nbPers; j++) {
          n = Math.floor(Math.random() * idxs.length);
          idx = idxs.splice(n, 1);
          tmp_members[j] = members[idx];
        }
        team.members = tmp_members;
        teams[i] = team;

      }

      //handle orphans ?
      var i = 0;
      while (idxs.length>0){
        teams[i].members.push(members[idxs.pop()]);
        (i < nbTeam-1) ? i++: i = 0;
      }



    }




    if (teams) {
      displayTeams(teams);
    }

  }



    var displayTeams = function(teams) {
        currentOutput = teams;

        $resultList.innerHTML = tplResultList(teams);
        var $btnSave = $resultList.querySelector('button');
        $btnSave.onclick = function(){
          if (currentOutput){
            app("archive-save", currentOutput);
          }
        }
    }

    //empty tpl by default
    $teamList.innerHTML = '<option value="-1">--all groups--</option>';
    //$teamList.classList.add('spinner');
    $resultList.innerHTML = null;



    $okBtn.onclick = function(e){
      e.preventDefault();
      exec();
    }


    //save output



  return function(params) {

    remoteStorage.teams.findAll().then(
      function(teams){

        if (Object.keys(teams).length === 0){
          app.alert('alert-info','humm, no members found, you can add members by clicking on the "My Groups" menu');
        }
        $teamList.innerHTML = tplTeamList(teams);
      }
    );

    remoteStorage.config.get().then(function(conf){
      config = conf;
    });

    //list already saved ?
    if (params && params.event =='onSavedOutput'){
      var $btnSave = $resultList.querySelector('button');
      $btnSave.classList.toggle('btn-default');
      $btnSave.onclick = null;
    }

  }
});
