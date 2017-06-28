$(function () {

	//---------------------------------------------
	// Globales variables and constants
	//---------------------------------------------

	var maxChecked = 6;

	var minFeelingChecked = 1;
	var minAffinityChecked = 1;

	var maxFeelingChecked = 2;
	var maxAffinityChecked = 5;

	var feelingChecked = 0;
	var affinityChecked = 0;

	var cookieName = "treegenerationform";
	var cookieTime = 2;

	var APIGetWordsUrl = "https://api-tree.herokuapp.com/words";
	var APIPostUrl = "https://api-tree.herokuapp.com/inputs";

	var checkboxModel = "<span class=\"input col-xs-4 col-sm-3 col-md-2 clearfix\"><input type=\"checkbox\"/><label></label></span>";

	var alreadyVoteMessage = "<div class=\"alert alert-warning alert-dismissible\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>Vous avez déjà voté ! Vous pourrez voter à nouveau dans XMINS minutes et XSECONDS secondes.</div>";
	var successVoteMessage = "<div class=\"alert alert-success alert-dismissible\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>Merci pour votre vote ! Grâce à vous, l'arbre va grandir. </div>";

	//---------------------------------------------
	// Create the cookie
	//---------------------------------------------
	var setCookie = function(cname, exmin) {
		var d = new Date();
		d.setTime(d.getTime() + (exmin * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + d + ";" + expires + ";path=/";
	}

	//---------------------------------------------
	// Get the cookie
	//---------------------------------------------
	var getCookie = function(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
			c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	var listenCheckbox = function() {
		//---------------------------------------------
		// Actions on reset event
		//---------------------------------------------
		$("[type='reset']").click(function() {
			// Reset counters
			$(".cptFeeling").html("");
			$(".cptAffinity").html("");
			$(".totalreponse").html('0/' + maxChecked);

			// Reset checkboxes and variables
			$(".feeling, .affinity").find(":checkbox").removeAttr("disabled");
			feelingChecked = 0;
			affinityChecked = 0;
			checkedAction();
		});

		//---------------------------------------------
		// Init events on feelings checkboxes
		//---------------------------------------------
		$(".feeling").find(":checkbox").each(function() {
			$(this).on("change", function() {
				if ($(this).is(":checked")) {
					feelingChecked++;
				} else {
					feelingChecked--;
				}
				checkedAction();
			});
		});

		//---------------------------------------------
		// Init events on affinities checkboxes
		//---------------------------------------------
		$(".affinity").find(":checkbox").each(function() {
			$(this).on("change", function() {
				if ($(this).is(":checked")) {
					affinityChecked++;
				} else {
					affinityChecked--;
				}
				checkedAction();
			});
		});
	}


	var checkedAction = function() {
		//---------------------------------------------
		// Counters init and update
		//---------------------------------------------
		if (feelingChecked == maxFeelingChecked) {
			$(".cptFeeling").html("("+feelingChecked+"/"+maxFeelingChecked+")");
			$(".cptAffinity").html("("+affinityChecked+"/4)");
		} else {
			$(".cptFeeling").html("("+ feelingChecked+"/1)");
			$(".cptAffinity").html("("+affinityChecked+"/"+maxAffinityChecked+")");
		}
		$(".totalreponse").html((feelingChecked + affinityChecked)+'/'+ maxChecked);

		//---------------------------------------------
		// Disable checkboxes if max checked
		//---------------------------------------------
		$(".feeling, .affinity").find(":checkbox:not(:checked)").attr("disabled", "disabled");
		if (feelingChecked < maxFeelingChecked && feelingChecked + affinityChecked < maxChecked) {
			$(".feeling").find(":checkbox:not(:checked)").removeAttr("disabled");
		}
		if (affinityChecked < maxAffinityChecked && feelingChecked + affinityChecked < maxChecked) {
			$(".affinity").find(":checkbox:not(:checked)").removeAttr("disabled");
		}

		//---------------------------------------------
		// Disable or enable submit and bind events on
		// submit
		//---------------------------------------------
		if (feelingChecked >= minFeelingChecked && affinityChecked >= minFeelingChecked && feelingChecked + affinityChecked <= maxChecked) {
			$(":submit").removeAttr("disabled", "disabled");
			$("form").unbind("submit");
			$("form").bind("submit", function(e) {
				// Cancel classic submit
				e.preventDefault();
				if (userCanVote()) {
					ajaxPostData(e);
				}
				$("html, body").stop().animate({scrollTop:0}, 500, 'swing');
			});
		} else {
			$("form").unbind("submit");
			$(":submit").attr("disabled", "disabled");
			$("form").bind("submit", function(e) {
				e.preventDefault();
			});
		}
	}

	var ajaxPostData = function() {
		// Init array of keys of checked inputs
		var checkboxData = [];
		$(".feeling, .affinity").find(":checkbox:checked").each(function() {
			checkboxData.push(parseInt(this.name));
		});

		// Post data to API and redirect to tree view
		if (checkboxData.length >= (minFeelingChecked + minAffinityChecked) && checkboxData.length <= maxChecked) {
			$.ajax({
				type: "POST",
				url: APIPostUrl,
				data: JSON.stringify({"words":checkboxData}),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function(data){
					// If post is done, create cookie and redirect the user
					setCookie(cookieName, cookieTime);
					$("main.container").find(".alert").remove();
					$("main.container").prepend(successVoteMessage);
					console.log(data);
				},
				error: function(data) {
					console.log(data.responseText);
				}
			});
		}
	}

	$.getJSON(APIGetWordsUrl, function(data) {
		$.each(data, function() {
			var newCheckbox = $(checkboxModel).clone();
			newCheckbox.find("input").attr("id", this._id).attr("name", this.key);
			newCheckbox.find("label").attr("for", this._id).html("<span class=\"center-text\">" + this.word + "</span>");
			if (this.mood) {
				$(".feelings").append(newCheckbox.addClass("feeling"));
			} else {
				$(".affinities").append(newCheckbox.addClass("affinity"));
			}
		});
		feelingChecked = $(".feeling").find(":checkbox:checked").length;
		affinityChecked = $(".affinity").find(":checkbox:checked").length;
		listenCheckbox();
		checkedAction();
	}).fail(function(error) {
		console.log("error");
	}).always(function() {
		$(".model").remove();
	});

	//---------------------------------------------
	// Check if user had already vote.
	//---------------------------------------------
	var userCanVote = function() {
		var cookie = getCookie(cookieName);
		if (cookie != "") {
			cookieTime = new Date(cookie).getTime();
			currentTime = new Date().getTime();
			if (cookieTime < currentTime) {
				document.cookie = cookieName + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
			} else {
				// If user had already vote, create message to prevent him
				var endTime = (new Date(cookie).getTime() - new Date().getTime()) / (1000 * 60);
				var minLeft = Math.trunc(endTime);
				var secLeft = Math.trunc((endTime%1)*60);
				$("main.container").find(".alert").remove();
				$("main.container").prepend(alreadyVoteMessage.replace("XMINS", minLeft).replace("XSECONDS", secLeft));
				return false;
			}
		}
		return true;
	}

});
