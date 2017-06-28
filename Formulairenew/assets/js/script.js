$(function () {

	//---------------------------------------------
	// Globales variables and constants
	//---------------------------------------------

	var maxChecked = 6;

	var minMoodChecked = 1;
	var minStateChecked = 1;

	var maxMoodChecked = 2;
	var maxStateChecked = 5;

	var moodChecked = 0;
	var stateChecked = 0;

	var cookieName = "treegenerationform";
	var cookieTime = 24;

	var APIGetWordsUrl = "https://api-tree.herokuapp.com/words";
	var APIPostUrl = "https://api-tree.herokuapp.com/inputs";

	var checkboxModel = "<span class=\"input col-md-2 arcade\"><input type=\"checkbox\"/><label></label></span>";

	//---------------------------------------------
	// Create the cookie
	//---------------------------------------------
	var setCookie = function(cname, exhours) {
		var d = new Date();
		d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
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
			$(".cptMood").html("");
			$(".cptState").html("");
			$(".totalreponse").html('0/' + maxChecked);

			// Reset checkboxes and variables
			$(".mood, .state").find(":checkbox").removeAttr("disabled");
			moodChecked = 0;
			stateChecked = 0;
			checkedAction();
		});

		//---------------------------------------------
		// Init events on mood checkboxes
		//---------------------------------------------
		$(".mood").find(":checkbox").each(function() {
			$(this).on("change", function() {
				if ($(this).is(":checked")) {
					moodChecked++;
				} else {
					moodChecked--;
				}
				checkedAction();
			});
		});

		//---------------------------------------------
		// Init events on states checkboxes
		//---------------------------------------------
		$(".state").find(":checkbox").each(function() {
			$(this).on("change", function() {
				if ($(this).is(":checked")) {
					stateChecked++;
				} else {
					stateChecked--;
				}
				checkedAction();
			});
		});
	}


	var checkedAction = function() {
		//---------------------------------------------
		// Counters init and update
		//---------------------------------------------
		if (moodChecked == maxMoodChecked) {
			$(".cptMood").html("("+moodChecked+"/"+maxMoodChecked+")");
			$(".cptState").html("("+stateChecked+"/4)");
		} else {
			$(".cptMood").html("("+ moodChecked+"/1)");
			$(".cptState").html("("+stateChecked+"/"+maxStateChecked+")");
		}
		$(".totalreponse").html((moodChecked + stateChecked)+'/'+ maxChecked);

		//---------------------------------------------
		// Disable checkboxes if max checked
		//---------------------------------------------
		$(".mood, .state").find(":checkbox:not(:checked)").attr("disabled", "disabled");
		if (moodChecked < maxMoodChecked && moodChecked + stateChecked < maxChecked) {
			$(".mood").find(":checkbox:not(:checked)").removeAttr("disabled");
		}
		if (stateChecked < maxStateChecked && moodChecked + stateChecked < maxChecked) {
			$(".state").find(":checkbox:not(:checked)").removeAttr("disabled");
		}

		//---------------------------------------------
		// Disable or enable submit and bind events on
		// submit
		//---------------------------------------------
		if (moodChecked >= minMoodChecked && stateChecked >= minMoodChecked && moodChecked + stateChecked <= maxChecked) {
			$(":submit").removeAttr("disabled", "disabled");
			$("form").unbind("submit");
			$("form").bind("submit", function(e) {
				// Cancel classic submit
				e.preventDefault();
				ajaxPostData(e);
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
		$(".mood, .state").find(":checkbox:checked").each(function() {
			checkboxData.push(parseInt(this.name));
		});

		// Post data to API and redirect to tree view
		if (checkboxData >= (minMoodChecked + minStateChecked) && checkboxData <= maxChecked) {
			$.ajax({
				type: "POST",
				url: APIPostUrl,
				data: JSON.stringify({"words":checkboxData}),
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				success: function(data){
					// If post is done, create cookie and redirect the user
					setCookie(cookieName, cookieTime);
					window.location.replace("/tree.html");
					console.log(data);
				},
				error: function(data) {
					console.log(data.responseText);
				}
			});
		}
	}

	//---------------------------------------------
	// Check if user had already vote. If not,
	// create inputs with words from API
	//---------------------------------------------
	var cookie = getCookie(cookieName);
	if (cookie == "") {
		$.getJSON(APIGetWordsUrl, function(data) {
			$.each(data, function() {
				var newCheckbox = $(checkboxModel).clone();
				newCheckbox.find("input").attr("id", this._id).attr("name", this.key);
				newCheckbox.find("label").attr("for", this._id).html(this.word);
				if (this.mood) {
					$(".moods").append(newCheckbox.addClass("mood"));
				} else {
					$(".states").append(newCheckbox.addClass("state"));
				}
			});
			moodChecked = $(".mood").find(":checkbox:checked").length;
			stateChecked = $(".state").find(":checkbox:checked").length;
			listenCheckbox();
			checkedAction();
		}).fail(function(error) {
			console.log("error");
		}).always(function() {
			$(".model").remove();
		});
	// If user had already vote, create message to prevent him
	} else {
		var endTime = (new Date(cookie).getTime() - new Date().getTime()) / (1000 * 60 * 60);
		var hoursLeft = Math.trunc(endTime);
		var minLeft = Math.trunc((endTime%1)*60);
		$("main.container").html("<div class=\"alert alert-warning alert-dismissible\" role=\"alert\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>Vous avez déjà voté ! Vous pourrez voter à nouveau dans " + hoursLeft + " heures et " + minLeft + " minutes.</div>");
	}

});
