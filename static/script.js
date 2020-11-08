class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    add(vector_to_add) {
        this.x += vector_to_add.x;
        this.y += vector_to_add.y;
        return this;
    }

    subtract(vector_to_subtract) {
        this.x -= vector_to_subtract.x;
        this.y -= vector_to_subtract.y;
        return this;
    }

    normalize() {
        var length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
    }

    multiply(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    length() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    clone() {
        return new Vector(this.x, this.y);
    }
}

// UTILITY FUNCTIONS =======================================
function returnImageObject(image_link, onload) {
    var img = document.createElement('img');
    img.src = image_link;
    img.onload = onload;
    return img;
}

function getCanvasMousePos(evt, canvas) {
    var rect = canvas.getBoundingClientRect();
    return new Vector(
        evt.clientX - rect.left,
        evt.clientY - rect.top
    );
}
// END OF UTILITY FUNCTIONS ================================

class User {

    constructor(position, name, weather, sprite_idx) {
        this.sprite_wh = 30;
        this.position = position;
        this.name = name;
        this.weather = weather;
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.sprite_wh;
        this.canvas.height = this.sprite_wh;
        this.sprite_idx = sprite_idx;
        this.draw_avatar();

    }

    draw_avatar() {
        var user = this;
        var img = returnImageObject('static/sprites.png', function () {
            user.context.drawImage(img, user.sprite_idx * 30, 0, 30, 30, 0, 0, user.sprite_wh, user.sprite_wh);
        });
    }

}

class Chat {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);
        this.context = this.canvas.getContext('2d');
        // all users without logged in user
        this.users = [];
        // logged in user
        this.player;

        // set up background drawing offset
        this.background_width = 2000;
        this.background_height = undefined;
        this.background_size = new Vector();
        this.background_center = new Vector(0.42, 0.36); // from 0 to 1, percentage
        this.offset = undefined;
        
        var chat = this;
        // set up background
        this.background = returnImageObject('static/map.png', function() {
            // this executes when the background loads
            // set background center to center of screen
            // calculate ratio
            var ratio = chat.background.width/chat.background.height;
            // set height
            chat.background_height = chat.background_width / ratio;

            chat.offset = new Vector(
                chat.background_width * chat.background_center.x - chat.canvas.width/2,
                chat.background_height * chat.background_center.y - chat.canvas.height/2
            );

            // Start drawing
            chat.drawLoop();
            
            // add event listeners for interacting
            chat.hookControls();
        });
    }

    addUser(player, isPlayer) {
        // player ... user object
        // isPlayer ... boolean, is added user the logged in user?
        this.users.push(player);
        if (isPlayer) {
            this.player = player;
        }
    }

    resize(width) {
        this.canvas.style.width = '95%';
        this.canvas.style.height = '95%';
        this.canvas.width = 0.95 * width;
        this.canvas.height = this.canvas.width;
    }

    hookControls() {
        var chat = this;
        // move handler
        document.addEventListener('click', function(click) {
            var position = getCanvasMousePos(click, chat.canvas);
            var wanted_position = position.clone().add(chat.offset);
            chat.player.position = wanted_position;
        });
    }

    centerOnPlayer() {
        var left_upper_corner = this.offset;
        var right_bottom_corner = this.offset.clone().add(new Vector(this.canvas.width, this.canvas.height));
        var canvas_center = this.offset.clone().add(new Vector(this.canvas.width/2, this.canvas.height/2));
        var player_position = this.player.position;
        // check if player is close to border, move if he is
        const treshold = Math.min(250, this.canvas.width/2-50);
        const move_speed = 5;
        // calculate distances from border
        // top, right, bottom, left
        const distances = [
            player_position.y - left_upper_corner.y,
            right_bottom_corner.x - player_position.x,
            right_bottom_corner.y - player_position.y,
            player_position.x - left_upper_corner.x
        ]

        if (Math.min(...distances) < treshold) {
            // player is close to the border
            // calculate vector to center map
            var direction = canvas_center.subtract(player_position).normalize();
            // finally move the offset
            this.offset.subtract(direction.multiply(move_speed));
        }
    }

    drawLoop() {
        // Da lahko uporabimo v loopu
        var chat = this;
        var context = chat.context;

        // drawing settings
        const avatar_size = 60;

        function loop() {
            // Prvo pobrisemo
            context.imageSmoothingEnabled = false;
            context.clearRect(0, 0, chat.canvas.width, chat.canvas.height);
            // move offset towards player
            chat.centerOnPlayer();
            context.drawImage(chat.background, -chat.offset.x, -chat.offset.y, chat.background_width, chat.background_height);

            for (let i = 0; i < chat.users.length; i++) {
                var user = chat.users[i];
                
                context.drawImage(user.canvas, user.position.x - chat.offset.x - avatar_size/2, user.position.y - chat.offset.y - avatar_size/2, avatar_size, avatar_size);

            }

        }

        setInterval(function () {
            loop();
        }, 16.666);
    }
}

$(function () {
    // Event Listeners, Function Declarations ==============
    $(".hamburger .fa").click(function () {
        $(".wrapper").addClass("active")
    })

    $(".wrapper .sidebar .close").click(function () {
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
            if (square.classList.contains('map')) {
                chat.resize($(square).width());
            }
            //console.log($(square).width(), $(square).height());
        }
    }
    $(window).resize(formatPage);

    // write your functions here

    //js za pojavno okno
    function topAlert(message, seconds){
        var okno = document.createElement('div');
        okno.textContent = message;
        okno.className = 'message-bubble modalnoOkno';
        document.body.appendChild(okno);

        var cas = setTimeout(function() { okno.remove(); }, seconds * 1000);
    }
    
    // new message
    function novoSporocilo(sporocilo_info) {
        var sporocilo=document.createElement("div");
        sporocilo.classList.add("message-bubble");
        sporocilo.setAttribute("data-user_id",sporocilo_info.sender_id);

        if (sporocilo_info.player==true) {
            sporocilo.classList.add("player");
        }

        sporocilo.textContent=((sporocilo_info.date)+" "+(sporocilo_info.sender)+": "+(sporocilo_info.body));
        document.querySelector("#chatlogs").prepend(sporocilo);
    }

    // MessageDropdown
    function dropdownReset() {
        if(document.getElementById("dropdown")) 
            document.getElementById("dropdown").remove();
    }
    
    function dropdownButtonClick(option) {
        dropdownReset();
        //option handler
    }
    
    function messageDropdown(screenPosition, dropdown_info) {
        // reset in case of two consecutive right clicks
        dropdownReset();
    
        // init
        //let dropdown = document.getElementById("dropdown");
        let dropdown = document.createElement("div");
        let dropdown_nav = document.createElement("ul");
        let row = document.createElement("li");
        let link = document.createElement("a");
        let options = [["mute", "unmute"], "room invite", "request room invite", "private message",
                        ["global mute", "global unmute"], "warn", "kick", "ban", "teleport", "enter room"];
        let optionsLength = (dropdown_info.rank == "admin")?options.length:4;
        
        // Append buttons to div (user and admin are different)
        dropdown.id = "dropdown";
        dropdown_nav.id = "dropdown_nav";                               // set ID for removal of dropdown
        dropdown_nav.className = "nav flex-column";                     // bootstrap
        for(let i=0;i<optionsLength;i++) {
            link = document.createElement("a");                         // has to be reinitialized every time
            row.className="nav-item";                                   // bootstrap
            link.className = "nav-link pt-0 pb-0";                      // bootstrap
            //link.addEventListener("click", dropdownButtonClick);      // add event listener on click (left in case eventlistener on div is harder to handle)
            
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
        // append everything to dropdown and to body
        dropdown.appendChild(dropdown_nav);
        document.body.appendChild(dropdown);
    
        // add event listener on click
        dropdown.addEventListener("click", dropdownButtonClick);     
           
        // Opens dropdown on x,y position
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


    // End of Event Listeners, Function Declarations =======

    // Start of Code =======================================
    // Tukaj lahko klicete funkcije da jih testirate
    //topAlert("delaj", 7);
    
     /*novoSporocilo({
        'date':'18:05',
        'sender':'Janez',
        'sender_id':12,
        'body':'Moje ime je Janez',
        'player':true
     });*/

    // formatiranje s pomocjo javascripta
    var chat = new Chat('tinyroom');
    formatPage();
    // End of Code =========================================

    var position = new Vector(600, 600);
    var name = "Domen";
    var weather = "Sunny";
    var user1 = new User(position, name, weather, 1);
    chat.addUser(user1, true);
});
