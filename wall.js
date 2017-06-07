/*

This script be improved by removing ellement once they pass the float-line instead of on-arrive
Otherwise we skip activities with might have not been seen yet (bellow float line)

*/

function setVisibleAsSeen() {

    chrome.storage.local.get(['storyIds'], function(result) {

        result.storyIds = result.storyIds;
        if (result.storyIds instanceof Array == false)
            result.storyIds = new Array;

        $("._5jmm:not(.seenSet)").filter(":onScreen").each(function() {
            console.log("Set as seen : " + $(this).attr("data-dedupekey"));

            //Mark the activity as seen
            result.storyIds.unshift($(this).attr("data-dedupekey"));

            // console.log(result.storyIds.length + " activities saved : " + result.storyIds);

            $(this).addClass("seenSet");
        });

        //Only keep recent elements to save storage
        if (result.storyIds.length >= 500) {
            result.storyIds.length = 500;
        }

        chrome.storage.local.set({
            'storyIds': result.storyIds
        });
    });

}

function hideIfSeen(element, storyIds, hideSeen) {
    //Not sure why some elements don't have a key, let's skip them
    if (element.attr("data-dedupekey") == undefined)
        return;

    if ($.inArray(element.attr("data-dedupekey"), storyIds) > -1) {
        console.log(element.attr("data-dedupekey") + " Already seen, hiding it");

        countHidden = countHidden + 1;
        chrome.runtime.sendMessage({
            type: "setCount",
            count: countHidden
        });

        if (hideSeen == true) {
            element.css("display", "none");
        }
    } else {
        console.log("Not seen" + element.attr("data-dedupekey"))
    }
}

var countHidden = 0;
chrome.runtime.sendMessage({
    type: "setCount",
    count: countHidden
});
//Retreive storyIds from localed storage
chrome.storage.local.get(['storyIds', 'hideSeen'], function(result) {

    result.storyIds = result.storyIds;
    if (result.storyIds instanceof Array == false)
        result.storyIds = new Array;

    console.log("let's hide these : " + result.storyIds);

    $(document).on("scroll", function() {
        setVisibleAsSeen();
    });


    $('._5jmm').each(function() {
        hideIfSeen($(this), result.storyIds, result.hideSeen);
    });

    $('body').arrive('._5jmm', function() {
        hideIfSeen($(this), result.storyIds, result.hideSeen);
    });
});

//Css injection
var node = document.createElement('style');
node.innerHTML = ".seenSet ._5pcp::after {content:' - Seen'} ";
document.body.appendChild(node);
