"use strict";

$("#flickrTr").on("click",function(){
	$("#containerNet").css("display", "none");
	$("#containerCheckin").css("display", "none");
	$("#containerPic").css("display", "block", "width", "400px", "height", "300px");
  console.log("switch1");
});

$("#snTr").on("click",function(){
	$("#containerPic").css("display", "none");
	$("#containerCheckin").css("display", "none");
	$("#containerNet").css("display", "block", "width", "400px", "height", "300px");
	console.log("switch3");
});

$("#foursquareTr").on("click",function(){
	$("#containerPic").css("display", "none");
	$("#containerNet").css("display", "none");
	$("#containerCheckin").css("display", "block", "width", "400px", "height", "300px");
	console.log("switch2");
});

