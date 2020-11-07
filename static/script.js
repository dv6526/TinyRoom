class User {

}

class Chat {
    
}

$(function() {
    // Event Listeners, Function Declarations ==============
    $(".hamburger .fa").click(function(){
        $(".wrapper").addClass("active")
    })

    $(".wrapper .sidebar .close").click(function(){
        $(".wrapper").removeClass("active")
    })

    function fillCanvas(canvas) {
        let context = canvas[0].getContext('2d');
        context.fillStyle = '#FF0000';
        context.fillRect(0, 0, canvas.width(), canvas.height());
    }

    function formatPage() {
        let squares = $('.square-content');
        //console.log(squares);
        for (let i = 0; i < squares.length; i++) {
            const square = squares[i];
            $(square).height($(square).width());
            console.log($(square).width(), $(square).height());
        }
    }
    $(window).resize(formatPage);

    // write your functions here

    // End of Event Listeners, Function Declarations =======

    // Start of Code =======================================
    // Tukaj lahko klicete funkcije da jih testirate



    // formatiranje s pomocjo javascripta
    formatPage();
    // End of Code =========================================
    
});

function dropdownReset() {
    let dropwdown = document.getElementById("dropdown");
    if (dropdown.style.display == "block") {
        dropdown.style.display = "none";
        let dropdown_nav = document.getElementById("dropdown_nav");
        dropdown_nav.remove();
    }
}

function dropdownButtonClick(option) {
    dropdownReset();
    //option handler
}

function messageDropdown(screenPosition, dropdown_info) {
    // reset in case of two consecutive right clicks
    dropdownReset();

    // init
    let dropwdown = document.getElementById("dropdown");
    let dropdown_nav = document.createElement("ul");
    let row = document.createElement("li");
    let link = document.createElement("a");
    let options = [["mute", "unmute"], "room invite", "request room invite", "private message",
                    ["global mute", "global unmute"], "warn", "kick", "ban", "teleport", "enter room"];
    let optionsLength = (dropdown_info.rank == "admin")?options.length:4;
    
    // Append buttons to div (user and admin are different)
    dropdown_nav.id = "dropdown_nav";                               // set ID for removal of dropdown
    dropdown_nav.className = "nav flex-column";                     // bootstrap
    for(let i=0;i<optionsLength;i++) {
        link = document.createElement("a");                         // has to be reinitialized every time
        row.className="nav-item";                                   // bootstrap
        link.className = "nav-link pt-0 pb-0";                      // bootstrap
        link.setAttribute("onclick", "dropdownButtonClick()");      // set action onclick
        
        // append childs to parents (look out for mute/unmute, global mute/unmute)
        if(i==0)
            link.appendChild(document.createTextNode((dropdown_info.muted)? options[i][1]: options[i][0]));
        else if(i==4)
            link.appendChild(document.createTextNode((dropdown_info.g_muted)? options[i][1]: options[i][0]));
        else 
            link.appendChild(document.createTextNode(options[i]));
        row.appendChild(link);
        dropdown_nav.appendChild(row);
    }
    // append everything to dropdown
    dropwdown.appendChild(dropdown_nav);

    // Opens dropdown on x,y position
    dropdown.style.display = "block";
    // check if clicked closer to the edge than allowed
    if((screenPosition.x + dropdown.offsetHeight) > $(document).height())
        dropdown.style.top = ($(document).height() - dropdown.offsetHeight - 1) + "px";
    else
        dropdown.style.top = screenPosition.x + "px";
    
    if((screenPosition.y + dropdown.offsetWidth) > $(document).width())
        dropdown.style.left = ($(document).width() - dropdown.offsetWidth - 1) + "px";
    else
        dropdown.style.left = screenPosition.y + "px";

    // Close dropdown if clicked anywhere else on the screen 
    // klic dropdownButtonClick(brez opcije) ali dropdownReset()
    // PRI RESIZE-U OKNA SKRIJ DIV (klic dropdownReset()), ker se ne premika skladno in bo potem postavljen kr nekje

    // HTML okno mora imeti atribut data-user_id z vrednostjo target_user_id
    // ne vem točno kaj naj bi to pomenilo. Predvidevam, da mora imeti ta atribut message-bubble.
}