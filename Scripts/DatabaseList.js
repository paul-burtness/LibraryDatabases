//global
//constants used in app
var dbImagesURL = "http://www.anokacounty.us/ImageRepository/Document?documentID="; //dev URL
//var dbImagesURL = "/ImageRepository/Document?documentID="; //prod URL
var dbJsonURL = "JSON/DatabaseList.txt";  //dev URL
//var dbJsonURL = "/DocumentCenter/View/9342";  //prod URL
//used in html menu
var show_0_9 = [];
var show_A_E = [];
var show_F_J = [];
var show_K_O = [];
var show_P_T = [];
var show_U_Z = [];
var show_ALL = ["ALL"];

function showItems(myArr, myTab) {
    "use strict";
    //hide all items in the list
    $(".DbListItemContainer").css("display", "none");
    //if the first item in the array is MENU
    //show menu and default number of items
    if (myArr[0] === "MENU") {
        //move bottom menu container to end of list
        $("#DbMenuBottom").appendTo("#DbList");
        //show the menu containers
        $(".DbMenuContainer").css("display", "block");
        //as a default show items 0-9 and A-E
        //append show_A_E to show_0_9
        var show_0_9_A_E = show_0_9.concat(show_A_E);
        //show new array
        showItems(show_0_9_A_E, "MENU");
        return false;
    } else if (myArr[0] === "ALL") {
        //show all items
        $(".DbListItemContainer").css("display", "block");
        showTab(myTab);
        return false;
    } else {
        var myFlag = true;
        myArr.forEach(function (value) {
            //if the ID item is a match in the DOM, show the ID item
            if ($("#" + value).length > 0) {
                $("#" + value).css("display", "block");
            } else {
                //if the ID item is not a match, set flag to false
                myFlag = false;
            }
        });
        //if there is at least one id that does not match, the flag is set to false, do not hide the div
        //then the author can catch the error
        if (myFlag) {
            //if all IDs have a match in the DOM, hide the div that holds the list from the web visitor
            $("#MyDbList").css("display", "none");
        } else {
            //if there is at least one ID that does not match, keep the div visible and display an error message
            $("#MyDbList").css("display", "block");
            alert("There is at least one Datase ID in your list that does not match the master list of databases. Please check and fix.");
        }
        showTab(myTab);
        return false;
    }
}

function showTab(myTab) {
    console.log(myTab);
    //turn off hightlight on all menu tabs
    $(".DbMenuItem").css("background-color", "transparent");
    //turn on highlight for specific tab
    switch (myTab) {
        case '0_9':
            $("#DbMenuTop_0_9").css("background-color", "#D3D3D3");
            $("#DbMenuBottom_0_9").css("background-color", "#D3D3D3");
            break;
        case 'A_E':
            $("#DbMenuTop_A_E").css("background-color", "#D3D3D3");
            $("#DbMenuBottom_A_E").css("background-color", "#D3D3D3");
            break;
        case 'F_J':
            $("#DbMenuTop_F_J").css("background-color", "#D3D3D3");
            $("#DbMenuBottom_F_J").css("background-color", "#D3D3D3");
            break;
        case 'K_O':
            $("#DbMenuTop_K_O").css("background-color", "#D3D3D3");
            $("#DbMenuBottom_K_O").css("background-color", "#D3D3D3");
            break;
        case 'P_T':
            $("#DbMenuTop_P_T").css("background-color", "#D3D3D3");
            $("#DbMenuBottom_P_T").css("background-color", "#D3D3D3");
            break;
        case 'U_Z':
            $("#DbMenuTop_U_Z").css("background-color", "#D3D3D3");
            $("#DbMenuBottom_U_Z").css("background-color", "#D3D3D3");
            break;
        case 'ALL':
            $("#DbMenuTop_ALL").css("background-color", "#D3D3D3");
            $("#DbMenuBottom_ALL").css("background-color", "#D3D3D3");
            break;
        case 'MENU':
            $("#DbMenuTop_0_9").css("background-color", "#D3D3D3");
            $("#DbMenuBottom_0_9").css("background-color", "#D3D3D3");
            $("#DbMenuTop_A_E").css("background-color", "#D3D3D3");
            $("#DbMenuBottom_A_E").css("background-color", "#D3D3D3");
            break;
        default:
            break;
    }
}

function showData(value, index) {
    "use strict";
    //add dbid to menu item array, based on first character of value.db.title
    //if value.db.title begins with "The " then remove first 4 characters
    var myTitle = String(value.db_title).toUpperCase();
    if (myTitle.substr(0, 4) === "THE ") {
        myTitle = myTitle.substr(4, 1);
    } else {
        myTitle = myTitle.substr(0, 1);
    }
    if (myTitle >= "0" && myTitle <= "9") {
        show_0_9.push(value.db_id);
    }
    if (myTitle >= "A" && myTitle <= "E") {
        show_A_E.push(value.db_id);
    }
    if (myTitle >= "F" && myTitle <= "J") {
        show_F_J.push(value.db_id);
    }
    if (myTitle >= "K" && myTitle <= "O") {
        show_K_O.push(value.db_id);
    }
    if (myTitle >= "P" && myTitle <= "T") {
        show_P_T.push(value.db_id);
    }
    if (myTitle >= "U" && myTitle <= "Z") {
        show_U_Z.push(value.db_id);
    }
    //build the item
    $("#DbList").append("<div id=\x22" + value.db_id + "\x22 class=\x22DbListItemContainer\x22></div>");
    var $myItem = $("#DbListItemTemplate").clone();
    $myItem.removeAttr("id");
    $myItem.find(".DbListLogo").append("<a href=\x22" + value.db_link + "\x22 target=\x22_blank\x22><img alt=\x22" + value.db_title + "\x22 src=\x22" + dbImagesURL + value.db_logoid + "\x22></a>");
    $myItem.find(".DbListTitle").append("<a href=\x22" + value.db_link + "\x22 target=\x22_blank\x22>" + value.db_title + "</a>");
    $myItem.find(".DbListDescription").html(value.db_description);
    //$("#Db" + index).append($myItem);
    $("#" + value.db_id).append($myItem);
}

function getData() {
    "use strict";
    $.ajax({
        url: dbJsonURL,  //use .txt because Document Center will not upload .json
        dataType: "json",
        success: function (data) {
            var myDbList;
            var myTab = "";
            //call showData for each db object in the JSON array to build the list in the DOM, CSS initially makes display: none
            data.items.item.forEach(showData);
            //look for a list of db_id to display
            //should be on the page in a div, like <div id="MyDbList">DB101,DB120,DB140</div>
            //this div will be visible in Live Edit so authors can see it
            //if there is at least one matching db_id, then the div will be hidden by code in showItems()
            if ($("#MyDbList").length > 0) {
                //get the text list and split it into an array
                myDbList = $("#MyDbList").text().split(",");
                //trim any spaces off each item in the array
                myDbList.forEach(function (element, index, array) {
                    array[index] = element.trim();
                });
            } else {
                //if that div is not on the page, set the array to a default value MENU to show the database menu
                myDbList = ["MENU"];
                myTab = "MENU";
            }
            //call showItems to show the appropriate list items by setting CSS to display: block
            showItems(myDbList, myTab);
        },
        error: OnError
    });
}

function OnError(xhr, errorType, exception) {
    var responseText;
    $("#dialog").html("");
    try {
        responseText = jQuery.parseJSON(xhr.responseText);
        $("#dialog").append("<div><b>" + errorType + " " + exception + "</b></div>");
        $("#dialog").append("<div><u>Exception</u>:<br /><br />" + responseText.ExceptionType + "</div>");
        $("#dialog").append("<div><u>StackTrace</u>:<br /><br />" + responseText.StackTrace + "</div>");
        $("#dialog").append("<div><u>Message</u>:<br /><br />" + responseText.Message + "</div>");
    } catch (e) {
        responseText = xhr.responseText;
        $("#dialog").html(responseText);
    }
}

$(document).ready(function () {
    "use strict";
    //if #liveEditTabs exists, that means Live Edit is active, so don't run anything!
    if ($("#liveEditTabs").length) {
        //display messages that should be visible in Live Edit
        $(".AppMessages").css("display", "block");
    } else {
        //hide messages visible in Live Edit
        $(".AppMessages").css("display", "none");
        //start the app by getting the data
        getData();
    }
});
